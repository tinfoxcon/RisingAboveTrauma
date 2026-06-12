import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import useUser from "@/utils/auth/useUser";
import { useAuthStore } from "@/utils/auth/store";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import useSinglePress from "@/utils/useSinglePress";

export default function CheckInScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: user } = useUser();
  const { auth, setAuth } = useAuthStore();
  const [consentChecked, setConsentChecked] = useState(false);
  const [showPathwayStep, setShowPathwayStep] = useState(false);
  const [selectedPath, setSelectedPath] = useState(user?.current_path || null);
  const [pendingOption, setPendingOption] = useState(null);
  const [saving, setSaving] = useState(false);
  const guard = useSinglePress();

  useEffect(() => {
    if (user && !user.checkin_consent_given && !consentChecked) {
      setConsentChecked(true);
      Alert.alert(
        "Your Privacy Matters",
        "Before you continue, please know that this app will securely store your personal safety information, including details about incidents and your safety plan. This data is encrypted, completely private to you, and never shared with anyone.\n\nBy continuing you consent to the secure storage of this information on your device and our encrypted servers.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => router.replace("/"),
          },
          {
            text: "I Understand — Continue",
            onPress: async () => {
              try {
                await fetchWithAuth("/api/consent/update", {
                  method: "POST",
                  body: JSON.stringify({ consentType: "checkin" }),
                });
                setAuth({
                  ...auth,
                  user: {
                    ...auth.user,
                    checkin_consent_given: true,
                  },
                });
              } catch (error) {
                console.error("Consent error:", error);
              }
            },
          },
        ],
        { cancelable: false },
      );
    }
  }, [user, consentChecked]);

  const whatHappenedOptions =
    user?.current_path === "rebuild"
      ? [
          { id: "confidence", label: "Building Confidence", emoji: "💪" },
          { id: "boundaries", label: "Setting Boundaries", emoji: "🛡️" },
          { id: "relationships", label: "Healthy Relationships", emoji: "💚" },
          { id: "career", label: "Career/Education", emoji: "🎯" },
          { id: "selfcare", label: "Self-Care", emoji: "🌸" },
          { id: "celebrating", label: "Celebrating Progress", emoji: "✨" },
        ]
      : [
          { id: "argument", label: "Argument", emoji: "💬" },
          { id: "threats", label: "Threats", emoji: "⚠️" },
          {
            id: "physical",
            label: "Physical Contact",
            emoji: "✋",
            danger: true,
          },
          { id: "monitoring", label: "Monitoring/Control", emoji: "👁️" },
          { id: "financial", label: "Financial Control", emoji: "💳" },
          { id: "checking", label: "Just Checking In", emoji: "✓" },
        ];

  const handleOptionPress = guard((optionId) => {
    setPendingOption(optionId);
    setShowPathwayStep(true);
  });

  const handlePathwayContinue = guard(async () => {
    setSaving(true);
    try {
      if (selectedPath && selectedPath !== user?.current_path) {
        await fetchWithAuth("/api/settings/update", {
          method: "POST",
          body: JSON.stringify({ current_path: selectedPath }),
        });
      }
      router.push({
        pathname: "/(tabs)/check-in/step2",
        params: { what: pendingOption },
      });
    } catch (error) {
      console.error("Path update error:", error);
      router.push({
        pathname: "/(tabs)/check-in/step2",
        params: { what: pendingOption },
      });
    } finally {
      setSaving(false);
    }
  });

  if (showPathwayStep) {
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
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => setShowPathwayStep(false)}
            style={{ marginBottom: 20 }}
          >
            <Text style={{ fontSize: 16, color: "#7A6B8A", fontWeight: "600" }}>
              ← Back
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#2B2438",
              marginBottom: 10,
            }}
          >
            Where Are You Right Now?
          </Text>
          <Text style={{ fontSize: 14, color: "#6E6480", marginBottom: 30 }}>
            Your path helps us personalize resources and support for your
            current situation
          </Text>

          <TouchableOpacity
            onPress={() => setSelectedPath("still_in_it")}
            style={{
              backgroundColor:
                selectedPath === "still_in_it" ? "#7A6B8A" : "#FDF6E3",
              borderWidth: 2,
              borderColor: "#7A6B8A",
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: selectedPath === "still_in_it" ? "#FFFFFF" : "#7A6B8A",
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              Still In It
            </Text>
            <Text
              style={{
                fontSize: 14,
                color:
                  selectedPath === "still_in_it"
                    ? "rgba(255,255,255,0.9)"
                    : "#6E6480",
              }}
            >
              You're currently in an unsafe situation
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedPath("just_left")}
            style={{
              backgroundColor:
                selectedPath === "just_left" ? "#7A6B8A" : "#FDF6E3",
              borderWidth: 2,
              borderColor: "#7A6B8A",
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: selectedPath === "just_left" ? "#FFFFFF" : "#7A6B8A",
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              Just Left
            </Text>
            <Text
              style={{
                fontSize: 14,
                color:
                  selectedPath === "just_left"
                    ? "rgba(255,255,255,0.9)"
                    : "#6E6480",
              }}
            >
              You recently left an abusive relationship
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedPath("rebuild")}
            style={{
              backgroundColor:
                selectedPath === "rebuild" ? "#7A6B8A" : "#FDF6E3",
              borderWidth: 2,
              borderColor: "#7A6B8A",
              padding: 20,
              borderRadius: 12,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: selectedPath === "rebuild" ? "#FFFFFF" : "#7A6B8A",
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              Rebuilding
            </Text>
            <Text
              style={{
                fontSize: 14,
                color:
                  selectedPath === "rebuild"
                    ? "rgba(255,255,255,0.9)"
                    : "#6E6480",
              }}
            >
              You're healing and building your new life
            </Text>
          </TouchableOpacity>
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
            onPress={handlePathwayContinue}
            disabled={!selectedPath || saving}
            style={{
              backgroundColor: selectedPath && !saving ? "#7A6B8A" : "#D1D5DB",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}
            >
              {saving ? "Please wait..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#2B2438",
            marginBottom: 10,
          }}
        >
          60-Second Check-In
        </Text>
        <Text style={{ fontSize: 14, color: "#6E6480", marginBottom: 30 }}>
          {user?.current_path === "rebuild"
            ? "Track your progress and victories as you rebuild."
            : "Document what happened. This stays private and helps you see patterns."}
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#2B2438",
            marginBottom: 15,
          }}
        >
          {user?.current_path === "rebuild"
            ? "How are you growing today?"
            : "What happened?"}
        </Text>

        {whatHappenedOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleOptionPress(option.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              backgroundColor: option.danger ? "#FEE2E2" : "#FDF6E3",
              borderRadius: 12,
              marginBottom: 12,
              borderWidth: option.danger ? 2 : 1,
              borderColor: option.danger ? "#E32626" : "#D9D1E6",
            }}
          >
            <Text style={{ fontSize: 32, marginRight: 16 }}>
              {option.emoji}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: option.danger ? "#E32626" : "#2B2438",
                fontWeight: "500",
                flex: 1,
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
