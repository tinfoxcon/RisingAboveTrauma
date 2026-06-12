import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import { Check } from "lucide-react-native";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import useSinglePress from "@/utils/useSinglePress";

const GROWTH_BEHAVIORS = [
  "Victories",
  "Breakthroughs",
  "Progress made",
  "Goals achieved",
  "Positive connections made",
  "Acts of self care",
  "Moments of peace",
  "Boundaries held",
];

const FREQUENCIES = [
  "Daily",
  "Several times a week",
  "Weekly",
  "Monthly",
  "Occasionally",
];

const GROWTH_FEELINGS = [
  "Proud",
  "Hopeful",
  "Grateful",
  "Strong",
  "Peaceful",
  "Confident",
  "Joyful",
  "Free",
  "Empowered",
  "Inspired",
];

const GROWTH_RATINGS = [
  { value: 1, label: "Small step forward" },
  { value: 2, label: "Steady progress" },
  { value: 3, label: "Significant growth" },
  { value: 4, label: "Major breakthrough" },
  { value: 5, label: "Transformative victory" },
];

export default function GrowthTrackerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedBehaviors, setSelectedBehaviors] = useState([]);
  const [frequency, setFrequency] = useState(null);
  const [selectedFeelings, setSelectedFeelings] = useState([]);
  const [growthRating, setGrowthRating] = useState(null);
  const [privateNotes, setPrivateNotes] = useState("");
  const [supportPerson, setSupportPerson] = useState("");
  const [saving, setSaving] = useState(false);
  const guard = useSinglePress();

  const toggleBehavior = (behavior) => {
    setSelectedBehaviors((prev) =>
      prev.includes(behavior)
        ? prev.filter((b) => b !== behavior)
        : [...prev, behavior],
    );
  };

  const toggleFeeling = (feeling) => {
    setSelectedFeelings((prev) =>
      prev.includes(feeling)
        ? prev.filter((f) => f !== feeling)
        : [...prev, feeling],
    );
  };

  const handleSave = guard(async () => {
    setSaving(true);
    try {
      const response = await fetchWithAuth("/api/growth-tracker/save", {
        method: "POST",
        body: JSON.stringify({
          behaviors: selectedBehaviors,
          frequency,
          feelings: selectedFeelings,
          growth_rating: growthRating,
          private_notes: privateNotes,
          support_person: supportPerson,
        }),
      });

      if (response.ok) {
        Alert.alert(
          "Victory Recorded! 🌟",
          "Your growth has been saved. You are reclaiming your power, one step at a time.",
          [
            {
              text: "OK",
              onPress: () => {
                setSelectedBehaviors([]);
                setFrequency(null);
                setSelectedFeelings([]);
                setGrowthRating(null);
                setPrivateNotes("");
                setSupportPerson("");
              },
            },
          ],
        );
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Could not save growth tracker. Please try again.");
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

      <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 20,
            paddingTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 20 }}
          >
            <Text style={{ fontSize: 16, color: "#4A2D8F", fontWeight: "600" }}>
              ← Back
            </Text>
          </TouchableOpacity>

          {/* Title and Introduction */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#4A2D8F",
                flex: 1,
              }}
            >
              Growth Tracker 🌟
            </Text>
            <TouchableOpacity
              onPress={guard(() => router.push("/growth-tracker-history"))}
              style={{
                backgroundColor: "#4A2D8F",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 13, color: "white", fontWeight: "600" }}>
                View History
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              lineHeight: 22,
              marginBottom: 30,
            }}
          >
            Track your victories, breakthroughs, and moments of strength. This
            is your personal record of reclaiming your life.
          </Text>

          {/* Section 1: Behaviors */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: 15,
            }}
          >
            What victories did I experience today?
          </Text>
          <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
            Select all that apply
          </Text>
          <View style={{ marginBottom: 30 }}>
            {GROWTH_BEHAVIORS.map((behavior) => (
              <TouchableOpacity
                key={behavior}
                onPress={() => toggleBehavior(behavior)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: selectedBehaviors.includes(behavior)
                    ? "#EDE9FE"
                    : "#FDF6E3",
                  borderWidth: 1,
                  borderColor: selectedBehaviors.includes(behavior)
                    ? "#4A2D8F"
                    : "#E5E7EB",
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: selectedBehaviors.includes(behavior)
                      ? "#4A2D8F"
                      : "#D1D5DB",
                    backgroundColor: selectedBehaviors.includes(behavior)
                      ? "#4A2D8F"
                      : "white",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  {selectedBehaviors.includes(behavior) && (
                    <Check color="white" size={16} />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#1F2937",
                    fontWeight: selectedBehaviors.includes(behavior)
                      ? "600"
                      : "normal",
                  }}
                >
                  {behavior}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Section 2: Frequency */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: 15,
            }}
          >
            How often am I experiencing this growth?
          </Text>
          <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
            Select one
          </Text>
          <View style={{ marginBottom: 30 }}>
            {FREQUENCIES.map((freq) => (
              <TouchableOpacity
                key={freq}
                onPress={() => setFrequency(freq)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: frequency === freq ? "#EDE9FE" : "#FDF6E3",
                  borderWidth: 1,
                  borderColor: frequency === freq ? "#4A2D8F" : "#E5E7EB",
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 2,
                    borderColor: frequency === freq ? "#4A2D8F" : "#D1D5DB",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  {frequency === freq && (
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: "#4A2D8F",
                      }}
                    />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#1F2937",
                    fontWeight: frequency === freq ? "600" : "normal",
                  }}
                >
                  {freq}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Section 3: Feelings */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: 15,
            }}
          >
            How do I feel about my progress?
          </Text>
          <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
            Select all that apply
          </Text>
          <View style={{ marginBottom: 30 }}>
            {GROWTH_FEELINGS.map((feeling) => (
              <TouchableOpacity
                key={feeling}
                onPress={() => toggleFeeling(feeling)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: selectedFeelings.includes(feeling)
                    ? "#EDE9FE"
                    : "#FDF6E3",
                  borderWidth: 1,
                  borderColor: selectedFeelings.includes(feeling)
                    ? "#4A2D8F"
                    : "#E5E7EB",
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: selectedFeelings.includes(feeling)
                      ? "#4A2D8F"
                      : "#D1D5DB",
                    backgroundColor: selectedFeelings.includes(feeling)
                      ? "#4A2D8F"
                      : "white",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  {selectedFeelings.includes(feeling) && (
                    <Check color="white" size={16} />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#1F2937",
                    fontWeight: selectedFeelings.includes(feeling)
                      ? "600"
                      : "normal",
                  }}
                >
                  {feeling}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Section 4: Growth Rating */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: 15,
            }}
          >
            How significant is this growth?
          </Text>
          <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
            Scale 1 to 5
          </Text>
          <View style={{ marginBottom: 30 }}>
            {GROWTH_RATINGS.map((rating) => (
              <TouchableOpacity
                key={rating.value}
                onPress={() => setGrowthRating(rating.value)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor:
                    growthRating === rating.value ? "#EDE9FE" : "#FDF6E3",
                  borderWidth: 1,
                  borderColor:
                    growthRating === rating.value ? "#4A2D8F" : "#E5E7EB",
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    borderWidth: 2,
                    borderColor:
                      growthRating === rating.value ? "#4A2D8F" : "#D1D5DB",
                    backgroundColor:
                      growthRating === rating.value ? "#4A2D8F" : "white",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color:
                        growthRating === rating.value ? "white" : "#6B7280",
                    }}
                  >
                    {rating.value}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#1F2937",
                    fontWeight:
                      growthRating === rating.value ? "600" : "normal",
                  }}
                >
                  {rating.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Section 5: Private Notes */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: 10,
            }}
          >
            Private notes for reflection
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#6B7280",
              marginBottom: 12,
              lineHeight: 20,
            }}
          >
            Write about your growth today. What are you proud of? What did you
            learn?
          </Text>
          <TextInput
            value={privateNotes}
            onChangeText={setPrivateNotes}
            placeholder="Your private reflections..."
            multiline
            numberOfLines={6}
            style={{
              backgroundColor: "#FDF6E3",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 8,
              padding: 14,
              fontSize: 15,
              color: "#1F2937",
              textAlignVertical: "top",
              minHeight: 120,
              marginBottom: 30,
            }}
          />

          {/* Section 6: Who Was Involved */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: 10,
            }}
          >
            Who supported your growth today? (Optional)
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#6B7280",
              marginBottom: 12,
              lineHeight: 20,
            }}
          >
            Document anyone who helped, encouraged, or supported you today.
          </Text>
          <TextInput
            value={supportPerson}
            onChangeText={setSupportPerson}
            placeholder="Name or initials of person who supported you"
            placeholderTextColor="#9CA3AF"
            style={{
              backgroundColor: "#FDF6E3",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 15,
              color: "#1F2937",
              marginBottom: 30,
            }}
          />

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{
              backgroundColor: "#F0B429",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {saving ? "Saving..." : "Save Entry"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingAnimatedView>
    </View>
  );
}
