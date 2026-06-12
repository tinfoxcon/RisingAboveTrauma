import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";

export default function PrivacyPolicyScreen() {
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
          PRIVACY POLICY
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

        <Text style={{ fontSize: 16, color: "#6B7280", marginBottom: 5 }}>
          My F.O.C.U.S. LLC
        </Text>

        <Text style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 30 }}>
          Effective Date: 2026
        </Text>

        <Section
          number="1"
          title="Information We Collect"
          content="We collect information you provide directly to us when you create an account, including your name, email address, and password. We also collect the content you enter into the app, such as check-ins, journal entries, safety plans, and pattern tracker data."
        />

        <Section
          number="2"
          title="How We Use Your Information"
          content="We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you technical notices and support messages, and to respond to your comments and questions. Your personal data is never sold or shared with third parties for marketing purposes."
        />

        <Section
          number="3"
          title="Data Security"
          content="Your personal data, check-ins, documentation, and all information entered into this application is private and encrypted. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
        />

        <Section
          number="4"
          title="Data Sharing"
          content="We do not sell, share, or distribute your personal information to any third party under any circumstances. An exception applies to RevenueCat, which manages subscription payments and has access only to subscription status and transaction data for the purpose of processing your subscription. RevenueCat does not have access to any personal content you enter in the app."
        />

        <Section
          number="5"
          title="Your Data Rights"
          content="You have the right to access, update, or delete your personal information at any time. You may also export your own personal data, including journal entries, safety plans, and pattern tracker documentation, for your personal safety, legal proceedings, or support needs."
        />

        <Section
          number="6"
          title="Data Retention"
          content="We retain your personal information for as long as your account is active or as needed to provide you services. If you delete your account, we will delete or anonymize your personal information within a reasonable period of time."
        />

        <Section
          number="7"
          title="Children's Privacy"
          content="Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that a child under 18 has provided us with personal information, we will take steps to delete such information."
        />

        <Section
          number="8"
          title="Changes to This Policy"
          content="We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. Continued use of the application after changes constitutes your acceptance of the updated policy."
        />

        <Section
          number="9"
          title="Contact Us"
          content="If you have any questions about this Privacy Policy or our privacy practices, please contact us at mildredmuhammad.com"
        />

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
      <Text style={{ fontSize: 14, color: "#374151", lineHeight: 22 }}>
        {content}
      </Text>
    </View>
  );
}
