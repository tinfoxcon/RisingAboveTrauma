import { router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "@/utils/auth/store";
import usePreventBack from "@/utils/usePreventBack";

// In native production / TestFlight builds React Native fetch has no implicit
// base URL. We must use an absolute URL so the request reaches the server.
const BASE_URL =
  Platform.OS !== "web" ? process.env.EXPO_PUBLIC_BASE_URL || "" : "";

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  // CRITICAL SAFETY: Prevent back navigation from sign in screen
  usePreventBack();

  const isValidEmail = (text) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim());
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (text) => {
    // Block spaces completely
    const filtered = text.replace(/\s/g, "");
    setPassword(filtered);
    if (passwordError) setPasswordError("");
  };

  const handleSignIn = async () => {
    setError("");
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email.trim()) {
      setEmailError("Please enter your email");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Please enter your password");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/auth/mobile-signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Sign in failed");
        setLoading(false);
        return;
      }

      // Set auth state with user data and real JWT for authenticated API calls
      setAuth({
        user: data.user,
        jwt: data.jwt,
      });

      // Navigate to home
      router.replace("/");
    } catch (err) {
      console.error("Sign in error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <LinearGradient colors={["#4A2D8F", "#F0B429"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: 24,
              paddingTop: insets.top + 20,
              paddingBottom: insets.bottom + 20,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                backgroundColor: "#FDF6E3",
                borderRadius: 16,
                padding: 32,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <View style={{ alignItems: "center", marginBottom: 24 }}>
                <Text style={{ fontSize: 48, marginBottom: 8 }}>🕊️</Text>
                <Text
                  style={{
                    fontSize: 24,
                    fontFamily: "System",
                    fontStyle: "italic",
                    color: "#F0B429",
                  }}
                >
                  Welcome back.
                </Text>
              </View>

              <View style={{ gap: 16 }}>
                <View>
                  <TextInput
                    value={email}
                    onChangeText={handleEmailChange}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{
                      borderWidth: 2,
                      borderColor: emailError ? "#DC2626" : "#F0B429",
                      borderRadius: 8,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 16,
                    }}
                  />
                  {emailError ? (
                    <Text
                      style={{
                        color: "#DC2626",
                        fontSize: 12,
                        marginTop: 4,
                        marginLeft: 4,
                      }}
                    >
                      {emailError}
                    </Text>
                  ) : null}
                </View>

                <View>
                  <TextInput
                    value={password}
                    onChangeText={handlePasswordChange}
                    placeholder="Password"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{
                      borderWidth: 2,
                      borderColor: passwordError ? "#DC2626" : "#F0B429",
                      borderRadius: 8,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 16,
                    }}
                  />
                  {passwordError ? (
                    <Text
                      style={{
                        color: "#DC2626",
                        fontSize: 12,
                        marginTop: 4,
                        marginLeft: 4,
                      }}
                    >
                      {passwordError}
                    </Text>
                  ) : null}
                </View>

                {error ? (
                  <View
                    style={{
                      backgroundColor: "#FEE2E2",
                      padding: 12,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: "#DC2626", fontSize: 14 }}>
                      {error}
                    </Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  onPress={handleSignIn}
                  disabled={loading}
                  style={{
                    backgroundColor: "#F0B429",
                    paddingVertical: 14,
                    borderRadius: 8,
                    alignItems: "center",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      Sign In
                    </Text>
                  )}
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 4,
                  }}
                >
                  <Text style={{ color: "#6B7280", fontSize: 14 }}>
                    Don't have an account?
                  </Text>
                  <TouchableOpacity onPress={() => router.push("/signup")}>
                    <Text
                      style={{
                        color: "#4A2D8F",
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      Create Free Account
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}
