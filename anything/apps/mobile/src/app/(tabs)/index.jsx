import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Settings, AlertCircle } from "lucide-react-native";
import SafetyButtons from "@/components/SafetyButtons";
import { LinearGradient } from "expo-linear-gradient";
import useInAppPurchase from "@/utils/useInAppPurchase";
import useUser from "@/utils/auth/useUser";
import useSinglePress from "@/utils/useSinglePress";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { hasShieldAccess, hasRiseAccess } = useInAppPurchase();
  const { data: user } = useUser();
  const guard = useSinglePress();

  const handleScriptsPress = guard(() => {
    if (hasShieldAccess || hasRiseAccess) {
      router.push("/in-the-moment-scripts");
    } else {
      router.push("/(tabs)/upgrade");
    }
  });

  const formatPath = (path) => {
    const paths = {
      still_in_it: "Still In It",
      just_left: "Just Left",
      rebuild: "Rebuilding",
    };
    return paths[path] || path;
  };

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
          paddingVertical: 10,
        }}
      >
        <SafetyButtons />
        <TouchableOpacity onPress={guard(() => router.push("/settings"))}>
          <Settings color="#5B2CA0" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 80,
        }}
      >
        {/* Dr. Muhammad Founder Message */}
        <LinearGradient
          colors={["#5B2CA0", "#D9A62B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#D9A62B",
              marginBottom: 15,
              textAlign: "center",
            }}
          >
            YOU ARE NOT HERE BY ACCIDENT
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "white",
              marginBottom: 15,
              lineHeight: 24,
            }}
          >
            I know what it feels like to live through victimization, to fight
            through survival, and to rise into freedom. Many of the options in
            this app were not available to me. For much of my lived experience,
            I had to navigate it alone because I wasn't taken seriously. That
            reality led me to take my safety into my own hands.
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "white",
              marginBottom: 15,
              lineHeight: 24,
            }}
          >
            Rising Above Trauma was created so you won't have to feel alone in
            the midst of trauma. Inside this app, you'll find resources and
            courses designed to give you insight into the judicial system,
            domestic violence information, and national and international
            support available at your fingertips when you need it most.
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "white",
              marginBottom: 15,
              lineHeight: 24,
            }}
          >
            My hope is that this app helps fill the gaps in your journey toward
            freedom from abuse in every area of your life. What is happening to
            you is not your fault. The blame belongs to the abuser, not to you.
            Don't carry responsibility for harm you did not create.
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "white",
              marginBottom: 15,
              lineHeight: 24,
            }}
          >
            You have been, are, and always will be a MASTERPIECE.
          </Text>
          <Text style={{ fontSize: 14, color: "white", marginBottom: 5 }}>
            With much love and respect,
          </Text>
          <Text style={{ fontSize: 14, color: "#5B2CA0", marginBottom: 8 }}>
            Dr. Mildred D. Muhammad, D.Hum
          </Text>
          <Text style={{ fontSize: 12, color: "white", marginBottom: 3 }}>
            Award-Winning Global Keynote Speaker
          </Text>
          <Text style={{ fontSize: 12, color: "white", marginBottom: 3 }}>
            Certified Domestic Violence Advocate/Expert, Trainer/Educator
          </Text>
          <Text style={{ fontSize: 12, color: "white", marginBottom: 3 }}>
            Certified Professional/Personal Development Consultant
          </Text>
          <Text style={{ fontSize: 12, color: "white", marginBottom: 3 }}>
            Gubernatorial Appointee to the Maryland State Board of Victim
            Services by Governor Wes Moore
          </Text>
          <Text style={{ fontSize: 12, color: "white", marginBottom: 3 }}>
            Ex-Wife of the DC Sniper
          </Text>
          <Text style={{ fontSize: 12, color: "white" }}>
            Founder · Rising Above Trauma · My F.O.C.U.S. LLC
          </Text>
        </LinearGradient>

        {/* Emergency 911 Button */}
        <TouchableOpacity
          onPress={() => Linking.openURL("tel:911")}
          style={{
            backgroundColor: "#E32626",
            padding: 20,
            borderRadius: 12,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <AlertCircle color="white" size={32} />
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 10,
            }}
          >
            Emergency: Call 911
          </Text>
        </TouchableOpacity>

        {/* Today's Step */}
        <LinearGradient
          colors={["#5B2CA0", "#D9A62B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 20, borderRadius: 12, marginBottom: 20 }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "white",
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Today's Step
          </Text>
          <Text style={{ fontSize: 14, color: "white", lineHeight: 22 }}>
            {user?.current_path === "rebuild"
              ? "Celebrate your progress. Every step forward is a victory worth honoring."
              : "Take a moment to check in with yourself. Your safety and wellbeing matter."}
          </Text>
        </LinearGradient>

        {/* Fast Access Grid */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#2B2438",
            marginBottom: 15,
          }}
        >
          Fast Access
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          {/* What's Your Status */}
          <TouchableOpacity
            onPress={guard(() => router.push("/path-switcher"))}
            style={{
              width: "48%",
              backgroundColor: "#FDF6E3",
              paddingVertical: 24,
              paddingHorizontal: 20,
              borderRadius: 12,
              marginBottom: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#D9D1E6",
            }}
          >
            <Text style={{ fontSize: 48 }}>🧭</Text>
            <Text
              style={{
                fontSize: 14,
                color: "#2B2438",
                fontWeight: "600",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              What's Your Status?
            </Text>
          </TouchableOpacity>

          {/* Calm & Affirmations */}
          <TouchableOpacity
            onPress={guard(() => router.push("/calm"))}
            style={{
              width: "48%",
              backgroundColor: "#FDF6E3",
              paddingVertical: 24,
              paddingHorizontal: 20,
              borderRadius: 12,
              marginBottom: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#D9D1E6",
            }}
          >
            <Text style={{ fontSize: 48 }}>💜</Text>
            <Text
              style={{
                fontSize: 14,
                color: "#2B2438",
                fontWeight: "600",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Calm & Affirmations
            </Text>
          </TouchableOpacity>

          {/* Pattern Map Tracker */}
          <TouchableOpacity
            onPress={guard(() => router.push("/pattern-map-choice"))}
            style={{
              width: "48%",
              backgroundColor: "#FDF6E3",
              paddingVertical: 24,
              paddingHorizontal: 20,
              borderRadius: 12,
              marginBottom: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#D9D1E6",
            }}
          >
            <Text style={{ fontSize: 48 }}>🗺️</Text>
            <Text
              style={{
                fontSize: 14,
                color: "#2B2438",
                fontWeight: "600",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Pattern Map Tracker
            </Text>
          </TouchableOpacity>

          {/* Check-In History */}
          <TouchableOpacity
            onPress={guard(() => router.push("/check-in-history"))}
            style={{
              width: "48%",
              backgroundColor: "#FDF6E3",
              paddingVertical: 24,
              paddingHorizontal: 20,
              borderRadius: 12,
              marginBottom: 12,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#D9D1E6",
            }}
          >
            <Text style={{ fontSize: 48 }}>📝</Text>
            <Text
              style={{
                fontSize: 14,
                color: "#2B2438",
                fontWeight: "600",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Check-In History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Feature Cards */}
        <FeatureCard
          title="Safety Plan"
          icon={<Text style={{ fontSize: 28 }}>🛡️</Text>}
          onPress={guard(() => router.push("/safety-plan"))}
        />
        <FeatureCard
          title="Suggested Scripts Library"
          icon={<Text style={{ fontSize: 28 }}>🎙️</Text>}
          onPress={handleScriptsPress}
          badge="Shield"
        />
        <FeatureCard
          title="Documented Evidence Report"
          icon={<Text style={{ fontSize: 28 }}>📄</Text>}
          onPress={guard(() => router.push("/evidence-export"))}
          badge="Shield"
        />
      </ScrollView>
    </View>
  );
}

function FeatureCard({ title, icon, onPress, badge }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FDF6E3",
        borderWidth: 1,
        borderColor: "#D9D1E6",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <View style={{ marginRight: 16 }}>{icon}</View>
      <Text
        style={{ flex: 1, fontSize: 16, color: "#2B2438", fontWeight: "500" }}
      >
        {title}
      </Text>
      {badge && (
        <View
          style={{
            backgroundColor: "#D9A62B",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
          }}
        >
          <Text style={{ fontSize: 11, color: "white", fontWeight: "bold" }}>
            {badge}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
