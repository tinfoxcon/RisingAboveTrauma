import { View, Text } from "react-native";
import { ContactCard } from "@/components/Resources/ContactCard";

export function LeavingTab() {
  return (
    <View>
      {/* WARNING CARD */}
      <View
        style={{
          backgroundColor: "#FEE2E2",
          borderWidth: 2,
          borderColor: "#DC2626",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#DC2626",
            marginBottom: 12,
          }}
        >
          🚨 WARNING: The Most Dangerous Time
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: "#7F1D1D",
            lineHeight: 22,
            marginBottom: 10,
          }}
        >
          Research shows that approximately 75% of domestic violence homicide
          victims are killed when they attempt to leave or after they have
          already left the relationship. Leaving is not a single moment. It is a
          process that requires awareness of your situation and your abuser's
          behavior.
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: "#7F1D1D",
            lineHeight: 22,
            marginBottom: 10,
          }}
        >
          If your abuser has made any threats to kill you, if you have noticed
          weapons in your home that were not there before, or if the violence
          has been escalating in frequency or severity, you are in extreme
          danger. Move quickly and call 911 immediately. Once you are safe,
          contact the National DV Hotline for additional assistance.
        </Text>
        <ContactCard
          title="National DV Hotline"
          description="Free, confidential support available 24/7. Call for safety planning, shelter referrals, and immediate assistance."
          phone="1-800-799-7233"
          url="https://www.thehotline.org"
        />
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            color: "#7F1D1D",
            lineHeight: 22,
          }}
        >
          Your life is worth fighting for. Trust your instincts and move toward
          safety.
        </Text>
      </View>

      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 20,
        }}
      >
        Understanding Why Leaving Takes Time
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: "#374151",
          lineHeight: 24,
          marginBottom: 20,
        }}
      >
        Every situation is different. Every relationship has its own dynamics,
        its own dangers, and its own reasons why leaving is more complicated
        than it looks from the outside. What's shared here are examples, not a
        script. You may see yourself in some of these moments and not in others.
        That's okay. The point isn't to match your experience exactly. The point
        is to show you that the back and forth, the leaving and returning, the
        trying and not quite making it yet, is not a character flaw. It's the
        reality of what leaving actually looks like for most victims and
        survivors. You are not alone in how long this is taking.
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: "#374151",
          lineHeight: 24,
          marginBottom: 20,
        }}
      >
        If you've tried to leave and gone back, you are not weak. You are not a
        failure. You are not beyond help. You are in the middle of one of the
        most complicated and dangerous processes a person can navigate, and the
        fact that you're still here means you're still trying.
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: "#374151",
          lineHeight: 24,
          marginBottom: 20,
        }}
      >
        The statistic that survivors return an average of seven times before
        leaving for good is widely quoted. But almost no one explains how or why
        it actually happens. Here is what those seven times can look like in
        real life.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        The first time
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#374151",
          lineHeight: 24,
          marginBottom: 20,
        }}
      >
        you leave it feels impossible. You may have left with nothing, nowhere
        to go, and no plan. The fear of the unknown feels bigger than the fear
        of going back. So you go back because the familiar, even when it's
        painful, feels safer than the uncertain.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        The second time
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#374151",
          lineHeight: 24,
          marginBottom: 20,
        }}
      >
        something specific pushed you out. Maybe it escalated. Maybe the
        children saw something they shouldn't have. You leave again but the
        promises come. The tears come. The person you fell in love with
        reappears just long enough to make you believe the change is real. You
        go back because you love who they could be, not who they are.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        The third time
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#374151",
          lineHeight: 24,
          marginBottom: 20,
        }}
      >
        you're starting to see the pattern but you're not ready to name it yet.
        You go back because you're not sure anyone will believe you. Because
        you're not sure you can make it financially. Because the kids are asking
        for their parent. Because you're exhausted and the fight to stay gone
        takes more energy than you have right now.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        The fourth time
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#374151",
          lineHeight: 24,
          marginBottom: 20,
        }}
      >
        something in you shifts. You start quietly making a plan. You go back
        but this time you're paying attention differently. You're watching.
        You're preparing. You're not back because you've given up. You're back
        because you're not ready yet and you know it.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        The fifth time
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#374151",
          lineHeight: 24,
          marginBottom: 20,
        }}
      >
        you leave with a little more than you had before. Maybe you've talked to
        an advocate. Maybe you've opened a separate bank account. Maybe you've
        told one person the truth. You go back but the grip is loosening. The
        illusion is harder to maintain. You're seeing more clearly now even when
        it's painful.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        The sixth time
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#374151",
          lineHeight: 24,
          marginBottom: 20,
        }}
      >
        feels different because you feel different. You've done some healing.
        You've had some distance. You know what you're returning to and part of
        you is already grieving it before you walk back through the door. You go
        back because leaving completely still feels like too much. But you're
        closer than you've ever been.
      </Text>

      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        The seventh time
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#374151",
          lineHeight: 24,
          marginBottom: 20,
        }}
      >
        you don't go back. Not because it suddenly became easy. But because
        something inside you finally decided that the pain of staying had become
        greater than the fear of leaving for good. You'd built enough, learned
        enough, and survived enough to take the step that this time would hold.
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: "#374151",
          lineHeight: 24,
          marginBottom: 20,
          marginTop: 20,
        }}
      >
        Every one of those times was part of the journey. Not a failure. Not a
        weakness. A process. And every person who has ever left an abusive
        situation for good went through their own version of it.
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#4A2D8F",
          lineHeight: 24,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        You are not behind. You are not broken. You are in your process. And
        your process is valid.
      </Text>
    </View>
  );
}
