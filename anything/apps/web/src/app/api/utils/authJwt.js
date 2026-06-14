import { decode, encode, getToken } from "@auth/core/jwt";

export const LEGACY_AUTH_SESSION_SALT = "authjs.session-token";
export const SECURE_AUTH_SESSION_SALT = "__Secure-authjs.session-token";
export const AUTH_SECRET_ENV_KEYS = [
  "AUTH_SECRET",
  "NEXTAUTH_SECRET",
  "AUTHJS_SECRET",
];
export const AUTH_URL_ENV_KEYS = ["AUTH_URL", "NEXTAUTH_URL"];

function getEnvValue(keys) {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

export function getAuthSecret() {
  return getEnvValue(AUTH_SECRET_ENV_KEYS);
}

export function getRequiredAuthSecret() {
  const secret = getAuthSecret();
  if (!secret) {
    throw new Error(
      `Authentication secret is not configured. Set one of: ${AUTH_SECRET_ENV_KEYS.join(", ")}`,
    );
  }

  return secret;
}

function getAuthUrlCandidates(request) {
  return [
    request?.nextUrl?.href,
    request?.url,
    request?.headers?.get?.("origin"),
    request?.headers?.get?.("referer"),
    ...AUTH_URL_ENV_KEYS.map((key) => process.env[key]),
  ];
}

export function requestUsesHttps(request) {
  const forwardedProto = request?.headers?.get?.("x-forwarded-proto");
  if (forwardedProto) {
    return forwardedProto.split(",")[0].trim() === "https";
  }

  for (const value of getAuthUrlCandidates(request)) {
    if (!value) continue;

    try {
      if (new URL(value).protocol === "https:") {
        return true;
      }
      if (new URL(value).protocol === "http:") {
        return false;
      }
    } catch {
      // Ignore invalid URLs and try the next candidate.
    }
  }

  return false;
}

export function getPreferredAuthSecureCookie(request) {
  return requestUsesHttps(request);
}

export function getSupportedAuthSecureCookieModes(request) {
  const preferredMode = getPreferredAuthSecureCookie(request);
  return preferredMode ? [true, false] : [false, true];
}

export function getPreferredAuthSessionSalt(request) {
  return requestUsesHttps(request)
    ? SECURE_AUTH_SESSION_SALT
    : LEGACY_AUTH_SESSION_SALT;
}

export function getSupportedAuthSessionSalts(request) {
  const preferredSalt = getPreferredAuthSessionSalt(request);
  return preferredSalt === SECURE_AUTH_SESSION_SALT
    ? [SECURE_AUTH_SESSION_SALT, LEGACY_AUTH_SESSION_SALT]
    : [LEGACY_AUTH_SESSION_SALT, SECURE_AUTH_SESSION_SALT];
}

export async function getAuthTokenPair(request) {
  const secret = getRequiredAuthSecret();
  let lastError = null;

  for (const secureCookie of getSupportedAuthSecureCookieModes(request)) {
    try {
      const [token, jwt] = await Promise.all([
        getToken({
          req: request,
          secret,
          secureCookie,
          raw: true,
        }),
        getToken({
          req: request,
          secret,
          secureCookie,
        }),
      ]);

      if (jwt) {
        return { token, jwt, secureCookie };
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return {
    token: null,
    jwt: null,
    secureCookie: getPreferredAuthSecureCookie(request),
  };
}

export async function decodeMobileAuthToken(token, request) {
  const secret = getRequiredAuthSecret();
  let lastError = null;

  for (const salt of getSupportedAuthSessionSalts(request)) {
    try {
      const decoded = await decode({
        token,
        secret,
        salt,
      });

      if (decoded) {
        return decoded;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return null;
}

export async function encodeMobileAuthToken(token, request) {
  return encode({
    token,
    secret: getRequiredAuthSecret(),
    salt: getPreferredAuthSessionSalt(request),
    maxAge: 30 * 24 * 60 * 60,
  });
}

export function isAuthConfigurationError(error) {
  const message = String(error?.message || "");

  return (
    message.includes("Authentication secret is not configured") ||
    AUTH_SECRET_ENV_KEYS.some((key) => message.includes(key))
  );
}
