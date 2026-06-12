import { View, Text, TouchableOpacity, Linking } from "react-native";
import { useRouter } from "expo-router";
import { BulletPoint } from "./TextComponents";
import { ResourceCard } from "@/components/Resources/ResourceCard";
import { ContactCard } from "@/components/Resources/ContactCard";

function LegalItem({ title, description }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          color: "#7A6B8A",
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          lineHeight: 20,
        }}
      >
        {description}
      </Text>
    </View>
  );
}

export function LegalTab() {
  const router = useRouter();

  return (
    <View>
      {/* 5 Questions to Ask a Domestic Violence Attorney */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        5 Questions to Ask a Domestic Violence Attorney
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        Finding the right attorney can make a significant difference in your
        case and your safety. Not all family law attorneys understand the unique
        dynamics of domestic violence. Before hiring an attorney ask these five
        questions to make sure they are the right fit for you.
      </Text>

      <View style={{ marginBottom: 12 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          1. How many domestic violence cases have you handled and what were the
          outcomes?
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          An experienced domestic violence attorney should be able to speak
          specifically about their experience with protective orders, custody
          cases involving abuse, and safety planning around legal proceedings.
          General family law experience is not enough.
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          2. Do you understand coercive control and how it differs from physical
          abuse?
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          Domestic violence is not always physical. An attorney who only
          recognizes bruises and injuries may not be able to effectively
          represent a survivor of emotional, financial, digital, or
          psychological abuse. Their answer to this question will tell you
          whether they truly understand your experience.
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          3. How do you handle cases where the abuser is using the children as
          leverage?
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          Abusers often use custody and visitation as tools of continued control
          after separation. A domestic violence attorney should understand this
          pattern and know how to address it strategically in court without
          putting you or your children at greater risk.
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          4. What is your experience with emergency protective orders and how
          quickly can you get one filed?
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          Speed and knowledge of emergency protective orders can mean the
          difference between safety and danger. An attorney who hesitates or is
          unfamiliar with the emergency filing process is not the right fit.
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          5. If you are offered money to throw my case will you protect my
          interests regardless of outside pressure?
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          This question reveals the character and integrity of the attorney
          sitting across from you. Victims with high profile cases or cases
          involving wealthy or powerful abusers need to know their attorney
          cannot be bought. The right attorney will not flinch at this question.
          The wrong one will.
        </Text>
      </View>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 40,
          lineHeight: 22,
          fontWeight: "600",
        }}
      >
        These questions are not just interview questions. They are safety tools.
        The right attorney will welcome them. The wrong one will not.
      </Text>

      {/* Restraining Orders */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        Restraining Orders
      </Text>

      {/* Important Safety Note */}
      <View
        style={{
          backgroundColor: "#FEF3C7",
          padding: 16,
          borderRadius: 12,
          marginBottom: 25,
          borderLeftWidth: 4,
          borderLeftColor: "#F59E0B",
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: "#92400E",
            fontWeight: "bold",
            marginBottom: 12,
          }}
        >
          ⚠️ Important Safety Note
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: "#92400E",
            lineHeight: 20,
            marginBottom: 12,
          }}
        >
          A restraining order is a legal document and not a physical barrier.
          Research shows that restraining orders are violated approximately 40%
          of the time. For some survivors, filing for a restraining order can
          escalate the abuser's behavior.
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: "#92400E",
            lineHeight: 20,
            marginBottom: 12,
          }}
        >
          Before filing, consult with a qualified domestic violence advocate who
          can help you assess your specific risk level and create a safety plan
          around the filing process.
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: "#92400E",
            lineHeight: 20,
            fontWeight: "600",
            marginBottom: 12,
          }}
        >
          A restraining order is one tool in a larger safety plan. It works best
          alongside other protections, not as the only protection.
        </Text>
        <ContactCard
          title="National DV Hotline"
          description="Call for personalized guidance on restraining orders and safety planning."
          phone="800-799-7233"
          url="https://www.thehotline.org"
        />
      </View>

      {/* What Is A Restraining Order */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        What Is A Restraining Order
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        A restraining order (also called a protective order) is a legal document
        issued by a court to protect someone from abuse, harassment, or threats.
        There are four main types:
      </Text>

      <View style={{ marginBottom: 20 }}>
        <LegalItem
          title="Emergency Protective Order"
          description="Issued immediately by law enforcement and lasts up to 7 days. Used for urgent danger."
        />
        <LegalItem
          title="Temporary Restraining Order"
          description="Issued by a court and remains in effect until the scheduled hearing date."
        />
        <LegalItem
          title="Permanent Restraining Order"
          description="Issued after a hearing. Durations vary by state — many now offer initial orders up to 5 years with renewable options extending up to 10 years. In California, courts can issue orders lasting up to 15 years under AB 2308. Can be renewed."
        />
        <LegalItem
          title="Criminal Protective Order"
          description="Issued automatically if the abuser is arrested. Tied to the criminal case."
        />
      </View>

      {/* Restraining Order Duration Updates */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        Restraining Order Duration Updates
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 14,
          lineHeight: 22,
        }}
      >
        Restraining order durations have changed significantly. Here is what
        victims and survivors should know:
      </Text>

      <View style={{ marginBottom: 16 }}>
        <BulletPoint text="Emergency Protective Orders are typically issued immediately by law enforcement and last up to 7 days." />
        <BulletPoint text="Temporary Restraining Orders are issued by a court and remain in effect until the scheduled hearing date." />
        <BulletPoint text="Long term restraining orders have been extended in many states. In California, courts can now issue restraining orders lasting up to 15 years under AB 2308, effective January 2025. Many states now offer initial orders for up to 5 years with renewable options extending up to 10 years." />
        <BulletPoint text="Permanent lifetime orders are available in cases with documented severe violence." />
        <BulletPoint text="Automatic extensions apply during incarceration with additional protection for up to 5 years post release." />
        <BulletPoint text="Restraining orders now explicitly cover cyberstalking, online harassment, and monitoring through smart devices in many jurisdictions." />
      </View>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 16,
          lineHeight: 22,
          fontStyle: "italic",
        }}
      >
        Because restraining order laws vary by state, contact a domestic
        violence attorney or your local courthouse to understand the specific
        durations and protections available in your state.
      </Text>

      <ResourceCard
        title="American Bar Association"
        description="Find a lawyer and locate your state bar association for free or low cost legal help with restraining orders and domestic violence cases."
        url="https://www.americanbar.org"
      />

      {/* How To Get One */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        How To Get One
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          1. Go to your local courthouse or family court.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          2. Fill out a petition explaining why you need protection.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          3. See the judge (often same day) to get a temporary order.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          4. Serve the abuser with the order (court or sheriff does this).
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          5. Attend the full hearing, usually scheduled 2 to 3 weeks out, to
          receive the permanent order.
        </Text>
      </View>

      {/* How It Works */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        How It Works
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        A restraining order can require the abuser to:
      </Text>
      <View style={{ marginBottom: 12 }}>
        <BulletPoint text="Stay away from you, your home, work, and children's school" />
        <BulletPoint text="Stop all contact (calls, texts, social media, through others)" />
        <BulletPoint text="Move out of a shared home" />
        <BulletPoint text="Attend counseling or anger management" />
        <BulletPoint text="Turn in any firearms" />
      </View>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 20,
          lineHeight: 22,
          fontWeight: "600",
        }}
      >
        If the order is violated: Call 911 immediately. Violating a restraining
        order is a crime and can result in arrest.
      </Text>

      {/* Attorney Note */}
      <View
        style={{
          backgroundColor: "#FEF3C7",
          padding: 16,
          borderRadius: 12,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: "#92400E",
            fontWeight: "600",
            lineHeight: 20,
          }}
        >
          Attorney Note: Not all attorneys are the same. A domestic violence
          attorney understands family law AND the dynamics of abuse.
        </Text>
      </View>

      {/* Find Legal Aid Button */}
      <TouchableOpacity
        onPress={() =>
          Linking.openURL(
            "https://www.lsc.gov/about-lsc/what-legal-aid/i-need-legal-help",
          )
        }
        style={{
          backgroundColor: "#7A6B8A",
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}>
          Find Legal Aid
        </Text>
      </TouchableOpacity>

      {/* Stalking Section */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        🚨 Stalking
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        Stalking is often overlooked or minimized. It is defined as a repeated
        pattern of unwanted attention, contact, or behavior that causes fear.
        Following you, showing up at your home or workplace, monitoring your
        phone or social media, sending unwanted messages, and tracking your
        location without your knowledge are all forms of stalking. Stalking is a
        crime in all 50 states. According to the U.S. Department of Justice, 76%
        of women murdered by an intimate partner were stalked first.
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        If you are being stalked, here is what you need to do:
      </Text>

      <View style={{ marginBottom: 12 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          Document everything.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          Every incident must be recorded with the date, time, location, and
          exactly what happened. Keep copies of all text messages, emails,
          voicemails, social media messages, photos, gifts, and letters from the
          stalker. Touch physical items as little as possible to preserve them
          as evidence.
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          Report every incident to the police.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          Report every incident even if you do not want to prosecute. Each
          report creates an official record. Depending on the state, a minimum
          number of documented incidents may be required before stalking charges
          can be filed. This varies by state. Reporting consistently builds that
          record. Request a copy of every police report filed.
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          Tell trusted people.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          Inform friends, family, neighbors, coworkers, and building security
          about the stalking. Give them a description of the stalker. Ask them
          to document anything they witness.
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          Apply for a protective order.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          A restraining order can legally require the stalker to stay away from
          you, your home, your workplace, and your children's school. Filing is
          free in most states.
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          Protect your personal information.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          Remove your home address from checks, business cards, and social
          media. Use a P.O. box if possible. Vary your routes to and from work,
          school, and home. Be aware of your surroundings at all times.
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 10,
          }}
        >
          Connect with specialized resources.
        </Text>

        <ResourceCard
          title="Stalking Prevention, Awareness and Resource Center"
          description="Safety planning tools and state specific information for stalking victims and survivors."
          url="https://www.stalkingawareness.org"
        />

        <ContactCard
          title="VictimConnect"
          description="Local referrals and support for crime victims. Call or text to connect with resources in your area."
          phone="855-484-2846"
          url="https://victimconnect.org"
        />

        <ContactCard
          title="National DV Hotline"
          description="Available 24 hours a day 7 days a week"
          phone="800-799-7233"
          url="https://thehotline.org"
        />
      </View>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 40,
          lineHeight: 22,
          fontWeight: "600",
        }}
      >
        Stalking is not a misunderstanding. It is not a coincidence. It is a
        crime. And it is not your fault.
      </Text>
    </View>
  );
}
