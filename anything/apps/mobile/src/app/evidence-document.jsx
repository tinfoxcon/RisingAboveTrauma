import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Share2 } from "lucide-react-native";
import useUser from "@/utils/auth/useUser";
import useInAppPurchase from "@/utils/useInAppPurchase";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function EvidenceDocumentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dateFilter = "all" } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: user } = useUser();
  const { hasShieldAccess, hasRiseAccess } = useInAppPurchase();

  // Use hook-based access check so paywall toggle is respected
  const hasAccess = hasShieldAccess || hasRiseAccess;

  useEffect(() => {
    // Check subscription access before loading data
    if (user && !hasAccess) {
      Alert.alert(
        "Upgrade Required",
        "This feature is available with Survivor Shield. Upgrade to document and export your evidence for law enforcement, attorneys, and court proceedings.",
        [
          { text: "Cancel", style: "cancel", onPress: () => router.back() },
          { text: "Upgrade", onPress: () => router.replace("/(tabs)/upgrade") },
        ],
      );
      return;
    }
    if (user && hasAccess) {
      loadData();
    }
  }, [dateFilter, user, hasAccess]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `/api/evidence/export?dateFilter=${dateFilter}`,
      );
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        console.error(`Evidence export failed: HTTP ${response.status}`, body);
        throw new Error(`Failed to load evidence (${response.status})`);
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Load error:", error);
      Alert.alert("Error", "Could not load evidence data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDateOnly = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleShare = async () => {
    if (!data) return;

    try {
      let message = `📋 EVIDENCE DOCUMENTATION\n\n`;
      message += `Document Owner: ${data.user.name || "User"}\n`;
      if (data.user.email) message += `Email: ${data.user.email}\n`;
      message += `Date Range: ${data.dateRange.start ? formatDateOnly(data.dateRange.start) : "All Time"} — ${formatDateOnly(data.dateRange.end)}\n`;
      message += `Generated: ${formatDate(data.exportedAt)}\n\n`;

      message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `📝 CHECK-IN INCIDENT RECORDS (${data.checkins.length})\n\n`;

      data.checkins.forEach((checkin, idx) => {
        message += `── Incident #${idx + 1} ──\n`;
        message += `Date: ${formatDate(checkin.created_at)}\n`;
        if (checkin.is_high_risk) message += `⚠️ HIGH RISK\n`;
        if (checkin.what_happened)
          message += `What Happened: ${checkin.what_happened}\n`;
        if (checkin.behaviors && checkin.behaviors.length > 0)
          message += `Behaviors: ${checkin.behaviors.join(", ")}\n`;
        if (checkin.assailant_name)
          message += `Person Named: ${checkin.assailant_name}\n`;
        if (checkin.assailant_relationship)
          message += `Relationship: ${checkin.assailant_relationship}\n`;
        if (checkin.safety_rating)
          message += `Safety Rating: ${checkin.safety_rating}/5\n`;
        if (checkin.needs_next)
          message += `Needs Next: ${checkin.needs_next}\n`;
        if (checkin.notes) message += `Notes: ${checkin.notes}\n`;
        message += `Record ID: ${checkin.id}\n\n`;
      });

      message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `📊 PATTERN TRACKER ENTRIES (${data.patternTrackers.length})\n\n`;

      data.patternTrackers.forEach((tracker, idx) => {
        message += `── Entry #${idx + 1} ──\n`;
        message += `Date: ${formatDate(tracker.created_at)}\n`;
        if (tracker.behaviors && tracker.behaviors.length > 0)
          message += `Behaviors: ${tracker.behaviors.join(", ")}\n`;
        if (tracker.frequency) message += `Frequency: ${tracker.frequency}\n`;
        if (tracker.feelings && tracker.feelings.length > 0)
          message += `Feelings: ${tracker.feelings.join(", ")}\n`;
        if (tracker.safety_rating)
          message += `Safety Rating: ${tracker.safety_rating}/5\n`;
        if (tracker.private_notes)
          message += `Notes: ${tracker.private_notes}\n`;
        message += `Entry ID: ${tracker.id}\n\n`;
      });

      if (data.safetyPlan) {
        message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `🛡️ SAFETY PLAN\n\n`;
        message += `Last Updated: ${formatDate(data.safetyPlan.updated_at)}\n\n`;
        if (data.safetyPlan.warning_signs)
          message += `⚠️ Warning Signs:\n${data.safetyPlan.warning_signs}\n\n`;
        if (data.safetyPlan.safe_people)
          message += `👥 Safe People:\n${data.safetyPlan.safe_people}\n\n`;
        if (data.safetyPlan.important_documents)
          message += `📄 Important Documents:\n${data.safetyPlan.important_documents}\n\n`;
        if (data.safetyPlan.emergency_bag)
          message += `🎒 Emergency Bag:\n${data.safetyPlan.emergency_bag}\n\n`;
        if (data.safetyPlan.safe_places)
          message += `🏠 Safe Places:\n${data.safetyPlan.safe_places}\n\n`;
        if (data.safetyPlan.children_safety)
          message += `👶 Children Safety:\n${data.safetyPlan.children_safety}\n\n`;
        if (data.safetyPlan.financial_safety)
          message += `💰 Financial Safety:\n${data.safetyPlan.financial_safety}\n\n`;
        if (data.safetyPlan.legal_protection)
          message += `⚖️ Legal Protection:\n${data.safetyPlan.legal_protection}\n\n`;
      }

      message += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      message += `🔒 Document Verification\n`;
      message += `This document was generated from Rising Above Trauma app.\n`;
      message += `Document ID: ${data.user.email || "N/A"}-${new Date(data.exportedAt).getTime()}\n`;
      message += `\nNote: For a formatted PDF version, please view this document on a computer and print to PDF, or email this text to yourself and format it in a word processor.`;

      await Share.share({
        message,
        title: `Evidence Documentation - ${data.user.name || "User"}`,
      });
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert("Error", "Could not share document");
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: insets.top,
        }}
      >
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#4A2D8F" />
        <Text style={{ marginTop: 15, color: "#6B7280" }}>
          Loading evidence data...
        </Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          paddingTop: insets.top,
          paddingHorizontal: 20,
        }}
      >
        <StatusBar style="dark" />
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ fontSize: 16, color: "#4A2D8F", fontWeight: "600" }}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            color: "#DC2626",
            marginTop: 40,
            textAlign: "center",
          }}
        >
          Could not load evidence data
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
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
          paddingBottom: insets.bottom + 20,
        }}
      >
        {/* Print Instructions */}
        <View
          style={{
            backgroundColor: "#EDE9FE",
            padding: 15,
            borderRadius: 8,
            marginTop: 15,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: "#4A2D8F",
              lineHeight: 20,
              fontWeight: "500",
            }}
          >
            📄 <Text style={{ fontWeight: "700" }}>To create a PDF:</Text> Tap
            "Share" above and choose your email app to send this to yourself.
            Open it on a computer and save/print as PDF. Or use "Print" from the
            share menu and select "Save as PDF" if available on your device.
          </Text>
        </View>

        {/* Header */}
        <View
          style={{
            borderBottomWidth: 3,
            borderBottomColor: "#4A2D8F",
            paddingBottom: 20,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#4A2D8F",
              marginBottom: 10,
            }}
          >
            📋 Evidence Documentation
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 4 }}>
            <Text style={{ fontWeight: "600" }}>Document Owner:</Text>{" "}
            {data.user.name || "User"}
          </Text>
          {data.user.email && (
            <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 4 }}>
              <Text style={{ fontWeight: "600" }}>Email:</Text>{" "}
              {data.user.email}
            </Text>
          )}
          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 4 }}>
            <Text style={{ fontWeight: "600" }}>Date Range:</Text>{" "}
            {data.dateRange.start
              ? formatDateOnly(data.dateRange.start)
              : "All Time"}{" "}
            — {formatDateOnly(data.dateRange.end)}
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280" }}>
            <Text style={{ fontWeight: "600" }}>Generated:</Text>{" "}
            {formatDate(data.exportedAt)}
          </Text>
        </View>

        {/* Tamper-Evident Notice */}
        <View
          style={{
            backgroundColor: "#F9FAFB",
            padding: 15,
            borderLeftWidth: 4,
            borderLeftColor: "#F0B429",
            marginBottom: 25,
          }}
        >
          <Text style={{ fontSize: 13, color: "#1F2937", lineHeight: 20 }}>
            🔒{" "}
            <Text style={{ fontWeight: "600" }}>Tamper-Evident Document:</Text>{" "}
            This document was generated on {formatDate(data.exportedAt)} and
            contains timestamped incident records. All entries are
            chronologically ordered and include verification timestamps.
          </Text>
        </View>

        {/* Check-Ins */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#4A2D8F",
            marginBottom: 15,
            borderBottomWidth: 2,
            borderBottomColor: "#4A2D8F",
            paddingBottom: 8,
          }}
        >
          📝 Check-In Incident Records ({data.checkins.length})
        </Text>

        {data.checkins.length === 0 ? (
          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 25 }}>
            No check-in records in this date range.
          </Text>
        ) : (
          data.checkins.map((checkin) => (
            <View
              key={checkin.id}
              style={{
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    color: "#4A2D8F",
                    fontWeight: "600",
                    fontSize: 15,
                    flex: 1,
                  }}
                >
                  {formatDate(checkin.created_at)}
                </Text>
                {checkin.is_high_risk && (
                  <View
                    style={{
                      backgroundColor: "#DC2626",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 11,
                        fontWeight: "600",
                      }}
                    >
                      ⚠️ HIGH RISK
                    </Text>
                  </View>
                )}
              </View>

              {checkin.what_happened && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    What Happened:
                  </Text>
                  <Text style={{ color: "#1F2937" }}>
                    {checkin.what_happened}
                  </Text>
                </View>
              )}

              {checkin.behaviors && checkin.behaviors.length > 0 && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: 14,
                      marginBottom: 6,
                    }}
                  >
                    Behaviors Observed:
                  </Text>
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}
                  >
                    {checkin.behaviors.map((b, idx) => (
                      <View
                        key={idx}
                        style={{
                          backgroundColor: "#EDE9FE",
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 4,
                        }}
                      >
                        <Text style={{ color: "#4A2D8F", fontSize: 13 }}>
                          {b}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {checkin.assailant_name && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    Person Named:
                  </Text>
                  <Text style={{ color: "#1F2937" }}>
                    {checkin.assailant_name}
                  </Text>
                </View>
              )}

              {checkin.assailant_relationship && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    Relationship:
                  </Text>
                  <Text style={{ color: "#1F2937" }}>
                    {checkin.assailant_relationship}
                  </Text>
                </View>
              )}

              {checkin.safety_rating && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    Safety Rating:
                  </Text>
                  <Text style={{ fontSize: 14, color: "#1F2937" }}>
                    {checkin.safety_rating}/5
                  </Text>
                </View>
              )}

              {checkin.needs_next && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    Needs Next:
                  </Text>
                  <Text style={{ color: "#1F2937" }}>{checkin.needs_next}</Text>
                </View>
              )}

              {checkin.notes && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    Additional Notes:
                  </Text>
                  <Text style={{ color: "#1F2937" }}>{checkin.notes}</Text>
                </View>
              )}

              <View
                style={{
                  marginTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: "#E5E7EB",
                  paddingTop: 10,
                }}
              >
                <Text style={{ fontSize: 12, color: "#6B7280" }}>
                  <Text style={{ fontWeight: "600" }}>Record ID:</Text>{" "}
                  {checkin.id} |{" "}
                  <Text style={{ fontWeight: "600" }}>Timestamp:</Text>{" "}
                  {formatDate(checkin.created_at)}
                </Text>
              </View>
            </View>
          ))
        )}

        {/* Pattern Trackers */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#4A2D8F",
            marginBottom: 15,
            marginTop: 20,
            borderBottomWidth: 2,
            borderBottomColor: "#4A2D8F",
            paddingBottom: 8,
          }}
        >
          📊 Pattern Tracker Entries ({data.patternTrackers.length})
        </Text>

        {data.patternTrackers.length === 0 ? (
          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 25 }}>
            No pattern tracker entries in this date range.
          </Text>
        ) : (
          data.patternTrackers.map((tracker) => (
            <View
              key={tracker.id}
              style={{
                backgroundColor: "#F9FAFB",
                borderLeftWidth: 4,
                borderLeftColor: "#F0B429",
                padding: 15,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: "#4A2D8F",
                  fontWeight: "600",
                  fontSize: 15,
                  marginBottom: 10,
                }}
              >
                {formatDate(tracker.created_at)}
              </Text>

              {tracker.behaviors && tracker.behaviors.length > 0 && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: 14,
                      marginBottom: 6,
                    }}
                  >
                    Behaviors:
                  </Text>
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}
                  >
                    {tracker.behaviors.map((b, idx) => (
                      <View
                        key={idx}
                        style={{
                          backgroundColor: "#EDE9FE",
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 4,
                        }}
                      >
                        <Text style={{ color: "#4A2D8F", fontSize: 13 }}>
                          {b}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {tracker.frequency && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    Frequency:
                  </Text>
                  <Text style={{ color: "#1F2937" }}>{tracker.frequency}</Text>
                </View>
              )}

              {tracker.feelings && tracker.feelings.length > 0 && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    Feelings:
                  </Text>
                  <Text style={{ color: "#1F2937" }}>
                    {tracker.feelings.join(", ")}
                  </Text>
                </View>
              )}

              {tracker.safety_rating && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    Safety Rating:
                  </Text>
                  <Text style={{ fontSize: 14, color: "#1F2937" }}>
                    {tracker.safety_rating}/5
                  </Text>
                </View>
              )}

              {tracker.private_notes && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "#374151",
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    Notes:
                  </Text>
                  <Text style={{ color: "#1F2937" }}>
                    {tracker.private_notes}
                  </Text>
                </View>
              )}

              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 12, color: "#6B7280" }}>
                  <Text style={{ fontWeight: "600" }}>Entry ID:</Text>{" "}
                  {tracker.id} |{" "}
                  <Text style={{ fontWeight: "600" }}>Timestamp:</Text>{" "}
                  {formatDate(tracker.created_at)}
                </Text>
              </View>
            </View>
          ))
        )}

        {/* Safety Plan */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#4A2D8F",
            marginBottom: 15,
            marginTop: 20,
            borderBottomWidth: 2,
            borderBottomColor: "#4A2D8F",
            paddingBottom: 8,
          }}
        >
          🛡️ Safety Plan
        </Text>

        {!data.safetyPlan ? (
          <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 25 }}>
            No safety plan on file.
          </Text>
        ) : (
          <>
            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginBottom: 20,
              }}
            >
              Last Updated: {formatDate(data.safetyPlan.updated_at)}
            </Text>

            {data.safetyPlan.warning_signs && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: 10,
                  }}
                >
                  ⚠️ Warning Signs
                </Text>
                <Text style={{ color: "#1F2937" }}>
                  {data.safetyPlan.warning_signs}
                </Text>
              </View>
            )}

            {data.safetyPlan.safe_people && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: 10,
                  }}
                >
                  👥 Safe People
                </Text>
                <Text style={{ color: "#1F2937" }}>
                  {data.safetyPlan.safe_people}
                </Text>
              </View>
            )}

            {data.safetyPlan.important_documents && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: 10,
                  }}
                >
                  📄 Important Documents
                </Text>
                <Text style={{ color: "#1F2937" }}>
                  {data.safetyPlan.important_documents}
                </Text>
              </View>
            )}

            {data.safetyPlan.emergency_bag && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: 10,
                  }}
                >
                  🎒 Emergency Bag
                </Text>
                <Text style={{ color: "#1F2937" }}>
                  {data.safetyPlan.emergency_bag}
                </Text>
              </View>
            )}

            {data.safetyPlan.safe_places && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: 10,
                  }}
                >
                  🏠 Safe Places
                </Text>
                <Text style={{ color: "#1F2937" }}>
                  {data.safetyPlan.safe_places}
                </Text>
              </View>
            )}

            {data.safetyPlan.children_safety && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: 10,
                  }}
                >
                  👶 Children Safety
                </Text>
                <Text style={{ color: "#1F2937" }}>
                  {data.safetyPlan.children_safety}
                </Text>
              </View>
            )}

            {data.safetyPlan.financial_safety && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: 10,
                  }}
                >
                  💰 Financial Safety
                </Text>
                <Text style={{ color: "#1F2937" }}>
                  {data.safetyPlan.financial_safety}
                </Text>
              </View>
            )}

            {data.safetyPlan.legal_protection && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: 10,
                  }}
                >
                  ⚖️ Legal Protection
                </Text>
                <Text style={{ color: "#1F2937" }}>
                  {data.safetyPlan.legal_protection}
                </Text>
              </View>
            )}
          </>
        )}

        {/* Footer */}
        <View
          style={{
            marginTop: 30,
            paddingTop: 20,
            borderTopWidth: 2,
            borderTopColor: "#E5E7EB",
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            <Text style={{ fontWeight: "600" }}>Document Verification</Text>
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#6B7280",
              textAlign: "center",
              lineHeight: 18,
            }}
          >
            This document was generated from Rising Above Trauma app on{" "}
            {formatDate(data.exportedAt)}.{"\n"}
            All timestamps are recorded in the user's local timezone and
            verified against the secure database.{"\n"}
            Document ID: {data.user.email || "N/A"}-
            {new Date(data.exportedAt).getTime()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
