import { Platform } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

export const getAuthenticationMethodLabel = async () => {
  if (Platform.OS === "web") return "device authentication";

  try {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const labels = [];

    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      labels.push(Platform.OS === "ios" ? "Face ID" : "Face recognition");
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      labels.push(Platform.OS === "ios" ? "Touch ID" : "Fingerprint");
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      labels.push("Iris");
    }

    if (!labels.length) return "Device Passcode/PIN";
    return `${labels.join(" or ")} / Device Passcode`;
  } catch (error) {
    console.warn("Unable to detect authentication methods:", error);
    return "device authentication";
  }
};

export const authenticateForAppLock = async () => {
  if (Platform.OS === "web") {
    return {
      success: false,
      error: "unsupported_platform",
      message: "App Lock is only available on iOS and Android devices.",
    };
  }

  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    // Expo LocalAuthentication primarily relies on platform biometric APIs, with
    // device credential fallback enabled below. If neither hardware nor an
    // enrolled authentication method is available, do not unlock app content.
    if (!hasHardware && !isEnrolled) {
      return {
        success: false,
        error: "not_available",
        message:
          "No supported device authentication is available. Please set up Face ID, Touch ID, fingerprint, PIN, or device passcode in your device settings.",
      };
    }

    const methodLabel = await getAuthenticationMethodLabel();
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock app",
      cancelLabel: "Cancel",
      fallbackLabel: "Use Passcode",
      disableDeviceFallback: false,
      biometricsSecurityLevel: "weak",
    });

    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      error: result.error || "authentication_failed",
      message:
        result.error === "user_cancel" || result.error === "system_cancel"
          ? `${methodLabel} is required to open the app.`
          : "Authentication failed. Please try again or use your device passcode/PIN when prompted.",
    };
  } catch (error) {
    console.error("App Lock authentication error:", error);
    return {
      success: false,
      error: "unexpected_error",
      message: "Authentication is temporarily unavailable. Please try again.",
    };
  }
};
