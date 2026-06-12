import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Heart,
  Shield,
  BookOpen,
  Phone,
  MessageCircle,
} from "lucide-react-native";
import SafetyButtons from "@/components/SafetyButtons";
import useSinglePress from "@/utils/useSinglePress";

export default function CheckInStep4() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [selectedNeed, setSelectedNeed] = useState(null);
  const guard = useSinglePress();

  const needs = [
    {
      id: "calm",
      label: "I need to calm down",
      icon: <Heart color="#5B2CA0" size={28} />,
      route: "/calm",
    },
    {
      id: "safety",
      label: "I need to plan for safety",
      icon: <Shield color="#5B2CA0" size={28} />,
      route: "/safety-plan",
    },
    {
      id: "learn",
      label: "I want to understand this",
      icon: <BookOpen color="#5B2CA0" size={28} />,
      route: "/(tabs)/learn/index",
    },
    {
      id: "help",
      label: "I need help now",
      icon: <Phone color="#E32626" size={28} />,
      route: "/(tabs)/resources",
    },
    {
      id: "finish",
      label: "Just finish and save this",
      icon: <MessageCircle color="#5B2CA0" size={28} />,
      action: "notes",
    },
  ];

  const handleSelect = guard((need) => {
    setSelectedNeed(need.id);

    if (need.id === "help") {
      setTimeout(() => {
        router.push({
          pathname: "/(tabs)/check-in/emergency",
          params,
        });
      }, 200);
      return;
    }

    setTimeout(() => {
      router.push({
        pathname: "/(tabs)/check-in/step5",
        params: { ...params, needsNext: need.id },
      });
    }, 200);
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
          paddingTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#2B2438",
            marginBottom: 10,
          }}
        >
          What do you need next?
        </Text>
        <Text style={{ fontSize: 14, color: "#6E6480", marginBottom: 30 }}>
          We'll take you there after saving your check-in
        </Text>

        {needs.map((need) => (
          <TouchableOpacity
            key={need.id}
            onPress={() => handleSelect(need)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: selectedNeed === need.id ? "#FCFAFF" : "#FDF6E3",
              borderWidth: 1,
              borderColor: need.id === "help" ? "#E32626" : "#D9D1E6",
              padding: 20,
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            <View style={{ marginRight: 16 }}>{need.icon}</View>
            <Text
              style={{
                flex: 1,
                fontSize: 16,
                fontWeight: "500",
                color: need.id === "help" ? "#E32626" : "#2B2438",
              }}
            >
              {need.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
