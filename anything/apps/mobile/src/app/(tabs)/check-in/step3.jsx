import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import useSinglePress from "@/utils/useSinglePress";

export default function CheckInStep3() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [safetyRating, setSafetyRating] = useState(null);
  const guard = useSinglePress();

  const ratings = [
    {
      value: 1,
      label: "Very Unsafe",
      color: "#E32626",
      message: "I am in immediate danger",
    },
    {
      value: 2,
      label: "Unsafe",
      color: "#EA580C",
      message: "I am worried about what might happen",
    },
    {
      value: 3,
      label: "Uncertain",
      color: "#F59E0B",
      message: "Things feel tense and unpredictable",
    },
    {
      value: 4,
      label: "Mostly Safe",
      color: "#84CC16",
      message: "I feel relatively secure right now",
    },
    {
      value: 5,
      label: "Safe",
      color: "#22C55E",
      message: "I feel safe and supported",
    },
  ];

  const handleRatingSelect = guard((rating) => {
    setSafetyRating(rating);

    // Automatically navigate based on the selection
    setTimeout(() => {
      if (rating === 1) {
        // Rating 1 "Very Unsafe" goes to emergency screen with 911 button
        router.push({
          pathname: "/(tabs)/check-in/emergency",
          params: { ...params, safetyRating: rating },
        });
      } else if (rating === 5) {
        // Rating 5 "Safe and supported" goes to Calm & Affirmations
        router.push("/calm");
      } else {
        // Ratings 2-4 continue with check-in flow
        router.push({
          pathname: "/(tabs)/check-in/step4",
          params: { ...params, safetyRating: rating },
        });
      }
    }, 300); // Small delay for visual feedback
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
          How safe do you feel right now?
        </Text>
        <Text style={{ fontSize: 14, color: "#6E6480", marginBottom: 30 }}>
          Your honest answer helps you track patterns
        </Text>

        {ratings.map((rating) => (
          <TouchableOpacity
            key={rating.value}
            onPress={() => handleRatingSelect(rating.value)}
            style={{
              backgroundColor:
                safetyRating === rating.value ? rating.color : "#FFFFFF",
              borderWidth: 2,
              borderColor: rating.color,
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor:
                    safetyRating === rating.value ? "white" : rating.color,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text
                  style={{
                    color:
                      safetyRating === rating.value ? rating.color : "white",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {rating.value}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: safetyRating === rating.value ? "white" : rating.color,
                }}
              >
                {rating.label}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                color:
                  safetyRating === rating.value
                    ? "rgba(255,255,255,0.9)"
                    : "#6E6480",
                lineHeight: 20,
              }}
            >
              {rating.message}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
