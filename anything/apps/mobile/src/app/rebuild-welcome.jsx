import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import { LinearGradient } from "expo-linear-gradient";

export default function RebuildWelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
        <LinearGradient
          colors={["#4A2D8F", "#F0B429"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: 30,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "white",
              lineHeight: 28,
              marginBottom: 20,
            }}
          >
            You made it. What happened to you was not your fault, and you
            survived it. This part of your journey is about reclaiming what
            abuse tried to take from you — your voice, your confidence, your
            peace, and your future. You are not starting over. You are starting
            from what you now know.
          </Text>

          <Text
            style={{
              fontSize: 18,
              color: "white",
              lineHeight: 28,
              marginBottom: 20,
            }}
          >
            Those four words — voice, confidence, peace, and future — are in the
            right order. Voice comes first because that is often what abuse
            tries to silence first. Confidence follows. Then peace. And from
            there, the future begins to open up.
          </Text>

          <Text
            style={{
              fontSize: 18,
              color: "white",
              lineHeight: 28,
              marginBottom: 20,
            }}
          >
            That is not just a welcome message. It is a roadmap of recovery in
            one sentence.
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#4A2D8F",
              fontWeight: "600",
              marginTop: 10,
            }}
          >
            — Dr. Mildred D. Muhammad, D.Hum
          </Text>
        </LinearGradient>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          paddingBottom: insets.bottom + 20,
          backgroundColor: "#FDF6E3",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)")}
          style={{
            backgroundColor: "#F0B429",
            paddingVertical: 16,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Begin My Rebuilding
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
