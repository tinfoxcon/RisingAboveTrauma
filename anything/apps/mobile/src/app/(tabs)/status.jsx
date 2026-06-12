import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import useUser from "@/utils/auth/useUser";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useState } from "react";
import useSinglePress from "@/utils/useSinglePress";

export default function StatusTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: user, refetch } = useUser();
  const [saving, setSaving] = useState(false);
  const guard = useSinglePress();

  const handlePathSelect = guard(async (path) => {
    setSaving(true);
    try {
      await fetchWithAuth("/api/settings/update", {
        method: "POST",
        body: JSON.stringify({ current_path: path }),
      });
      await refetch();

      if (path === "rebuild") {
        router.push("/your-next-chapter");
      } else {
        router.push("/(tabs)/check-in/step2");
      }
    } catch (error) {
      console.error("Path update error:", error);
    } finally {
      setSaving(false);
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
          paddingBottom: insets.bottom + 80,
          paddingTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#2B2438",
            marginBottom: 10,
          }}
        >
          What's Your Status?
        </Text>
        <Text style={{ fontSize: 14, color: "#6E6480", marginBottom: 30 }}>
          Your status can change as your situation changes
        </Text>

        <TouchableOpacity
          onPress={() => handlePathSelect("still_in_it")}
          disabled={saving}
          style={{
            backgroundColor: "#FFF1F0",
            borderWidth: 2,
            borderColor: "#D92D20",
            padding: 20,
            borderRadius: 12,
            marginBottom: 16,
            opacity: saving ? 0.6 : 1,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 36, marginRight: 16 }}>🔒</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 20,
                  color: "#D92D20",
                  fontWeight: "bold",
                  marginBottom: 8,
                }}
              >
                Still In It
              </Text>
              <Text style={{ fontSize: 14, color: "#6E6480" }}>
                You're currently in an unsafe situation
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePathSelect("just_left")}
          disabled={saving}
          style={{
            backgroundColor: "#FFF9E8",
            borderWidth: 2,
            borderColor: "#D4A017",
            padding: 20,
            borderRadius: 12,
            marginBottom: 16,
            opacity: saving ? 0.6 : 1,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 36, marginRight: 16 }}>🚶‍♀️</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 20,
                  color: "#D4A017",
                  fontWeight: "bold",
                  marginBottom: 8,
                }}
              >
                Just Left
              </Text>
              <Text style={{ fontSize: 14, color: "#6E6480" }}>
                You recently left an abusive relationship
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePathSelect("rebuild")}
          disabled={saving}
          style={{
            backgroundColor: "#EEF9F0",
            borderWidth: 2,
            borderColor: "#2F9E44",
            padding: 20,
            borderRadius: 12,
            opacity: saving ? 0.6 : 1,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 36, marginRight: 16 }}>🌱</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 20,
                  color: "#2F9E44",
                  fontWeight: "bold",
                  marginBottom: 8,
                }}
              >
                Rebuilding
              </Text>
              <Text style={{ fontSize: 14, color: "#6E6480" }}>
                You're healing and building your new life
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
