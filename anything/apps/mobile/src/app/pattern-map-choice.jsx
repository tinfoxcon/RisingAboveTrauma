import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import { FileText, TrendingUp, Lock } from "lucide-react-native";
import useInAppPurchase from "@/utils/useInAppPurchase";
import useUser from "@/utils/auth/useUser";

export default function PatternMapChoiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { hasShieldAccess, hasRiseAccess } = useInAppPurchase();
  const { data: user } = useUser();

  const hasPremiumAccess = hasShieldAccess || hasRiseAccess;
  const isRebuildUser = user?.current_path === "rebuild";

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
          Pattern Map Tracker
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#6B7280",
            marginBottom: 30,
            lineHeight: 20,
          }}
        >
          Choose how you'd like to track your{" "}
          {isRebuildUser ? "growth and progress" : "patterns"}
        </Text>

        {/* Option 1: Free Pattern/Growth Tracker */}
        <TouchableOpacity
          onPress={() =>
            router.push(
              isRebuildUser
                ? "/pattern-tracker-rebuild"
                : "/pattern-tracker-free",
            )
          }
          style={{
            backgroundColor: "#FDF6E3",
            borderWidth: 2,
            borderColor: "#4A2D8F",
            borderRadius: 12,
            padding: 20,
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
            <View style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: "#22C55E",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                  alignSelf: "flex-start",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{ fontSize: 11, color: "white", fontWeight: "bold" }}
                >
                  FREE
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FileText
                  color="#4A2D8F"
                  size={24}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#1F2937",
                    flex: 1,
                  }}
                >
                  Pattern Map Tracker
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              lineHeight: 20,
              marginBottom: 12,
            }}
          >
            {isRebuildUser
              ? "Track your victories, breakthroughs, and moments of strength"
              : "Begin identifying patterns with a simple, private worksheet"}
          </Text>

          <View
            style={{
              backgroundColor: "#F9FAFB",
              padding: 12,
              borderRadius: 8,
            }}
          >
            {isRebuildUser ? (
              <>
                <Text
                  style={{ fontSize: 13, color: "#4B5563", marginBottom: 6 }}
                >
                  ✓ Record victories and growth
                </Text>
                <Text
                  style={{ fontSize: 13, color: "#4B5563", marginBottom: 6 }}
                >
                  ✓ Track progress over time
                </Text>
                <Text style={{ fontSize: 13, color: "#4B5563" }}>
                  ✓ Private reflections
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={{ fontSize: 13, color: "#4B5563", marginBottom: 6 }}
                >
                  ✓ Track behaviors and feelings
                </Text>
                <Text
                  style={{ fontSize: 13, color: "#4B5563", marginBottom: 6 }}
                >
                  ✓ Rate your safety daily
                </Text>
                <Text style={{ fontSize: 13, color: "#4B5563" }}>
                  ✓ Private encrypted notes
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Option 2: Full Pattern Map (Premium) */}
        <TouchableOpacity
          onPress={() => {
            if (hasPremiumAccess) {
              router.push("/pattern-map");
            } else {
              router.push("/(tabs)/upgrade");
            }
          }}
          style={{
            backgroundColor: "#FDF6E3",
            borderWidth: 2,
            borderColor: "#F0B429",
            borderRadius: 12,
            padding: 20,
            opacity: hasPremiumAccess ? 1 : 0.7,
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
            <View style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: "#F0B429",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                  alignSelf: "flex-start",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{ fontSize: 11, color: "white", fontWeight: "bold" }}
                >
                  SURVIVOR SHIELD
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <TrendingUp
                    color="#4A2D8F"
                    size={24}
                    style={{ marginRight: 12 }}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#1F2937",
                      flex: 1,
                    }}
                  >
                    Full Pattern Map Tracker
                  </Text>
                </View>
                {!hasPremiumAccess && <Lock color="#6B7280" size={20} />}
              </View>
            </View>
          </View>

          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              lineHeight: 20,
              marginBottom: 12,
            }}
          >
            Advanced analytics with behavior trends, escalation detection, and
            visual insights
          </Text>

          <View
            style={{
              backgroundColor: "#F9FAFB",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 13, color: "#4B5563", marginBottom: 6 }}>
              ✓ Visual trend charts
            </Text>
            <Text style={{ fontSize: 13, color: "#4B5563", marginBottom: 6 }}>
              ✓ Top 5 behavior patterns
            </Text>
            <Text style={{ fontSize: 13, color: "#4B5563", marginBottom: 6 }}>
              ✓ Escalation alerts
            </Text>
            <Text style={{ fontSize: 13, color: "#4B5563" }}>
              ✓ Proactive next steps
            </Text>
          </View>

          {!hasPremiumAccess && (
            <View
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: "#4A2D8F",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Tap to upgrade →
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
