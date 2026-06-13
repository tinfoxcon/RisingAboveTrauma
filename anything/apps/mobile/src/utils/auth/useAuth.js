import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useMemo } from "react";
import { create } from "zustand";
import { Modal, View } from "react-native";
import { useAuthModal, useAuthStore, authKey } from "./store";

/**
 * This hook provides authentication functionality.
 * It may be easier to use the `useAuthModal` or `useRequireAuth` hooks
 * instead as those will also handle showing authentication to the user
 * directly.
 */
export const useAuth = () => {
  const { isReady, auth, setAuth } = useAuthStore();
  const { isOpen, close, open } = useAuthModal();

  const initiate = useCallback(() => {
    // Load stored session - will be cleared by AppState when app backgrounds
    SecureStore.getItemAsync(authKey).then((auth) => {
      useAuthStore.setState({
        auth: auth ? JSON.parse(auth) : null,
        isReady: true,
      });
    });
  }, []);

  useEffect(() => {}, []);

  const signIn = useCallback(() => {
    router.push("/signin");
  }, []);

  const signUp = useCallback(() => {
    router.push("/signup");
  }, []);

  const signOut = useCallback(
    ({ redirect = true } = {}) => {
      // Clear auth from secure storage
      SecureStore.deleteItemAsync(authKey).catch(console.error);
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
  const { open } = useAuthModal();

  useEffect(() => {
    if (!isAuthenticated && isReady) {
      // Navigate to signin screen instead of opening modal
      router.push(options?.mode === "signup" ? "/signup" : "/signin");
    }
  }, [isAuthenticated, isReady, options?.mode]);
};

export default useAuth;
