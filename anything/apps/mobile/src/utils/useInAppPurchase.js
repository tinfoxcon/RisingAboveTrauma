import Purchases from "react-native-purchases";
import { Platform } from "react-native";
import { create } from "zustand";
import { useCallback, useState, useEffect } from "react";
import useUser from "@/utils/auth/useUser";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { usePaywallStore } from "@/utils/usePaywallStore";

const useInAppPurchaseStore = create((set) => ({
  isReady: false,
  offerings: null,
  customerInfo: null,
  setCustomerInfo: (customerInfo) => set({ customerInfo }),
  setOfferings: (offerings) => set({ offerings }),
  setIsReady: (isReady) => set({ isReady }),
}));

function useInAppPurchase() {
  const { data: user } = useUser();
  const { paywallEnabled, loadPaywallSetting } = usePaywallStore();
  const {
    isReady,
    offerings,
    customerInfo,
    setOfferings,
    setCustomerInfo,
    setIsReady,
  } = useInAppPurchaseStore();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const initiateInAppPurchase = useCallback(async () => {
    // Load persisted paywall toggle before anything else
    await loadPaywallSetting();

    try {
      // Production keys only — iOS and Android
      const apiKey = Platform.select({
        ios: "appl_ssNqmdcBOFyTLjKqqIsksfjocbs",
        android: "goog_rnmhLqCLtDoSzkuwyvuIFTGQOoe",
      });

      if (apiKey) {
        Purchases.configure({ apiKey });

        if (user?.id) {
          await Purchases.logIn(user.id.toString());
        }

        const [offeringsResult, customerInfoResult] = await Promise.allSettled([
          Purchases.getOfferings(),
          Purchases.getCustomerInfo(),
        ]);

        if (offeringsResult.status === "fulfilled") {
          setOfferings(offeringsResult.value);
        }

        if (customerInfoResult.status === "fulfilled") {
          setCustomerInfo(customerInfoResult.value);
        }
      }
    } catch (error) {
      console.error("Failed to initialize RevenueCat:", error);
    } finally {
      setIsReady(true);
    }
  }, [user, setIsReady, setOfferings, setCustomerInfo, loadPaywallSetting]);

  const getAvailableSubscriptions = useCallback(() => {
    const offering =
      offerings?.all?.["subscription_plans"] || offerings?.current;

    if (!offering) return [];

    return offering.availablePackages;
  }, [offerings]);

  const startSubscription = useCallback(
    async ({ packageToPurchase }) => {
      try {
        setIsPurchasing(true);
        if (!user?.id) {
          throw new Error("User not authenticated");
        }

        const purchaseResult =
          await Purchases.purchasePackage(packageToPurchase);
        setCustomerInfo(purchaseResult.customerInfo);

        // Sync with backend
        await fetchWithAuth("/api/revenue-cat/sync-subscription", {
          method: "POST",
        });

        return true;
      } catch (error) {
        if (error.userCancelled) {
          console.log("User cancelled purchase");
          return false;
        }
        console.error("Failed to start subscription:", error);
        return false;
      } finally {
        setIsPurchasing(false);
      }
    },
    [user, setIsPurchasing, setCustomerInfo],
  );

  const restorePurchases = useCallback(async () => {
    try {
      const restoredInfo = await Purchases.restorePurchases();
      setCustomerInfo(restoredInfo);

      // Sync with backend
      await fetchWithAuth("/api/revenue-cat/sync-subscription", {
        method: "POST",
      });

      return true;
    } catch (error) {
      console.error("Failed to restore purchases:", error);
      return false;
    }
  }, [setCustomerInfo]);

  // Raw entitlement checks from RevenueCat
  const _hasShieldAccess =
    customerInfo?.entitlements?.active?.shield_pro !== undefined;
  const _hasRiseAccess =
    customerInfo?.entitlements?.active?.rise_pro !== undefined;

  // When paywall enforcement is OFF, grant full access regardless of subscription
  const hasShieldAccess = paywallEnabled === false ? true : _hasShieldAccess;
  const hasRiseAccess = paywallEnabled === false ? true : _hasRiseAccess;

  // Determine subscription tier
  const subscriptionTier = hasRiseAccess
    ? "rise"
    : hasShieldAccess
      ? "shield"
      : "free";

  return {
    isReady,
    initiateInAppPurchase,
    getAvailableSubscriptions,
    startSubscription,
    restorePurchases,
    isPurchasing,
    subscriptionTier,
    hasShieldAccess,
    hasRiseAccess,
  };
}

export default useInAppPurchase;
