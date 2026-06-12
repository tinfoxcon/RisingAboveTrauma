import { ContactCard } from "@/components/Resources/ContactCard";
import { ResourceCard } from "@/components/Resources/ResourceCard";
import { SectionHeader } from "@/components/Resources/SectionHeader";

export function StalkingResourcesSection() {
  return (
    <>
      <SectionHeader>🚨 For Stalking Victims & Survivors</SectionHeader>

      <ResourceCard
        title="SPARC"
        description="Federally funded resource providing information and safety planning tools"
        url="https://stalkingawareness.org"
      />

      <ContactCard
        title="VictimConnect"
        description="Connects stalking victims and survivors to local resources"
        phone="855-484-2846"
        url="https://victimconnect.org"
      />

      <ContactCard
        title="National DV Hotline"
        description="Available 24 hours a day 7 days a week"
        phone="800-799-7233"
        url="https://thehotline.org"
      />
    </>
  );
}
