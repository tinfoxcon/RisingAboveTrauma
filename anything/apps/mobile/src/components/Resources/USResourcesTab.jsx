import { Text } from "react-native";
import { CrisisCard988 } from "@/components/Resources/CrisisCard988";
import { CrisisTextLineCard } from "@/components/Resources/CrisisTextLineCard";
import { EmergencyNote } from "@/components/Resources/EmergencyNote";
import { ResourceCard } from "@/components/Resources/ResourceCard";
import { SectionHeader } from "@/components/Resources/SectionHeader";
import { SovereignNationsSection } from "@/components/Resources/SovereignNationsSection";
import { TeenResourcesSection } from "@/components/Resources/TeenResourcesSection";
import { LGBTQResourcesSection } from "@/components/Resources/LGBTQResourcesSection";
import { MenResourcesSection } from "@/components/Resources/MenResourcesSection";
import { ElderResourcesSection } from "@/components/Resources/ElderResourcesSection";
import { DeafResourcesSection } from "@/components/Resources/DeafResourcesSection";
import { DisabilityResourcesSection } from "@/components/Resources/DisabilityResourcesSection";
import { BlindResourcesSection } from "@/components/Resources/BlindResourcesSection";
import { MilitaryResourcesSection } from "@/components/Resources/MilitaryResourcesSection";

export function USResourcesTab() {
  return (
    <>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#DC2626",
          marginBottom: 15,
        }}
      >
        🆘 Crisis Support
      </Text>

      <CrisisCard988 />
      <CrisisTextLineCard />
      <EmergencyNote />

      <SectionHeader style={{ marginTop: 0 }}>
        Domestic Violence Resources
      </SectionHeader>

      <ResourceCard
        title="National DV Hotline"
        description="Call 800-799-7233 or text START to 88788"
        url="https://thehotline.org"
      />
      <ResourceCard
        title="State Domestic Violence Coalitions"
        description="Find your state's domestic violence coalition for local advocacy organizations, shelters, and support services in your area."
        url="https://www.thehotline.org/get-help/state-domestic-violence-coalitions/"
      />
      <ResourceCard
        title="DomesticShelters.org"
        description="Find US and Canada shelters near you"
        url="https://domesticshelters.org"
      />
      <ResourceCard
        title="Findhelp.org"
        description="Local services and community support"
        url="https://findhelp.org"
      />
      <ResourceCard
        title="Family Justice Centers"
        description="Find a Family Justice Center near you. These centers bring together multiple agencies and services to support domestic violence victims and survivors in one location. Search by state, city, or zip code."
        url="https://www.allianceforhope.org/family-justice-center-alliance/find-a-center"
      />

      <TeenResourcesSection />
      <SovereignNationsSection />
      <LGBTQResourcesSection />
      <MenResourcesSection />
      <ElderResourcesSection />
      <DeafResourcesSection />
      <DisabilityResourcesSection />
      <BlindResourcesSection />
      <MilitaryResourcesSection />
    </>
  );
}
