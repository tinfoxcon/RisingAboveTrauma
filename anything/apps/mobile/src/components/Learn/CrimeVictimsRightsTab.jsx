import { View, Text, TouchableOpacity, Linking } from "react-native";
import { ResourceCard } from "@/components/Resources/ResourceCard";
import { ContactCard } from "@/components/Resources/ContactCard";
import { Mail } from "lucide-react-native";

function NumberedRight({ number, text }) {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 14,
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: "#4A2D8F",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
          marginTop: 1,
          flexShrink: 0,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 13,
            fontWeight: "bold",
          }}
        >
          {number}
        </Text>
      </View>
      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          lineHeight: 22,
          flex: 1,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

export function CrimeVictimsRightsTab() {
  return (
    <View>
      {/* SECTION 1: Crime Victims Rights */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        🏛️ Crime Victims Rights
      </Text>

      <View
        style={{
          backgroundColor: "#F5F3FF",
          borderLeftWidth: 3,
          borderLeftColor: "#4A2D8F",
          borderRadius: 10,
          padding: 14,
          marginBottom: 12,
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
          ⚖️ Important Note About State Crimes
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: "#4B5563",
            lineHeight: 20,
          }}
        >
          Most domestic violence cases are prosecuted under state law rather
          than federal law. The Crime Victims Rights Act of 2004 applies
          specifically to federal crimes. If your case is a state crime, your
          rights are protected under your state's own crime victims rights laws.
          Every state has them. Contact your state attorney general's office or
          a local victim advocate to learn the specific rights available to you
          in your state.
        </Text>
      </View>

      <ResourceCard
        title="National Association of Attorneys General"
        description="Find your state attorney general's office to learn about crime victims rights laws in your state."
        url="https://www.naag.org"
      />

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 20,
          lineHeight: 22,
        }}
      >
        Every victim of a federal crime in the United States has legally
        protected rights under the Crime Victims Rights Act of 2004. Most people
        never know these rights exist. Here is what you are entitled to by law.
      </Text>

      <View style={{ marginBottom: 20 }}>
        <NumberedRight
          number={1}
          text="The right to be reasonably protected from the accused."
        />
        <NumberedRight
          number={2}
          text="The right to reasonable, accurate, and timely notice of any court proceeding or parole proceeding involving the crime."
        />
        <NumberedRight
          number={3}
          text="The right not to be excluded from any public court proceeding."
        />
        <NumberedRight
          number={4}
          text="The right to be reasonably heard at any public proceeding involving release, plea, sentencing, or parole."
        />
        <NumberedRight
          number={5}
          text="The right to confer with the attorney for the government in the case."
        />
        <NumberedRight
          number={6}
          text="The right to full and timely restitution as provided by law."
        />
        <NumberedRight
          number={7}
          text="The right to proceedings free from unreasonable delay."
        />
        <NumberedRight
          number={8}
          text="The right to be treated with fairness and with respect for your dignity and privacy."
        />
        <NumberedRight
          number={9}
          text="The right to be informed of any plea bargain or deferred prosecution agreement."
        />
        <NumberedRight
          number={10}
          text="The right to be informed of all of the above rights."
        />
      </View>

      {/* Email ombudsman card */}
      <View
        style={{
          backgroundColor: "#FEF3C7",
          borderLeftWidth: 4,
          borderLeftColor: "#F59E0B",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#92400E",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          If you believe a Department of Justice employee has failed to provide
          you these rights, contact the Victims Rights Ombudsman.
        </Text>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL("mailto:usaeo.VictimOmbudsman@usdoj.gov")
          }
          style={{
            backgroundColor: "#92400E",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            borderRadius: 8,
          }}
        >
          <Mail color="white" size={14} style={{ marginRight: 6 }} />
          <Text
            style={{
              color: "white",
              fontSize: 13,
              fontWeight: "bold",
            }}
          >
            Email the Victims Rights Ombudsman
          </Text>
        </TouchableOpacity>
      </View>

      <ResourceCard
        title="Office for Victims of Crime"
        description="Federal resource for crime victims rights, services, and information."
        url="https://ovc.ojp.gov"
      />

      {/* SECTION 2: VINE */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginTop: 30,
          marginBottom: 15,
        }}
      >
        🔔 VINE: Victim Information and Notification Everyday
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 16,
          lineHeight: 22,
        }}
      >
        VINE stands for Victim Information and Notification Everyday. It is a
        free, anonymous service that notifies you when your offender's custody
        status changes, including when they are released, transferred, or escape
        from custody. You can register to receive notifications by phone, email,
        or text message. The offender will never know you are registered. VINE
        is available in 46 states and is completely free to the public.
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 20,
          lineHeight: 22,
          fontWeight: "600",
        }}
      >
        To register, visit VINELink online or call 1-877-411-5588.
      </Text>

      <ResourceCard
        title="VINELink"
        description="Free anonymous service to track offender custody status and receive notifications when an offender is released, transferred, or escapes. Available 24 hours a day, 7 days a week."
        url="https://www.vinelink.com"
      />

      <ContactCard
        title="VINE Registration Helpline"
        description="Call to register for offender custody notifications by phone."
        phone="1-877-411-5588"
      />
    </View>
  );
}
