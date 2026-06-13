import { useAuthStore } from "./auth/store";
import { router } from "expo-router";
import { Platform } from "react-native";

/**
 * In development, Expo's proxy resolves relative URLs automatically.
 * In a native TestFlight/production build there is no proxy — React Native
 * fetch() has no implicit base URL, so relative paths like "/api/..." fail.
 * We must prepend the absolute server URL for all native (non-web) builds.
 */
const BASE_URL =
  Platform.OS !== "web" ? process.env.EXPO_PUBLIC_BASE_URL || "" : "";

function resolveUrl(url) {
  if (!url || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${BASE_URL}${url}`;
}

// Guard to prevent multiple simultaneous refresh/sign-out flows
let isRefreshing = false;
let pendingRefreshResolvers = [];

/**
 * Attempt to silently refresh the JWT using the stored token.
 * Returns the new JWT string on success, or null on failure.
 */
async function tryRefreshToken(currentJwt) {
  try {
    const refreshUrl = resolveUrl("/api/auth/mobile-token-refresh");
    const res = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentJwt}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.jwt || null;
  } catch {
    return null;
  }
}

/**
 * Drop-in replacement for fetch() that automatically:
 * - Adds Authorization: Bearer <jwt> header from the auth store
 * - Resolves relative URLs to the correct production host in native builds
 * - On 401: attempts a silent token refresh, retries the request, then
 *   falls back to clearing auth and redirecting to sign-in
 */
export async function fetchWithAuth(url, options = {}) {
  const { auth, setAuth } = useAuthStore.getState();
  const jwt = auth?.jwt;

  const fullUrl = resolveUrl(url);

  const makeRequest = (token) =>
    fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let response = await makeRequest(jwt);

  // Handle 401: attempt silent token refresh then retry, or force re-login
  if (response.status === 401 && jwt) {
    if (isRefreshing) {
      // Another refresh is already in progress — wait for it
      const newJwt = await new Promise((resolve) => {
        pendingRefreshResolvers.push(resolve);
      });
      if (newJwt) {
        return makeRequest(newJwt);
      }
    } else {
      isRefreshing = true;
      try {
        const newJwt = await tryRefreshToken(jwt);

        // Notify any callers that were waiting for the refresh
        pendingRefreshResolvers.forEach((resolve) => resolve(newJwt));
        pendingRefreshResolvers = [];

        if (newJwt) {
          // Store the refreshed token and retry the original request
          const currentAuth = useAuthStore.getState().auth;
          if (currentAuth) {
            useAuthStore.getState().setAuth({ ...currentAuth, jwt: newJwt });
          }
          response = await makeRequest(newJwt);
        } else {
          // Refresh failed — token is truly expired or revoked
          setAuth(null);
          setTimeout(() => {
            try {
              router.replace("/splash");
            } catch (e) {
              console.error("fetchWithAuth: could not redirect after 401:", e);
            }
          }, 0);
        }
      } finally {
        isRefreshing = false;
      }
    }
  }

  return response;
}
