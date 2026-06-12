import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Check } from "lucide-react-native";
import SafetyButtons from "@/components/SafetyButtons";
import { useEffect, useState } from "react";
import useInAppPurchase from "@/utils/useInAppPurchase";
import { usePaywallStore } from "@/utils/usePaywallStore";

function BillingToggle({ value, onChange, savings }) {
  const isMonthly = value === "monthly";
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#F0EBF8",
        borderRadius: 10,
        padding: 3,
        marginBottom: 14,
      }}
    >
      <TouchableOpacity
        onPress={() => onChange("monthly")}
        style={{
          flex: 1,
          paddingVertical: 9,
          borderRadius: 8,
          alignItems: "center",
          backgroundColor: isMonthly ? "#FFFFFF" : "transparent",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isMonthly ? 0.08 : 0,
          shadowRadius: 2,
          elevation: isMonthly ? 2 : 0,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: isMonthly ? "#2B2438" : "#7A6B8A",
          }}
        >
          Monthly
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onChange("yearly")}
        style={{
          flex: 1,
          paddingVertical: 9,
          borderRadius: 8,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 5,
          backgroundColor: !isMonthly ? "#FFFFFF" : "transparent",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: !isMonthly ? 0.08 : 0,
          shadowRadius: 2,
          elevation: !isMonthly ? 2 : 0,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: !isMonthly ? "#2B2438" : "#7A6B8A",
          }}
        >
          Yearly
        </Text>
        {savings && savings > 0 && (
          <View
            style={{
              backgroundColor: "#D9A62B",
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
            }}
          >
            <Text style={{ fontSize: 10, color: "white", fontWeight: "bold" }}>
              SAVE {savings}%
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function UpgradeScreen() {
  const insets = useSafeAreaInsets();
  const {
    isReady,
    initiateInAppPurchase,
    getAvailableSubscriptions,
    startSubscription,
    restorePurchases,
    isPurchasing,
    subscriptionTier,
  } = useInAppPurchase();
  const { paywallEnabled, loadPaywallSetting, setPaywallEnabled } =
    usePaywallStore();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shieldBilling, setShieldBilling] = useState("monthly");
  const [riseBilling, setRiseBilling] = useState("monthly");

  useEffect(() => {
    initiateInAppPurchase();
    loadPaywallSetting();
  }, []);

  useEffect(() => {
    if (isReady) {
      try {
        const packages = getAvailableSubscriptions();
        setSubscriptions(packages);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [isReady, getAvailableSubscriptions]);

  const handlePurchase = async (pkg) => {
    if (!pkg) return;
    const success = await startSubscription({ packageToPurchase: pkg });
    if (success) {
      Alert.alert(
        "Success!",
        "Your subscription is now active. Thank you for supporting your healing journey.",
      );
    }
  };

  const handleRestore = async () => {
    const success = await restorePurchases();
    if (success) {
      Alert.alert("Restored", "Your purchases have been restored.");
    } else {
      Alert.alert("No Purchases", "No purchases found to restore.");
    }
  };

  const shieldMonthly = subscriptions.find(
    (pkg) => pkg.product.identifier === "com.rising.shield.monthly",
  );
  const shieldAnnual = subscriptions.find(
    (pkg) => pkg.product.identifier === "com.rising.shield.yearly",
  );
  const riseMonthly = subscriptions.find(
    (pkg) => pkg.product.identifier === "com.rising.rise.monthly",
  );
  const riseAnnual = subscriptions.find(
    (pkg) => pkg.product.identifier === "com.rising.rise.yearly",
  );

  const selectedShield =
    shieldBilling === "monthly" ? shieldMonthly : shieldAnnual;
  const selectedRise = riseBilling === "monthly" ? riseMonthly : riseAnnual;

  const shieldSavings =
    shieldMonthly && shieldAnnual && shieldMonthly.product.price > 0
      ? Math.round(
          ((shieldMonthly.product.price * 12 - shieldAnnual.product.price) /
            (shieldMonthly.product.price * 12)) *
            100,
        )
      : null;

  const riseSavings =
    riseMonthly && riseAnnual && riseMonthly.product.price > 0
      ? Math.round(
          ((riseMonthly.product.price * 12 - riseAnnual.product.price) /
            (riseMonthly.product.price * 12)) *
            100,
        )
      : null;

  // Developer toggle — always visible at bottom
  const DeveloperToggle = (
    <View
      style={{
        marginTop: 16,
        backgroundColor: "#1F2937",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 10,
          color: "#6B7280",
          fontWeight: "700",
          letterSpacing: 1.2,
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        Developer Settings
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1, marginRight: 12 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: "#F9FAFB",
              marginBottom: 4,
            }}
          >
            Paywall Enforcement
          </Text>
          <Text style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 18 }}>
            {paywallEnabled
              ? "ON — Users must subscribe to access premium screens"
              : "OFF — All premium screens are freely accessible"}
          </Text>
        </View>
        <Switch
          value={paywallEnabled}
          onValueChange={(val) => setPaywallEnabled(val)}
          trackColor={{ false: "#374151", true: "#5B2CA0" }}
          thumbColor={paywallEnabled ? "#D9A62B" : "#6B7280"}
        />
      </View>
    </View>
  );

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
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#2B2438",
            marginBottom: 6,
            textAlign: "center",
          }}
        >
          Choose Your Plan
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#6E6480",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Safety features are always free
        </Text>

        {/* ── Loading ── */}
        {loading || !isReady ? (
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#7A6B8A" />
            <Text style={{ marginTop: 12, color: "#6E6480" }}>
              Loading plans...
            </Text>
          </View>
        ) : paywallEnabled === false ? (
          /* ── Dev mode: paywall OFF ── */
          <>
            <View
              style={{
                backgroundColor: "#F0FDF4",
                borderRadius: 12,
                padding: 20,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: "#86EFAC",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 32, marginBottom: 8 }}>🔓</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#166534",
                  marginBottom: 6,
                  textAlign: "center",
                }}
              >
                Full Access Enabled
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#4B7A5B",
                  textAlign: "center",
                  lineHeight: 20,
                }}
              >
                Paywall enforcement is OFF. All premium features — Shield & Rise
                — are freely accessible. Toggle it back ON below to restore
                normal subscription behaviour.
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "#D9D1E6",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#2B2438",
                  marginBottom: 12,
                }}
              >
                Plans (preview only — no purchases in dev mode)
              </Text>
              <Feature text="✅ Free Essentials — Accessible" />
              <Feature text="✅ Survivor Shield — Accessible" />
              <Feature text="✅ Survivor Rise — Accessible" />
            </View>

            {DeveloperToggle}
          </>
        ) : (
          /* ── Normal mode: paywall ON ── */
          <>
            {subscriptionTier !== "free" && (
              <View
                style={{
                  backgroundColor: "#F0FDF4",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: "#86EFAC",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#166534",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  {subscriptionTier === "rise"
                    ? "✨ Survivor Rise Active"
                    : "🛡️ Survivor Shield Active"}
                </Text>
              </View>
            )}

            {/* Free Essentials */}
            <View
              style={{
                backgroundColor:
                  subscriptionTier === "free" ? "#F0FDF4" : "#FCFAFF",
                padding: 20,
                borderRadius: 12,
                marginBottom: 16,
                borderWidth: subscriptionTier === "free" ? 2 : 1,
                borderColor:
                  subscriptionTier === "free" ? "#86EFAC" : "#D9D1E6",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#5B2CA0",
                  marginBottom: 4,
                }}
              >
                Free Essentials
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#2B2438",
                  marginBottom: 14,
                }}
              >
                $0
              </Text>
              <Feature text="Quick Exit" />
              <Feature text="Discreet Mode" />
              <Feature text="Crisis Resources" />
              <Feature text="Basic Check-Ins" />
              <Feature text="Safety Planning" />
              <Feature text="Pattern Map Tracker" />
              {subscriptionTier === "free" && (
                <View
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: "#D1FAE5",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#166534",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    ✓ Current Plan
                  </Text>
                </View>
              )}
            </View>

            {/* Survivor Shield */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                padding: 20,
                borderRadius: 12,
                marginBottom: 16,
                borderWidth: 2,
                borderColor:
                  subscriptionTier === "shield" ? "#86EFAC" : "#5B2CA0",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <Text
                  style={{ fontSize: 22, fontWeight: "bold", color: "#5B2CA0" }}
                >
                  Survivor Shield
                </Text>
                {subscriptionTier !== "shield" &&
                  subscriptionTier !== "rise" && (
                    <View
                      style={{
                        backgroundColor: "#D9A62B",
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        POPULAR
                      </Text>
                    </View>
                  )}
              </View>

              <BillingToggle
                value={shieldBilling}
                onChange={setShieldBilling}
                savings={shieldSavings}
              />

              {selectedShield ? (
                <View style={{ marginBottom: 14 }}>
                  <Text
                    style={{
                      fontSize: 26,
                      fontWeight: "bold",
                      color: "#2B2438",
                    }}
                  >
                    {selectedShield.product.priceString}
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#6E6480",
                        fontWeight: "400",
                      }}
                    >
                      {shieldBilling === "monthly" ? " / month" : " / year"}
                    </Text>
                  </Text>
                  {shieldBilling === "yearly" && shieldMonthly && (
                    <Text
                      style={{ fontSize: 12, color: "#6E6480", marginTop: 3 }}
                    >
                      vs {shieldMonthly.product.priceString}/mo billed monthly
                      {shieldSavings && shieldSavings > 0
                        ? ` — save ${shieldSavings}%`
                        : ""}
                    </Text>
                  )}
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#D97706",
                      fontWeight: "600",
                      marginTop: 6,
                    }}
                  >
                    Start your 2-day free trial
                  </Text>
                </View>
              ) : (
                <Text
                  style={{ fontSize: 14, color: "#6E6480", marginBottom: 14 }}
                >
                  Pricing unavailable
                </Text>
              )}

              <Feature text="Everything in Free" />
              <Feature text="Pattern Map Tracker Trends" />
              <Feature text="Suggested Scripts Library" />
              <Feature text="Documented Evidence Report" />

              {subscriptionTier === "shield" ? (
                <View
                  style={{
                    marginTop: 15,
                    padding: 12,
                    backgroundColor: "#F0FDF4",
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#166534",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    ✓ Active Subscription
                  </Text>
                </View>
              ) : subscriptionTier === "rise" ? null : (
                selectedShield && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#7A6B8A",
                      paddingVertical: 14,
                      borderRadius: 8,
                      alignItems: "center",
                      marginTop: 15,
                    }}
                    onPress={() => handlePurchase(selectedShield)}
                    disabled={isPurchasing}
                  >
                    {isPurchasing ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        Start Free Trial —{" "}
                        {shieldBilling === "monthly" ? "Monthly" : "Yearly"}
                      </Text>
                    )}
                  </TouchableOpacity>
                )
              )}
            </View>

            {/* Survivor Rise */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                padding: 20,
                borderRadius: 12,
                marginBottom: 16,
                borderWidth: 2,
                borderColor:
                  subscriptionTier === "rise" ? "#86EFAC" : "#D9A62B",
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#5B2CA0",
                  marginBottom: 14,
                }}
              >
                Survivor Rise
              </Text>

              <BillingToggle
                value={riseBilling}
                onChange={setRiseBilling}
                savings={riseSavings}
              />

              {selectedRise ? (
                <View style={{ marginBottom: 14 }}>
                  <Text
                    style={{
                      fontSize: 26,
                      fontWeight: "bold",
                      color: "#2B2438",
                    }}
                  >
                    {selectedRise.product.priceString}
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#6E6480",
                        fontWeight: "400",
                      }}
                    >
                      {riseBilling === "monthly" ? " / month" : " / year"}
                    </Text>
                  </Text>
                  {riseBilling === "yearly" && riseMonthly && (
                    <Text
                      style={{ fontSize: 12, color: "#6E6480", marginTop: 3 }}
                    >
                      vs {riseMonthly.product.priceString}/mo billed monthly
                      {riseSavings && riseSavings > 0
                        ? ` — save ${riseSavings}%`
                        : ""}
                    </Text>
                  )}
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#D97706",
                      fontWeight: "600",
                      marginTop: 6,
                    }}
                  >
                    Start your 2-day free trial
                  </Text>
                </View>
              ) : (
                <Text
                  style={{ fontSize: 14, color: "#6E6480", marginBottom: 14 }}
                >
                  Pricing unavailable
                </Text>
              )}

              <Feature text="Everything in Shield" />
              <Feature text="Guided Healing Tracks" />
              <Feature text="5 Mini-Courses" />
              <Feature text="Progress Tracking" />
              <Feature text="Certificate of Completion" />

              {subscriptionTier === "rise" ? (
                <View
                  style={{
                    marginTop: 15,
                    padding: 12,
                    backgroundColor: "#F0FDF4",
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#166534",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    ✓ Active Subscription
                  </Text>
                </View>
              ) : (
                selectedRise && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#D9A62B",
                      paddingVertical: 14,
                      borderRadius: 8,
                      alignItems: "center",
                      marginTop: 15,
                    }}
                    onPress={() => handlePurchase(selectedRise)}
                    disabled={isPurchasing}
                  >
                    {isPurchasing ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        Start Free Trial —{" "}
                        {riseBilling === "monthly" ? "Monthly" : "Yearly"}
                      </Text>
                    )}
                  </TouchableOpacity>
                )
              )}
            </View>

            {/* Restore */}
            <TouchableOpacity
              style={{
                paddingVertical: 12,
                alignItems: "center",
                marginBottom: 16,
              }}
              onPress={handleRestore}
            >
              <Text
                style={{ fontSize: 14, color: "#5B2CA0", fontWeight: "600" }}
              >
                Restore Purchases
              </Text>
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: "#FEF3C7",
                padding: 16,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: "#92400E",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                We Never Lock Safety Behind A Paywall
              </Text>
            </View>

            {DeveloperToggle}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Feature({ text }) {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
    >
      <Check color="#5B2CA0" size={18} />
      <Text style={{ fontSize: 14, color: "#2B2438", marginLeft: 10 }}>
        {text}
      </Text>
    </View>
  );
}
