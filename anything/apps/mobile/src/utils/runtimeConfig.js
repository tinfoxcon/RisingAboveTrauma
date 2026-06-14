const LEGACY_AUTH_STORAGE_KEY = "shelter-app-jwt";
const CREATED_APP_SUFFIX = ".created.app";

function cleanString(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeUrl(value) {
  const trimmed = cleanString(value);
  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function extractHostFromUrl(value) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}

function extractProjectGroupId(value) {
  const host = value?.includes?.("://")
    ? extractHostFromUrl(value)
    : cleanString(value);

  if (!host || !host.endsWith(CREATED_APP_SUFFIX)) {
    return null;
  }

  const projectGroupId = host.slice(0, -CREATED_APP_SUFFIX.length);
  return projectGroupId || null;
}

export function getBaseUrl() {
  const configuredHost = cleanString(process.env.EXPO_PUBLIC_HOST);
  const baseUrl = normalizeUrl(process.env.EXPO_PUBLIC_BASE_URL);
  const appUrl = normalizeUrl(process.env.EXPO_PUBLIC_APP_URL);

  if (configuredHost) {
    if (extractHostFromUrl(baseUrl) === configuredHost) {
      return baseUrl;
    }

    if (extractHostFromUrl(appUrl) === configuredHost) {
      return appUrl;
    }
  }

  return baseUrl || appUrl;
}

export function getProxyBaseUrl() {
  return normalizeUrl(process.env.EXPO_PUBLIC_PROXY_BASE_URL);
}

export function getHost() {
  return (
    extractHostFromUrl(getBaseUrl()) ||
    cleanString(process.env.EXPO_PUBLIC_HOST) ||
    extractHostFromUrl(getProxyBaseUrl())
  );
}

export function getProjectGroupId() {
  return (
    cleanString(process.env.EXPO_PUBLIC_PROJECT_GROUP_ID) ||
    extractProjectGroupId(getBaseUrl()) ||
    extractProjectGroupId(getProxyBaseUrl()) ||
    extractProjectGroupId(getHost())
  );
}

export function getAuthStorageKey() {
  const projectGroupId = getProjectGroupId();
  return projectGroupId ? `${projectGroupId}-jwt` : LEGACY_AUTH_STORAGE_KEY;
}

export function getRuntimeAuthConfig() {
  return {
    authStorageKey: getAuthStorageKey(),
    baseUrl: getBaseUrl(),
    host: getHost(),
    projectGroupId: getProjectGroupId(),
    proxyBaseUrl: getProxyBaseUrl(),
  };
}

export { LEGACY_AUTH_STORAGE_KEY };
