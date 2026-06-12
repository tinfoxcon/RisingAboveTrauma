import { View, Text, TouchableOpacity, Linking } from "react-native";
import { ExternalLink } from "lucide-react-native";
import { ContactCard } from "@/components/Resources/ContactCard";
import { SectionHeader } from "@/components/Resources/SectionHeader";

export function MilitaryResourcesSection() {
  return (
    <>
      <SectionHeader>🎖 For Military Victims and Survivors</SectionHeader>

      <ContactCard
        title="Military OneSource"
        description="24 hour support for service members and their families"
        phone="1-800-342-9647"
        url="https://militaryonesource.mil/"
      />

      <View
        style={{
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#E5E7EB",
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "#4A2D8F",
            marginBottom: 8,
          }}
        >
          Family Advocacy Program
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#6B7280",
            lineHeight: 20,
            marginBottom: 12,
          }}
        >
          Free confidential support for active duty service members, spouses,
          and families. Offers restricted and unrestricted reporting options
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://militaryonesource.mil/")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 8,
          }}
        >
          <ExternalLink color="#4A2D8F" size={14} style={{ marginRight: 6 }} />
          <Text
            style={{
              color: "#4A2D8F",
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            Visit militaryonesource.mil
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "#E5E7EB",
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "#4A2D8F",
            marginBottom: 8,
          }}
        >
          VA Intimate Partner Violence Assistance Program
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#6B7280",
            lineHeight: 20,
            marginBottom: 12,
          }}
        >
          Support specifically for veterans experiencing intimate partner
          violence
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://socialwork.va.gov/ipv")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 8,
          }}
        >
          <ExternalLink color="#4A2D8F" size={14} style={{ marginRight: 6 }} />
          <Text
            style={{
              color: "#4A2D8F",
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            Visit socialwork.va.gov/ipv
          </Text>
        </TouchableOpacity>
      </View>

      <ContactCard
        title="Safe Helpline"
        description="Confidential sexual assault support for the military community"
        phone="877-995-5247"
        url="https://safehelpline.org/"
      />

      <ContactCard
        title="National DV Hotline"
        description="Serves military families and civilians"
        phone="800-799-7233"
        url="https://thehotline.org/"
      />
    </>
  );
}
