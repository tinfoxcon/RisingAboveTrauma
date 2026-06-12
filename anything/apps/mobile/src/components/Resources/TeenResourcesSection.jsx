import { View, TouchableOpacity, Linking } from "react-native";
import { Phone, MessageCircle, ExternalLink } from "lucide-react-native";
import { ContactCard } from "@/components/Resources/ContactCard";
import { ResourceCard } from "@/components/Resources/ResourceCard";
import { SectionHeader } from "@/components/Resources/SectionHeader";

export function TeenResourcesSection() {
  return (
    <>
      <SectionHeader>🧡 For Teens — Teen Dating Violence</SectionHeader>

      <ContactCard
        title="loveisrespect.org"
        description="24/7 support for teens and young adults experiencing dating abuse via call, chat, and text."
        phone="1-866-331-9474"
        sms="sms:22522&body=LOVEIS"
        url="https://loveisrespect.org/"
      />

      <ContactCard
        title="Teen Line"
        phone="1-800-852-8336"
        sms="sms:839863&body=TEEN"
        url="https://teenlineonline.org/"
      />

      <ResourceCard
        title="Break the Cycle"
        description="Teen DV prevention and education"
        url="https://breakthecycle.org/"
      />
      <ResourceCard
        title="Teen Dating Violence Awareness"
        description="Information, resources, and tips on teen dating violence awareness and prevention"
        url="https://www.teendvmonth.org"
      />
    </>
  );
}
