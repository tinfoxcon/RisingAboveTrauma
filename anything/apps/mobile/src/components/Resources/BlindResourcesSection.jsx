import { Text } from "react-native";
import { ContactCard } from "@/components/Resources/ContactCard";
import { SectionHeader } from "@/components/Resources/SectionHeader";

export function BlindResourcesSection() {
  return (
    <>
      <SectionHeader>👁️ For Blind Victims and Survivors</SectionHeader>

      <Text
        style={{
          fontSize: 14,
          color: "#6B7280",
          lineHeight: 22,
          marginBottom: 16,
        }}
      >
        Blind survivors face unique barriers when seeking help, including
        limited access to screen reader compatible materials and accessible
        support groups. These resources exist specifically to bridge that gap.
        If you are helping a blind victim or survivor, this section will connect
        you to the right support.
      </Text>

      <ContactCard
        title="National Domestic Violence Hotline"
        description="Available 24 hours a day, 7 days a week in over 130 languages. A trusted advocate can provide verbal safety planning and referrals for blind callers with no visual navigation required."
        phone="1-800-799-7233"
        url="https://www.thehotline.org"
      />

      <ContactCard
        title="End Abuse of People with Disabilities"
        description="Provides training and resources to help domestic violence service providers better serve blind survivors."
        url="https://www.endabusepwd.org"
      />

      <ContactCard
        title="APH ConnectCenter and VisionAware"
        description="Offers guidance specifically on crime and domestic violence for people who are blind or have low vision, including safety tips and resource referrals."
        url="https://aphconnectcenter.org/visionaware/living-with-blindness-or-low-vision/relationships/crime-and-domestic-violence/"
      />

      <ContactCard
        title="National Federation of the Blind"
        description="Connects blind victims and survivors with local chapters and support networks nationwide."
        phone="1-410-659-9314"
        url="https://www.nfb.org"
      />
    </>
  );
}
