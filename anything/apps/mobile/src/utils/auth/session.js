import { readStoredAuth, useAuthStore } from "./store";

const MOBILE_REFRESH_URL = "/api/auth/mobile-refresh";
const REFRESH_WINDOW_MS = 5 * 60 * 1000;

let refreshPromise = null;

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  return Buffer.from(padded, "base64").toString("utf8");
}

export function getJwtPayload(jwt) {
  if (!jwt || typeof jwt !== "string") {
    return null;
  }

  const [, payload] = jwt.split(".");
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload));
  } catch (error) {
    console.error("Failed to decode JWT payload:", error);
    return null;
  }
}

export function getJwtExpirationTime(jwt) {
  const payload = getJwtPayload(jwt);
  return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
}

export function isJwtExpired(jwt, skewMs = 0) {
  const exp = getJwtExpirationTime(jwt);
  if (!exp) {
    return false;
  }

  return Date.now() + skewMs >= exp;
}

export function shouldRefreshJwt(jwt, thresholdMs = REFRESH_WINDOW_MS) {
  const exp = getJwtExpirationTime(jwt);
  if (!exp) {
    return false;
  }

  return Date.now() + thresholdMs >= exp;
}

async function getCurrentAuth() {
  const storeAuth = useAuthStore.getState().auth;
  if (storeAuth?.jwt) {
    return storeAuth;
  }

  const storedAuth = await readStoredAuth();
  if (storedAuth?.jwt) {
    useAuthStore.setState((state) => ({
      ...state,
      auth: storedAuth,
      isReady: true,
    }));
  }

  return storedAuth;
}

async function requestSessionRefresh(jwt) {
  return fetch(MOBILE_REFRESH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  });
}

export async function refreshAuthSession({ force = false } = {}) {
  const auth = await getCurrentAuth();

  if (!auth?.jwt) {
    return { ok: false, reason: "missing-auth" };
  }

  if (!force && !shouldRefreshJwt(auth.jwt)) {
    return { ok: true, auth, refreshed: false };
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await requestSessionRefresh(auth.jwt);

      if (!response.ok) {
        return {
          ok: false,
          reason: response.status === 401 ? "expired" : "refresh-failed",
          status: response.status,
        };
      }

      const data = await response.json();
      const nextAuth = {
        ...auth,
        jwt: data.jwt,
        user: data.user,
      };

      useAuthStore.getState().setAuth(nextAuth);

      return {
        ok: true,
        auth: nextAuth,
        refreshed: true,
      };
    } catch (error) {
      console.error("Session refresh error:", error);
      return { ok: false, reason: "network-error", error };
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function ensureValidAuthSession() {
  const auth = await getCurrentAuth();

  if (!auth?.jwt) {
    return { ok: false, reason: "missing-auth" };
  }

  if (!shouldRefreshJwt(auth.jwt)) {
    return { ok: true, auth, refreshed: false };
  }

  return refreshAuthSession({ force: true });
}
