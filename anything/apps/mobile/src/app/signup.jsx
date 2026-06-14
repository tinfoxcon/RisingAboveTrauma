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
import {
  extractAuthPayload,
  getUserFacingApiError,
  readJsonResponse,
} from "@/utils/apiResponse";
import usePreventBack from "@/utils/usePreventBack";

export default function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();

  // CRITICAL SAFETY: Prevent back navigation from sign up screen
  usePreventBack();

  const handleNameChange = (text) => {
    // Only allow letters (including accented) and spaces
    const filtered = text.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    setName(filtered);
    if (nameError) setNameError("");
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (text) => {
    const noSpaces = text.replace(/\s/g, "");
    setPassword(noSpaces);
    if (passwordError) setPasswordError("");
  };

  const isValidEmail = (text) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim());
  };

  const handleSignUp = async () => {
    setError("");
    setNameError("");
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!name.trim()) {
      setNameError("Please enter your name");
      hasError = true;
    } else if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError("Please enter your email");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Please enter a password");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const response = await fetch("/api/auth/mobile-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await readJsonResponse(response, { action: "Sign up" });

      if (!response.ok) {
        setError(data?.error || data?.message || "Sign up failed");
        return;
      }

      const authPayload = extractAuthPayload(data);
      if (!authPayload) {
        if (data?.error || data?.message) {
          throw new Error(data.error || data.message);
        }
        throw new Error("Sign up failed. Invalid server response.");
      }

      // Set auth state with user data and real JWT for authenticated API calls
      setAuth({
        user: authPayload.user,
        jwt: authPayload.jwt,
      });

      // Navigate to onboarding for new users
      router.replace("/onboarding");
    } catch (err) {
      console.error("Sign up error:", err);
      setError(getUserFacingApiError(err));
    } finally {
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
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{
                    fontSize: 24,
                    fontFamily: "System",
                    fontStyle: "italic",
                    color: "#F0B429",
                  }}
                >
                  Create A Free Account
                </Text>
              </View>

              <View style={{ gap: 16 }}>
                <View>
                  <TextInput
                    value={name}
                    onChangeText={handleNameChange}
                    placeholder="Name"
                    autoCapitalize="words"
                    autoCorrect={false}
                    style={{
                      borderWidth: 2,
                      borderColor: nameError ? "#DC2626" : "#F0B429",
                      borderRadius: 8,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 16,
                    }}
                  />
                  {nameError ? (
                    <Text
                      style={{
                        color: "#DC2626",
                        fontSize: 12,
                        marginTop: 4,
                        marginLeft: 4,
                      }}
                    >
                      {nameError}
                    </Text>
                  ) : null}
                </View>

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
                  onPress={handleSignUp}
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
                      Create Free Account
                    </Text>
                  )}
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <Text style={{ color: "#6B7280", fontSize: 14 }}>
                    Already have an account?
                  </Text>
                  <TouchableOpacity onPress={() => router.push("/signin")}>
                    <Text
                      style={{
                        color: "#4A2D8F",
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      Sign in
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Terms & Privacy Policy */}
                <Text
                  style={{
                    fontSize: 11,
                    color: "#9CA3AF",
                    textAlign: "center",
                    lineHeight: 18,
                  }}
                >
                  By signing up or continuing, you agree to our{" "}
                  <Text
                    onPress={() => router.push("/terms-of-use")}
                    style={{ color: "#4A2D8F", fontWeight: "600" }}
                  >
                    Terms of Use
                  </Text>
                  {" and "}
                  <Text
                    onPress={() => router.push("/privacy-policy")}
                    style={{ color: "#4A2D8F", fontWeight: "600" }}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}
