import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AlertTriangle, Phone, ShieldAlert } from "lucide-react-native";
import SafetyButtons from "@/components/SafetyButtons";
import useSinglePress from "@/utils/useSinglePress";

export default function HighRiskScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const guard = useSinglePress();

  const handleContinue = guard(() => {
    router.push({
      pathname: "/(tabs)/check-in/step3",
      params,
    });
  });

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <SafetyButtons />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 100,
          paddingTop: 20,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <AlertTriangle color="#E32626" size={64} />
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#E32626",
              marginTop: 20,
              textAlign: "center",
            }}
          >
            High Risk Alert
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#FFF8F8",
            borderWidth: 2,
            borderColor: "#E32626",
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#2B2438",
              fontWeight: "600",
              marginBottom: 15,
            }}
          >
            What you described includes behaviors that put you at elevated risk:
          </Text>
          <Text style={{ fontSize: 14, color: "#E32626", marginBottom: 8 }}>
            • Physical violence
          </Text>
          <Text style={{ fontSize: 14, color: "#E32626", marginBottom: 8 }}>
            • Choking/strangulation
          </Text>
          <Text style={{ fontSize: 14, color: "#E32626" }}>
            • Weapon threats or presence
          </Text>
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#2B2438",
            marginBottom: 15,
          }}
        >
          What would help right now?
        </Text>

        <TouchableOpacity
          onPress={() => Linking.openURL("tel:911")}
          style={{
            backgroundColor: "#E32626",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Phone color="white" size={24} style={{ marginRight: 12 }} />
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Call 911 Now
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL("tel:18007997233")}
          style={{
            backgroundColor: "#7A6B8A",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <ShieldAlert color="white" size={24} style={{ marginRight: 12 }} />
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "bold" }}>
            DV Hotline: 1-800-799-7233
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleContinue}
          style={{
            backgroundColor: "#FDF6E3",
            borderWidth: 2,
            borderColor: "#7A6B8A",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#7A6B8A", fontSize: 16, fontWeight: "bold" }}>
            Continue Check-In Safely
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL("https://weather.com")}
          style={{
            backgroundColor: "transparent",
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#6E6480", fontSize: 14, fontWeight: "500" }}>
            Quick Exit
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
