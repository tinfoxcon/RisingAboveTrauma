import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import { Award, Download } from "lucide-react-native";
import useUser from "@/utils/auth/useUser";

const courses = {
  1: {
    title: "Understanding What Happened To Me",
    subtitle: "Healing — You Are A Victim And That Is Okay",
  },
  2: { title: "Reclaiming My Identity", subtitle: "Clarity" },
  3: { title: "Setting Boundaries That Hold", subtitle: "Strength" },
  4: { title: "Building My New Life", subtitle: "Rebuilding" },
  5: { title: "Leading My Own Life Again", subtitle: "Freedom" },
  6: {
    title: "Rebuilding Your Relationship With Yourself",
    subtitle: "Rebuilding — You Are A Warrior And You Are Rising",
  },
  7: {
    title: "Finding Your Voice Again",
    subtitle: "Rebuilding — You Are A Warrior And You Are Rising",
  },
  8: {
    title: "Releasing Shame and Guilt",
    subtitle: "Rebuilding — You Are A Warrior And You Are Rising",
  },
  9: {
    title: "Rediscovering Who You Are",
    subtitle: "Rebuilding — You Are A Warrior And You Are Rising",
  },
  10: {
    title: "Building a Life You Choose",
    subtitle: "Rebuilding — You Are A Warrior And You Are Rising",
  },
  11: {
    title: "Healthy Relationships Going Forward",
    subtitle: "Rebuilding — You Are A Warrior And You Are Rising",
  },
  12: {
    title: "Forgiving Yourself",
    subtitle: "Rebuilding — You Are A Warrior And You Are Rising",
  },
  13: {
    title: "Your Transformation",
    subtitle: "Rebuilding — You Are A Warrior And You Are Free",
  },
};

export default function CertificateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { courseId } = useLocalSearchParams();
  const courseNum = parseInt(courseId);
  const course = courses[courseNum];
  const { data: user } = useUser();
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!course) return;
    setSharing(true);
    try {
      const recipientName = user?.name || "Your Name";
      const seriesLabel =
        courseNum <= 5 ? "Healing to Freedom" : "My Growth Journey";
      const completionBadge =
        courseNum === 5
          ? "\n🏆 Healing to Freedom Series Complete 🏆"
          : courseNum === 13
            ? "\n🎉 My Growth Journey Series Complete 🎉"
            : "";

      const certificateText =
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `       CERTIFICATE OF COMPLETION\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `This certifies that\n\n` +
        `${recipientName}\n\n` +
        `has successfully completed\n\n` +
        `Course ${courseNum}: ${course.title}\n` +
        `${course.subtitle}\n` +
        `${seriesLabel} Series${completionBadge}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `Dr. Mildred D. Muhammad, D.Hum.\n` +
        `Award-Winning Global Keynote Speaker\n` +
        `Certified Domestic Violence Advocate/Expert\n` +
        `Appointed by Governor Wes Moore —\n` +
        `Maryland State Board of Victim Services\n` +
        `Founder · Rising Above Trauma · My F.O.C.U.S. LLC\n\n` +
        `"Survival is behind you.\n` +
        ` Intentional living begins here."\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `© 2026 Dr. Mildred D. Muhammad, D.Hum.\n` +
        `My F.O.C.U.S. LLC · All Rights Reserved`;

      await Share.share(
        {
          message: certificateText,
          title: `Certificate of Completion — Course ${courseNum}: ${course.title}`,
        },
        {
          dialogTitle: "Share Your Certificate",
        },
      );
    } catch (error) {
      if (error?.message !== "The user did not share") {
        Alert.alert("Could not share certificate", "Please try again.");
        console.error("Share error:", error);
      }
    } finally {
      setSharing(false);
    }
  };

  // Handle invalid course ID
  if (!course) {
    return (
      <View
        style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
      >
        <StatusBar style="dark" />
        <SafetyButtons />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#E32626",
              marginBottom: 10,
            }}
          >
            Course Not Found
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6E6480",
              marginBottom: 30,
              textAlign: "center",
            }}
          >
            This course doesn't exist. Please choose from courses 1-5.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: "#5B2CA0",
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              ← Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
          <Text style={{ fontSize: 16, color: "#5B2CA0", fontWeight: "600" }}>
            ← Back
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <Award color="#D9A62B" size={64} />
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#5B2CA0",
              marginTop: 20,
            }}
          >
            Congratulations!
          </Text>
        </View>

        {/* Certificate */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderWidth: 8,
            borderColor: "#D9A62B",
            padding: 30,
            borderRadius: 12,
            marginBottom: 30,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#6E6480",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Certificate of Completion
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: "#6E6480",
              textAlign: "center",
              marginBottom: 15,
            }}
          >
            This certifies that
          </Text>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#2B2438",
              textAlign: "center",
              marginBottom: user?.name ? 20 : 6,
            }}
          >
            {user?.name || "Your Name"}
          </Text>

          {!user?.name && (
            <TouchableOpacity
              onPress={() => router.push("/settings")}
              style={{ alignItems: "center", marginBottom: 20 }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#5B2CA0",
                  textDecorationLine: "underline",
                }}
              >
                Add your name in Settings
              </Text>
            </TouchableOpacity>
          )}

          <Text
            style={{
              fontSize: 12,
              color: "#6E6480",
              textAlign: "center",
              marginBottom: 15,
            }}
          >
            has successfully completed
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#5B2CA0",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Course {courseNum}: {course.title}
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#D9A62B",
              fontStyle: "italic",
              textAlign: "center",
              marginBottom: 30,
            }}
          >
            {course.subtitle}
          </Text>

          {courseNum === 13 && (
            <View
              style={{
                backgroundColor: "#F0FDF4",
                padding: 16,
                borderRadius: 8,
                marginBottom: 30,
                borderWidth: 1,
                borderColor: "#22C55E",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "#166534",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                🎉 My Growth Journey Series Complete 🎉
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#166534",
                  textAlign: "center",
                  lineHeight: 20,
                }}
              >
                You have completed all 8 courses of the My Growth Journey
                series. You are a Warrior. And you are free.
              </Text>
            </View>
          )}

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#D9D1E6",
              paddingTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 24,
                color: "#D9A62B",
                fontFamily: "MonteCarlo",
                textAlign: "center",
                marginBottom: 15,
              }}
            >
              Dr. Mildred D. Muhammad, D.Hum.
            </Text>

            <Text
              style={{
                fontSize: 10,
                color: "#6E6480",
                textAlign: "center",
                marginBottom: 3,
              }}
            >
              Award-Winning Global Keynote Speaker
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: "#6E6480",
                textAlign: "center",
                marginBottom: 3,
              }}
            >
              Certified Domestic Violence Advocate/Expert, Trainer/Educator
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: "#6E6480",
                textAlign: "center",
                marginBottom: 3,
              }}
            >
              Certified Professional/Personal Development Consultant
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: "#6E6480",
                textAlign: "center",
                marginBottom: 3,
              }}
            >
              Appointed by Governor Wes Moore — Maryland State Board of Victim
              Services
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: "#6E6480",
                textAlign: "center",
                marginBottom: 3,
              }}
            >
              Ex-Wife of the DC Sniper
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: "#6E6480",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Founder · Rising Above Trauma · My F.O.C.U.S. LLC
            </Text>

            <Text
              style={{
                fontSize: 13,
                color: "#5B2CA0",
                fontStyle: "italic",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              "Survival is behind you.{"\n"}Intentional living begins here."
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleShare}
          disabled={sharing}
          style={{
            backgroundColor: sharing ? "#8B6BBE" : "#5B2CA0",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 16,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Download color="white" size={20} style={{ marginRight: 8 }} />
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            {sharing ? "Opening Share Sheet…" : "Share Certificate"}
          </Text>
        </TouchableOpacity>

        {/* Continue Button */}
        {courseNum < 5 ? (
          <TouchableOpacity
            onPress={() => router.push(`/course/${courseNum + 1}`)}
            style={{
              backgroundColor: "#D9A62B",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
              Continue to Course {courseNum + 1} →
            </Text>
          </TouchableOpacity>
        ) : courseNum === 13 ? (
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            style={{
              backgroundColor: "#D9A62B",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
              Return to Home 🏠
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/learn")}
            style={{
              backgroundColor: "#D9A62B",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>
              Return to All Courses
            </Text>
          </TouchableOpacity>
        )}

        {/* Back to Current Course Button */}
        <TouchableOpacity
          onPress={() => router.push(`/course/${courseNum}`)}
          style={{
            borderWidth: 2,
            borderColor: "#5B2CA0",
            backgroundColor: "#FFFFFF",
            paddingVertical: 16,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#5B2CA0" }}>
            Back to Course {courseNum}
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 9,
            color: "#D9A62B",
            textAlign: "center",
            marginTop: 30,
          }}
        >
          © 2026 Dr. Mildred D. Muhammad, D.Hum. · My F.O.C.U.S. LLC · All
          Rights Reserved
        </Text>
      </ScrollView>
    </View>
  );
}
