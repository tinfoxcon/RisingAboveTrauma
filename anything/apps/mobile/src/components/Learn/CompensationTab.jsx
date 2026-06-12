import { View, Text } from "react-native";
import { ContactCard } from "@/components/Resources/ContactCard";
import { ResourceCard } from "@/components/Resources/ResourceCard";

function SectionTitle({ children }) {
  return (
    <Text
      style={{
        fontSize: 14,
        fontWeight: "bold",
        color: "#7A6B8A",
        marginTop: 16,
        marginBottom: 8,
      }}
    >
      {children}
    </Text>
  );
}

function SectionText({ children }) {
  return (
    <Text
      style={{
        fontSize: 14,
        color: "#374151",
        lineHeight: 22,
        marginBottom: 8,
      }}
    >
      {children}
    </Text>
  );
}

export function CompensationTab() {
  return (
    <View>
      {/* CARD 1: CIVILIAN */}
      <View
        style={{
          backgroundColor: "#FDF6E3",
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#1F2937",
                marginBottom: 6,
              }}
            >
              CIVILIAN
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#6B7280",
                fontWeight: "600",
              }}
            >
              State Crime Victim Compensation
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#10B981",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "white",
                fontWeight: "bold",
              }}
            >
              Civilian
            </Text>
          </View>
        </View>

        <SectionTitle>WHAT IT IS</SectionTitle>
        <SectionText>
          Direct reimbursement for crime-related expenses including medical
          costs, mental health counseling, lost wages, and funeral costs.
          Administered by your state, funded federally through the Office for
          Victims of Crime.
        </SectionText>

        <SectionTitle>WHO QUALIFIES</SectionTitle>
        <SectionText>
          Victims of violent crime, family members of victims, and in some cases
          witnesses. You must not have contributed to the crime and must not
          have been incarcerated when the crime occurred.
        </SectionText>
        <SectionText>
          Domestic violence exception: a police report is not always required. A
          protection order or advocate verification may substitute.
        </SectionText>

        <SectionTitle>WHAT'S COVERED</SectionTitle>
        <SectionText>
          Medical and counseling costs | Lost wages | Domestic violence shelter
          costs | Crime scene cleanup | Funeral and burial expenses |
          Transportation
        </SectionText>

        <SectionTitle>HOW TO APPLY</SectionTitle>
        <SectionText>
          Apply through your state's victim compensation program. It is free and
          no lawyer is required. A trained victim advocate can help submit
          through Presumptive Eligibility processing. Contact the program in the
          state where the crime occurred.
        </SectionText>

        <SectionTitle>KEY CONTACT</SectionTitle>
        <ContactCard
          title="VictimConnect Helpline"
          description="Call or text for help navigating victim compensation and connecting to local resources."
          phone="1-855-484-2846"
          url="https://victimconnect.org"
        />
      </View>

      {/* CARD 2: MILITARY */}
      <View
        style={{
          backgroundColor: "#FDF6E3",
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#1F2937",
                marginBottom: 6,
              }}
            >
              MILITARY
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#6B7280",
                fontWeight: "600",
              }}
            >
              Transitional Compensation (TC) Program
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#4A2D8F",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "white",
                fontWeight: "bold",
              }}
            >
              Military
            </Text>
          </View>
        </View>

        <SectionTitle>WHAT IT IS</SectionTitle>
        <SectionText>
          A DoD program under 10 U.S. Code § 1059, administered by the Family
          Advocacy Program (FAP). Provides monthly financial benefits to spouses
          and dependent children when a service member is discharged for
          domestic violence or sexual assault against that family member.
        </SectionText>

        <SectionTitle>WHO QUALIFIES</SectionTitle>
        <SectionText>
          Spouses and dependent children under 18, or under 23 if in college, of
          a service member discharged due to domestic violence or sexual assault
          against that family member.
        </SectionText>
        <SectionText>
          Important: Unmarried partners do not qualify for TC payments on their
          own. However, children of unmarried parents may qualify if they are
          victims of child abuse by a service member parent.
        </SectionText>

        <SectionTitle>WHAT'S COVERED</SectionTitle>
        <SectionText>
          Monthly cash payments | Tricare or CHAMPVA health care | Commissary
          and exchange privileges | Household goods shipment
        </SectionText>
        <SectionText>
          Monthly payment amounts: Spouse $1,283 | Per child $318 | Duration 12
          to 36 months
        </SectionText>

        <SectionTitle>HOW TO REPORT AND ACCESS</SectionTitle>
        <SectionText>
          Report to military law enforcement, the Family Advocacy Program (FAP),
          a healthcare provider, a chaplain, or the command. Both restricted
          (confidential) and unrestricted reporting options are available.
        </SectionText>

        <SectionTitle>KEY CONTACT</SectionTitle>
        <ResourceCard
          title="Military OneSource"
          description="Access the DoD Domestic Abuse Victim Advocate Locator and military family support resources."
          url="https://www.militaryonesource.mil"
        />
      </View>

      {/* CARD 3: SOVEREIGN NATIONS */}
      <View
        style={{
          backgroundColor: "#FDF6E3",
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#1F2937",
                marginBottom: 6,
              }}
            >
              SOVEREIGN NATIONS
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#6B7280",
                fontWeight: "600",
              }}
            >
              Tribal Victim Compensation & Resources
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#14B8A6",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "white",
                fontWeight: "bold",
              }}
            >
              Sovereign Nations
            </Text>
          </View>
        </View>

        <SectionTitle>WHAT MAKES THIS DIFFERENT</SectionTitle>
        <SectionText>
          If you live on tribal lands, you are not under the same legal system
          as civilian or military victims and survivors. You exist under three
          overlapping jurisdictions: tribal, state, and federal. Understanding
          which one applies to you is critical. There are 574 federally
          recognized sovereign nations in the United States. Each one has its
          own laws, its own tribal court, and its own definition of domestic
          violence.
        </SectionText>

        <SectionTitle>THE JURISDICTION PROBLEM</SectionTitle>
        <SectionText>
          For decades, if your abuser was non-Native, tribal courts had no
          authority to prosecute them. The 2013 VAWA reauthorization restored
          tribal courts' authority to prosecute both Native and non-Native
          abusers for domestic violence on tribal lands. The 2022 VAWA
          reauthorization expanded that authority to cover sexual assault, child
          abuse, stalking, sex trafficking, and assaults on tribal law
          enforcement officers. Gaps still exist. Fewer than 45 tribal shelters
          serve the entire country.
        </SectionText>

        <SectionTitle>WHAT FINANCIAL ASSISTANCE IS AVAILABLE</SectionTitle>
        <SectionText>
          The Family Violence Prevention and Services Act (FVPSA) provides
          funding directly to federally recognized tribes for emergency shelter,
          crisis counseling, safety planning, legal aid, housing assistance, and
          transportation. The Tribal Victim Services Set-Aside (TVSSA) has
          awarded approximately $596 million to tribes from 2018 through 2024 to
          serve domestic violence and sexual assault victims and survivors
          directly. Tribes can also provide emergency grocery assistance,
          emergency housing, transportation to appointments, and culturally
          grounded support including ceremonies and community healing practices.
        </SectionText>

        <SectionTitle>PROTECTION ORDERS</SectionTitle>
        <SectionText>
          Most tribes have the ability to issue and enforce protection orders,
          including against non-Native abusers. Protection orders issued by
          tribal courts must be honored by state and federal courts under
          federal law. How long they last varies by tribe. Contact your tribal
          court directly to find out what applies in your community.
        </SectionText>

        <SectionTitle>THE SHELTER GAP</SectionTitle>
        <SectionText>
          There are fewer than 45 tribal shelters in all of Indian Country. If
          your tribe does not have one, tribal programs can arrange hotels, safe
          homes, and access to non-Native shelters outside your community. Ask
          your tribal advocate what options exist.
        </SectionText>

        <SectionTitle>BUREAU OF INDIAN AFFAIRS VICTIM ASSISTANCE</SectionTitle>
        <SectionText>
          The BIA Office of Justice Services provides crisis intervention,
          mental and emotional health referrals, emergency services,
          transportation, court accompaniment, and follow-up support
          specifically for victims and survivors in Indian Country.
        </SectionText>

        <SectionTitle>KEY CONTACTS</SectionTitle>
        <ContactCard
          title="StrongHearts Native Helpline"
          description="24/7, confidential, anonymous, and free. Call or text, or chat at strongheartshelpline.org."
          phone="1-844-762-8483"
          url="https://www.strongheartshelpline.org"
        />
        <ContactCard
          title="National Indigenous Women's Resource Center"
          description="Support and resources for Native women experiencing domestic violence."
          phone="855-649-7299"
          url="https://www.niwrc.org"
        />
        <ResourceCard
          title="Bureau of Indian Affairs Victim Assistance"
          description="Crisis intervention, referrals, emergency services, and court accompaniment in Indian Country."
          url="https://www.bia.gov/bia/ojs/victim-assistance"
        />
        <ResourceCard
          title="Tribal Resource Tool"
          description="Find tribal-specific victim resources and programs."
          url="https://ovc.ojp.gov/program/tribal"
        />

        <SectionTitle>
          IF YOU ARE UNSURE WHICH SYSTEM APPLIES TO YOU
        </SectionTitle>
        <SectionText>
          Contact StrongHearts first. Their advocates understand the
          jurisdictional complexity and will help you identify exactly which
          resources apply to your specific situation, whether tribal, state,
          federal, or all three. You do not have to figure this out alone.
        </SectionText>
      </View>

      {/* BOTTOM NOTE */}
      <View
        style={{
          backgroundColor: "#FEF3C7",
          padding: 16,
          borderRadius: 12,
          borderLeftWidth: 4,
          borderLeftColor: "#F59E0B",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#92400E",
            lineHeight: 22,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          If you are unsure which system applies to you, contact a victim
          advocate. You may qualify for more than one.
        </Text>
      </View>
    </View>
  );
}
