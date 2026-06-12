import { View, TouchableOpacity, Text, Platform, Linking } from "react-native";
import { useAuth } from "@/utils/auth/useAuth";
import { useRouter } from "expo-router";

export default function SafetyButtons() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handle911 = () => {
    const url = Platform.OS === "ios" ? "tel:911" : "tel:911";
    Linking.openURL(url);
  };

  const handleQuickExit = async () => {
    // CRITICAL SAFETY: Clear all authentication and session data
    await signOut({ redirect: false });

    // Clear the entire navigation stack to prevent back navigation
    // This ensures Android back button and iOS swipe gesture cannot access app content
    router.dismissAll();

    // Navigate to splash screen as the only accessible screen
    router.replace("/splash");

    // Open weather.com to disguise the app
    // If abuser closes weather.com and returns, they'll only see splash screen
    // with NO ability to navigate back into app content
    setTimeout(() => {
      Linking.openURL("https://weather.com/");
    }, 100);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
    >
      <TouchableOpacity
        onPress={handle911}
        style={{
          backgroundColor: "#E32626",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 16, textAlign: "center" }}>🚨</Text>
        <Text
          style={{
            color: "white",
            fontSize: 14,
            fontWeight: "bold",
            marginLeft: 6,
          }}
        >
          911
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleQuickExit}
        style={{
          backgroundColor: "#5B2CA0",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 16, textAlign: "center" }}>🚪</Text>
        <Text
          style={{
            color: "white",
            fontSize: 14,
            fontWeight: "bold",
            marginLeft: 6,
          }}
        >
          Exit
        </Text>
      </TouchableOpacity>
    </View>
  );
}
