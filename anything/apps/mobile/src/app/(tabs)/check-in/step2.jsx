import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import { Check } from "lucide-react-native";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import useSinglePress from "@/utils/useSinglePress";

export default function CheckInStep2() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { what } = useLocalSearchParams();
  const [selectedBehaviors, setSelectedBehaviors] = useState([]);
  const [assailantName, setAssailantName] = useState("");
  const [relationship, setRelationship] = useState("");
  const guard = useSinglePress();

  const behaviors = [
    { id: "yelling", label: "Yelling/Screaming" },
    { id: "insults", label: "Name-calling/Insults" },
    { id: "blame", label: "Blaming me" },
    { id: "silent", label: "Silent treatment" },
    { id: "intimidation", label: "Intimidation" },
    { id: "monitoring", label: "Checking phone/location" },
    { id: "isolation", label: "Isolating me" },
    { id: "jealousy", label: "Extreme jealousy" },
    { id: "pushing", label: "Pushing/Shoving", danger: true },
    { id: "hitting", label: "Hitting/Slapping", danger: true },
    { id: "choking", label: "Choking/Strangling", danger: true },
    { id: "weapon", label: "Weapon present/threatened", danger: true },
    { id: "sexual", label: "Sexual coercion" },
    { id: "property", label: "Destroying property" },
    { id: "pets", label: "Hurting pets" },
    { id: "children", label: "Threatening children" },
  ];

  const dangerBehaviors = ["pushing", "hitting", "choking", "weapon"];

  const toggleBehavior = (id) => {
    if (selectedBehaviors.includes(id)) {
      setSelectedBehaviors(selectedBehaviors.filter((b) => b !== id));
    } else {
      setSelectedBehaviors([...selectedBehaviors, id]);
    }
  };

  const handleContinue = guard(() => {
    const hasHighRisk = selectedBehaviors.some((b) =>
      dangerBehaviors.includes(b),
    );
    const params = {
      what,
      behaviors: JSON.stringify(selectedBehaviors),
      assailantName,
      relationship,
    };

    if (hasHighRisk) {
      router.push({
        pathname: "/(tabs)/check-in/high-risk",
        params,
      });
    } else {
      router.push({
        pathname: "/(tabs)/check-in/step3",
        params,
      });
    }
  });

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <SafetyButtons />

      <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 100,
            paddingTop: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 20 }}
          >
            <Text style={{ fontSize: 16, color: "#7A6B8A", fontWeight: "600" }}>
              ← Back
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#2B2438",
              marginBottom: 10,
            }}
          >
            What You Are Still Experiencing
          </Text>
          <Text style={{ fontSize: 14, color: "#6E6480", marginBottom: 20 }}>
            Select all that apply
          </Text>

          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 30 }}
          >
            {behaviors.map((behavior) => (
              <TouchableOpacity
                key={behavior.id}
                onPress={() => toggleBehavior(behavior.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: behavior.danger ? "#E32626" : "#7A6B8A",
                  backgroundColor: selectedBehaviors.includes(behavior.id)
                    ? behavior.danger
                      ? "#E32626"
                      : "#7A6B8A"
                    : "#FDF6E3",
                  marginRight: 8,
                  marginBottom: 12,
                }}
              >
                {selectedBehaviors.includes(behavior.id) && (
                  <Check color="#FFFFFF" size={16} style={{ marginRight: 6 }} />
                )}
                <Text
                  style={{
                    color: selectedBehaviors.includes(behavior.id)
                      ? "#FFFFFF"
                      : behavior.danger
                        ? "#E32626"
                        : "#7A6B8A",
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  {behavior.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#2B2438",
              marginBottom: 15,
            }}
          >
            Who was involved? (Optional)
          </Text>

          <TextInput
            value={assailantName}
            onChangeText={setAssailantName}
            placeholder="Name or initials"
            placeholderTextColor="#9CA3AF"
            style={{
              backgroundColor: "#FDF6E3",
              borderWidth: 1,
              borderColor: "#D9D1E6",
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              marginBottom: 12,
              color: "#2B2438",
            }}
          />

          <TextInput
            value={relationship}
            onChangeText={setRelationship}
            placeholder="Relationship (e.g., partner, ex, family)"
            placeholderTextColor="#9CA3AF"
            style={{
              backgroundColor: "#FDF6E3",
              borderWidth: 1,
              borderColor: "#D9D1E6",
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              marginBottom: 30,
              color: "#2B2438",
            }}
          />
        </ScrollView>

        {selectedBehaviors.length > 0 && (
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
              borderTopColor: "#D9D1E6",
            }}
          >
            <TouchableOpacity
              onPress={handleContinue}
              style={{
                backgroundColor: "#7A6B8A",
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingAnimatedView>
    </View>
  );
}
