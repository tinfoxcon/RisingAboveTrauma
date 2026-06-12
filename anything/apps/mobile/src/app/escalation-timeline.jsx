import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { TrendingUp, AlertTriangle, Share2 } from "lucide-react-native";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function EscalationTimelineScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth("/api/evidence/export?dateFilter=all");
      if (!res.ok) throw new Error("Failed to load");
      const result = await res.json();

      // Merge checkins and pattern tracker into one timeline
      const events = [];

      (result.checkins || []).forEach((c) => {
        events.push({
          id: `ci-${c.id}`,
          type: "checkin",
          date: new Date(c.created_at),
          isHighRisk: c.is_high_risk,
          safetyRating: c.safety_rating,
          behaviors: c.behaviors || [],
          summary: c.what_happened || "",
          label: "Check-In",
        });
      });

      (result.patternTrackers || []).forEach((p) => {
        events.push({
          id: `pt-${p.id}`,
          type: "pattern",
          date: new Date(p.created_at),
          isHighRisk: p.safety_rating <= 2,
          safetyRating: p.safety_rating,
          behaviors: p.behaviors || [],
          summary: p.private_notes || "",
          label: "Pattern Tracker",
        });
      });

      // Sort oldest → newest
      events.sort((a, b) => a.date - b.date);

      // Calculate escalation score per event (rolling avg of last 3 safety ratings)
      let recentRatings = [];
      const enriched = events.map((ev) => {
        if (ev.safetyRating) {
          recentRatings.push(ev.safetyRating);
          if (recentRatings.length > 3) recentRatings.shift();
        }
        const avg =
          recentRatings.length > 0
            ? recentRatings.reduce((s, r) => s + r, 0) / recentRatings.length
            : null;
        return { ...ev, rollingAvg: avg };
      });

      setData({ events: enriched, raw: result });
    } catch (error) {
      console.error("Escalation timeline load error:", error);
      setData({ events: [], raw: null });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getSeverityColor = (event) => {
    if (event.isHighRisk) return "#DC2626";
    if (event.safetyRating && event.safetyRating <= 2) return "#F59E0B";
    if (event.safetyRating && event.safetyRating <= 3) return "#F0B429";
    return "#4A2D8F";
  };

  const getSeverityLabel = (event) => {
    if (event.isHighRisk) return "HIGH RISK";
    if (event.safetyRating && event.safetyRating <= 2) return "DANGER";
    if (event.safetyRating && event.safetyRating <= 3) return "CONCERN";
    return null;
  };

  const handleShare = async () => {
    if (!data || data.events.length === 0) return;
    try {
      let message = "📈 ESCALATION TIMELINE — Rising Above Trauma\n\n";
      message += `Total Events: ${data.events.length}\n`;
      const highRiskEvents = data.events.filter((e) => e.isHighRisk);
      message += `High-Risk Events: ${highRiskEvents.length}\n`;
      message += `Date Range: ${formatDate(data.events[0].date)} — ${formatDate(data.events[data.events.length - 1].date)}\n\n`;
      message += "━━━━━━━━━━━━━━━━━━━\n\n";

      data.events.forEach((ev, idx) => {
        const severity = getSeverityLabel(ev);
        message += `[${idx + 1}] ${formatDate(ev.date)} ${formatTime(ev.date)}\n`;
        message += `Type: ${ev.label}`;
        if (severity) message += ` — ⚠️ ${severity}`;
        message += "\n";
        if (ev.safetyRating) message += `Safety Rating: ${ev.safetyRating}/5\n`;
        if (ev.behaviors.length > 0)
          message += `Behaviors: ${ev.behaviors.join(", ")}\n`;
        if (ev.summary) message += `Notes: ${ev.summary}\n`;
        message += "\n";
      });

      message +=
        "This timeline was generated from the Rising Above Trauma app and shows a chronological escalation pattern.";

      await Share.share({ message, title: "Escalation Timeline" });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

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
        <ActivityIndicator size="large" color="#4A2D8F" />
        <Text style={{ marginTop: 15, color: "#6B7280" }}>
          Building timeline…
        </Text>
      </View>
    );
  }

  const events = data?.events || [];
  const highRiskCount = events.filter((e) => e.isHighRisk).length;

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          backgroundColor: "#F3F0F8",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 16, color: "#4A2D8F", fontWeight: "600" }}>
            ← Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleShare}
          style={{
            backgroundColor: "#4A2D8F",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Share2 color="white" size={18} />
          <Text style={{ color: "white", fontWeight: "600", fontSize: 14 }}>
            Share
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 30,
          paddingTop: 20,
        }}
      >
        {/* Title */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 6,
            gap: 10,
          }}
        >
          <TrendingUp color="#DC2626" size={26} />
          <Text style={{ fontSize: 24, fontWeight: "bold", color: "#1F2937" }}>
            Escalation Timeline
          </Text>
        </View>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
          Chronological view of all documented incidents, showing pattern
          escalation over time.
        </Text>

        {/* Summary Banner */}
        {events.length > 0 && (
          <View
            style={{
              backgroundColor: highRiskCount > 0 ? "#FEE2E2" : "#EDE9FE",
              padding: 16,
              borderRadius: 12,
              marginBottom: 24,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <AlertTriangle
              color={highRiskCount > 0 ? "#DC2626" : "#4A2D8F"}
              size={24}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: highRiskCount > 0 ? "#DC2626" : "#4A2D8F",
                  marginBottom: 4,
                }}
              >
                {events.length} Total Events • {highRiskCount} High-Risk
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: highRiskCount > 0 ? "#991B1B" : "#5B21B6",
                }}
              >
                From {formatDate(events[0].date)} to{" "}
                {formatDate(events[events.length - 1].date)}
              </Text>
            </View>
          </View>
        )}

        {events.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              paddingTop: 60,
              paddingHorizontal: 30,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#6B7280",
                textAlign: "center",
                lineHeight: 24,
              }}
            >
              No documented events yet. Complete check-ins and pattern tracker
              entries to build your timeline.
            </Text>
          </View>
        ) : (
          <View>
            {events.map((ev, idx) => {
              const color = getSeverityColor(ev);
              const severity = getSeverityLabel(ev);
              const isLast = idx === events.length - 1;

              return (
                <View key={ev.id} style={{ flexDirection: "row" }}>
                  {/* Timeline Line + Dot */}
                  <View
                    style={{ alignItems: "center", width: 32, marginRight: 14 }}
                  >
                    <View
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: color,
                        marginTop: 18,
                        zIndex: 1,
                        borderWidth: ev.isHighRisk ? 2 : 0,
                        borderColor: "white",
                        shadowColor: color,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: ev.isHighRisk ? 0.6 : 0,
                        shadowRadius: 4,
                      }}
                    />
                    {!isLast && (
                      <View
                        style={{
                          width: 2,
                          flex: 1,
                          backgroundColor: ev.isHighRisk
                            ? "#FCA5A5"
                            : "#DDD6FE",
                          marginTop: 2,
                          minHeight: 20,
                        }}
                      />
                    )}
                  </View>

                  {/* Event Card */}
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: ev.isHighRisk ? "#FFF5F5" : "white",
                      borderWidth: 1,
                      borderColor: ev.isHighRisk ? "#FECACA" : "#E5E7EB",
                      borderRadius: 10,
                      padding: 14,
                      marginBottom: 12,
                    }}
                  >
                    {/* Date + Badge */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: "700",
                            color: color,
                          }}
                        >
                          {formatDate(ev.date)}
                        </Text>
                        <Text style={{ fontSize: 11, color: "#9CA3AF" }}>
                          {formatTime(ev.date)}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 6,
                          alignItems: "center",
                        }}
                      >
                        {severity && (
                          <View
                            style={{
                              backgroundColor: color,
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                              borderRadius: 4,
                            }}
                          >
                            <Text
                              style={{
                                color: "white",
                                fontSize: 10,
                                fontWeight: "700",
                              }}
                            >
                              {severity}
                            </Text>
                          </View>
                        )}
                        <View
                          style={{
                            backgroundColor:
                              ev.type === "checkin" ? "#EDE9FE" : "#FEF3C7",
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: 4,
                          }}
                        >
                          <Text
                            style={{
                              color:
                                ev.type === "checkin" ? "#4A2D8F" : "#92400E",
                              fontSize: 10,
                              fontWeight: "600",
                            }}
                          >
                            {ev.label}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Safety Rating Bar */}
                    {ev.safetyRating && (
                      <View style={{ marginBottom: 8 }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#6B7280",
                            marginBottom: 4,
                          }}
                        >
                          Safety Rating: {ev.safetyRating}/5
                        </Text>
                        <View
                          style={{
                            height: 6,
                            backgroundColor: "#E5E7EB",
                            borderRadius: 3,
                          }}
                        >
                          <View
                            style={{
                              height: 6,
                              width: `${(ev.safetyRating / 5) * 100}%`,
                              backgroundColor:
                                ev.safetyRating <= 2
                                  ? "#DC2626"
                                  : ev.safetyRating <= 3
                                    ? "#F59E0B"
                                    : "#10B981",
                              borderRadius: 3,
                            }}
                          />
                        </View>
                      </View>
                    )}

                    {/* Behaviors */}
                    {ev.behaviors.length > 0 && (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 4,
                          marginBottom: ev.summary ? 8 : 0,
                        }}
                      >
                        {ev.behaviors.slice(0, 4).map((b, bi) => (
                          <View
                            key={bi}
                            style={{
                              backgroundColor: "#EDE9FE",
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                              borderRadius: 4,
                            }}
                          >
                            <Text style={{ color: "#4A2D8F", fontSize: 11 }}>
                              {b}
                            </Text>
                          </View>
                        ))}
                        {ev.behaviors.length > 4 && (
                          <View
                            style={{
                              backgroundColor: "#E5E7EB",
                              paddingHorizontal: 8,
                              paddingVertical: 3,
                              borderRadius: 4,
                            }}
                          >
                            <Text style={{ color: "#6B7280", fontSize: 11 }}>
                              +{ev.behaviors.length - 4} more
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    {/* Summary */}
                    {ev.summary ? (
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#374151",
                          lineHeight: 18,
                        }}
                        numberOfLines={2}
                      >
                        {ev.summary}
                      </Text>
                    ) : null}

                    {/* Event number */}
                    <Text
                      style={{
                        fontSize: 10,
                        color: "#D1D5DB",
                        marginTop: 6,
                        textAlign: "right",
                      }}
                    >
                      Event #{idx + 1}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {events.length > 0 && (
          <View
            style={{
              backgroundColor: "#F9FAFB",
              padding: 14,
              borderRadius: 10,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 12, color: "#6B7280", lineHeight: 18 }}>
              🔒 This timeline was generated from your documented records and
              reflects a chronological view of all check-ins and pattern tracker
              entries. Tap Share to export for your attorney or advocate.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
