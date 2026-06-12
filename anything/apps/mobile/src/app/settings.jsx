import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import { ChevronRight } from "lucide-react-native";
import { useAuth } from "@/utils/auth/useAuth";
import useUser from "@/utils/auth/useUser";
import * as Notifications from "expo-notifications";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import useSinglePress from "@/utils/useSinglePress";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { data: user, refetch } = useUser();
  const guard = useSinglePress();

  const [discreetMode, setDiscreetMode] = useState(
    user?.discreet_mode || false,
  );
  const [appLock, setAppLock] = useState(user?.app_lock || false);
  const [dailyReminder, setDailyReminder] = useState(
    user?.daily_reminder !== false,
  );
  const [safetyNudges, setSafetyNudges] = useState(
    user?.safety_nudges !== false,
  );
  const [consentModal, setConsentModal] = useState({
    visible: false,
    type: null,
  });

  // Re-fetch fresh user data every time this screen comes into focus
  // (e.g. returning from path-switcher so current_path is always current)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  // Sync local toggle state whenever the user object updates
  useEffect(() => {
    if (user) {
      setDiscreetMode(user.discreet_mode || false);
      setAppLock(user.app_lock || false);
      setDailyReminder(user.daily_reminder !== false);
      setSafetyNudges(user.safety_nudges !== false);
    }
  }, [user]);

  const updateSetting = async (field, value) => {
    try {
      await fetchWithAuth("/api/settings/update", {
        method: "POST",
        body: JSON.stringify({ [field]: value }),
      });
      refetch();
    } catch (error) {
      console.error("Settings update error:", error);
    }
  };

  // Called when either notification switch is toggled
  const handleNotificationToggle = (field, val) => {
    if (!val) {
      // Turning OFF — save directly, no consent needed
      if (field === "daily_reminder") setDailyReminder(false);
      if (field === "safety_nudges") setSafetyNudges(false);
      updateSetting(field, false);
      return;
    }
    // Turning ON — show consent modal first
    setConsentModal({ visible: true, type: field });
  };

  const handleConsentConfirm = async () => {
    const { type } = consentModal;
    setConsentModal({ visible: false, type: null });

    // Request system-level notification permission
    if (Platform.OS !== "web") {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Notifications Blocked",
          "To receive notifications, please enable them for this app in your device Settings.",
          [
            { text: "Open Settings", onPress: () => Linking.openSettings() },
            { text: "Cancel", style: "cancel" },
          ],
        );
        return;
      }
    }

    // Permission granted — update local state and save
    if (type === "daily_reminder") {
      setDailyReminder(true);
      updateSetting("daily_reminder", true);
    } else if (type === "safety_nudges") {
      setSafetyNudges(true);
      updateSetting("safety_nudges", true);
    }
  };

  const handleConsentDeny = () => {
    // Revert toggle — do not save
    setConsentModal({ visible: false, type: null });
  };

  const handleSignOut = guard(async () => {
    await signOut();
    router.replace("/splash");
  });

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete all your data. This cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await fetchWithAuth("/api/account/delete", { method: "POST" });
              await signOut();
              router.replace("/splash");
            } catch (error) {
              console.error("Delete error:", error);
            }
          },
        },
      ],
    );
  };

  const CONSENT_COPY = {
    daily_reminder: {
      title: "Daily Check-In Reminder",
      icon: "🔔",
      description:
        "This will send you one gentle daily reminder to check in with how you are feeling. You can turn this off at any time in Settings.",
    },
    safety_nudges: {
      title: "Safety Plan Nudges",
      icon: "🛡️",
      description:
        "This will occasionally remind you to review and update your safety plan. These nudges are designed to support your ongoing safety. You can turn this off at any time in Settings.",
    },
  };

  const activeConsent = consentModal.type
    ? CONSENT_COPY[consentModal.type]
    : null;

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <SafetyButtons />

      {/* Notification Consent Modal */}
      <Modal
        visible={consentModal.visible}
        transparent
        animationType="fade"
        onRequestClose={handleConsentDeny}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 380,
            }}
          >
            {activeConsent && (
              <>
                <Text
                  style={{
                    fontSize: 32,
                    textAlign: "center",
                    marginBottom: 12,
                  }}
                >
                  {activeConsent.icon}
                </Text>

                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#2B2438",
                    textAlign: "center",
                    marginBottom: 12,
                  }}
                >
                  {activeConsent.title}
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: "#4B5563",
                    lineHeight: 22,
                    textAlign: "center",
                    marginBottom: 24,
                  }}
                >
                  {activeConsent.description}
                </Text>

                <TouchableOpacity
                  onPress={handleConsentConfirm}
                  style={{
                    backgroundColor: "#4A2D8F",
                    paddingVertical: 14,
                    borderRadius: 10,
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 15,
                      fontWeight: "bold",
                    }}
                  >
                    Yes, Enable Notifications
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleConsentDeny}
                  style={{
                    paddingVertical: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#6B7280",
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                  >
                    No Thanks
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

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
            color: "#2B2438",
            marginBottom: 30,
          }}
        >
          Settings
        </Text>

        {/* Privacy & Security */}
        <SectionHeader title="Privacy & Security" />

        <SettingRow
          icon={<Text style={{ fontSize: 20 }}>👁️</Text>}
          label="Discreet Mode"
          description="App appears as 'My Journal' with neutral grey branding"
          rightElement={
            <Switch
              value={discreetMode}
              onValueChange={(val) => {
                setDiscreetMode(val);
                updateSetting("discreet_mode", val);
              }}
              trackColor={{ false: "#D1D5DB", true: "#4A2D8F" }}
            />
          }
        />

        <SettingRow
          icon={<Text style={{ fontSize: 20 }}>🔒</Text>}
          label="App Lock"
          description="Require authentication to open the app"
          rightElement={
            <Switch
              value={appLock}
              onValueChange={(val) => {
                setAppLock(val);
                updateSetting("app_lock", val);
              }}
              trackColor={{ false: "#D1D5DB", true: "#4A2D8F" }}
            />
          }
        />

        <View
          style={{
            backgroundColor: "#FDF6E3",
            padding: 16,
            borderRadius: 12,
            marginBottom: 30,
          }}
        >
          <Text style={{ fontSize: 13, color: "#6B7280", lineHeight: 20 }}>
            ⚠️ Quick Exit is always on and cannot be disabled — it's a critical
            safety feature.
          </Text>
        </View>

        {/* Your Path */}
        <SectionHeader title="Your Path" />
        <SettingRow
          label="Current Path"
          description={
            user?.current_path ? formatPath(user.current_path) : "Not set"
          }
          onPress={guard(() => router.push("/path-switcher"))}
          hasArrow
        />

        {/* Notifications */}
        <SectionHeader title="Notifications" />
        <SettingRow
          icon={<Text style={{ fontSize: 20 }}>🔔</Text>}
          label="Daily Check-In Reminder"
          rightElement={
            <Switch
              value={dailyReminder}
              onValueChange={(val) =>
                handleNotificationToggle("daily_reminder", val)
              }
              trackColor={{ false: "#D1D5DB", true: "#4A2D8F" }}
            />
          }
        />
        <SettingRow
          icon={<Text style={{ fontSize: 20 }}>🔔</Text>}
          label="Safety Plan Nudges"
          rightElement={
            <Switch
              value={safetyNudges}
              onValueChange={(val) =>
                handleNotificationToggle("safety_nudges", val)
              }
              trackColor={{ false: "#D1D5DB", true: "#4A2D8F" }}
            />
          }
        />

        {/* Account */}
        <SectionHeader title="Account" />
        <SettingRow
          icon={<Text style={{ fontSize: 20 }}>💳</Text>}
          label="Access Level"
          description="Survivor Shield or Survivor Rise"
          onPress={guard(() => router.push("/upgrade"))}
          hasArrow
        />
        <SettingRow
          icon={<Text style={{ fontSize: 20 }}>📄</Text>}
          label="Documented Evidence Report"
          onPress={guard(() => router.push("/evidence-export"))}
          hasArrow
        />
        <SettingRow
          icon={<Text style={{ fontSize: 20 }}>🚪</Text>}
          label="Sign Out"
          onPress={handleSignOut}
          hasArrow
        />
        <SettingRow
          icon={<Text style={{ fontSize: 20 }}>🗑️</Text>}
          label="Delete Account"
          description="Permanently delete all data"
          onPress={handleDeleteAccount}
          hasArrow
        />

        {/* About */}
        <SectionHeader title="About" />
        <SettingRow
          label="About Dr. Mildred D. Muhammad, D.Hum"
          onPress={guard(() => Linking.openURL("https://mildredmuhammad.com"))}
          hasArrow
        />
        <SettingRow
          label="Privacy Policy"
          onPress={guard(() =>
            Linking.openURL("https://myfocusllc.com/privacy-policy"),
          )}
          hasArrow
        />
        <SettingRow
          label="Terms of Use"
          onPress={guard(() => router.push("/terms-of-use"))}
          hasArrow
        />

        {/* Footer */}
        <Text
          style={{
            fontSize: 11,
            color: "#9CA3AF",
            textAlign: "center",
            marginTop: 30,
          }}
        >
          © 2026 Dr. Mildred D. Muhammad, D.Hum · My F.O.C.U.S. LLC · All Rights
          Reserved
        </Text>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title }) {
  return (
    <Text
      style={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#2B2438",
        marginBottom: 12,
        marginTop: 20,
      }}
    >
      {title}
    </Text>
  );
}

function SettingRow({
  icon,
  label,
  description,
  rightElement,
  onPress,
  hasArrow,
}) {
  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FDF6E3",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      {icon && <View style={{ marginRight: 12 }}>{icon}</View>}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            color: "#2B2438",
            fontWeight: "500",
            marginBottom: description ? 4 : 0,
          }}
        >
          {label}
        </Text>
        {description && (
          <Text style={{ fontSize: 13, color: "#6E6480" }}>{description}</Text>
        )}
      </View>
      {rightElement || (hasArrow && <ChevronRight color="#9CA3AF" size={20} />)}
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }
  return content;
}

function formatPath(path) {
  const paths = {
    still_in_it: "Still In It",
    just_left: "Just Left",
    rebuild: "Rebuilding",
  };
  return paths[path] || path;
}
