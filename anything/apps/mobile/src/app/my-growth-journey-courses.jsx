import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, BookOpen, Lock } from "lucide-react-native";
import SafetyButtons from "@/components/SafetyButtons";
import useInAppPurchase from "@/utils/useInAppPurchase";

export default function MyGrowthJourneyCoursesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { hasShieldAccess, hasRiseAccess } = useInAppPurchase();

  const hasPaidAccess = hasShieldAccess || hasRiseAccess;

  const CourseCard = ({ number, title, subtitle, isLocked, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: isLocked ? "#F3F4F6" : "#F9FAFB",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: isLocked ? "#D1D5DB" : "#E5E7EB",
        opacity: isLocked ? 0.7 : 1,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: isLocked ? "#9CA3AF" : "#4A2D8F",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          {isLocked ? (
            <Lock color="white" size={20} />
          ) : (
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {number}
            </Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: isLocked ? "#6B7280" : "#1F2937",
              marginBottom: 8,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              lineHeight: 20,
            }}
          >
            {subtitle}
          </Text>
          {isLocked && (
            <View
              style={{
                backgroundColor: "#F0B429",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                alignSelf: "flex-start",
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Upgrade to Access
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <SafetyButtons />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#4A2D8F" size={24} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#4A2D8F",
            marginLeft: 12,
          }}
        >
          My Growth Journey
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#6B7280",
            lineHeight: 24,
            marginBottom: 30,
          }}
        >
          Eight courses designed exclusively for the Rebuilding path. These
          courses are built to help you reclaim your voice, build confidence,
          find peace, and step into your future.
        </Text>

        <View
          style={{
            backgroundColor: "#EDE9FE",
            padding: 16,
            borderRadius: 12,
            borderLeftWidth: 4,
            borderLeftColor: "#4A2D8F",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#4A2D8F",
              lineHeight: 22,
              fontWeight: "600",
            }}
          >
            These courses are separate from the main Healing to Freedom Journey.
            They are built specifically for those on the Rebuilding path.
          </Text>
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#4A2D8F",
            marginBottom: 15,
          }}
        >
          Available Courses
        </Text>

        {/* Course 1 - Always Free */}
        <CourseCard
          number={1}
          title="Rebuilding Your Relationship With Yourself"
          subtitle="Rebuilding — You Are A Warrior And You Are Rising"
          isLocked={false}
          onPress={() => router.push("/course/6")}
        />

        {/* Course 2 - Requires Paid Subscription */}
        <CourseCard
          number={2}
          title="Finding Your Voice Again"
          subtitle="Rebuilding — You Are A Warrior And You Are Rising"
          isLocked={!hasPaidAccess}
          onPress={() =>
            hasPaidAccess
              ? router.push("/course/7")
              : router.push("/(tabs)/upgrade")
          }
        />

        {/* Course 3 - Requires Paid Subscription */}
        <CourseCard
          number={3}
          title="Releasing Shame and Guilt"
          subtitle="Rebuilding — You Are A Warrior And You Are Rising"
          isLocked={!hasPaidAccess}
          onPress={() =>
            hasPaidAccess
              ? router.push("/course/8")
              : router.push("/(tabs)/upgrade")
          }
        />

        {/* Course 4 - Requires Paid Subscription */}
        <CourseCard
          number={4}
          title="Rediscovering Who You Are"
          subtitle="Rebuilding — You Are A Warrior And You Are Rising"
          isLocked={!hasPaidAccess}
          onPress={() =>
            hasPaidAccess
              ? router.push("/course/9")
              : router.push("/(tabs)/upgrade")
          }
        />

        {/* Course 5 - Requires Paid Subscription */}
        <CourseCard
          number={5}
          title="Building a Life You Choose"
          subtitle="Rebuilding — You Are A Warrior And You Are Rising"
          isLocked={!hasPaidAccess}
          onPress={() =>
            hasPaidAccess
              ? router.push("/course/10")
              : router.push("/(tabs)/upgrade")
          }
        />

        {/* Course 6 - Requires Paid Subscription */}
        <CourseCard
          number={6}
          title="Healthy Relationships Going Forward"
          subtitle="Rebuilding — You Are A Warrior And You Are Rising"
          isLocked={!hasPaidAccess}
          onPress={() =>
            hasPaidAccess
              ? router.push("/course/11")
              : router.push("/(tabs)/upgrade")
          }
        />

        {/* Course 7 - Requires Paid Subscription */}
        <CourseCard
          number={7}
          title="Forgiving Yourself"
          subtitle="Rebuilding — You Are A Warrior And You Are Rising"
          isLocked={!hasPaidAccess}
          onPress={() =>
            hasPaidAccess
              ? router.push("/course/12")
              : router.push("/(tabs)/upgrade")
          }
        />

        {/* Course 8 - Final Course - Requires Paid Subscription */}
        <CourseCard
          number={8}
          title="Your Transformation"
          subtitle="Rebuilding — You Are A Warrior And You Are Free"
          isLocked={!hasPaidAccess}
          onPress={() =>
            hasPaidAccess
              ? router.push("/course/13")
              : router.push("/(tabs)/upgrade")
          }
        />
      </ScrollView>
    </View>
  );
}
