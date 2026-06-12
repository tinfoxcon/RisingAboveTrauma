import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

export const legacyAuthKey = "shelter-app-jwt";
export const authKey = process.env.EXPO_PUBLIC_PROJECT_GROUP_ID
  ? `${process.env.EXPO_PUBLIC_PROJECT_GROUP_ID}-jwt`
  : legacyAuthKey;

function parseStoredAuth(value) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Failed to parse stored auth:", error);
    return null;
  }
}

export async function readStoredAuth() {
  const currentAuth = await SecureStore.getItemAsync(authKey).catch(() => null);
  const parsedCurrentAuth = parseStoredAuth(currentAuth);
  if (parsedCurrentAuth) {
    return parsedCurrentAuth;
  }

  if (authKey === legacyAuthKey) {
    return null;
  }

  const legacyAuth = await SecureStore.getItemAsync(legacyAuthKey).catch(
    () => null,
  );
  const parsedLegacyAuth = parseStoredAuth(legacyAuth);

  if (!parsedLegacyAuth) {
    return null;
  }

  await SecureStore.setItemAsync(authKey, JSON.stringify(parsedLegacyAuth)).catch(
    (error) => {
      console.error("Failed to migrate stored auth:", error);
    },
  );

  return parsedLegacyAuth;
}

export async function clearStoredAuth() {
  const keysToClear =
    authKey === legacyAuthKey ? [authKey] : [authKey, legacyAuthKey];

  await Promise.all(
    keysToClear.map((key) =>
      SecureStore.deleteItemAsync(key).catch((error) => {
        console.error(`Failed to clear auth key ${key}:`, error);
      }),
    ),
  );
}

async function writeStoredAuth(auth) {
  await SecureStore.setItemAsync(authKey, JSON.stringify(auth)).catch((error) => {
    console.error("Failed to persist auth:", error);
  });

  if (authKey !== legacyAuthKey) {
    await SecureStore.deleteItemAsync(legacyAuthKey).catch(() => null);
  }
}

/**
 * This store manages the authentication state of the application.
 */
export const useAuthStore = create((set) => ({
  isReady: false,
  auth: null,
  setAuth: (auth) => {
    if (auth) {
      writeStoredAuth(auth);
    } else {
      // CRITICAL SAFETY: Completely clear secure storage
      clearStoredAuth();
    }
    set({ auth, isReady: true });
  },
}));

/**
 * This store manages the state of the authentication modal.
 */
export const useAuthModal = create((set) => ({
  isOpen: false,
  mode: "signup",
  open: (options) => set({ isOpen: true, mode: options?.mode || "signup" }),
  close: () => set({ isOpen: false }),
}));
