import { router } from "expo-router";
import { useCallback, useEffect } from "react";
import { readStoredAuth, useAuthModal, useAuthStore } from "./store";

/**
 * This hook provides authentication functionality.
 * It may be easier to use the `useAuthModal` or `useRequireAuth` hooks
 * instead as those will also handle showing authentication to the user
 * directly.
 */
export const useAuth = () => {
  const { isReady, auth, setAuth } = useAuthStore();
  const { close } = useAuthModal();

  const initiate = useCallback(() => {
    readStoredAuth().then((auth) => {
      useAuthStore.setState({
        auth,
        isReady: true,
      });
    });
  }, []);

  const signIn = useCallback(() => {
    router.push("/signin");
  }, []);

  const signUp = useCallback(() => {
    router.push("/signup");
  }, []);

  const signOut = useCallback(
    ({ redirect = true } = {}) => {
      setAuth(null);
      close();

      // Only redirect if explicitly requested (not during background event)
      if (redirect) {
        router.replace("/splash");
      }
    },
    [close, setAuth],
  );

  return {
    isReady,
    isAuthenticated: isReady ? !!auth : null,
    signIn,
    signOut,
    signUp,
    auth,
    setAuth,
    initiate,
  };
};

/**
 * This hook will automatically open the authentication modal if the user is not authenticated.
 */
export const useRequireAuth = (options) => {
  const { isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && isReady) {
      // Navigate to signin screen instead of opening modal
      router.push(options?.mode === "signup" ? "/signup" : "/signin");
    }
  }, [isAuthenticated, isReady, options?.mode]);
};

export default useAuth;
