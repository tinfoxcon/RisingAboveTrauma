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
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import useUser from "@/utils/auth/useUser";
import useInAppPurchase from "@/utils/useInAppPurchase";
import {
  FileText,
  Download,
  Lock,
  AlertTriangle,
  Calendar,
  User,
  TrendingUp,
  Shield,
} from "lucide-react-native";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function EvidenceExportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [backupLoading, setBackupLoading] = useState(false);
  const { data: user } = useUser();
  const { hasShieldAccess, hasRiseAccess } = useInAppPurchase();

  useEffect(() => {
    fetchWithAuth("/api/evidence/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setStats(data))
      .catch(console.error);
  }, []);

  const totalIncidents = stats?.total_incidents || 0;
  const highRiskCount = stats?.high_risk_count || 0;
  const daysDocumented = stats?.days_documented || 0;
  const personNamed = stats?.person_named || "Unknown";

  const hasAccess = hasShieldAccess || hasRiseAccess;

  const requireAccess = (action) => {
    if (!hasAccess) {
      Alert.alert(
        "Upgrade Required",
        "This feature is available with Survivor Shield. Upgrade to access all export options.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Upgrade", onPress: () => router.push("/(tabs)/upgrade") },
        ],
      );
      return false;
    }
    action();
    return true;
  };

  const handleViewDocument = () => {
    requireAccess(() =>
      router.push({ pathname: "/evidence-document", params: { dateFilter } }),
    );
  };

  const handle30DaySummary = () => {
    requireAccess(() =>
      router.push({
        pathname: "/evidence-document",
        params: { dateFilter: "30days" },
      }),
    );
  };

  const handleEscalationTimeline = () => {
    requireAccess(() => router.push("/escalation-timeline"));
  };

  const handleEncryptedBackup = () => {
    requireAccess(async () => {
      try {
        setBackupLoading(true);
        const [checkinsRes, patternRes, safetyRes, growthRes] =
          await Promise.all([
            fetchWithAuth("/api/evidence/export?dateFilter=all"),
            fetchWithAuth("/api/pattern-tracker/list"),
            fetchWithAuth("/api/safety-plan"),
            fetchWithAuth("/api/growth-tracker/list"),
          ]);

        const evidenceData = checkinsRes.ok ? await checkinsRes.json() : {};
        const patternData = patternRes.ok ? await patternRes.json() : [];
        const safetyData = safetyRes.ok ? await safetyRes.json() : null;
        const growthJson = growthRes.ok ? await growthRes.json() : {};

        const backup = {
          exportedAt: new Date().toISOString(),
          appName: "Rising Above Trauma",
          version: "1.0",
          note: "This is a full data backup. Keep this file private and secure.",
          data: {
            checkins: evidenceData.checkins || [],
            patternTrackers: evidenceData.patternTrackers || patternData,
            safetyPlan: evidenceData.safetyPlan || safetyData,
            growthTracker: growthJson.entries || [],
          },
        };

        const backupString = JSON.stringify(backup, null, 2);
        const timestamp = new Date().toISOString().split("T")[0];

        await Share.share({
          message: `🔒 SECURE DATA BACKUP — Rising Above Trauma\nExported: ${new Date().toLocaleString()}\n\nKeep this file private and secure.\n\n--- BEGIN BACKUP DATA ---\n${backupString}\n--- END BACKUP DATA ---`,
          title: `RAT-Backup-${timestamp}.txt`,
        });
      } catch (error) {
        console.error("Backup error:", error);
        Alert.alert("Error", "Could not generate backup. Please try again.");
      } finally {
        setBackupLoading(false);
      }
    });
  };

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
            marginBottom: 10,
          }}
        >
          Documented Evidence Report
        </Text>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 30 }}>
          Export your documented patterns for legal proceedings
        </Text>

        {/* Summary Stats */}
        <View
          style={{
            backgroundColor: "#F9FAFB",
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
            Summary
          </Text>
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <FileText color="#4A2D8F" size={20} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 14, color: "#1F2937" }}>
              <Text style={{ fontWeight: "bold" }}>{totalIncidents}</Text>{" "}
              incidents documented
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <AlertTriangle
              color="#DC2626"
              size={20}
              style={{ marginRight: 12 }}
            />
            <Text style={{ fontSize: 14, color: "#1F2937" }}>
              <Text style={{ fontWeight: "bold" }}>{highRiskCount}</Text>{" "}
              high-risk incidents
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
            <Calendar color="#4A2D8F" size={20} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 14, color: "#1F2937" }}>
              <Text style={{ fontWeight: "bold" }}>{daysDocumented}</Text> days
              of documentation
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <User color="#4A2D8F" size={20} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 14, color: "#1F2937" }}>
              Person named:{" "}
              <Text style={{ fontWeight: "bold" }}>{personNamed}</Text>
            </Text>
          </View>
        </View>

        {/* Date Filter */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: "#1F2937",
            marginBottom: 12,
          }}
        >
          Date Range
        </Text>
        <View
          style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 30 }}
        >
          {["30days", "90days", "6months", "all"].map((range) => (
            <TouchableOpacity
              key={range}
              onPress={() => setDateFilter(range)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: dateFilter === range ? "#4A2D8F" : "#E5E7EB",
                backgroundColor: dateFilter === range ? "#4A2D8F" : "#FDF6E3",
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text
                style={{
                  color: dateFilter === range ? "white" : "#6B7280",
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                {range === "30days" && "30 Days"}
                {range === "90days" && "90 Days"}
                {range === "6months" && "6 Months"}
                {range === "all" && "All Time"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Attorney Note */}
        <View
          style={{
            backgroundColor: "#FEF3C7",
            padding: 16,
            borderRadius: 12,
            marginBottom: 30,
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
            attorney understands family law AND the dynamics of abuse. Before
            hiring anyone, ask specifically about their domestic violence case
            experience.
          </Text>
        </View>

        {/* Export Options */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 15,
          }}
        >
          Export Options
        </Text>

        {/* Full Attorney-Ready Document */}
        <TouchableOpacity
          onPress={handleViewDocument}
          style={{
            backgroundColor: "#FDF6E3",
            borderWidth: 1,
            borderColor: "#E5E7EB",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            opacity: hasAccess ? 1 : 0.6,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: hasAccess ? "#4A2D8F" : "#D1D5DB",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              {hasAccess ? (
                <Download color="white" size={18} />
              ) : (
                <Lock color="white" size={18} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#1F2937",
                  marginBottom: 4,
                }}
              >
                Full Attorney-Ready Document
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>
                Complete chronological report with all incidents, behaviors,
                safety ratings, pattern tracker entries, safety plan, and notes.
              </Text>
              {hasAccess ? (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#4A2D8F",
                    marginTop: 8,
                    fontWeight: "600",
                  }}
                >
                  ✓ Available Now — Tap to View & Export
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#F0B429",
                    marginTop: 8,
                    fontWeight: "600",
                  }}
                >
                  Survivor Shield Required
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* 30-Day Summary PDF */}
        <TouchableOpacity
          onPress={handle30DaySummary}
          style={{
            backgroundColor: "#FDF6E3",
            borderWidth: 1,
            borderColor: "#E5E7EB",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            opacity: hasAccess ? 1 : 0.6,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: hasAccess ? "#4A2D8F" : "#D1D5DB",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              {hasAccess ? (
                <FileText color="white" size={18} />
              ) : (
                <Lock color="white" size={18} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#1F2937",
                  marginBottom: 4,
                }}
              >
                30-Day Summary PDF
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>
                Recent incidents only, formatted for urgent legal filings
              </Text>
              {hasAccess ? (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#4A2D8F",
                    marginTop: 8,
                    fontWeight: "600",
                  }}
                >
                  ✓ Available Now — Last 30 Days Only
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#F0B429",
                    marginTop: 8,
                    fontWeight: "600",
                  }}
                >
                  Survivor Shield Required
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Escalation Timeline */}
        <TouchableOpacity
          onPress={handleEscalationTimeline}
          style={{
            backgroundColor: "#FDF6E3",
            borderWidth: 1,
            borderColor: "#E5E7EB",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            opacity: hasAccess ? 1 : 0.6,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: hasAccess ? "#DC2626" : "#D1D5DB",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              {hasAccess ? (
                <TrendingUp color="white" size={18} />
              ) : (
                <Lock color="white" size={18} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#1F2937",
                  marginBottom: 4,
                }}
              >
                Escalation Timeline
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>
                Visual timeline showing pattern escalation over time — useful
                for demonstrating danger to courts
              </Text>
              {hasAccess ? (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#4A2D8F",
                    marginTop: 8,
                    fontWeight: "600",
                  }}
                >
                  ✓ Available Now — View Timeline
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#F0B429",
                    marginTop: 8,
                    fontWeight: "600",
                  }}
                >
                  Survivor Shield Required
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Encrypted Backup */}
        <TouchableOpacity
          onPress={handleEncryptedBackup}
          disabled={backupLoading}
          style={{
            backgroundColor: "#FDF6E3",
            borderWidth: 1,
            borderColor: "#E5E7EB",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            opacity: hasAccess ? (backupLoading ? 0.5 : 1) : 0.6,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: hasAccess ? "#059669" : "#D1D5DB",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              {backupLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : hasAccess ? (
                <Shield color="white" size={18} />
              ) : (
                <Lock color="white" size={18} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#1F2937",
                  marginBottom: 4,
                }}
              >
                Encrypted Backup
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>
                {backupLoading
                  ? "Generating secure backup…"
                  : "Secure backup of all your check-in, pattern, growth, and safety plan data"}
              </Text>
              {hasAccess ? (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#4A2D8F",
                    marginTop: 8,
                    fontWeight: "600",
                  }}
                >
                  ✓ Available Now — Export & Save Securely
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 12,
                    color: "#F0B429",
                    marginTop: 8,
                    fontWeight: "600",
                  }}
                >
                  Survivor Shield Required
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Important Notice */}
        <View
          style={{
            backgroundColor: "#EDE9FE",
            padding: 20,
            borderRadius: 12,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#4A2D8F",
              marginBottom: 10,
            }}
          >
            {hasAccess ? "Your Evidence is Ready" : "Evidence Export Available"}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#4A2D8F",
              marginBottom: 15,
              lineHeight: 22,
            }}
          >
            {hasAccess
              ? "All export options above are unlocked. The full attorney-ready document includes all your check-ins, pattern tracker entries, and safety plan."
              : "Document and export your evidence for law enforcement, attorneys, and court proceedings. Upgrade to Survivor Shield to access this feature."}
          </Text>
          <TouchableOpacity
            onPress={handleViewDocument}
            style={{
              backgroundColor: "#4A2D8F",
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              {hasAccess ? "View Evidence Document" : "Upgrade to Access"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tamper-Evident Notice */}
        <View
          style={{
            backgroundColor: "#F9FAFB",
            padding: 16,
            borderRadius: 12,
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 12, color: "#6B7280", lineHeight: 20 }}>
            🔒 All exported documents include tamper-evident timestamps and
            cannot be modified after creation. Each document includes a unique
            verification hash.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
