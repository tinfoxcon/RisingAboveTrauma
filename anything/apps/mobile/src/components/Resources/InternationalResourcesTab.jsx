import { View, Text } from "react-native";
import { ResourceCard } from "@/components/Resources/ResourceCard";
import { ContactCard } from "@/components/Resources/ContactCard";
import { SectionHeader } from "@/components/Resources/SectionHeader";

export function InternationalResourcesTab() {
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

      <View
        style={{
          backgroundColor: "#FEF3C7",
          padding: 14,
          borderRadius: 12,
          marginBottom: 30,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: "#92400E",
            fontWeight: "600",
            textAlign: "center",
            lineHeight: 20,
          }}
        >
          In an emergency call your local emergency number. Common emergency
          numbers include 999 in the UK, 112 in Europe, 000 in Australia, and
          111 in New Zealand. If you are unsure of your local emergency number
          please dial your country's operator or check with a local authority.
        </Text>
      </View>

      <SectionHeader style={{ marginTop: 0 }}>
        International Resources
      </SectionHeader>

      <View
        style={{
          backgroundColor: "#F5F3FF",
          borderLeftWidth: 3,
          borderLeftColor: "#4A2D8F",
          borderRadius: 10,
          padding: 14,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#4A2D8F",
            marginBottom: 6,
          }}
        >
          👁️ For Blind Victims and Survivors
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: "#4B5563",
            lineHeight: 20,
          }}
        >
          If you are outside the United States and are blind or have low vision,
          contact your local domestic violence organization and ask specifically
          about services available for blind victims and survivors. Many
          organizations have advocates trained to provide verbal safety planning
          and accessible support by phone with no visual navigation required.
        </Text>
      </View>

      <ResourceCard
        title="1800RESPECT (Australia)"
        description="Support for domestic violence survivors"
        url="https://www.1800respect.org.au"
      />
      <ResourceCard
        title="Alliance for Hope International"
        description="Global DV support network"
        url="https://www.allianceforhope.com"
      />
      <ResourceCard
        title="Coalition Against Trafficking in Women"
        description="Human trafficking prevention"
        url="https://www.catwinternational.org"
      />
      <ResourceCard
        title="End Violence Against Women International"
        description="Global advocacy and resources"
        url="https://www.evawintl.org"
      />
      <ResourceCard
        title="Esperanza United"
        description="Support for Latinx communities"
        url="https://www.esperanzaunited.org"
      />
      <ResourceCard
        title="Global Network of Women's Shelters"
        description="Worldwide shelter network"
        url="https://www.gnws.org"
      />
      <ResourceCard
        title="Hot Peach Pages"
        description="Resources in 110+ languages"
        url="https://www.hotpeachpages.net"
      />
      <ResourceCard
        title="NZ Family Violence Clearinghouse"
        description="New Zealand resources"
        url="https://nzfvc.org.nz"
      />
      <ResourceCard
        title="NO MORE"
        description="Global awareness campaign"
        url="https://nomore.org"
      />
      <ResourceCard
        title="Pathways to Safety International"
        description="US citizens abroad"
        url="https://www.pathwaystosafety.org"
      />
      <ResourceCard
        title="Red Nacional de Refugios (Mexico)"
        description="Mexican shelter network"
        url="https://www.rednacionalderefugios.org.mx"
      />
      <ResourceCard
        title="International Safe Shelter Foundation"
        description="Supports domestic violence shelters in Latin America providing emergency shelter and transitional housing to victims and survivors"
        url="https://issf-us.org"
      />
      <ResourceCard
        title="The Pixel Project"
        description="Online activism against VAW"
        url="https://www.thepixelproject.net"
      />
      <ResourceCard
        title="Women Against Violence Europe"
        description="European resources"
        url="https://www.wave-network.org"
      />

      <SectionHeader style={{ marginTop: 10 }}>
        👨 For Male Victims and Survivors
      </SectionHeader>

      <ContactCard
        title="ManKind Initiative"
        description="Confidential helpline and support for male victims of domestic abuse and violence in the United Kingdom. Available Monday through Friday, 10am to 4pm."
        phone="01823 334244"
        url="https://mankind.org.uk"
      />
    </>
  );
}
