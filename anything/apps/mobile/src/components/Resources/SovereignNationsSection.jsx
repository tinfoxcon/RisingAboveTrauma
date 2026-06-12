import { SectionHeader } from "@/components/Resources/SectionHeader";
import { ResourceCard } from "@/components/Resources/ResourceCard";
import { ContactCard } from "@/components/Resources/ContactCard";

export function SovereignNationsSection() {
  return (
    <>
      <SectionHeader>🪶 Sovereign Nations Resources</SectionHeader>

      <ContactCard
        title="StrongHearts Native Helpline"
        phone="1-844-762-8483"
        description="Available 24/7, confidential and anonymous for Native Americans and Alaska Natives"
      />

      <ResourceCard
        title="National Indigenous Women's Resource Center"
        description="Supporting Native women and families affected by violence"
        url="https://niwrc.org"
      />

      <ResourceCard
        title="Alaska Native Women's Resource Center"
        description="Resources and advocacy for Alaska Native survivors"
        url="https://aknwrc.org"
      />
    </>
  );
}
