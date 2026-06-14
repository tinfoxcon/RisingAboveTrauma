import { decode, encode } from "@auth/core/jwt";

export const LEGACY_AUTH_SESSION_SALT = "authjs.session-token";
export const SECURE_AUTH_SESSION_SALT = "__Secure-authjs.session-token";

function requestUsesHttps(request) {
  const forwardedProto = request?.headers?.get?.("x-forwarded-proto");
  if (forwardedProto) {
    return forwardedProto.split(",")[0].trim() === "https";
  }

  const candidates = [
    request?.nextUrl?.href,
    request?.url,
    request?.headers?.get?.("origin"),
    request?.headers?.get?.("referer"),
    process.env.AUTH_URL,
    process.env.NEXTAUTH_URL,
  ];

  for (const value of candidates) {
    if (!value) continue;

    try {
      if (new URL(value).protocol === "https:") {
        return true;
      }
      if (new URL(value).protocol === "http:") {
        return false;
      }
    } catch {
      // Ignore invalid URLs and continue checking.
    }
  }

  return false;
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

export async function decodeMobileAuthToken(token, request) {
  let lastError = null;

  for (const salt of getSupportedAuthSessionSalts(request)) {
    try {
      const decoded = await decode({
        token,
        secret: process.env.AUTH_SECRET,
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
    secret: process.env.AUTH_SECRET,
    salt: getPreferredAuthSessionSalt(request),
    maxAge: 30 * 24 * 60 * 60,
  });
}
