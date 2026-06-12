import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import { Check } from "lucide-react-native";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import useSinglePress from "@/utils/useSinglePress";

const BEHAVIORS = [
  "Argument",
  "Threats",
  "Physical Contact",
  "Monitoring/Control",
  "Financial Control",
  "Isolation",
  "Humiliation",
  "Stalking",
  "Digital Surveillance",
  "Spiritual Abuse",
];

const FREQUENCIES = [
  "Daily",
  "Several times a week",
  "Weekly",
  "Monthly",
  "Occasionally",
];

const FEELINGS = [
  "Scared",
  "Confused",
  "Sad",
  "Angry",
  "Numb",
  "Hopeless",
  "Anxious",
  "Trapped",
  "Alone",
  "Ashamed",
];

const SAFETY_RATINGS = [
  { value: 1, label: "I feel safe" },
  { value: 2, label: "I feel mostly safe" },
  { value: 3, label: "I feel uncertain" },
  { value: 4, label: "I feel unsafe" },
  { value: 5, label: "I am in immediate danger" },
];

export default function PatternTrackerRebuildScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { editId } = useLocalSearchParams();

  const [selectedBehaviors, setSelectedBehaviors] = useState([]);
  const [frequency, setFrequency] = useState(null);
  const [selectedFeelings, setSelectedFeelings] = useState([]);
  const [safetyRating, setSafetyRating] = useState(null);
  const [privateNotes, setPrivateNotes] = useState("");
  const [assailantName, setAssailantName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const guard = useSinglePress();

  // Load existing entry if editing
  useEffect(() => {
    if (editId) {
      loadEntry();
    }
  }, [editId]);

  const loadEntry = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(`/api/pattern-tracker/${editId}`);

      if (response.ok) {
        const data = await response.json();
        const tracker = data.tracker;

        setSelectedBehaviors(tracker.behaviors || []);
        setFrequency(tracker.frequency);
        setSelectedFeelings(tracker.feelings || []);
        setSafetyRating(tracker.safety_rating);
        setPrivateNotes(tracker.private_notes || "");
        setAssailantName(tracker.assailant_name || "");
        setRelationship(tracker.assailant_relationship || "");
      } else {
        throw new Error("Failed to load entry");
      }
    } catch (error) {
      console.error("Load entry error:", error);
      Alert.alert("Error", "Could not load entry for editing");
      router.back();
    } finally {
      setLoading(false);
    }
  };

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

  // CRITICAL SAFETY: Handle safety rating selection with immediate emergency routing
  const handleSafetyRatingSelect = guard((rating) => {
    setSafetyRating(rating);

    // If user selects "I am in immediate danger", route immediately to emergency screen
    if (rating === 5) {
      setTimeout(() => {
        router.push({
          pathname: "/(tabs)/check-in/emergency",
          params: { safetyRating: rating },
        });
      }, 300);
    }
  });

  const handleSave = guard(async () => {
    // Validation — only "Who was involved" is optional
    const missing = [];
    if (selectedBehaviors.length === 0)
      missing.push("• What behaviors am I experiencing?");
    if (!frequency) missing.push("• How often does this happen?");
    if (selectedFeelings.length === 0)
      missing.push("• How do I feel after it happens?");
    if (!safetyRating) missing.push("• What was my safety rating today?");
    if (!privateNotes.trim()) missing.push("• Private notes");

    if (missing.length > 0) {
      Alert.alert(
        "Please complete all sections",
        "The following sections are required:\n\n" + missing.join("\n"),
      );
      return;
    }

    setSaving(true);
    try {
      const url = editId
        ? `/api/pattern-tracker/${editId}`
        : "/api/pattern-tracker/save";
      const method = editId ? "PUT" : "POST";

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify({
          behaviors: selectedBehaviors,
          frequency,
          feelings: selectedFeelings,
          safety_rating: safetyRating,
          private_notes: privateNotes,
          assailant_name: assailantName,
          assailant_relationship: relationship,
        }),
      });

      if (response.ok) {
        Alert.alert(
          editId ? "Updated" : "Saved",
          editId
            ? "Your tracker has been updated. 🕊"
            : "Your tracker has been saved privately. You are not alone. 🕊",
          [
            {
              text: "OK",
              onPress: () => {
                if (editId) {
                  router.back();
                } else {
                  // Navigate to history so the user sees the new entry
                  router.push("/pattern-tracker-history");
                }
              },
            },
          ],
        );
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save");
      }
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Could not save tracker. Please try again.");
    } finally {
      setSaving(false);
    }
  });

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F3F0F8",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: insets.top,
        }}
      >
        <StatusBar style="dark" />
        <SafetyButtons />
        <ActivityIndicator size="large" color="#4A2D8F" />
        <Text style={{ marginTop: 15, color: "#6B7280" }}>
          Loading entry...
        </Text>
      </View>
    );
  }

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
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#4A2D8F",
              marginBottom: 15,
            }}
          >
            {editId ? "Edit Pattern Tracker" : "Pattern Map Tracker"}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              lineHeight: 22,
              marginBottom: 30,
            }}
          >
            {editId
              ? "Update your pattern tracker entry. All changes are encrypted and private."
              : "This private tracker helps you identify and document patterns of abusive behavior. Your answers are encrypted and visible only to you."}
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
            What behaviors am I experiencing?
          </Text>
          <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
            Select all that apply
          </Text>
          <View style={{ marginBottom: 30 }}>
            {BEHAVIORS.map((behavior) => (
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
            How often does this happen?
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
            How do I feel after it happens?
          </Text>
          <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
            Select all that apply
          </Text>
          <View style={{ marginBottom: 30 }}>
            {FEELINGS.map((feeling) => (
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

          {/* Section 4: Safety Rating */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: 15,
            }}
          >
            What was my safety rating today?
          </Text>
          <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 12 }}>
            Scale 1 to 5
          </Text>
          <View style={{ marginBottom: 30 }}>
            {SAFETY_RATINGS.map((rating) => (
              <TouchableOpacity
                key={rating.value}
                onPress={() => handleSafetyRatingSelect(rating.value)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor:
                    safetyRating === rating.value ? "#EDE9FE" : "#FDF6E3",
                  borderWidth: 1,
                  borderColor:
                    safetyRating === rating.value ? "#4A2D8F" : "#E5E7EB",
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
                      safetyRating === rating.value ? "#4A2D8F" : "#D1D5DB",
                    backgroundColor:
                      safetyRating === rating.value ? "#4A2D8F" : "white",
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
                        safetyRating === rating.value ? "white" : "#6B7280",
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
                      safetyRating === rating.value ? "600" : "normal",
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
            Private notes
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#6B7280",
              marginBottom: 12,
              lineHeight: 20,
            }}
          >
            Write anything you want to remember about today. This is private and
            encrypted.
          </Text>
          <TextInput
            value={privateNotes}
            onChangeText={setPrivateNotes}
            placeholder="Your private notes..."
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
            Who was involved? (Optional)
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: "#6B7280",
              marginBottom: 12,
              lineHeight: 20,
            }}
          >
            Document who was involved for your records. This information is
            encrypted and private.
          </Text>
          <TextInput
            value={assailantName}
            onChangeText={setAssailantName}
            placeholder="Name or initials"
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
              marginBottom: 12,
            }}
          />
          <TextInput
            value={relationship}
            onChangeText={setRelationship}
            placeholder="Relationship (e.g., partner, ex, family member, coworker)"
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
              {saving
                ? editId
                  ? "Updating..."
                  : "Saving..."
                : editId
                  ? "Update My Tracker"
                  : "Save My Tracker"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingAnimatedView>
    </View>
  );
}
