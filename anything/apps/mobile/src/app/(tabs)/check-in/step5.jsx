import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import { LinearGradient } from "expo-linear-gradient";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import useSinglePress from "@/utils/useSinglePress";

export default function CheckInStep5() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [addedPrompts, setAddedPrompts] = useState(new Set());
  const guard = useSinglePress();

  const prompts = [
    "What I noticed about the pattern...",
    "What triggered this...",
    "How I'm feeling now...",
    "What I need to remember...",
    "One thing I can do to stay safe...",
  ];

  const addPrompt = (prompt) => {
    if (addedPrompts.has(prompt)) return; // already added, do nothing
    setNotes((prev) => prev + (prev ? "\n\n" : "") + prompt + " ");
    setAddedPrompts((prev) => new Set([...prev, prompt]));
  };

  const handleNotesChange = (text) => {
    setNotes(text);
    // Re-enable prompts that were manually deleted from the text
    setAddedPrompts((prev) => {
      const updated = new Set(prev);
      for (const p of prev) {
        if (!text.includes(p)) updated.delete(p);
      }
      return updated;
    });
  };

  const handleSave = guard(async () => {
    setSaving(true);
    try {
      const response = await fetchWithAuth("/api/checkins/create", {
        method: "POST",
        body: JSON.stringify({
          what_happened: params.what,
          behaviors: JSON.parse(params.behaviors || "[]"),
          assailant_name: params.assailantName,
          assailant_relationship: params.relationship,
          safety_rating: parseInt(params.safetyRating),
          needs_next: params.needsNext,
          notes,
        }),
      });

      if (response.ok) {
        router.push({
          pathname: "/(tabs)/check-in/complete",
          params: { needsNext: params.needsNext },
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Check-in save failed:", response.status, errorData);
        if (response.status === 401) {
          Alert.alert(
            "Session Expired",
            "Please sign out and sign back in, then try again.",
          );
        } else {
          Alert.alert("Error", "Could not save check-in. Please try again.");
        }
      }
    } catch (error) {
      console.error("Check-in save error:", error);
      Alert.alert(
        "Error",
        "Could not save check-in. Please check your connection.",
      );
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
          paddingBottom: insets.bottom + 100,
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
          Private Notes
        </Text>
        <Text style={{ fontSize: 14, color: "#6E6480", marginBottom: 20 }}>
          This is for your eyes only. No one else will see it.
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#2B2438",
            marginBottom: 15,
          }}
        >
          Quick prompts (tap to add):
        </Text>

        <View
          style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 20 }}
        >
          {prompts.map((prompt, index) => {
            const isAdded = addedPrompts.has(prompt);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => addPrompt(prompt)}
                activeOpacity={isAdded ? 1 : 0.7}
                style={{
                  backgroundColor: isAdded ? "#EDE9FE" : "#FCFAFF",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 16,
                  marginRight: 8,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: isAdded ? "#7C3AED" : "#D9D1E6",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {isAdded && (
                  <Text
                    style={{ fontSize: 11, color: "#7C3AED", marginRight: 4 }}
                  >
                    ✓
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: 13,
                    color: isAdded ? "#7C3AED" : "#5B2CA0",
                    opacity: isAdded ? 0.6 : 1,
                  }}
                >
                  {prompt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TextInput
          value={notes}
          onChangeText={handleNotesChange}
          placeholder="Write what you want to remember... (optional)"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          style={{
            backgroundColor: "#FDF6E3",
            borderWidth: 1,
            borderColor: "#D9D1E6",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: "#2B2438",
            minHeight: 200,
            marginBottom: 20,
          }}
        />

        {/* NEW: Calm & Affirmations button when needsNext is "calm" */}
        {params.needsNext === "calm" && (
          <TouchableOpacity
            onPress={() => router.push("/calm")}
            style={{
              backgroundColor: "#D9A62B",
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Take me to Calm & Affirmations 🕊
            </Text>
          </TouchableOpacity>
        )}

        <View
          style={{ backgroundColor: "#FEF3C7", padding: 16, borderRadius: 12 }}
        >
          <Text style={{ fontSize: 13, color: "#92400E", lineHeight: 20 }}>
            💡 Your notes are encrypted and stored privately. They help you spot
            patterns and prepare for conversations with attorneys or advocates.
          </Text>
        </View>
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
          borderTopColor: "#D9D1E6",
        }}
      >
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{
            backgroundColor: "#7A6B8A",
            paddingVertical: 16,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}>
            {saving ? "Saving..." : "Save Check-In"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
