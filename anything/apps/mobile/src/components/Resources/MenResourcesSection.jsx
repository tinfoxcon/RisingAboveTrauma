import { ContactCard } from "@/components/Resources/ContactCard";
import { ResourceCard } from "@/components/Resources/ResourceCard";
import { SectionHeader } from "@/components/Resources/SectionHeader";

export function MenResourcesSection() {
  return (
    <>
      <SectionHeader>👨 For Men</SectionHeader>

      <ResourceCard
        title="Stop Abuse Campaign"
        description="Resources specifically for male survivors"
        url="https://stopabuse.com/"
      />
      <ResourceCard
        title="HelpGuide: Domestic Violence Against Men"
        description="Information and resources for men experiencing domestic abuse and violence including how to recognize abuse and find help."
        url="https://www.helpguide.org/relationships/domestic-abuse/domestic-violence-against-men"
      />

      <ContactCard
        title="National DV Hotline"
        description="Serves ALL genders"
        phone="800-799-7233"
        url="https://thehotline.org/"
      />
    </>
  );
}
