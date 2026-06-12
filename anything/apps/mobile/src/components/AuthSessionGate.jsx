import { useAuth } from "@/utils/auth/useAuth";
import {
  AUTHENTICATED_HOME_ROUTE,
  getRouteForAuthenticatedUser,
  getRouteForLoggedOutUser,
  hasCompletedOnboarding,
  ONBOARDING_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
} from "@/utils/auth/routing";
import { ensureValidAuthSession } from "@/utils/auth/session";
import { useAuthStore } from "@/utils/auth/store";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";

const PUBLIC_ROUTES = new Set([
  "/",
  "/splash",
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  "/terms-of-use",
  "/privacy-policy",
]);

const ANON_ONLY_ROUTES = new Set(["/splash", SIGN_IN_ROUTE, SIGN_UP_ROUTE]);

function isPublicRoute(pathname) {
  return PUBLIC_ROUTES.has(pathname);
}

export default function AuthSessionGate() {
  const pathname = usePathname();
  const router = useRouter();
  const { isReady, auth } = useAuth();
  const setAuth = useAuthStore((state) => state.setAuth);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!auth) {
      if (!isPublicRoute(pathname)) {
        router.replace(getRouteForLoggedOutUser());
      }
      return;
    }

    if (ANON_ONLY_ROUTES.has(pathname)) {
      router.replace(getRouteForAuthenticatedUser(auth.user));
      return;
    }

    if (hasCompletedOnboarding(auth.user)) {
      if (pathname === ONBOARDING_ROUTE) {
        router.replace(AUTHENTICATED_HOME_ROUTE);
      }
      return;
    }

    if (pathname !== "/" && pathname !== ONBOARDING_ROUTE) {
      router.replace(ONBOARDING_ROUTE);
    }
  }, [auth, isReady, pathname, router]);

  useEffect(() => {
    if (!isReady || !auth?.jwt) {
      return;
    }

    let cancelled = false;

    const syncSession = async () => {
      const result = await ensureValidAuthSession();

      if (cancelled || result.ok || result.reason !== "expired") {
        return;
      }

      setAuth(null);
    };

    syncSession();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const wasBackgrounded =
        appState.current === "background" || appState.current === "inactive";
      appState.current = nextAppState;

      if (!wasBackgrounded || nextAppState !== "active") {
        return;
      }

      syncSession();
    });

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, [auth?.jwt, isReady, setAuth]);

  return null;
}
