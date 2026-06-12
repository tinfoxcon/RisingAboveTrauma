import { ContactCard } from "@/components/Resources/ContactCard";
import { ResourceCard } from "@/components/Resources/ResourceCard";
import { SectionHeader } from "@/components/Resources/SectionHeader";

export function LGBTQResourcesSection() {
  return (
    <>
      <SectionHeader>🏳️‍🌈 For LGBTQ+ Victims & Survivors</SectionHeader>

      <ContactCard
        title="The Trevor Project"
        description="Crisis support for LGBTQ+ youth"
        phone="1-866-488-7386"
        url="https://thetrevorproject.org/"
      />

      <ContactCard
        title="GLBTQ Domestic Violence Project"
        phone="617-742-4911"
        url="https://glbtqdvp.org/"
      />

      <ContactCard
        title="Trans Lifeline"
        description="Peer support for transgender people in crisis"
        phone="877-565-8860"
        url="https://translifeline.org/"
      />

      <ResourceCard
        title="NCAVP"
        description="Anti-violence support for LGBTQ+ communities"
        url="https://avp.org/"
      />
    </>
  );
}
