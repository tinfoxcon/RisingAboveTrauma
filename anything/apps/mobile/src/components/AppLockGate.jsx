import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePathname } from "expo-router";
import { useAuth } from "@/utils/auth/useAuth";
import useUser from "@/utils/auth/useUser";
import { authenticateForAppLock, getAuthenticationMethodLabel } from "@/utils/appLockAuth";

const PUBLIC_ROUTES = new Set([
  "/",
  "/splash",
  "/signin",
  "/signup",
  "/terms-of-use",
  "/privacy-policy",
]);

export default function AppLockGate() {
  const pathname = usePathname();
  const { auth, signOut } = useAuth();
  const { data: user } = useUser();
  const appState = useRef(AppState.currentState);
  const authenticatingRef = useRef(false);
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState("Authenticate to continue.");
  const [methodLabel, setMethodLabel] = useState("Face ID, Touch ID, fingerprint, PIN, or device passcode");

  const appLockEnabled = !!(user?.app_lock ?? auth?.user?.app_lock);
  const shouldProtectRoute = !!auth && !PUBLIC_ROUTES.has(pathname);
  const shouldRequireAppLock = appLockEnabled && shouldProtectRoute && Platform.OS !== "web";

  useEffect(() => {
    getAuthenticationMethodLabel().then(setMethodLabel);
  }, []);

  const unlock = useCallback(async () => {
    if (!shouldRequireAppLock || authenticatingRef.current) return;

    authenticatingRef.current = true;
    setLocked(true);
    setMessage("Authenticate to continue.");

    const result = await authenticateForAppLock();

    authenticatingRef.current = false;
    if (result.success) {
      setLocked(false);
      setMessage("Authenticate to continue.");
      return;
    }

    setLocked(true);
    setMessage(result.message || "Authentication is required to open the app.");
  }, [shouldRequireAppLock]);

  useEffect(() => {
    if (shouldRequireAppLock) {
      unlock();
    } else {
      setLocked(false);
      authenticatingRef.current = false;
    }
  }, [shouldRequireAppLock, unlock]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const wasBackgrounded = appState.current === "background" || appState.current === "inactive";
      appState.current = nextAppState;

      if (wasBackgrounded && nextAppState === "active" && shouldRequireAppLock) {
        setLocked(true);
        unlock();
      }

      if (nextAppState === "background" || nextAppState === "inactive") {
        if (shouldRequireAppLock) {
          setLocked(true);
        }
      }
    });

    return () => subscription.remove();
  }, [shouldRequireAppLock, unlock]);

  const handleSignOut = useCallback(() => {
    Alert.alert(
      "Sign out?",
      "Authentication is required to access app content. You can sign out instead.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: () => signOut() },
      ],
    );
  }, [signOut]);

  if (!locked || !shouldRequireAppLock) return null;

  return (
    <Modal visible transparent={false} animationType="fade" onRequestClose={() => {}}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#F3F0F8",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <Text style={{ fontSize: 48, marginBottom: 18 }}>🔒</Text>
        <Text
          style={{
            color: "#2B2438",
            fontSize: 24,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          App Locked
        </Text>
        <Text
          style={{
            color: "#4B5563",
            fontSize: 15,
            lineHeight: 22,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          {message}\n\nSupported on this device: {methodLabel}
        </Text>

        {authenticatingRef.current ? (
          <ActivityIndicator size="large" color="#4A2D8F" />
        ) : (
          <TouchableOpacity
            onPress={unlock}
            style={{
              backgroundColor: "#4A2D8F",
              paddingVertical: 14,
              paddingHorizontal: 28,
              borderRadius: 12,
              minWidth: 180,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700" }}>
              Unlock
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleSignOut} style={{ paddingVertical: 12 }}>
          <Text style={{ color: "#6B7280", fontSize: 14, fontWeight: "600" }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
