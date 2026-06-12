import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { TabSelector } from "@/components/Resources/TabSelector";
import { USResourcesTab } from "@/components/Resources/USResourcesTab";
import { InternationalResourcesTab } from "@/components/Resources/InternationalResourcesTab";

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("us");

  const canGoBack = router.canGoBack();

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <SafetyButtons />

      <View
        style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}
      >
        {canGoBack && (
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 12 }}
          >
            <Text style={{ fontSize: 16, color: "#4A2D8F", fontWeight: "600" }}>
              ← Back
            </Text>
          </TouchableOpacity>
        )}

        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#2B2438",
            marginBottom: 20,
          }}
        >
          Resources
        </Text>

        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 80,
        }}
      >
        {activeTab === "us" ? (
          <USResourcesTab />
        ) : (
          <InternationalResourcesTab />
        )}

        <Text
          style={{
            fontSize: 14,
            color: "#D97706",
            textAlign: "center",
            marginTop: 40,
            marginBottom: 20,
            fontWeight: "500",
          }}
        >
          Ensuring support is accessible to all communities. 🕊
        </Text>
      </ScrollView>
    </View>
  );
}
