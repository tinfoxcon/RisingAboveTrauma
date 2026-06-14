import * as SecureStore from 'expo-secure-store';
import { fetch as expoFetch } from 'expo/fetch';
import { readStoredAuth } from '../utils/auth/store';
import {
  getBaseUrl,
  getHost,
  getProjectGroupId,
  getProxyBaseUrl,
} from '../utils/runtimeConfig';

const originalFetch = fetch;

const getURLFromArgs = (...args: Parameters<typeof fetch>) => {
  const [urlArg] = args;
  let url: string | null;
  if (typeof urlArg === 'string') {
    url = urlArg;
  } else if (typeof urlArg === 'object' && urlArg !== null) {
    url = urlArg.url;
  } else {
    url = null;
  }
  return url;
};

const isFileURL = (url: string) => {
  return url.startsWith('file://') || url.startsWith('data:');
};

const isFirstPartyURL = (url: string) => {
  const firstPartyURL = getBaseUrl();
  const secondPartyURL = getProxyBaseUrl();

  return (
    url.startsWith('/') ||
    (firstPartyURL && url.startsWith(firstPartyURL)) ||
    (secondPartyURL && url.startsWith(secondPartyURL))
  );
};

const isSecondPartyURL = (url: string) => {
  const secondPartyURL = getProxyBaseUrl();
  return url.startsWith('/_create/') || !!(secondPartyURL && url.startsWith(secondPartyURL));
};

type Params = Parameters<typeof expoFetch>;
const fetchToWeb = async function fetchWithHeaders(...args: Params) {
  const firstPartyURL = getBaseUrl();
  const secondPartyURL = getProxyBaseUrl();
  const [input, init] = args;
  const url = getURLFromArgs(input, init);
  if (!url) {
    return expoFetch(input, init);
  }

  if (isFileURL(url)) {
    return originalFetch(input, init);
  }

  const isExternalFetch = !isFirstPartyURL(url);
  // we should not add headers to requests that don't go to our own server
  if (isExternalFetch) {
    return expoFetch(input, init);
  }

  let finalInput = input;
  const baseURL = isSecondPartyURL(url)
    ? secondPartyURL ?? firstPartyURL
    : firstPartyURL;
  if (typeof input === 'string') {
    if (input.startsWith('/')) {
      if (!baseURL) {
        console.error('Missing first-party base URL for mobile fetch:', input);
        return expoFetch(input, init);
      }

      finalInput = `${baseURL}${input}`;
    } else {
      finalInput = input;
    }
  } else {
    return expoFetch(input, init);
  }

  const initHeaders = init?.headers ?? {};
  const finalHeaders = new Headers(initHeaders);

  const projectGroupId = getProjectGroupId();
  const host = getHost();
  const headers = {
    'x-createxyz-project-group-id': projectGroupId,
    host,
    'x-forwarded-host': host,
    'x-createxyz-host': host,
  };

  for (const [key, value] of Object.entries(headers)) {
    if (value) {
      finalHeaders.set(key, value);
    }
  }

  if (!finalHeaders.has('authorization')) {
    const auth = await readStoredAuth().catch(() => null);

    if (auth?.jwt) {
      finalHeaders.set('authorization', `Bearer ${auth.jwt}`);
    }
  }

  return expoFetch(finalInput, {
    ...init,
    headers: finalHeaders,
  });
};

export default fetchToWeb;
