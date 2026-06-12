import { useRouter as useExpoRouter } from "expo-router";

/**
 * Safely navigate back, with fallback to home if no history exists.
 * Prevents "GO_BACK action not handled" errors.
 */
export function safeGoBack(router, fallbackPath = "/(tabs)") {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallbackPath);
  }
}

/**
 * Drop-in replacement for useRouter() that wraps router.back() with safe fallback.
 * Usage: const router = useSafeRouter();
 */
export function useSafeRouter() {
  const router = useExpoRouter();

  return {
    ...router,
    back: (fallbackPath = "/(tabs)") => {
      safeGoBack(router, fallbackPath);
    },
  };
}
