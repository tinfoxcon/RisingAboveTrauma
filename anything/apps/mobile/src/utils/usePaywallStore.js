import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

const PAYWALL_KEY = "paywall-enforcement-enabled";

/**
 * Global toggle for paywall enforcement.
 * When disabled, all premium screens are accessible without a subscription.
 * Useful for testing and App Store review.
 *
 * Default: enabled (true) — production behavior.
 */
export const usePaywallStore = create((set) => ({
  paywallEnabled: true, // default until loaded from storage
  isLoaded: false,

  // Load persisted value from SecureStore
  loadPaywallSetting: async () => {
    try {
      const stored = await SecureStore.getItemAsync(PAYWALL_KEY);
      // If nothing stored yet, default to enabled
      const paywallEnabled = stored === null ? true : stored === "true";
      set({ paywallEnabled, isLoaded: true });
    } catch {
      set({ paywallEnabled: true, isLoaded: true });
    }
  },

  // Toggle and persist
  setPaywallEnabled: async (enabled) => {
    try {
      await SecureStore.setItemAsync(PAYWALL_KEY, String(enabled));
    } catch {
      // silently fail — state still updates in memory
    }
    set({ paywallEnabled: enabled });
  },
}));
