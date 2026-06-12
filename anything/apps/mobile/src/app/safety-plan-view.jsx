import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Share,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import { Download, History, FileText, Mail, Share2 } from "lucide-react-native";
import * as FileSystem from "expo-file-system";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

const steps = [
  {
    id: "warning_signs",
    title: "Warning Signs",
    prompt: "What behaviors tell me violence might happen soon?",
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

export default function SafetyPlanViewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [planData, setPlanData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [expandedStep, setExpandedStep] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadPlan();
  }, []);

  useEffect(() => {
    // Check if data has changed
    const changed = JSON.stringify(planData) !== JSON.stringify(originalData);
    setHasChanges(changed);
  }, [planData, originalData]);

  const loadPlan = async () => {
    try {
      const response = await fetchWithAuth("/api/safety-plan");
      if (response.ok) {
        const data = await response.json();
        if (data.plan) {
          setPlanData(data.plan);
          setOriginalData(data.plan);
        }
      }
    } catch (error) {
      console.error("Load error:", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetchWithAuth("/api/safety-plan/update", {
        method: "POST",
        body: JSON.stringify(planData),
      });

      if (response.ok) {
        Alert.alert("Saved", "Your safety plan has been updated.", [
          {
            text: "OK",
            onPress: () => {
              setOriginalData(planData);
              setHasChanges(false);
              setExpandedStep(null);
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert("Error", "Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const formatDateForFilename = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const createPDFContent = (exportData) => {
    const date = new Date(exportData.lastUpdated).toLocaleDateString();

    let content = `
═══════════════════════════════════════════════════
${exportData.branding}
${exportData.title}
═══════════════════════════════════════════════════

Last Updated: ${date}
Version: ${exportData.version}

`;

    exportData.steps.forEach((step, index) => {
      content += `
───────────────────────────────────────────────────
${index + 1}. ${step.title}
───────────────────────────────────────────────────

${step.prompt}

${step.response}

`;
    });

    content += `
═══════════════════════════════════════════════════
IMPORTANT SAFETY INFORMATION
═══════════════════════════════════════════════════

If you are in immediate danger, call 911.

National DV Hotline: 1-800-799-7233
Available 24/7, confidential, free

This safety plan is a private document. Keep it in a 
secure location where your abuser cannot find it.

© ${new Date().getFullYear()} Rising Above Trauma
`;

    return content;
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetchWithAuth("/api/safety-plan/export", {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const { exportData } = await response.json();
      const content = createPDFContent(exportData);

      // Use Share API to let user choose how to share (save, email, etc)
      await Share.share({
        message: content,
        title: "My Safety Plan",
      });
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Error", "Could not export safety plan. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const toggleStep = (stepId) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

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
            paddingBottom: insets.bottom + 180,
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
            My Safety Plan
          </Text>

          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
            Tap any step to edit. Your changes are saved privately.
          </Text>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 30,
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/safety-plan-history")}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#4A2D8F",
                paddingVertical: 12,
                borderRadius: 8,
                gap: 8,
              }}
            >
              <History color="#4A2D8F" size={18} />
              <Text
                style={{ color: "#4A2D8F", fontSize: 14, fontWeight: "600" }}
              >
                History
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleExport}
              disabled={exporting}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F0B429",
                paddingVertical: 12,
                borderRadius: 8,
                gap: 8,
              }}
            >
              <Download color="white" size={18} />
              <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
                {exporting ? "Preparing..." : "Export"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Steps */}
          {steps.map((step, index) => {
            const isExpanded = expandedStep === step.id;
            const value = planData[step.id] || "";

            return (
              <TouchableOpacity
                key={step.id}
                onPress={() => toggleStep(step.id)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: isExpanded ? "#4A2D8F" : "#E5E7EB",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: isExpanded ? 12 : 0,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: value ? "#4A2D8F" : "#E5E7EB",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: value ? "white" : "#6B7280",
                      }}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#1F2937",
                    }}
                  >
                    {step.title}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#6B7280" }}>
                    {isExpanded ? "▼" : "▶"}
                  </Text>
                </View>

                {isExpanded && (
                  <View>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#6B7280",
                        marginBottom: 12,
                        lineHeight: 20,
                      }}
                    >
                      {step.prompt}
                    </Text>
                    <TextInput
                      value={value}
                      onChangeText={(text) =>
                        setPlanData({ ...planData, [step.id]: text })
                      }
                      placeholder="Write your plan here..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={6}
                      textAlignVertical="top"
                      style={{
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 15,
                        minHeight: 120,
                        backgroundColor: "#F9FAFB",
                      }}
                    />

                    {step.id === "legal_protection" && (
                      <View
                        style={{
                          backgroundColor: "#FEF3C7",
                          padding: 12,
                          borderRadius: 8,
                          marginTop: 12,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#92400E",
                            fontWeight: "600",
                            lineHeight: 18,
                          }}
                        >
                          Attorney Note: Not all attorneys are the same. A
                          domestic violence attorney understands family law AND
                          the dynamics of abuse.
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingAnimatedView>

      {/* Save Button - Only shows when there are changes */}
      {hasChanges && (
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
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{
              backgroundColor: "#4A2D8F",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
