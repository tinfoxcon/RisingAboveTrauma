import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/utils/auth/useAuth";
import { useAuthStore } from "@/utils/auth/store";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function Index() {
  const router = useRouter();
  const { isReady, auth } = useAuth();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (!isReady) return;

    const route = async () => {
      // Not logged in → splash
      if (!auth) {
        router.replace("/splash");
        return;
      }

      // Logged in → fetch fresh user data from backend so onboarded is always accurate
      try {
        const response = await fetchWithAuth("/api/user/me");
        if (response.ok) {
          const data = await response.json();
          if (data?.user) {
            // Update stored auth with fresh DB values (onboarded, subscription_tier, etc.)
            setAuth({ ...auth, user: data.user });
            if (!data.user.onboarded) {
              router.replace("/onboarding");
            } else {
              router.replace("/(tabs)");
            }
            return;
          }
        }
      } catch (e) {
        console.error("Failed to fetch fresh user data:", e);
      }

      // Fallback: use stored value if network request fails
      if (!auth.user?.onboarded) {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)");
      }
    };

    route();
  }, [isReady]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#5B2CA0",
      }}
    >
      <ActivityIndicator size="large" color="#D9A62B" />
    </View>
  );
}
