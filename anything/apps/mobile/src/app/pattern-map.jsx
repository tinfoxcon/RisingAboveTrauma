import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import {
  AlertTriangle,
  TrendingUp,
  Calendar,
  Download,
  History,
} from "lucide-react-native";
import useInAppPurchase from "@/utils/useInAppPurchase";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function PatternMapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { hasShieldAccess, hasRiseAccess } = useInAppPurchase();
  const [dateRange, setDateRange] = useState(30);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect free users to upgrade screen
  useEffect(() => {
    if (!hasShieldAccess && !hasRiseAccess) {
      router.replace("/(tabs)/upgrade");
    }
  }, [hasShieldAccess, hasRiseAccess]);

  useEffect(() => {
    loadPatternData();
  }, [dateRange]);

  const loadPatternData = async () => {
    try {
      const response = await fetchWithAuth(
        `/api/pattern-map?days=${dateRange}`,
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Pattern map error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#6B7280" }}>Loading your patterns...</Text>
      </View>
    );
  }

  const totalCheckins = stats?.total_checkins || 0;
  const highRiskCount = stats?.high_risk_count || 0;
  const avgSafety = stats?.avg_safety_rating || 0;
  const topBehaviors = stats?.top_behaviors || [];
  const nextSteps = stats?.next_steps || [];

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
            marginBottom: 15,
          }}
        >
          Pattern Map Tracker
        </Text>

        {/* View History Button */}
        <TouchableOpacity
          onPress={() => router.push("/pattern-tracker-history")}
          style={{
            backgroundColor: "#EDE9FE",
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            marginBottom: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "#4A2D8F",
          }}
        >
          <History color="#4A2D8F" size={20} style={{ marginRight: 10 }} />
          <Text
            style={{
              color: "#4A2D8F",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            View History
          </Text>
        </TouchableOpacity>

        {/* Date Range Selector */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#FDF6E3",
            borderRadius: 8,
            padding: 4,
            marginBottom: 15,
          }}
        >
          {[30, 60, 90].map((days) => (
            <TouchableOpacity
              key={days}
              onPress={() => setDateRange(days)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 6,
                backgroundColor: dateRange === days ? "#FFFFFF" : "transparent",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: dateRange === days ? "bold" : "normal",
                  color: dateRange === days ? "#4A2D8F" : "#6B7280",
                }}
              >
                {days} Days
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Export Button */}
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/pattern-tracker-export",
              params: {
                dateFilter:
                  dateRange === 30
                    ? "30days"
                    : dateRange === 60
                      ? "60days"
                      : "90days",
              },
            })
          }
          style={{
            backgroundColor: "#4A2D8F",
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            marginBottom: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Download color="white" size={20} style={{ marginRight: 10 }} />
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Export Pattern Tracker
          </Text>
        </TouchableOpacity>

        {/* Summary Stats */}
        <View style={{ flexDirection: "row", marginBottom: 30 }}>
          <StatCard
            label="Check-Ins"
            value={totalCheckins}
            icon={<Calendar color="#4A2D8F" size={20} />}
          />
          <View style={{ width: 12 }} />
          <StatCard
            label="High Risk"
            value={highRiskCount}
            icon={<AlertTriangle color="#DC2626" size={20} />}
          />
          <View style={{ width: 12 }} />
          <StatCard
            label="Avg Safety"
            value={avgSafety.toFixed(1)}
            icon={<TrendingUp color="#4A2D8F" size={20} />}
          />
        </View>

        {/* Safety Trend */}
        <View
          style={{
            backgroundColor: "#FDF6E3",
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: 15,
            }}
          >
            Safety Rating Trend
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              height: 120,
              marginBottom: 15,
            }}
          >
            {[3.5, 2.8, 4.1, 3.2, 2.5, 3.8, 4.2].map((rating, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "flex-end",
                  marginHorizontal: 2,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: `${(rating / 5) * 100}%`,
                    backgroundColor:
                      rating < 2
                        ? "#DC2626"
                        : rating < 3
                          ? "#F59E0B"
                          : "#22C55E",
                    borderRadius: 4,
                  }}
                />
              </View>
            ))}
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 11, color: "#6B7280" }}>Older</Text>
            <Text style={{ fontSize: 11, color: "#6B7280" }}>Recent</Text>
          </View>
        </View>

        {/* Top Behaviors */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 15,
          }}
        >
          Top 5 Behavior Patterns
        </Text>
        {topBehaviors.length > 0 ? (
          topBehaviors.map((behavior, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text style={{ fontSize: 14, color: "#1F2937" }}>
                  {behavior.label}
                </Text>
                <Text style={{ fontSize: 14, color: "#6B7280" }}>
                  {behavior.count}×
                </Text>
              </View>
              <View
                style={{
                  height: 8,
                  backgroundColor: "#E5E7EB",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${(behavior.count / totalCheckins) * 100}%`,
                    height: "100%",
                    backgroundColor: "#4A2D8F",
                  }}
                />
              </View>
            </View>
          ))
        ) : (
          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
            No data yet. Start with a check-in to see patterns.
          </Text>
        )}

        {/* Escalation Indicator */}
        {highRiskCount > 0 && (
          <View
            style={{
              backgroundColor: "#FEE2E2",
              padding: 20,
              borderRadius: 12,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <AlertTriangle
                color="#DC2626"
                size={24}
                style={{ marginRight: 12 }}
              />
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#DC2626" }}
              >
                Escalation Detected
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: "#991B1B", lineHeight: 22 }}>
              You've reported {highRiskCount} high-risk incident
              {highRiskCount > 1 ? "s" : ""} in the last {dateRange} days.
              Please consider updating your safety plan.
            </Text>
          </View>
        )}

        {/* Next Steps */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 15,
          }}
        >
          Proactive Next Steps
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/safety-plan")}
          style={{
            backgroundColor: "#FDF6E3",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1F2937",
              marginBottom: 4,
            }}
          >
            Today: Update Your Safety Plan
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280" }}>
            Make sure your safe people and places are current
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/evidence-export")}
          style={{
            backgroundColor: "#FDF6E3",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1F2937",
              marginBottom: 4,
            }}
          >
            This Week: Export Your Evidence
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280" }}>
            Create a documented evidence report of your patterns
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/resources")}
          style={{
            backgroundColor: "#FDF6E3",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#1F2937",
              marginBottom: 4,
            }}
          >
            When Ready: Connect With Legal Aid
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280" }}>
            Find domestic violence attorneys in your area
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FDF6E3",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
      }}
    >
      {icon}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 8,
        }}
      >
        {value}
      </Text>
      <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>
        {label}
      </Text>
    </View>
  );
}
