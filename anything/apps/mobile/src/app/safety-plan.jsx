import { useState, useEffect } from "react";
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
import { Check } from "lucide-react-native";
import useUser from "@/utils/auth/useUser";
import { useAuthStore } from "@/utils/auth/store";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import useSinglePress from "@/utils/useSinglePress";

const steps = [
  {
    id: "warning_signs",
    title: "My First Move",
    prompt: "If danger escalates right now what is my immediate next step?",
  },
  {
    id: "safe_people",
    title: "Safe People",
    prompt: "Who can I call? Who can I trust? (Names and phone numbers)",
  },
  {
    id: "important_documents",
    title: "Important Documents",
    prompt:
      "ID, birth certificates, passports, social security cards, insurance, medical records, school records",
  },
  {
    id: "emergency_bag",
    title: "Emergency Bag",
    prompt: "Clothes, money, keys, medications, chargers, important papers",
  },
  {
    id: "safe_places",
    title: "Safe Places",
    prompt: "Where can I go if I need to leave quickly? Exact addresses.",
  },
  {
    id: "children_safety",
    title: "Children's Safety",
    prompt: "How will I keep my children safe if I need to leave?",
  },
  {
    id: "financial_safety",
    title: "Financial Safety",
    prompt: "Hidden cash, separate bank account, credit in my name",
  },
  {
    id: "legal_protection",
    title: "Legal Protection",
    prompt: "Restraining order, custody plan, legal aid contact",
  },
];

export default function SafetyPlanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [planData, setPlanData] = useState({});
  const [saving, setSaving] = useState(false);
  const { data: user } = useUser();
  const { auth, setAuth } = useAuthStore();
  const guard = useSinglePress();

  useEffect(() => {
    if (user && !user.safety_plan_consent_given) {
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
                  body: JSON.stringify({ consentType: "safety_plan" }),
                });
                // Update local auth state immediately
                setAuth({
                  ...auth,
                  user: {
                    ...auth.user,
                    safety_plan_consent_given: true,
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
  }, [user]);

  useEffect(() => {
    // Load existing safety plan
    fetchWithAuth("/api/safety-plan")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.plan) {
          setPlanData(data.plan);
        }
      })
      .catch(console.error);
  }, []);

  const handleNext = guard(async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSave();
    }
  });

  const handlePrevious = guard(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchWithAuth("/api/safety-plan/update", {
        method: "POST",
        body: JSON.stringify(planData),
      });
      router.back();
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const currentStepData = steps[currentStep];
  const value = planData[currentStepData.id] || "";

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <SafetyButtons />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 120,
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

        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#4A2D8F",
            marginBottom: 10,
          }}
        >
          Safety Plan
        </Text>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 30 }}>
          Step {currentStep + 1} of {steps.length}
        </Text>

        {/* Progress Bar */}
        <View style={{ flexDirection: "row", marginBottom: 30 }}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                height: 4,
                backgroundColor: index <= currentStep ? "#4A2D8F" : "#E5E7EB",
                marginRight: index < steps.length - 1 ? 4 : 0,
                borderRadius: 2,
              }}
            />
          ))}
        </View>

        {/* Safety Plan Description Card - only show on first step */}
        {currentStep === 0 && (
          <View
            style={{
              backgroundColor: "#FEF3C7",
              borderWidth: 2,
              borderColor: "#F0B429",
              borderRadius: 12,
              padding: 18,
              marginBottom: 30,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#92400E",
                marginBottom: 14,
                lineHeight: 24,
              }}
            >
              A safety plan is not an admission that you are leaving. It is a
              decision that you value your life.
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#92400E",
                marginBottom: 12,
                lineHeight: 22,
              }}
            >
              Having a plan before you need it is the difference between
              reacting in panic and moving with purpose. Abuse can escalate
              without warning. A safety plan gives you a roadmap for your most
              dangerous moments so you are not making critical decisions under
              pressure when fear is loudest.
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#92400E",
                marginBottom: 12,
                lineHeight: 22,
              }}
            >
              Your plan is private, encrypted, and only yours. It can be updated
              as your situation changes and exported when you need to share it
              with law enforcement, an advocate, or someone you trust.
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#92400E",
                fontWeight: "600",
                lineHeight: 22,
              }}
            >
              Start your plan today. You may need it sooner than you think.
            </Text>
          </View>
        )}

        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 15,
          }}
        >
          {currentStepData.title}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#6B7280",
            marginBottom: 20,
            lineHeight: 22,
          }}
        >
          {currentStepData.prompt}
        </Text>

        <TextInput
          value={value}
          onChangeText={(text) =>
            setPlanData({ ...planData, [currentStepData.id]: text })
          }
          placeholder="Write your plan here..."
          multiline
          numberOfLines={10}
          textAlignVertical="top"
          style={{
            borderWidth: 1,
            borderColor: "#E5E7EB",
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            minHeight: 250,
            marginBottom: 20,
          }}
        />

        {currentStepData.id === "legal_protection" && (
          <View
            style={{
              backgroundColor: "#FEF3C7",
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: "#92400E",
                fontWeight: "600",
                lineHeight: 20,
              }}
            >
              Attorney Note: Not all attorneys are the same. A domestic violence
              attorney understands family law AND the dynamics of abuse.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Navigation Buttons */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          paddingBottom: insets.bottom + 20,
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
        }}
      >
        <View style={{ flexDirection: "row", gap: 12 }}>
          {currentStep > 0 && (
            <TouchableOpacity
              onPress={handlePrevious}
              style={{
                flex: 1,
                borderWidth: 2,
                borderColor: "#4A2D8F",
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#4A2D8F", fontSize: 16, fontWeight: "bold" }}
              >
                Previous
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleNext}
            disabled={saving}
            style={{
              flex: 1,
              backgroundColor: "#4A2D8F",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              {saving
                ? "Saving..."
                : currentStep === steps.length - 1
                  ? "Save & Finish"
                  : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
