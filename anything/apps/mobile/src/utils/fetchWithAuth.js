import { useAuthStore } from "./auth/store";
import {
  ensureValidAuthSession,
  refreshAuthSession,
} from "./auth/session";

function isFormDataBody(body) {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function buildHeaders(options, jwt) {
  const headers = new Headers(options.headers || {});

  if (!isFormDataBody(options.body) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (jwt) {
    headers.set("Authorization", `Bearer ${jwt}`);
  }

  return headers;
}

function createUnauthorizedResponse() {
  if (typeof Response !== "undefined") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return {
    ok: false,
    status: 401,
    json: async () => ({ error: "Unauthorized" }),
  };
}

/**
 * Drop-in replacement for fetch() that automatically adds
 * the Authorization: Bearer <jwt> header from the auth store.
 */
export async function fetchWithAuth(url, options = {}) {
  const { setAuth } = useAuthStore.getState();
  const sessionResult = await ensureValidAuthSession();
  const initialJwt = sessionResult.ok
    ? sessionResult.auth?.jwt
    : useAuthStore.getState().auth?.jwt;

  const requestInit = {
    ...options,
    headers: buildHeaders(options, initialJwt),
  };

  if (!sessionResult.ok && sessionResult.reason === "expired") {
    setAuth(null);
    return createUnauthorizedResponse();
  }

  const response = await fetch(url, requestInit);
  if (response.status !== 401) {
    return response;
  }

  const refreshResult = await refreshAuthSession({ force: true });
  if (!refreshResult.ok) {
    if (refreshResult.reason === "expired") {
      setAuth(null);
    }
    return response;
  }

  return fetch(url, {
    ...options,
    headers: buildHeaders(options, refreshResult.auth?.jwt),
  });
}
