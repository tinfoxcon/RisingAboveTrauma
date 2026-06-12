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
import {
  Phone,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
} from "lucide-react-native";
import SafetyButtons from "@/components/SafetyButtons";

export default function EmergencyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const handleContinueCheckin = () => {
    router.push({
      pathname: "/(tabs)/check-in/step4",
      params,
    });
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#DC2626", paddingTop: insets.top }}
    >
      <StatusBar style="light" />
      <SafetyButtons />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 40,
          paddingTop: 40,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <AlertTriangle color="#FFFFFF" size={80} strokeWidth={2.5} />
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#FFFFFF",
              marginTop: 20,
              textAlign: "center",
            }}
          >
            You Are Not Safe
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#FEE2E2",
              textAlign: "center",
              marginTop: 10,
              lineHeight: 26,
            }}
          >
            If you are in immediate danger, please get help now
          </Text>
        </View>

        {/* PRIMARY: 911 Button */}
        <TouchableOpacity
          onPress={() => Linking.openURL("tel:911")}
          style={{
            backgroundColor: "#FFFFFF",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 24,
            paddingHorizontal: 20,
            borderRadius: 16,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Phone color="#DC2626" size={32} style={{ marginRight: 16 }} />
          <View>
            <Text
              style={{ color: "#DC2626", fontSize: 24, fontWeight: "bold" }}
            >
              Call 911 Now
            </Text>
            <Text style={{ color: "#991B1B", fontSize: 14, marginTop: 4 }}>
              For immediate emergency help
            </Text>
          </View>
        </TouchableOpacity>

        {/* SECONDARY: National DV Hotline */}
        <TouchableOpacity
          onPress={() => Linking.openURL("tel:18007997233")}
          style={{
            backgroundColor: "#FEE2E2",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 20,
            paddingHorizontal: 20,
            borderRadius: 12,
            marginBottom: 20,
            borderWidth: 2,
            borderColor: "#FFFFFF",
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <ShieldAlert
                color="#991B1B"
                size={24}
                style={{ marginRight: 12 }}
              />
              <Text
                style={{ color: "#991B1B", fontSize: 18, fontWeight: "bold" }}
              >
                National DV Hotline
              </Text>
            </View>
            <Text
              style={{ color: "#7F1D1D", fontSize: 20, fontWeight: "bold" }}
            >
              1-800-799-7233
            </Text>
            <Text style={{ color: "#991B1B", fontSize: 13, marginTop: 4 }}>
              24/7 confidential support and resources
            </Text>
          </View>
          <Phone color="#991B1B" size={24} />
        </TouchableOpacity>

        {/* Info Box */}
        <View
          style={{
            backgroundColor: "#FEE2E2",
            padding: 20,
            borderRadius: 12,
            marginBottom: 30,
            borderWidth: 2,
            borderColor: "#FFFFFF",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#7F1D1D",
              fontWeight: "600",
              marginBottom: 12,
              lineHeight: 24,
            }}
          >
            ⚠️ You indicated you feel "Very Unsafe" right now
          </Text>
          <Text style={{ fontSize: 14, color: "#991B1B", lineHeight: 22 }}>
            Your safety is the top priority. Please consider reaching out for
            immediate help using one of the options above.
          </Text>
        </View>

        {/* Continue Option */}
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            padding: 16,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            If you are safe enough to continue documenting what happened, you
            can proceed with your check-in below.
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleContinueCheckin}
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            borderWidth: 2,
            borderColor: "#FFFFFF",
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "bold",
              marginRight: 8,
            }}
          >
            Continue Check-In Safely
          </Text>
          <ArrowRight color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
