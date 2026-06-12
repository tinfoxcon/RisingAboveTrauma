import { View, Text } from "react-native";
import { ContactCard } from "@/components/Resources/ContactCard";
import { ResourceCard } from "@/components/Resources/ResourceCard";

export function WorkplaceTab() {
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
        What Is Workplace Violence
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 30,
          lineHeight: 22,
        }}
      >
        Workplace violence includes harassment, stalking by an intimate partner
        at the workplace, abuse by a coworker or supervisor, financial sabotage
        by an abuser targeting your employment, and intimidation in the
        workplace. Domestic violence does not stay at home. Abusers frequently
        contact, show up at, or sabotage a victim's workplace as a way to
        maintain control. Your workplace should be a safe space. When it is not
        you have rights.
      </Text>

      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        Know Your Rights at Work
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 30,
          lineHeight: 22,
        }}
      >
        You have the right to a safe workplace under federal law. Employers are
        required by OSHA to provide a workplace free from recognized hazards. As
        a domestic violence survivor you may also be entitled to workplace
        safety accommodations and protections against employment discrimination.
        Document everything that happens at work related to the abuse and report
        it to your HR department in writing.
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
        You have the right to legal representation for workplace violence. Ask
        your employer about their workplace violence policy. You can file a
        complaint with OSHA or the EEOC. Contact a legal aid organization or ask
        a law firm about pro bono representation. Remember every attorney is
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
        description="24/7 confidential support for survivors experiencing workplace related abuse."
        phone="1-800-799-7233"
        url="https://www.thehotline.org"
      />

      <ResourceCard
        title="OSHA"
        description="Federal agency responsible for workplace safety rights and complaints."
        url="https://www.osha.gov"
      />

      <ResourceCard
        title="Equal Employment Opportunity Commission"
        description="File workplace discrimination complaints related to domestic violence."
        url="https://www.eeoc.gov"
      />

      <ResourceCard
        title="American Bar Association"
        description="Find a lawyer, access free legal resources, and locate your state bar association for domestic violence and workplace violence legal assistance."
        url="https://www.americanbar.org"
      />
    </View>
  );
}
