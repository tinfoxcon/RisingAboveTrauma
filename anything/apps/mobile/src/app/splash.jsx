import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Platform,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/utils/auth/useAuth";
import usePreventBack from "@/utils/usePreventBack";

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signIn, signUp } = useAuth();

  // CRITICAL SAFETY: Prevent all back navigation (Android hardware button + iOS swipe)
  // This ensures no one can bypass the splash screen and access app content without signing in
  usePreventBack();

  const handle911 = () => {
    const url = Platform.OS === "ios" ? "tel:911" : "tel:911";
    Linking.openURL(url);
  };

  const handleQuickExit = () => {
    Linking.openURL("https://weather.com/");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={["rgba(74, 45, 143, 0.7)", "rgba(240, 180, 41, 0.7)"]}
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {/* Top Safety Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={handle911}
            style={{
              borderWidth: 2,
              borderColor: "#F0B429",
              backgroundColor: "transparent",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text
              style={{ color: "#F0B429", fontSize: 16, fontWeight: "bold" }}
            >
              911
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleQuickExit}
            style={{
              borderWidth: 2,
              borderColor: "#F0B429",
              backgroundColor: "transparent",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text
              style={{ color: "#F0B429", fontSize: 16, fontWeight: "bold" }}
            >
              Exit
            </Text>
          </TouchableOpacity>
        </View>

        {/* Centered Content */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontSize: 80, marginBottom: 20 }}>🕊️</Text>

          <View style={{ alignItems: "center", marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 48,
                color: "white",
                fontStyle: "italic",
                fontFamily: "Georgia",
              }}
            >
              Rising Above
            </Text>
            <Text
              style={{
                fontSize: 48,
                color: "#F0B429",
                fontWeight: "bold",
                fontFamily: "Georgia",
              }}
            >
              Trauma
            </Text>
          </View>

          <Text
            style={{
              fontSize: 16,
              color: "#F0B429",
              marginBottom: 40,
              letterSpacing: 2,
            }}
          >
            DV Safety · Clarity · Next Steps
          </Text>

          <Text
            style={{
              fontSize: 18,
              color: "#F0B429",
              fontStyle: "italic",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Welcome
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#F0B429",
              fontStyle: "italic",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Your Safe Space Starts Here
          </Text>

          <TouchableOpacity
            onPress={signIn}
            style={{
              width: "100%",
              backgroundColor: "#F0B429",
              paddingVertical: 16,
              borderRadius: 8,
              marginBottom: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={signUp}
            style={{
              width: "100%",
              borderWidth: 2,
              borderColor: "#F0B429",
              backgroundColor: "transparent",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: "#F0B429", fontSize: 18, fontWeight: "bold" }}
            >
              Create A Free Account
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
