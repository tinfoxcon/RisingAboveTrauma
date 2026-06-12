import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import { Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";

const scriptsByCategory = [
  {
    category: "NO-ENGAGEMENT",
    scripts: [
      {
        id: 1,
        title: "Script 1 — Complete No-Contact Response",
        situation:
          "When they contact you about anything other than a legal matter or children",
        script:
          "With all due respect, I will not engage in this conversation. Any necessary communication should go through my attorney. Don't contact me again.",
        guidance:
          "Keep further communications in your notes — without telling the abuser you are keeping evidence. Every message they send after this becomes documentation for your protection.",
      },
      {
        id: 2,
        title: "Script 2 — Repeat Contact Boundary",
        situation: "When they keep reaching out after being told not to",
        script:
          "I've already made my position clear. I will not be responding to further messages.",
        guidance:
          "Keep further communications in your notes — without telling the abuser you are keeping evidence. Every message they send after this becomes documentation for your protection.",
      },
    ],
  },
  {
    category: "LOGISTICS-ONLY",
    scripts: [
      {
        id: 3,
        title: "Script 3 — Information Exchange Only",
        situation:
          "When they try to turn a practical conversation into an emotional one",
        script:
          "Let's keep this conversation limited to [specific matter]. I will not discuss anything beyond that.",
        guidance:
          "Replace [specific matter] with the topic at hand. State it once and do not engage with anything else they raise.",
      },
      {
        id: 4,
        title: "Script 4 — Written Communication Only",
        situation: "When they insist on calling instead of texting or emailing",
        script: "I'm only communicating in writing. Use text or email.",
        guidance:
          "This is one of the most powerful boundaries you can set. When communication is in writing, the abuser is giving you evidence freely — every text, every email sharpens your case. They may not realize it, but you do.",
      },
    ],
  },
  {
    category: "CO-PARENTING",
    scripts: [
      {
        id: 5,
        title: "Script 5 — Child Pickup / Drop-Off",
        situation: "When exchanges become tense or confrontational",
        script: "This time is for the children's exchange only.",
        guidance:
          "For your safety during exchanges, consult with a qualified domestic violence advocate to create a personalized safety plan. Having a trusted support person present and using a police station as the exchange location are strategies that many advocates recommend. Contact the National DV Hotline at 800-799-7233 for personalized guidance.",
      },
      {
        id: 6,
        title: "Script 6 — Children's Needs Only",
        situation:
          "When they use co-parenting communication to manipulate or control",
        script:
          "Communication will remain limited to matters involving our children's health, education, and safety.",
        guidance:
          "The best option for communicating about your children is through a child support portal. If one is available in your area, discuss it with your attorney or ask the court how to apply. Everything stays documented, official, and on the record.",
      },
    ],
  },
  {
    category: "FAMILY",
    scripts: [
      {
        id: 7,
        title: "Script 7 — To Family Who Doesn't Understand",
        situation: "When family members pressure you to stay or go back",
        script:
          "I know what I need to do for myself, and I won't be talked out of it.",
        guidance:
          "This response reinforces that your voice, your needs, and your safety matter just as much as anyone else's comfort. You do not owe anyone an explanation for protecting your life.",
      },
      {
        id: 8,
        title: "Script 8 — Setting Limits With Family",
        situation: "When family members share your information with the abuser",
        script:
          "My privacy and safety are not negotiable. If information about me is shared with [name], I will step back from contact.",
        guidance:
          "This response reinforces that protecting your privacy and safety is a necessary boundary — not something you have to negotiate to keep others comfortable. Replace [name] with the person's name when you use it.",
      },
    ],
  },
  {
    category: "WORKPLACE / HR",
    scripts: [
      {
        id: 9,
        title: "Script 9 — Reporting to HR",
        situation:
          "When you need to inform HR about a personal safety concern at work",
        script:
          "There is a personal safety concern that may affect the workplace. Legal protections are in place, and confidentiality is requested. I'd like to discuss what safety measures can be put in place.",
        guidance:
          "This response communicates your concern clearly, professionally, and without overexposing personal details. It reinforces that workplace safety and confidentiality should be taken seriously — and it puts HR on notice without making you vulnerable.",
      },
      {
        id: 10,
        title: "Script 10 — Responding to a Coworker",
        situation: "When a coworker asks about something they saw or heard",
        script:
          "Thank you for your concern. I'm handling the situation and have support in place. I'm not able to share details, but I appreciate you checking in.",
        guidance:
          "This response helps protect your privacy while acknowledging concern — without feeling pressured to explain, defend, or disclose more than feels safe. A simple acknowledgment is enough.",
      },
    ],
  },
];

export default function InTheMomentScriptsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", "Script copied to clipboard");
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
            marginBottom: 20,
          }}
        >
          Suggested Scripts Library
        </Text>

        <View
          style={{
            backgroundColor: "#FEF3C7",
            padding: 16,
            borderRadius: 12,
            marginBottom: 30,
          }}
        >
          <Text style={{ fontSize: 14, color: "#92400E", lineHeight: 20 }}>
            These scripts are for you to read and practice privately — not to be
            read aloud from your phone.
          </Text>
        </View>

        {scriptsByCategory.map((category, idx) => (
          <View key={idx} style={{ marginBottom: 30 }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#6B7280",
                letterSpacing: 1,
                marginBottom: 15,
              }}
            >
              {category.category}
            </Text>

            {category.scripts.map((script) => (
              <View
                key={script.id}
                style={{
                  backgroundColor: "#FDF6E3",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#1F2937",
                    marginBottom: 10,
                  }}
                >
                  {script.title}
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: "#6B7280",
                    fontStyle: "italic",
                    marginBottom: 12,
                  }}
                >
                  Situation: {script.situation}
                </Text>

                <View
                  style={{
                    backgroundColor: "#EDE9FE",
                    padding: 14,
                    borderRadius: 8,
                    marginBottom: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#1F2937",
                      fontStyle: "italic",
                      lineHeight: 22,
                    }}
                  >
                    {script.script}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => copyToClipboard(script.script)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#4A2D8F",
                    padding: 12,
                    borderRadius: 8,
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <Copy color="white" size={16} style={{ marginRight: 8 }} />
                  <Text
                    style={{ color: "white", fontSize: 14, fontWeight: "600" }}
                  >
                    Copy Script
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    backgroundColor: "#F9FAFB",
                    padding: 12,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#4B5563",
                      lineHeight: 20,
                    }}
                  >
                    {script.guidance}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
