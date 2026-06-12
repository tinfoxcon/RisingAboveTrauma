import { ContactCard } from "@/components/Resources/ContactCard";
import { ResourceCard } from "@/components/Resources/ResourceCard";
import { SectionHeader } from "@/components/Resources/SectionHeader";

export function DeafResourcesSection() {
  return (
    <>
      <SectionHeader>
        👂 For Deaf & Hard of Hearing Victims & Survivors
      </SectionHeader>

      <ContactCard
        title="The Deaf Hotline"
        description="ASL support available 24 hours a day 7 days a week"
        phone="855-812-1001"
        url="https://thedeafhotline.org/"
      />

      <ResourceCard
        title="National Deaf Domestic Violence Hotline"
        description="Videophone and email support available 24 hours a day 7 days a week. Deaf advocates providing crisis intervention and referrals"
        url="https://www.thedeafhotline.org"
      />

      <ContactCard
        title="National DV Hotline"
        description="Serves survivors of all hearing abilities"
        phone="800-799-7233"
        url="https://thehotline.org/"
      />
    </>
  );
}
