import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import SafetyButtons from "@/components/SafetyButtons";
import { useAuth } from "@/utils/auth/useAuth";
import { useAuthStore } from "@/utils/auth/store";
import useSinglePress from "@/utils/useSinglePress";

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [selectedPath, setSelectedPath] = useState(null);
  const [protectingChildren, setProtectingChildren] = useState(null);
  const [completing, setCompleting] = useState(false);
  const { auth } = useAuth();
  const { setAuth } = useAuthStore();
  const guard = useSinglePress();

  const handleComplete = guard(async () => {
    setCompleting(true);
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      if (auth?.jwt) {
        headers["Authorization"] = `Bearer ${auth.jwt}`;
      }

      const baseURL = process.env.EXPO_PUBLIC_PROXY_BASE_URL || "";
      const response = await fetch(`${baseURL}/api/onboarding/complete`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          current_path: selectedPath,
          protecting_children: protectingChildren,
        }),
      });

      if (response.ok && auth) {
        setAuth({
          ...auth,
          user: {
            ...auth.user,
            onboarded: true,
            current_path: selectedPath,
            protecting_children: protectingChildren,
          },
        });
      }
    } catch (error) {
      console.error("Onboarding save failed:", error);
    } finally {
      setCompleting(false);
    }
    router.replace("/(tabs)");
  });

  if (step === 1) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#4A2D8F",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <StatusBar style="light" />
        <SafetyButtons />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 40,
            paddingBottom: 20,
          }}
        >
          <Text style={{ fontSize: 60, textAlign: "center", marginBottom: 20 }}>
            🕊️
          </Text>

          <Text
            style={{
              fontSize: 18,
              color: "#F0B429",
              fontStyle: "italic",
              textAlign: "center",
              marginBottom: 30,
              lineHeight: 28,
            }}
          >
            "I built this because I needed it and it didn't exist. Everything
            here comes from what I lived and what I wish someone had handed me.
            You are not alone."
          </Text>

          <Text
            style={{
              fontSize: 24,
              color: "#F0B429",
              fontStyle: "italic",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Dr. Mildred D. Muhammad, D.Hum
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: "white",
              textAlign: "center",
              marginBottom: 3,
            }}
          >
            Award-Winning Global Keynote Speaker
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "white",
              textAlign: "center",
              marginBottom: 3,
            }}
          >
            Certified Domestic Violence Advocate/Expert, Trainer/Educator
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "white",
              textAlign: "center",
              marginBottom: 3,
            }}
          >
            Certified Professional/Personal Development Consultant
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "white",
              textAlign: "center",
              marginBottom: 3,
            }}
          >
            Gubernatorial Appointee to the Maryland State Board of Victim
            Services by Governor Wes Moore
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "white",
              textAlign: "center",
              marginBottom: 3,
            }}
          >
            Ex-Wife of the DC Sniper
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "white",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Founder · Rising Above Trauma · My F.O.C.U.S. LLC
          </Text>

          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: 20,
              borderRadius: 12,
              marginBottom: 40,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "white",
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Three Privacy Promises:
            </Text>
            <Text style={{ fontSize: 14, color: "white", marginBottom: 8 }}>
              • All your data is encrypted and stored privately
            </Text>
            <Text style={{ fontSize: 14, color: "white", marginBottom: 8 }}>
              • We never share your information with anyone
            </Text>
            <Text style={{ fontSize: 14, color: "white" }}>
              • You control what you save and can delete everything anytime
            </Text>
          </View>

          <TouchableOpacity
            onPress={guard(() => setStep(2))}
            style={{
              backgroundColor: "#F0B429",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              Continue
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (step === 2) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#4A2D8F",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <StatusBar style="light" />
        <SafetyButtons />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 40,
            paddingBottom: 20,
          }}
        >
          <Text style={{ fontSize: 48, textAlign: "center", marginBottom: 20 }}>
            🔒
          </Text>

          <Text
            style={{
              fontSize: 28,
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Your Privacy Matters
          </Text>

          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: 20,
              borderRadius: 12,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "white",
                lineHeight: 24,
              }}
            >
              Before you continue, we want you to know what information this app
              collects and how it is used.{"\n\n"}Rising Above Trauma collects
              your path selection, check-in responses, safety plan details,
              pattern tracker entries, journal entries, and other information
              you voluntarily provide.{"\n\n"}This information is stored
              securely and privately and is never shared with third parties.
              {"\n\n"}You are in complete control of your data and can delete it
              at any time through Settings.
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://myfocusllc.com/privacy-policy")
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
              paddingVertical: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#F0B429",
                textDecorationLine: "underline",
                fontWeight: "600",
              }}
            >
              Read our full Privacy Policy →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={guard(() => setStep(3))}
            style={{
              backgroundColor: "#F0B429",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              I Agree and Continue
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (step === 3) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#4A2D8F",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <StatusBar style="light" />
        <SafetyButtons />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 40,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Choose Your Path
          </Text>

          <TouchableOpacity
            onPress={() => setSelectedPath("still_in_it")}
            style={{
              backgroundColor:
                selectedPath === "still_in_it"
                  ? "#F0B429"
                  : "rgba(255, 255, 255, 0.2)",
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
              borderWidth: 2,
              borderColor:
                selectedPath === "still_in_it" ? "#F0B429" : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "white",
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              Still In It
            </Text>
            <Text style={{ fontSize: 14, color: "white" }}>
              You're currently in an unsafe situation
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedPath("just_left")}
            style={{
              backgroundColor:
                selectedPath === "just_left"
                  ? "#F0B429"
                  : "rgba(255, 255, 255, 0.2)",
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
              borderWidth: 2,
              borderColor:
                selectedPath === "just_left" ? "#F0B429" : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "white",
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              Just Left
            </Text>
            <Text style={{ fontSize: 14, color: "white" }}>
              You recently left an abusive relationship
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedPath("rebuild")}
            style={{
              backgroundColor:
                selectedPath === "rebuild"
                  ? "#F0B429"
                  : "rgba(255, 255, 255, 0.2)",
              padding: 20,
              borderRadius: 12,
              marginBottom: 40,
              borderWidth: 2,
              borderColor:
                selectedPath === "rebuild" ? "#F0B429" : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "white",
                fontWeight: "bold",
                marginBottom: 8,
              }}
            >
              Rebuilding
            </Text>
            <Text style={{ fontSize: 14, color: "white" }}>
              You're healing and building your new life
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!selectedPath}
            onPress={guard(() => setStep(4))}
            style={{
              backgroundColor: selectedPath
                ? "#F0B429"
                : "rgba(240, 180, 41, 0.3)",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              Continue
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (step === 4) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#4A2D8F",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <StatusBar style="light" />
        <SafetyButtons />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 40,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Who Are You Protecting?
          </Text>

          <TouchableOpacity
            onPress={() => setProtectingChildren(false)}
            style={{
              backgroundColor:
                protectingChildren === false
                  ? "#F0B429"
                  : "rgba(255, 255, 255, 0.2)",
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
              borderWidth: 2,
              borderColor:
                protectingChildren === false ? "#F0B429" : "transparent",
            }}
          >
            <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
              Just Myself
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setProtectingChildren(true)}
            style={{
              backgroundColor:
                protectingChildren === true
                  ? "#F0B429"
                  : "rgba(255, 255, 255, 0.2)",
              padding: 20,
              borderRadius: 12,
              marginBottom: 40,
              borderWidth: 2,
              borderColor:
                protectingChildren === true ? "#F0B429" : "transparent",
            }}
          >
            <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
              Myself and My Children
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={protectingChildren === null}
            onPress={guard(() => setStep(5))}
            style={{
              backgroundColor:
                protectingChildren !== null
                  ? "#F0B429"
                  : "rgba(240, 180, 41, 0.3)",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              Continue
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (step === 5) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#4A2D8F",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <StatusBar style="light" />
        <SafetyButtons />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 40,
            paddingBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              color: "white",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Quick Exit: How It Works
          </Text>

          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: 20,
              borderRadius: 12,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#F0B429",
                fontWeight: "bold",
                marginBottom: 15,
              }}
            >
              Step 1: Tap Exit
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "white",
                marginBottom: 20,
                lineHeight: 22,
              }}
            >
              The Exit button in the top right instantly takes you to
              weather.com
            </Text>

            <Text
              style={{
                fontSize: 18,
                color: "#F0B429",
                fontWeight: "bold",
                marginBottom: 15,
              }}
            >
              Step 2: Your Data Stays Safe
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "white",
                marginBottom: 20,
                lineHeight: 22,
              }}
            >
              Everything you save is encrypted. Nobody can see it but you.
            </Text>

            <Text
              style={{
                fontSize: 18,
                color: "#F0B429",
                fontWeight: "bold",
                marginBottom: 15,
              }}
            >
              Step 3: Discreet Mode
            </Text>
            <Text style={{ fontSize: 14, color: "white", lineHeight: 22 }}>
              Turn on Discreet Mode in Settings to disguise the app as "My
              Journal"
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "rgba(240, 180, 41, 0.2)",
              padding: 16,
              borderRadius: 12,
              marginBottom: 40,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Quick Exit is ALWAYS available on every screen
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleComplete}
            disabled={completing}
            style={{
              backgroundColor: completing
                ? "rgba(240, 180, 41, 0.5)"
                : "#F0B429",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
              {completing ? "Getting Started..." : "I'm Ready"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return null;
}
