import { View, Text } from "react-native";
import { ContactCard } from "@/components/Resources/ContactCard";
import { ResourceCard } from "@/components/Resources/ResourceCard";

export function InterfamilyTab() {
  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        What Is Interfamily Violence
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 30,
          lineHeight: 22,
        }}
      >
        Abuse does not only happen in romantic relationships. Interfamily
        violence occurs between parents and adult children, siblings,
        grandparents, extended family members, and caregivers. It follows the
        same patterns of power and control as intimate partner violence but
        carries additional layers of complexity including loyalty, cultural
        expectations, financial entanglement, and shared history. Many victims
        do not recognize what they are experiencing as abuse because it is
        happening within a family system. It is still abuse and you have the
        right to be safe.
      </Text>

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        Know Your Rights
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 30,
          lineHeight: 22,
        }}
      >
        Victims of interfamily violence have the same legal rights as victims of
        intimate partner violence. You have the right to file for a protective
        order against a family member. You have the right to press criminal
        charges. You have the right to remove yourself from a dangerous living
        situation regardless of financial dependence or family pressure. Your
        safety is not negotiable regardless of who is causing the harm.
      </Text>

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        Legal Representation
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 30,
          lineHeight: 22,
        }}
      >
        You have the right to legal representation for interfamily violence. An
        attorney who handles family violence cases can help you file for a
        protective order, navigate custody or guardianship issues, and protect
        your financial rights. Contact a legal aid organization or ask a law
        firm about pro bono representation. Remember every attorney is
        encouraged by the American Bar Association to provide at least 50 hours
        of free legal services per year. You have the right to ask.
      </Text>

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        Resources
      </Text>

      <ContactCard
        title="National Domestic Violence Hotline"
        description="24/7 confidential support for all victims and survivors of domestic abuse and violence."
        phone="1-800-799-7233"
        url="https://www.thehotline.org"
      />

      <ContactCard
        title="Childhelp National Child Abuse Hotline"
        description="24/7 crisis intervention and support for cases involving child abuse within families."
        phone="1-800-422-4453"
        url="https://www.childhelp.org"
      />

      <ContactCard
        title="Eldercare Locator"
        description="Connects older adults and caregivers with local support services for elder abuse cases."
        phone="1-800-677-1116"
        url="https://eldercare.acl.gov"
      />

      <ResourceCard
        title="Legal Aid"
        description="Find free civil legal services in your area."
        url="https://www.lawhelp.org"
      />
    </View>
  );
}
