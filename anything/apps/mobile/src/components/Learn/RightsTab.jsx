import { View, Text } from "react-native";
import { BulletPoint, StepItem } from "./TextComponents";
import { ResourceCard } from "@/components/Resources/ResourceCard";
import { ContactCard } from "@/components/Resources/ContactCard";

export function RightsTab() {
  return (
    <View>
      {/* Did You Know? Free Legal Help */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        Did You Know? You May Qualify for Free Legal Help
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        Most people don't know this. Every attorney in the United States is
        encouraged by the American Bar Association to provide at least 50 hours
        of free legal services per year to those who can't afford
        representation. Many law firms have pro bono programs specifically for
        domestic violence cases. They don't advertise this because they prefer
        paying clients. But you have the right to ask.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        Here's how to access free or low cost legal help:
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
          Ask directly.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          When you contact a law firm tell them you're a domestic violence
          victim and ask if they offer pro bono services or a reduced fee
          arrangement. The worst they can say is no.
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          Contact your local Legal Aid office.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          Legal Aid provides free civil legal services to people who can't
          afford an attorney. Find your local office below.
        </Text>
        <ResourceCard
          title="LawHelp.org"
          description="Find free civil legal services in your area. Search by state to locate your nearest Legal Aid office."
          url="https://www.lawhelp.org"
        />

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          Contact your state bar association.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          Every state bar association has a lawyer referral service and many
          have specific domestic violence legal assistance programs.
        </Text>
        <ResourceCard
          title="American Bar Association"
          description="Find your state bar association and access lawyer referral services and domestic violence legal assistance programs."
          url="https://www.americanbar.org"
        />

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          Contact a domestic violence organization.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          Many domestic violence organizations have attorneys on staff or
          partnerships with law firms that provide free legal representation to
          survivors.
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
        You shouldn't have to face the legal system alone. These resources exist
        to make sure you don't have to.
      </Text>

      {/* SECTION 1: Cyberstalking */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        💻 Cyberstalking
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        Cyberstalking is stalking that happens through technology. It is just as
        dangerous as physical stalking, and in many cases it is harder to escape
        because it follows you everywhere you go online.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        What cyberstalking looks like:
      </Text>

      <View style={{ marginBottom: 12 }}>
        <BulletPoint text="Sending repeated unwanted threatening or harassing messages through text email or social media" />
        <BulletPoint text="Monitoring your social media accounts location or online activity" />
        <BulletPoint text="Hacking into your accounts phone or devices" />
        <BulletPoint text="Using GPS trackers AirTags or spyware to track your location without your knowledge" />
        <BulletPoint text="Creating fake profiles to impersonate you or monitor you" />
        <BulletPoint text="Doxxing, meaning publishing your private information such as your home address or workplace online" />
        <BulletPoint text="Sending unwanted explicit images or threats to share intimate images" />
        <BulletPoint text="Showing up at locations you posted about online" />
      </View>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        Cyberstalking is a crime. Under federal law, 18 U.S.C. § 2261A, it is
        illegal to use any electronic means to cause substantial emotional
        distress or fear of physical harm. Most states also have their own
        cyberstalking laws.
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        If you are being cyberstalked here is what you need to do:
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
          Take screenshots of every message post threat or communication. Record
          dates times and platforms. Save everything even if it feels minor. A
          pattern of behavior is required to prosecute, so every incident
          counts.
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          Stop all communication with the cyberstalker.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          Do not respond to messages. Responding, even to say stop, can be used
          to claim you consented to contact.
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          Report to the platform.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          Report the cyberstalker's account to every social media platform email
          provider or app they are using to contact you. This creates an
          official record and can result in their account being suspended.
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          Secure your accounts and devices immediately:
        </Text>
        <View style={{ marginLeft: 15, marginBottom: 12 }}>
          <BulletPoint text="Change all passwords, email, social media, banking, and everything else" />
          <BulletPoint text="Enable two-factor authentication on every account" />
          <BulletPoint text="Check your phone for unknown apps that may be tracking your location" />
          <BulletPoint text="Remove unknown devices from your home Wi-Fi network" />
          <BulletPoint text="Check your car and personal belongings for GPS trackers or AirTags" />
        </View>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          Report to local law enforcement.
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#374151",
            lineHeight: 22,
            marginBottom: 12,
          }}
        >
          Take your screenshots logs and all evidence with you. Use the words
          stalking harassment and I am in fear for my safety. Ask for a formal
          police report and request a copy of the report number.
        </Text>

        <ResourceCard
          title="FBI Internet Crime Complaint Center"
          description="File a complaint with the FBI if cyberstalking crosses state lines or involves online criminal activity."
          url="https://www.ic3.gov"
        />

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
          A restraining order can legally prohibit the cyberstalker from
          contacting you online or in person. Filing is free in most states.
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: 6,
          }}
        >
          Protect your personal information:
        </Text>
        <View style={{ marginLeft: 15, marginBottom: 12 }}>
          <BulletPoint text="Set all social media accounts to private" />
          <BulletPoint text="Remove your home address phone number and workplace from all online profiles and directories" />
          <BulletPoint text="Be careful about geotags on photos, as they can reveal your location" />
          <BulletPoint text="Use a P.O. box for mail if possible" />
        </View>
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        Resources:
      </Text>
      <ResourceCard
        title="Cyber Civil Rights Initiative"
        description="Support for victims of online abuse and non-consensual intimate image sharing."
        url="https://cybercivilrights.org"
      />
      <ResourceCard
        title="FBI Internet Crime Complaint Center"
        description="Report cybercrime online including cyberstalking and harassment."
        url="https://www.ic3.gov"
      />
      <ContactCard
        title="National DV Hotline"
        description="Available 24 hours a day, 7 days a week for domestic violence support."
        phone="800-799-7233"
        url="https://www.thehotline.org"
      />
      <ResourceCard
        title="SPARC"
        description="Cyberstalking safety planning tools and resources from the Stalking Prevention, Awareness and Resource Center."
        url="https://www.stalkingawareness.org"
      />

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 40,
          lineHeight: 22,
          fontWeight: "600",
        }}
      >
        Cyberstalking is not harmless. It is not just online. It is a crime. And
        it is not your fault.
      </Text>

      {/* SECTION: What Is Swatting */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        🚨 What Is Swatting
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        Swatting is a dangerous and potentially deadly form of digital abuse in
        which an abuser, stalker, or harasser makes a false emergency report to
        law enforcement claiming a violent incident is occurring at the victim's
        address. The goal is to trigger a heavily armed police response at the
        victim's home, creating terror, danger, and chaos.
      </Text>

      <View
        style={{
          backgroundColor: "#FEE2E2",
          borderWidth: 2,
          borderColor: "#DC2626",
          borderRadius: 12,
          padding: 14,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: "#7F1D1D",
            fontWeight: "bold",
            lineHeight: 22,
            textAlign: "center",
          }}
        >
          Swatting has resulted in the deaths of innocent people. It is not a
          prank. It is a weapon.
        </Text>
      </View>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        Abusers use swatting as a tool of coercive control to frighten victims,
        damage their reputation, and make them feel unsafe in their own home. It
        is a criminal act in most states and can result in federal charges.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        If you believe you are being targeted for swatting take the following
        steps immediately:
      </Text>

      <View style={{ marginBottom: 16 }}>
        <StepItem
          number={1}
          text="Contact your local police department and inform them that you may be a target of swatting so they have a record on file."
        />
        <StepItem
          number={2}
          text="Document all threats and suspicious activity and report them using the Pattern Map Tracker in this app."
        />
        <StepItem
          number={3}
          text="Contact the FBI's Internet Crime Complaint Center at ic3.gov to file a report."
        />
        <StepItem
          number={4}
          text="If you are on social media and believe someone is threatening to swat you, screenshot the threats and report them to the platform immediately."
        />
      </View>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 16,
          lineHeight: 22,
          fontWeight: "600",
        }}
      >
        You have the right to be safe in your own home. Swatting is abuse and it
        is a crime.
      </Text>

      <ResourceCard
        title="FBI Internet Crime Complaint Center"
        description="File a report for cybercrime including swatting threats and online harassment."
        url="https://www.ic3.gov"
      />

      {/* SECTION 2: Address Confidentiality Program */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
          marginTop: 30,
        }}
      >
        🏠 Address Confidentiality Program
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        If you are leaving or have left an abusive situation one of the biggest
        dangers is your abuser finding out where you live. Public records
        including voter registration, driver's license, car registration, school
        enrollment, and court documents can all reveal your address. The Address
        Confidentiality Program was created to protect you from that.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        What is the Address Confidentiality Program?
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        The Address Confidentiality Program, also known as the ACP, is a free
        statewide program available in most US states. It provides victims and
        survivors of domestic abuse and violence, stalking, sexual assault, and
        human trafficking with a legal substitute address. Government agencies
        are required by law to accept this substitute address in place of your
        real one.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        What the ACP does for you:
      </Text>

      <View style={{ marginBottom: 12 }}>
        <BulletPoint text="Provides a legal substitute address you can use for ALL government purposes" />
        <BulletPoint text="Forwards your first class mail and legal papers to your real address confidentially" />
        <BulletPoint text="Protects your address in voter registration records" />
        <BulletPoint text="Keeps your address off court documents" />
        <BulletPoint text="Allows you to get a driver's license, register your car, enroll your children in school, and apply for benefits without revealing where you live" />
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        Who qualifies:
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        You may qualify for the ACP if you are a victim or survivor of domestic
        abuse and violence, stalking, sexual assault, or human trafficking and
        you fear for your safety if your address becomes known. Most states also
        allow a parent or guardian to apply on behalf of minor children.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        Important to know:
      </Text>

      <View style={{ marginBottom: 12 }}>
        <BulletPoint text="The ACP is available in most but not all US states" />
        <BulletPoint text="You typically need to have recently moved or be planning to move to a location your abuser does not know" />
        <BulletPoint text="Certification usually lasts 3 to 4 years and can be renewed" />
        <BulletPoint text="The program works best as part of a broader safety plan" />
        <BulletPoint text="Contact your local DV advocate to apply and they will guide you through the process" />
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        How to apply:
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        Contact your state's ACP program directly or reach out to your local
        domestic violence organization for help applying. The National DV
        Hotline can also connect you to your state's program.
      </Text>

      <ContactCard
        title="National DV Hotline"
        description="Call 24/7 to be connected to your state's Address Confidentiality Program and local DV resources."
        phone="800-799-7233"
        url="https://www.thehotline.org"
      />

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 40,
          lineHeight: 22,
          fontWeight: "600",
        }}
      >
        Your location is your safety. You have the right to keep it private.
      </Text>

      {/* SECTION 3: Recording Abuse and Social Media */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        📱 Recording Abuse and Social Media
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        Recording abuse may seem like a powerful way to document what is
        happening to you. However before you record or post anything, there are
        important legal facts you need to understand.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        Know your state's recording laws.
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        The United States is divided into two types of states regarding
        recording conversations:
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        In <Text style={{ fontWeight: "600" }}>one-party consent states</Text>,
        only one person in the conversation needs to agree to the recording. If
        you are part of the conversation, you can legally record it without
        telling the other person.
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        In <Text style={{ fontWeight: "600" }}>two-party consent states</Text>,
        everyone in the conversation must agree to be recorded. If you record
        your abuser without their knowledge in one of these states you could be
        arrested and charged with illegal recording, even if you were
        documenting abuse. Two-party consent states include California, Florida,
        Illinois, Maryland, Massachusetts, Michigan, Montana, New Hampshire,
        Oregon, Pennsylvania, and Washington.
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        Before you record anything, find out which type of state you live in.
        Contact the National DV Hotline or a local DV advocate for guidance
        specific to your state.
      </Text>

      <ContactCard
        title="National DV Hotline"
        description="Call 24/7 to get guidance on recording laws in your state and connect with a local DV advocate."
        phone="800-799-7233"
        url="https://www.thehotline.org"
      />

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        Think carefully before posting recordings on social media.
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        Even if your recording was legal, posting it on social media can create
        serious problems:
      </Text>

      <View style={{ marginBottom: 12 }}>
        <BulletPoint text="Posting could violate the abuser's privacy rights and expose you to legal action." />
        <BulletPoint text="It could be used against you in court proceedings." />
        <BulletPoint text="It could alert the abuser and escalate danger." />
        <BulletPoint text="Social media platforms may remove it without warning." />
        <BulletPoint text="It could complicate your legal case." />
      </View>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        The safest use of recorded evidence is to share it privately with your
        attorney or law enforcement and not publicly on social media.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#1F2937",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        If someone posts intimate images of you without your consent:
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 12,
          lineHeight: 22,
        }}
      >
        The <Text style={{ fontWeight: "600" }}>TAKE IT DOWN Act</Text> was
        signed into federal law and it is now a federal crime to post intimate
        images or AI generated deepfakes of someone without their consent. You
        can request removal from the platform within 48 hours.
      </Text>

      <ResourceCard
        title="Cyber Civil Rights Initiative"
        description="Get help if intimate images have been shared without your consent."
        url="https://cybercivilrights.org"
      />

      {/* SECTION: Revenge Porn */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginTop: 30,
          marginBottom: 15,
        }}
      >
        🚫 Revenge Porn
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 16,
          lineHeight: 22,
        }}
      >
        Revenge porn is the non-consensual sharing of intimate images or videos
        of someone without their permission, typically by a former partner as a
        form of retaliation, control, or harassment. It is a form of digital
        abuse that causes lasting emotional, professional, and personal harm to
        victims. As of 2025 it is a federal crime under the TAKE IT DOWN Act.
        Most states also have their own revenge porn laws with criminal
        penalties. If you are a victim, document everything, do not contact the
        person responsible, and report it immediately to the platform and to law
        enforcement.
      </Text>

      <ResourceCard
        title="Cyber Civil Rights Initiative"
        description="Free confidential support, resources, and crisis helpline for victims of non-consensual intimate image abuse including revenge porn and deepfakes."
        url="https://cybercivilrights.org"
      />
    </View>
  );
}
