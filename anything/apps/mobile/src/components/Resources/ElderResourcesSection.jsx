import { View, TouchableOpacity, Linking, Text } from "react-native";
import { Phone, ExternalLink } from "lucide-react-native";
import { ContactCard } from "@/components/Resources/ContactCard";
import { ResourceCard } from "@/components/Resources/ResourceCard";
import { SectionHeader } from "@/components/Resources/SectionHeader";

export function ElderResourcesSection() {
  return (
    <>
      <SectionHeader>👴👵 For Elder Victims & Survivors</SectionHeader>

      <ContactCard
        title="Eldercare Locator"
        description="Connects seniors to local resources 24 hours a day 7 days a week"
        phone="1-800-677-1116"
        url="https://eldercare.acl.gov/"
      />

      <ResourceCard
        title="National Center on Elder Abuse"
        description="Information, resources, and reporting for elder abuse"
        url="https://ncea.acl.gov/"
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
          Adult Protective Services
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#6B7280",
            lineHeight: 20,
            marginBottom: 12,
          }}
        >
          Connects to local APS services in every state
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("tel:211")}
          style={{
            backgroundColor: "#4A2D8F",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            borderRadius: 8,
          }}
        >
          <Phone color="white" size={14} style={{ marginRight: 6 }} />
          <Text
            style={{
              color: "white",
              fontSize: 13,
              fontWeight: "bold",
            }}
          >
            Call 211
          </Text>
        </TouchableOpacity>
      </View>

      <ContactCard
        title="National DV Hotline"
        description="Serves survivors of all ages"
        phone="800-799-7233"
        url="https://thehotline.org/"
      />
    </>
  );
}
