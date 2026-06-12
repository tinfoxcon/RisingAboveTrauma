import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";

export default function TermsOfUseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
          TERMS OF USE
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: "#1F2937",
            marginBottom: 5,
            textAlign: "center",
          }}
        >
          Rising Above Trauma
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#6B7280",
            marginBottom: 5,
          }}
        >
          My F.O.C.U.S. LLC
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#9CA3AF",
            marginBottom: 30,
          }}
        >
          Effective Date: 2026
        </Text>

        {/* Section 1 */}
        <Section
          number="1"
          title="Ownership of Content"
          content="All content within this application, including but not limited to course materials, lesson content, scripts, guidance notes, affirmations, safety planning tools, worksheets, quizzes, certificates, podcast descriptions, and all written materials, is the exclusive intellectual property of Dr. Mildred D. Muhammad, D.Hum and My F.O.C.U.S. LLC. All rights are reserved."
        />

        {/* Section 2 */}
        <Section
          number="2"
          title="Copyright Protection"
          content="All content is protected under United States copyright law. Unauthorized reproduction, distribution, transmission, display, or creation of derivative works from any content within this application is strictly prohibited without the express written permission of Dr. Mildred D. Muhammad, D.Hum and My F.O.C.U.S. LLC."
        />

        {/* Section 3 */}
        <Section
          number="3"
          title="Personal Use Only"
          content="Content within this application is provided for your personal, private use only. You may not copy, screenshot, record, share, publish, teach, sell, or distribute any content from this application in any form without prior written authorization. However, you are permitted to export and share your own personal data, including journal entries, safety plans, pattern tracker documentation, and certificates of completion, for your personal safety, legal proceedings, or support needs."
        />

        {/* Section 4 */}
        <Section
          number="4"
          title="No Endorsement"
          content="Use of this application does not constitute a professional, legal, or medical relationship between the user and Dr. Mildred D. Muhammad, D.Hum or My F.O.C.U.S. LLC. The content provided is for educational and informational purposes only and does not replace professional legal, medical, or therapeutic advice."
        />

        {/* Section 5 */}
        <Section
          number="5"
          title="Privacy"
          content="Your personal data, check-ins, documentation, and all information entered into this application is private and encrypted. We do not sell, share, or distribute your personal information to any third party under any circumstances. An exception applies to RevenueCat, which manages subscription payments and has access only to subscription status and transaction data for the purpose of processing your Survivor Shield or Survivor Rise subscription. RevenueCat does not have access to any personal content you enter in the app."
        />

        {/* Section 6 */}
        <Section
          number="6"
          title="Safety Disclaimer"
          content="This application is a safety and educational tool. It is not a substitute for calling 911 in an emergency. If you are in immediate danger, call 911 immediately."
        />

        {/* Section 7 */}
        <Section
          number="7"
          title="Intellectual Property Violations"
          content="Any unauthorized use of the content within this application will be considered a violation of United States copyright law and may be subject to legal action. To request permission to use any content, contact: mildredmuhammad.com"
        />

        {/* Section 8 */}
        <Section
          number="8"
          title="Updates to Terms"
          content="These Terms of Use may be updated periodically. Continued use of the application constitutes acceptance of any updated terms."
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

function Section({ number, title, content }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 8,
        }}
      >
        {number}. {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          lineHeight: 22,
        }}
      >
        {content}
      </Text>
    </View>
  );
}
