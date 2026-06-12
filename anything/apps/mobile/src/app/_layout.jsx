import { useAuth } from "@/utils/auth/useAuth";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePaywallStore } from "@/utils/usePaywallStore";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { initiate, isReady } = useAuth();
  const { loadPaywallSetting } = usePaywallStore();

  useEffect(() => {
    initiate();
    // Load paywall toggle state from storage once at app startup
    // so it's available across all screens immediately
    loadPaywallSetting();
  }, [initiate]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
          <Stack.Screen name="index" />
          <Stack.Screen name="splash" />
          <Stack.Screen name="signin" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="check-in" />
          <Stack.Screen name="course" />
          <Stack.Screen name="calm" />
          <Stack.Screen name="in-the-moment-scripts" />
          <Stack.Screen name="safety-plan" />
          <Stack.Screen name="pattern-map" />
          <Stack.Screen name="evidence-export" />
          <Stack.Screen name="evidence-document" />
          <Stack.Screen name="escalation-timeline" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="path-switcher" />
          <Stack.Screen name="terms-of-use" />
          <Stack.Screen name="privacy-policy" />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
