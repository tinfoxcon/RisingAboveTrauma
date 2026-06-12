import { ContactCard } from "@/components/Resources/ContactCard";
import { SectionHeader } from "@/components/Resources/SectionHeader";

export function DisabilityResourcesSection() {
  return (
    <>
      <SectionHeader>
        ♿ For Victims & Survivors with Disabilities
      </SectionHeader>

      <ContactCard
        title="Barrier Free Living"
        description="Safe shelter and support services specifically for survivors with disabilities"
        phone="212-677-6668"
        url="https://www.bflnyc.org"
      />

      <ContactCard
        title="ADA Information Line"
        description="Information on your rights and accommodations under the Americans with Disabilities Act"
        phone="800-514-0301"
        url="https://ada.gov/"
      />

      <ContactCard
        title="National DV Hotline"
        description="Serves survivors of all abilities"
        phone="800-799-7233"
        url="https://thehotline.org/"
      />
    </>
  );
}
