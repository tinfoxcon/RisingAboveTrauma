import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import { CheckCircle } from "lucide-react-native";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import { ResourceCard } from "@/components/Resources/ResourceCard";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import {
  course1Content,
  course2Content,
  course3Content,
  course4Content,
  course5Content,
  course6Content,
  course7Content,
  course8Content,
  course9Content,
  course10Content,
  course11Content,
  course12Content,
  course13Content,
  course1Worksheet,
  course2Worksheet,
  course3Worksheet,
  course4Worksheet,
  course5Worksheet,
  course6Worksheet,
  course7Worksheet,
  course8Worksheet,
  course9Worksheet,
  course10Worksheet,
  course11Worksheet,
  course12Worksheet,
  course13Worksheet,
} from "@/data/course-content";

const courses = {
  1: {
    title: "Understanding What Happened To Me",
    subtitle: "Healing — You Are A Victim And That Is Okay",
  },
  2: {
    title: "Reclaiming My Identity",
    subtitle: "Clarity — You Are A Survivor And You Are Emerging",
  },
  3: {
    title: "Setting Boundaries That Hold",
    subtitle: "Strength — You Are A Warrior And You Are Growing",
  },
  4: { title: "Building My New Life", subtitle: "Rebuilding" },
  5: { title: "Leading My Own Life Again", subtitle: "Freedom" },
  6: {
    title: "Rebuilding Your Relationship With Yourself",
    subtitle: "Rebuilding — You Are A Warrior And You Are Rising",
  },
  7: {
    title: "Finding Your Voice Again",
    subtitle: "Rebuilding — You Are A Warrior And You Are Rising",
  },
  8: {
    title: "Releasing Shame and Guilt",
    subtitle: "Rebuilding — You Are A Warrior And You Are Rising",
  },
  9: {
    title: "Rediscovering Who You Are",
    subtitle: "Rebuilding — You Are A Warrior And You Are Rising",
  },
  10: {
    title: "Building a Life You Choose",
    subtitle: "Rebuilding — You Are A Warrior And You Are Rising",
  },
  11: {
    title: "Healthy Relationships Going Forward",
    subtitle: "Rebuilding — You Are A Warrior And You Are Rising",
  },
  12: {
    title: "Forgiving Yourself",
    subtitle: "Rebuilding — You Are A Warrior And You Are Rising",
  },
  13: {
    title: "Your Transformation",
    subtitle: "Rebuilding — You Are A Warrior And You Are Free",
  },
};

const courseLessons = {
  1: [
    "Naming What Happened",
    "Understanding the Cycle of Abuse",
    "Breaking Through Denial",
    "Releasing Shame",
    "Your First Step Toward Healing",
  ],
  2: [
    "Who Were You Before?",
    "How Abuse Rewrites Your Story",
    "Separating Their Voice From Yours",
    "Reclaiming Your Strengths",
    "Writing Your New Narrative",
  ],
  3: [
    "What Is A Real Boundary?",
    "Why Boundaries Feel Selfish",
    "How To Set A Boundary",
    "How To Hold A Boundary",
    "Boundaries With Children and Co-Parents",
  ],
  4: [
    "What Do You Actually Want?",
    "Building Financial Independence",
    "Creating a Safe Home",
    "New Routines and Rituals",
    "Making Peace with the Past",
  ],
  5: [
    "What Self-Leadership Means",
    "Rediscovering Joy",
    "Your Purpose Beyond Survival",
    "Healthy Relationships Going Forward",
    "This Is Where Your Intentional Life Begins",
  ],
  6: [
    "What Abuse Took From You",
    "Self Trust — Hearing Your Own Voice Again",
    "Self Worth — You Were Never The Problem",
    "Self Advocacy — Speaking Up For Yourself",
    "The Decision To Rebuild",
  ],
  7: [
    "Why Your Voice Went Quiet",
    "The Difference Between Silence and Peace",
    "Saying What You Mean Without Fear",
    "Setting the Record Straight With Yourself",
    "Your Voice Is Your Power",
  ],
  8: [
    "Understanding Where Shame Comes From",
    "The Difference Between Shame and Guilt",
    "What You're Carrying That Isn't Yours",
    "Forgiving Yourself For Surviving",
    "Putting Shame Down For Good",
  ],
  9: [
    "Who Were You Before?",
    "What Abuse Replaced",
    "Reclaiming Your Interests, Passions, and Joy",
    "Building a New Relationship With Your Body",
    "Introducing Yourself to Yourself Again",
  ],
  10: [
    "What It Means To Choose Your Own Life",
    "Making Decisions From a Place of Peace Not Fear",
    "Setting Goals That Belong to You",
    "Building Safety Into Your New Life",
    "The Life You Deserve Is Not a Reward It Is Your Right",
  ],
  11: [
    "What a Healthy Relationship Actually Feels Like",
    "Recognizing Red Flags Without Living in Fear",
    "Green Flags — What to Look For and Why They Matter",
    "Setting Boundaries Before You Need Them",
    "You Get to Choose Who Has Access to You",
  ],
  12: [
    "What Forgiveness Actually Means",
    "The Things You've Been Blaming Yourself For",
    "Survival Doesn't Always Look Pretty",
    "Releasing the Weight of What You Wish You'd Done Differently",
    "The Day You Decide You're Worth Forgiving",
  ],
  13: [
    "You Are Not Who The Abuse Said You Were",
    "What You Gained That No One Can Take",
    "The Person You Are Becoming",
    "Your Story Is Not Over",
    "Welcome to Your Transformation",
  ],
};

export default function LessonScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { courseId, lessonId } = useLocalSearchParams();
  const courseNum = parseInt(courseId);
  const lessonNum = parseInt(lessonId);
  const course = courses[courseNum];

  const [completed, setCompleted] = useState(false);
  const [worksheetAnswers, setWorksheetAnswers] = useState({});

  const handleComplete = async () => {
    try {
      const res = await fetchWithAuth("/api/courses/complete-lesson", {
        method: "POST",
        body: JSON.stringify({
          course_number: courseNum,
          lesson_number: lessonNum,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Lesson completion failed:", res.status, errData);
        return;
      }
      setCompleted(true);
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      console.error("Lesson completion error:", error);
    }
  };

  // Validate course exists
  if (!course) {
    return (
      <View
        style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
      >
        <StatusBar style="dark" />
        <SafetyButtons />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#E32626",
              marginBottom: 10,
            }}
          >
            Course Not Found
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#6E6480",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            This course doesn't exist. Please choose from courses 1-5.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: "#5B2CA0",
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Validate lesson number (1-5)
  if (!lessonNum || lessonNum < 1 || lessonNum > 5 || isNaN(lessonNum)) {
    return (
      <View
        style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
      >
        <StatusBar style="dark" />
        <SafetyButtons />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#E32626",
              marginBottom: 10,
            }}
          >
            Lesson Not Found
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#6E6480",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            This lesson doesn't exist. Each course has lessons 1-5.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: "#5B2CA0",
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const lessonTitle =
    courseLessons[courseNum]?.[lessonNum - 1] || "Lesson Content";

  // Get lesson content
  let lessonContent = null;
  if (courseNum === 1) {
    lessonContent = course1Content[lessonNum];
  } else if (courseNum === 2) {
    lessonContent = course2Content[lessonNum];
  } else if (courseNum === 3) {
    lessonContent = course3Content[lessonNum];
  } else if (courseNum === 4) {
    lessonContent = course4Content[lessonNum];
  } else if (courseNum === 5) {
    lessonContent = course5Content[lessonNum];
  } else if (courseNum === 6) {
    lessonContent = course6Content[lessonNum];
  } else if (courseNum === 7) {
    lessonContent = course7Content[lessonNum];
  } else if (courseNum === 8) {
    lessonContent = course8Content[lessonNum];
  } else if (courseNum === 9) {
    lessonContent = course9Content[lessonNum];
  } else if (courseNum === 10) {
    lessonContent = course10Content[lessonNum];
  } else if (courseNum === 11) {
    lessonContent = course11Content[lessonNum];
  } else if (courseNum === 12) {
    lessonContent = course12Content[lessonNum];
  } else if (courseNum === 13) {
    lessonContent = course13Content[lessonNum];
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <SafetyButtons />

      <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 120,
            paddingTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 20 }}
          >
            <Text style={{ fontSize: 16, color: "#5B2CA0", fontWeight: "600" }}>
              ← Back to Course
            </Text>
          </TouchableOpacity>

          <Text style={{ fontSize: 12, color: "#6E6480", marginBottom: 8 }}>
            Course {courseNum} • Lesson {lessonNum}
          </Text>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#2B2438",
              marginBottom: 10,
            }}
          >
            {lessonTitle}
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#6E6480",
              fontStyle: "italic",
              marginBottom: 30,
            }}
          >
            {course.subtitle}
          </Text>

          {/* Lesson Content */}
          {lessonContent ? (
            <View style={{ marginBottom: 20 }}>
              {lessonContent.content.map((item, index) => {
                if (typeof item === "string") {
                  return (
                    <Text
                      key={index}
                      style={{
                        fontSize: 16,
                        color: "#2B2438",
                        lineHeight: 26,
                        marginBottom: 20,
                      }}
                    >
                      {item}
                    </Text>
                  );
                } else if (item.type === "resource") {
                  return (
                    <ResourceCard
                      key={index}
                      title={item.title}
                      description={item.description}
                      url={item.url}
                      linkLabel={item.linkLabel}
                    />
                  );
                }
                return null;
              })}
            </View>
          ) : (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderWidth: 1,
                borderColor: "#D9D1E6",
                padding: 20,
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#2B2438",
                  fontWeight: "600",
                  marginBottom: 15,
                }}
              >
                Lesson Content
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6E6480",
                  lineHeight: 24,
                  marginBottom: 15,
                }}
              >
                This lesson explores {lessonTitle.toLowerCase()}. You'll learn
                practical tools and insights to support your journey toward{" "}
                {course.subtitle.toLowerCase()}.
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6E6480",
                  lineHeight: 24,
                  marginBottom: 15,
                }}
              >
                Key topics covered:{"\n"}• Understanding your experience{"\n"}•
                Recognizing patterns{"\n"}• Building self-awareness{"\n"}•
                Practical strategies for moving forward
              </Text>
            </View>
          )}

          {/* Worksheet - Course-specific questions with actual input fields */}
          {(() => {
            let worksheetQuestions = null;
            if (courseNum === 1) worksheetQuestions = course1Worksheet;
            else if (courseNum === 2) worksheetQuestions = course2Worksheet;
            else if (courseNum === 3) worksheetQuestions = course3Worksheet;
            else if (courseNum === 4) worksheetQuestions = course4Worksheet;
            else if (courseNum === 5) worksheetQuestions = course5Worksheet;
            else if (courseNum === 6) worksheetQuestions = course6Worksheet;
            else if (courseNum === 7) worksheetQuestions = course7Worksheet;
            else if (courseNum === 8) worksheetQuestions = course8Worksheet;
            else if (courseNum === 9) worksheetQuestions = course9Worksheet;
            else if (courseNum === 10) worksheetQuestions = course10Worksheet;
            else if (courseNum === 11) worksheetQuestions = course11Worksheet;
            else if (courseNum === 12) worksheetQuestions = course12Worksheet;
            else if (courseNum === 13) worksheetQuestions = course13Worksheet;

            if (!worksheetQuestions) return null;

            return (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#D9D1E6",
                  padding: 20,
                  borderRadius: 12,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#2B2438",
                    fontWeight: "600",
                    marginBottom: 10,
                  }}
                >
                  Fill-in-the-Blank Worksheet
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#6E6480",
                    marginBottom: 20,
                    lineHeight: 20,
                  }}
                >
                  These questions are for your personal reflection. Your answers
                  are private and help you process what you've learned.
                </Text>
                {worksheetQuestions.map((question, index) => (
                  <View key={index} style={{ marginBottom: 20 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#2B2438",
                        lineHeight: 22,
                        marginBottom: 8,
                        fontWeight: "500",
                      }}
                    >
                      {index + 1}. {question}
                    </Text>
                    <TextInput
                      value={worksheetAnswers[index] || ""}
                      onChangeText={(text) =>
                        setWorksheetAnswers((prev) => ({
                          ...prev,
                          [index]: text,
                        }))
                      }
                      placeholder="Type your answer here..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderWidth: 1,
                        borderColor: "#D9D1E6",
                        borderRadius: 8,
                        padding: 12,
                        fontSize: 15,
                        color: "#2B2438",
                        minHeight: 80,
                      }}
                    />
                  </View>
                ))}
              </View>
            );
          })()}

          {completed && (
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <CheckCircle color="#22C55E" size={48} />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#22C55E",
                  marginTop: 10,
                }}
              >
                Lesson Completed!
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingAnimatedView>

      {/* Complete Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 20,
          paddingBottom: insets.bottom + 20,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#D9D1E6",
        }}
      >
        <Text
          style={{
            fontSize: 9,
            color: "#D9A62B",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          © 2026 Dr. Mildred D. Muhammad, D.Hum · My F.O.C.U.S. LLC · All Rights
          Reserved
        </Text>
        <TouchableOpacity
          onPress={handleComplete}
          disabled={completed}
          style={{
            backgroundColor: completed ? "#22C55E" : "#5B2CA0",
            paddingVertical: 16,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            {completed ? "Completed ✓" : "Mark as Complete"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
