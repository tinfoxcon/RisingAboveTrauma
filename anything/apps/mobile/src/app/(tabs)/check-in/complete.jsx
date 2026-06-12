import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Check, ArrowRight } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import SafetyButtons from "@/components/SafetyButtons";
import useSinglePress from "@/utils/useSinglePress";

export default function CheckInComplete() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { needsNext } = useLocalSearchParams();
  const guard = useSinglePress();

  const handleContinue = guard(() => {
    switch (needsNext) {
      case "calm":
        router.replace("/calm");
        break;
      case "safety":
        router.replace("/safety-plan");
        break;
      case "learn":
        router.replace("/(tabs)/learn/index");
        break;
      case "help":
        router.replace("/(tabs)/resources");
        break;
      default:
        router.replace("/(tabs)");
        break;
    }
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
          paddingBottom: insets.bottom + 20,
          paddingTop: 40,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#22C55E",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Check color="white" size={48} />
          </View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#5B2CA0",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Check-In Saved
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6E6480",
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            You're documenting your experience. That takes courage.
          </Text>
        </View>

        <LinearGradient
          colors={["#5B2CA0", "#D9A62B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 20, borderRadius: 12, marginBottom: 30 }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "white",
              fontStyle: "italic",
              marginBottom: 15,
              lineHeight: 24,
            }}
          >
            "Every time you document what happened, you're building a record.
            You're taking back your power. You're preparing for the freedom
            that's coming."
          </Text>
          <Text
            style={{ fontSize: 18, color: "#D9A62B", fontFamily: "MonteCarlo" }}
          >
            — Dr. Mildred D. Muhammad, D.Hum
          </Text>
        </LinearGradient>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#2B2438",
            marginBottom: 15,
          }}
        >
          What's Next?
        </Text>

        <TouchableOpacity
          onPress={guard(() => router.push("/pattern-map"))}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FDF6E3",
            borderWidth: 1,
            borderColor: "#D9D1E6",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#2B2438",
                marginBottom: 4,
              }}
            >
              View Your Pattern Map Tracker
            </Text>
            <Text style={{ fontSize: 14, color: "#6E6480" }}>
              See trends and escalation indicators
            </Text>
          </View>
          <ArrowRight color="#5B2CA0" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={guard(() => router.push("/check-in-history"))}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FDF6E3",
            borderWidth: 1,
            borderColor: "#D9D1E6",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#2B2438",
                marginBottom: 4,
              }}
            >
              View Check-In History
            </Text>
            <Text style={{ fontSize: 14, color: "#6E6480" }}>
              Review all your check-in notes and entries
            </Text>
          </View>
          <ArrowRight color="#5B2CA0" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={guard(() => router.push("/safety-plan"))}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#FDF6E3",
            borderWidth: 1,
            borderColor: "#D9D1E6",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#2B2438",
                marginBottom: 4,
              }}
            >
              Update Your Safety Plan
            </Text>
            <Text style={{ fontSize: 14, color: "#6E6480" }}>
              Keep your exit strategy current
            </Text>
          </View>
          <ArrowRight color="#5B2CA0" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={guard(() => router.replace("/(tabs)"))}
          style={{
            backgroundColor: "#7A6B8A",
            paddingVertical: 16,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
