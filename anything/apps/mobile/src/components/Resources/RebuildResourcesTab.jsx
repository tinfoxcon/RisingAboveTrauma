import { Text } from "react-native";
import { ResourceCard } from "@/components/Resources/ResourceCard";
import { SectionHeader } from "@/components/Resources/SectionHeader";
import { TeenResourcesSection } from "@/components/Resources/TeenResourcesSection";
import { LGBTQResourcesSection } from "@/components/Resources/LGBTQResourcesSection";
import { MenResourcesSection } from "@/components/Resources/MenResourcesSection";
import { ElderResourcesSection } from "@/components/Resources/ElderResourcesSection";
import { DeafResourcesSection } from "@/components/Resources/DeafResourcesSection";
import { DisabilityResourcesSection } from "@/components/Resources/DisabilityResourcesSection";
import { MilitaryResourcesSection } from "@/components/Resources/MilitaryResourcesSection";
import { StalkingResourcesSection } from "@/components/Resources/StalkingResourcesSection";

export function RebuildResourcesTab() {
  return (
    <>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        🌱 Rebuild Resources
      </Text>

      <SectionHeader style={{ marginTop: 0 }}>Essential Services</SectionHeader>

      <ResourceCard
        title="Findhelp.org"
        description="Food, housing, employment, financial assistance, childcare, and transportation"
        url="https://findhelp.org"
      />

      <SectionHeader>Legal Resources</SectionHeader>

      <ResourceCard
        title="Legal Services Corporation"
        description="Find free legal aid for divorce, custody, restraining orders, and restitution"
        url="https://lsc.gov/what-legal-aid/find-legal-aid"
      />
      <ResourceCard
        title="WomensLaw.org"
        description="Legal information on restraining orders, divorce, and custody"
        url="https://womenslaw.org"
      />

      <SectionHeader>Financial Resources</SectionHeader>

      <ResourceCard
        title="MyMoney.gov"
        description="Banking, credit rebuilding, and financial planning"
        url="https://mymoney.gov"
      />
      <ResourceCard
        title="YWCA Career Services"
        description="Employment assistance and job training programs"
        url="https://ywca.org"
      />

      <SectionHeader>Housing Resources</SectionHeader>

      <ResourceCard
        title="DomesticShelters.org"
        description="Transitional and permanent housing options"
        url="https://domesticshelters.org"
      />
      <ResourceCard
        title="HUD Housing Counseling"
        description="Find affordable housing and rental assistance"
        url="https://hud.gov/counseling"
      />

      <SectionHeader>Mental Health & Support</SectionHeader>

      <ResourceCard
        title="Psychology Today"
        description="Find therapists specializing in trauma and abuse recovery"
        url="https://psychologytoday.com/us/therapists"
      />
      <ResourceCard
        title="RAINN Support Groups"
        description="Support groups and counseling services"
        url="https://rainn.org/national-resources-sexual-assault-survivors-and-their-loved-ones"
      />

      <SectionHeader>Additional US Resources</SectionHeader>

      <ResourceCard
        title="National DV Hotline"
        description="Call 800-799-7233 or text START to 88788"
        url="https://thehotline.org"
      />

      <TeenResourcesSection />
      <LGBTQResourcesSection />
      <MenResourcesSection />
      <ElderResourcesSection />
      <DeafResourcesSection />
      <DisabilityResourcesSection />
      <MilitaryResourcesSection />
      <StalkingResourcesSection />
    </>
  );
}
