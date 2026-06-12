import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import {
  Download,
  FileText,
  Calendar,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";

const DATE_FILTER_LABELS = {
  "30days": "Last 30 Days",
  "60days": "Last 60 Days",
  "90days": "Last 90 Days",
  "6months": "Last 6 Months",
  all: "All Time",
};

const SAFETY_LABELS = {
  1: "I feel safe",
  2: "I feel mostly safe",
  3: "I feel uncertain",
  4: "I feel unsafe",
  5: "I am in immediate danger",
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function buildShareText(data, dateFilter) {
  const { user, patternTrackers, dateRange, exportedAt } = data;
  const label = DATE_FILTER_LABELS[dateFilter] || "All Time";
  const lines = [];

  lines.push("═══════════════════════════════════════");
  lines.push("   PATTERN MAP TRACKER — EXPORT REPORT");
  lines.push("═══════════════════════════════════════");
  lines.push(`Exported: ${new Date(exportedAt).toLocaleString()}`);
  lines.push(`Name: ${user?.name || "Private"}`);
  lines.push(`Date Range: ${label}`);
  lines.push(`Total Entries: ${patternTrackers.length}`);
  lines.push("═══════════════════════════════════════\n");

  if (patternTrackers.length === 0) {
    lines.push("No entries found for this date range.");
  } else {
    patternTrackers.forEach((entry, idx) => {
      lines.push(`ENTRY #${idx + 1} — ${formatDate(entry.created_at)}`);
      lines.push("─────────────────────────────────────");

      if (entry.behaviors && entry.behaviors.length > 0) {
        lines.push(`Behaviors: ${entry.behaviors.join(", ")}`);
      }
      if (entry.frequency) {
        lines.push(`Frequency: ${entry.frequency}`);
      }
      if (entry.feelings && entry.feelings.length > 0) {
        lines.push(`Feelings: ${entry.feelings.join(", ")}`);
      }
      if (entry.safety_rating) {
        lines.push(
          `Safety Rating: ${entry.safety_rating}/5 — ${SAFETY_LABELS[entry.safety_rating] || ""}`,
        );
      }
      if (entry.assailant_name) {
        lines.push(`Person Involved: ${entry.assailant_name}`);
      }
      if (entry.assailant_relationship) {
        lines.push(`Relationship: ${entry.assailant_relationship}`);
      }
      if (entry.private_notes) {
        lines.push(`Notes:\n${entry.private_notes}`);
      }
      lines.push("");
    });
  }

  lines.push("═══════════════════════════════════════");
  lines.push("This report was generated privately and");
  lines.push("securely. Keep this document safe.");
  lines.push("═══════════════════════════════════════");

  return lines.join("\n");
}

function EntryCard({ entry, index }) {
  const [expanded, setExpanded] = useState(false);

  const safetyColor =
    entry.safety_rating >= 4
      ? "#DC2626"
      : entry.safety_rating === 3
        ? "#F59E0B"
        : "#22C55E";

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#F0B429",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        overflow: "hidden",
      }}
    >
      {/* Header row — always visible */}
      <TouchableOpacity
        onPress={() => setExpanded((p) => !p)}
        style={{
          padding: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 12,
              color: "#4A2D8F",
              fontWeight: "700",
              marginBottom: 2,
            }}
          >
            Entry #{index + 1}
          </Text>
          <Text style={{ fontSize: 13, color: "#6B7280" }}>
            {formatDate(entry.created_at)}
          </Text>
          {entry.behaviors && entry.behaviors.length > 0 && (
            <Text
              style={{ fontSize: 12, color: "#1F2937", marginTop: 4 }}
              numberOfLines={1}
            >
              {entry.behaviors.slice(0, 2).join(", ")}
              {entry.behaviors.length > 2
                ? ` +${entry.behaviors.length - 2} more`
                : ""}
            </Text>
          )}
        </View>

        {entry.safety_rating ? (
          <View
            style={{
              backgroundColor: safetyColor + "20",
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 6,
              marginRight: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: safetyColor }}
            >
              {entry.safety_rating}/5
            </Text>
          </View>
        ) : null}

        {expanded ? (
          <ChevronUp color="#6B7280" size={18} />
        ) : (
          <ChevronDown color="#6B7280" size={18} />
        )}
      </TouchableOpacity>

      {/* Expanded detail */}
      {expanded && (
        <View
          style={{
            paddingHorizontal: 14,
            paddingBottom: 14,
            borderTopWidth: 1,
            borderTopColor: "#F3F4F6",
          }}
        >
          {entry.behaviors && entry.behaviors.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: "600",
                  marginBottom: 6,
                }}
              >
                BEHAVIORS
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {entry.behaviors.map((b, i) => (
                  <View
                    key={i}
                    style={{
                      backgroundColor: "#EDE9FE",
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#4A2D8F" }}>{b}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {entry.frequency && (
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: "600",
                  marginBottom: 4,
                }}
              >
                FREQUENCY
              </Text>
              <Text style={{ fontSize: 14, color: "#1F2937" }}>
                {entry.frequency}
              </Text>
            </View>
          )}

          {entry.feelings && entry.feelings.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: "600",
                  marginBottom: 6,
                }}
              >
                FEELINGS
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
                {entry.feelings.map((f, i) => (
                  <View
                    key={i}
                    style={{
                      backgroundColor: "#FEF3C7",
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#92400E" }}>{f}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {entry.safety_rating && (
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: "600",
                  marginBottom: 4,
                }}
              >
                SAFETY RATING
              </Text>
              <Text
                style={{ fontSize: 14, color: safetyColor, fontWeight: "600" }}
              >
                {entry.safety_rating}/5 — {SAFETY_LABELS[entry.safety_rating]}
              </Text>
            </View>
          )}

          {(entry.assailant_name || entry.assailant_relationship) && (
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: "600",
                  marginBottom: 4,
                }}
              >
                PERSON INVOLVED
              </Text>
              <Text style={{ fontSize: 14, color: "#1F2937" }}>
                {entry.assailant_name}
                {entry.assailant_relationship
                  ? ` (${entry.assailant_relationship})`
                  : ""}
              </Text>
            </View>
          )}

          {entry.private_notes && (
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: "600",
                  marginBottom: 4,
                }}
              >
                NOTES
              </Text>
              <Text style={{ fontSize: 14, color: "#1F2937", lineHeight: 20 }}>
                {entry.private_notes}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function PatternTrackerExportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dateFilter: paramDateFilter } = useLocalSearchParams();

  const [dateFilter, setDateFilter] = useState(paramDateFilter || "30days");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [dateFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchWithAuth(
        `/api/pattern-tracker/export?dateFilter=${dateFilter}`,
      );
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${response.status}`);
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error("Pattern tracker export load error:", err);
      setError("Could not load your pattern tracker data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!data) return;
    try {
      setExporting(true);
      const text = buildShareText(data, dateFilter);
      const timestamp = new Date().toISOString().split("T")[0];
      await Share.share({
        message: text,
        title: `PatternTracker-${timestamp}.txt`,
      });
    } catch (err) {
      if (err.message !== "User did not share") {
        console.error("Export share error:", err);
        Alert.alert(
          "Export Failed",
          "Could not share the report. Please try again.",
        );
      }
    } finally {
      setExporting(false);
    }
  };

  const entries = data?.patternTrackers || [];
  const highRisk = entries.filter((e) => e.safety_rating >= 4).length;

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <SafetyButtons />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
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
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 30,
          paddingTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#4A2D8F",
            marginBottom: 6,
          }}
        >
          Export Pattern Tracker
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#6B7280",
            marginBottom: 24,
            lineHeight: 20,
          }}
        >
          Review your pattern tracker entries and share a private report.
        </Text>

        {/* Date filter selector */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#1F2937",
            marginBottom: 10,
          }}
        >
          Date Range
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {Object.entries(DATE_FILTER_LABELS).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setDateFilter(key)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: dateFilter === key ? "#4A2D8F" : "#E5E7EB",
                backgroundColor: dateFilter === key ? "#4A2D8F" : "#FDF6E3",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "500",
                  color: dateFilter === key ? "white" : "#6B7280",
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary stats */}
        {!loading && !error && data && (
          <View
            style={{
              backgroundColor: "#EDE9FE",
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              flexDirection: "row",
              gap: 12,
            }}
          >
            <View style={{ flex: 1, alignItems: "center" }}>
              <FileText color="#4A2D8F" size={22} />
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#4A2D8F",
                  marginTop: 4,
                }}
              >
                {entries.length}
              </Text>
              <Text
                style={{ fontSize: 11, color: "#6B7280", textAlign: "center" }}
              >
                Entries
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <ShieldAlert color="#DC2626" size={22} />
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#DC2626",
                  marginTop: 4,
                }}
              >
                {highRisk}
              </Text>
              <Text
                style={{ fontSize: 11, color: "#6B7280", textAlign: "center" }}
              >
                High Risk
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Calendar color="#4A2D8F" size={22} />
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#4A2D8F",
                  marginTop: 4,
                }}
              >
                {DATE_FILTER_LABELS[dateFilter]?.split(" ")[1] || "All"}
              </Text>
              <Text
                style={{ fontSize: 11, color: "#6B7280", textAlign: "center" }}
              >
                {dateFilter === "all" ? "Time" : "Days"}
              </Text>
            </View>
          </View>
        )}

        {/* Export button */}
        {!loading && !error && data && (
          <TouchableOpacity
            onPress={handleExport}
            disabled={exporting || entries.length === 0}
            style={{
              backgroundColor: entries.length === 0 ? "#D1D5DB" : "#4A2D8F",
              paddingVertical: 16,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            {exporting ? (
              <ActivityIndicator
                color="white"
                size="small"
                style={{ marginRight: 10 }}
              />
            ) : (
              <Download color="white" size={20} style={{ marginRight: 10 }} />
            )}
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              {exporting
                ? "Preparing Report…"
                : entries.length === 0
                  ? "No Data to Export"
                  : `Export ${entries.length} ${entries.length === 1 ? "Entry" : "Entries"}`}
            </Text>
          </TouchableOpacity>
        )}

        {/* Loading state */}
        {loading && (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <ActivityIndicator size="large" color="#4A2D8F" />
            <Text style={{ marginTop: 12, color: "#6B7280", fontSize: 14 }}>
              Loading your entries…
            </Text>
          </View>
        )}

        {/* Error state */}
        {!loading && error && (
          <View
            style={{
              backgroundColor: "#FEE2E2",
              padding: 20,
              borderRadius: 12,
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "#DC2626",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              {error}
            </Text>
            <TouchableOpacity
              onPress={loadData}
              style={{
                backgroundColor: "#DC2626",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Entry list */}
        {!loading && !error && entries.length === 0 && (
          <View
            style={{
              backgroundColor: "#FDF6E3",
              padding: 24,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <FileText color="#D1D5DB" size={40} />
            <Text
              style={{
                fontSize: 16,
                color: "#6B7280",
                marginTop: 12,
                textAlign: "center",
              }}
            >
              No entries found for this date range.
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#9CA3AF",
                marginTop: 6,
                textAlign: "center",
              }}
            >
              Try selecting a wider date range or complete a Pattern Tracker
              entry first.
            </Text>
          </View>
        )}

        {!loading && !error && entries.length > 0 && (
          <>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#1F2937",
                marginBottom: 12,
              }}
            >
              Entries Preview
            </Text>
            {entries.map((entry, idx) => (
              <EntryCard key={entry.id} entry={entry} index={idx} />
            ))}
          </>
        )}

        {/* Privacy notice */}
        <View
          style={{
            backgroundColor: "#F9FAFB",
            padding: 14,
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: "#6B7280",
              lineHeight: 18,
              textAlign: "center",
            }}
          >
            🔒 This report is generated privately on your device. Share only
            with trusted people such as attorneys or law enforcement.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
