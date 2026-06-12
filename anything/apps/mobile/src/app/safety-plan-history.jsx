import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import { Clock, CheckCircle } from "lucide-react-native";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

const stepTitles = {
  warning_signs: "Warning Signs",
  safe_people: "Safe People",
  important_documents: "Important Documents",
  emergency_bag: "Emergency Bag",
  safe_places: "Safe Places",
  children_safety: "Children's Safety",
  financial_safety: "Financial Safety",
  legal_protection: "Legal Protection",
};

export default function SafetyPlanHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedVersion, setExpandedVersion] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await fetchWithAuth("/api/safety-plan/history");
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
      }
    } catch (error) {
      console.error("Load history error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCompletedSteps = (plan) => {
    const stepKeys = Object.keys(stepTitles);
    return stepKeys.filter((key) => plan[key] && plan[key].trim().length > 0)
      .length;
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F3F0F8",
          paddingTop: insets.top,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StatusBar style="dark" />
        <SafetyButtons />
        <ActivityIndicator size="large" color="#4A2D8F" />
        <Text
          style={{
            marginTop: 12,
            fontSize: 14,
            color: "#6B7280",
          }}
        >
          Loading history...
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

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 40,
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
          Safety Plan History
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#6B7280",
            marginBottom: 30,
            lineHeight: 22,
          }}
        >
          Your safety plan evolves as your situation changes. This history shows
          how your plan has developed over time.
        </Text>

        {history.length === 0 ? (
          <View
            style={{
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 12,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#6B7280",
                textAlign: "center",
              }}
            >
              No history yet. Your safety plan versions will appear here.
            </Text>
          </View>
        ) : (
          history.map((plan, index) => {
            const isExpanded = expandedVersion === plan.id;
            const completedSteps = getCompletedSteps(plan);

            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setExpandedVersion(isExpanded ? null : plan.id)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: plan.is_current ? "#4A2D8F" : "#E5E7EB",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                {/* Header */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: isExpanded ? 16 : 0,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#1F2937",
                        }}
                      >
                        Version {plan.version}
                      </Text>
                      {plan.is_current && (
                        <View
                          style={{
                            backgroundColor: "#10B981",
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 12,
                            marginLeft: 10,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 11,
                              color: "white",
                              fontWeight: "600",
                            }}
                          >
                            CURRENT
                          </Text>
                        </View>
                      )}
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <Clock color="#6B7280" size={14} />
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#6B7280",
                          marginLeft: 6,
                        }}
                      >
                        {formatDate(plan.created_at)}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <CheckCircle color="#6B7280" size={14} />
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#6B7280",
                          marginLeft: 6,
                        }}
                      >
                        {completedSteps} of 8 steps completed
                      </Text>
                    </View>
                  </View>

                  <Text style={{ fontSize: 14, color: "#6B7280" }}>
                    {isExpanded ? "▼" : "▶"}
                  </Text>
                </View>

                {/* Expanded Content */}
                {isExpanded && (
                  <View>
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#E5E7EB",
                        marginBottom: 16,
                      }}
                    />

                    {Object.keys(stepTitles).map((stepKey, stepIndex) => {
                      const value = plan[stepKey];
                      const hasContent = value && value.trim().length > 0;

                      return (
                        <View
                          key={stepKey}
                          style={{
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
                                width: 24,
                                height: 24,
                                borderRadius: 12,
                                backgroundColor: hasContent
                                  ? "#4A2D8F"
                                  : "#E5E7EB",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 10,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: "bold",
                                  color: hasContent ? "white" : "#6B7280",
                                }}
                              >
                                {stepIndex + 1}
                              </Text>
                            </View>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "600",
                                color: "#1F2937",
                              }}
                            >
                              {stepTitles[stepKey]}
                            </Text>
                          </View>

                          {hasContent ? (
                            <Text
                              style={{
                                fontSize: 14,
                                color: "#374151",
                                lineHeight: 20,
                                paddingLeft: 34,
                              }}
                            >
                              {value}
                            </Text>
                          ) : (
                            <Text
                              style={{
                                fontSize: 14,
                                color: "#9CA3AF",
                                fontStyle: "italic",
                                paddingLeft: 34,
                              }}
                            >
                              Not completed
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
