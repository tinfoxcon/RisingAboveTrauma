import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import { Lock, Play, CheckCircle, Award } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

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
  4: {
    title: "Building My New Life",
    subtitle: "Rebuilding — You Are A Thriver And You Are Building",
  },
  5: {
    title: "Leading My Own Life Again",
    subtitle: "Freedom — You Are A Leader And You Are Free",
  },
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
    { number: 1, title: "Naming What Happened", duration: "20 min" },
    {
      number: 2,
      title: "Understanding the Cycle of Abuse",
      duration: "25 min",
    },
    { number: 3, title: "Breaking Through Denial", duration: "30 min" },
    { number: 4, title: "Releasing Shame", duration: "25 min" },
    { number: 5, title: "Your First Step Toward Healing", duration: "20 min" },
  ],
  2: [
    { number: 1, title: "Who Were You Before?", duration: "20 min" },
    { number: 2, title: "How Abuse Rewrites Your Story", duration: "25 min" },
    {
      number: 3,
      title: "Separating Their Voice From Yours",
      duration: "30 min",
    },
    { number: 4, title: "Reclaiming Your Strengths", duration: "25 min" },
    { number: 5, title: "Writing Your New Narrative", duration: "20 min" },
  ],
  3: [
    {
      number: 1,
      title: "What Is A Real Boundary?",
      duration: "20 min",
    },
    { number: 2, title: "Why Boundaries Feel Selfish", duration: "25 min" },
    { number: 3, title: "How To Set A Boundary", duration: "30 min" },
    {
      number: 4,
      title: "How To Hold A Boundary",
      duration: "25 min",
    },
    {
      number: 5,
      title: "Boundaries With Children and Co-Parents",
      duration: "20 min",
    },
  ],
  4: [
    { number: 1, title: "Safe Housing and Shelter", duration: "20 min" },
    { number: 2, title: "Financial Independence", duration: "25 min" },
    { number: 3, title: "Co-Parenting After Abuse", duration: "30 min" },
    {
      number: 4,
      title: "Legal Protection and Your Rights",
      duration: "25 min",
    },
    { number: 5, title: "Building Your Community", duration: "20 min" },
  ],
  5: [
    { number: 1, title: "What Self-Leadership Means", duration: "20 min" },
    { number: 2, title: "Rediscovering Joy", duration: "25 min" },
    { number: 3, title: "Your Purpose Beyond Survival", duration: "30 min" },
    {
      number: 4,
      title: "Healthy Relationships Going Forward",
      duration: "25 min",
    },
    {
      number: 5,
      title: "This Is Where Your Intentional Life Begins",
      duration: "20 min",
    },
  ],
  6: [
    { number: 1, title: "What Abuse Took From You", duration: "20 min" },
    {
      number: 2,
      title: "Self Trust — Hearing Your Own Voice Again",
      duration: "25 min",
    },
    {
      number: 3,
      title: "Self Worth — You Were Never The Problem",
      duration: "25 min",
    },
    {
      number: 4,
      title: "Self Advocacy — Speaking Up For Yourself",
      duration: "25 min",
    },
    { number: 5, title: "The Decision To Rebuild", duration: "20 min" },
  ],
  7: [
    { number: 1, title: "Why Your Voice Went Quiet", duration: "20 min" },
    {
      number: 2,
      title: "The Difference Between Silence and Peace",
      duration: "25 min",
    },
    {
      number: 3,
      title: "Saying What You Mean Without Fear",
      duration: "25 min",
    },
    {
      number: 4,
      title: "Setting the Record Straight With Yourself",
      duration: "25 min",
    },
    { number: 5, title: "Your Voice Is Your Power", duration: "20 min" },
  ],
  8: [
    {
      number: 1,
      title: "Understanding Where Shame Comes From",
      duration: "20 min",
    },
    {
      number: 2,
      title: "The Difference Between Shame and Guilt",
      duration: "25 min",
    },
    {
      number: 3,
      title: "What You're Carrying That Isn't Yours",
      duration: "25 min",
    },
    {
      number: 4,
      title: "Forgiving Yourself For Surviving",
      duration: "30 min",
    },
    { number: 5, title: "Putting Shame Down For Good", duration: "20 min" },
  ],
  9: [
    { number: 1, title: "Who Were You Before?", duration: "20 min" },
    { number: 2, title: "What Abuse Replaced", duration: "25 min" },
    {
      number: 3,
      title: "Reclaiming Your Interests, Passions, and Joy",
      duration: "25 min",
    },
    {
      number: 4,
      title: "Building a New Relationship With Your Body",
      duration: "25 min",
    },
    {
      number: 5,
      title: "Introducing Yourself to Yourself Again",
      duration: "20 min",
    },
  ],
  10: [
    {
      number: 1,
      title: "What It Means To Choose Your Own Life",
      duration: "20 min",
    },
    {
      number: 2,
      title: "Making Decisions From a Place of Peace Not Fear",
      duration: "25 min",
    },
    {
      number: 3,
      title: "Setting Goals That Belong to You",
      duration: "25 min",
    },
    {
      number: 4,
      title: "Building Safety Into Your New Life",
      duration: "25 min",
    },
    {
      number: 5,
      title: "The Life You Deserve Is Not a Reward It Is Your Right",
      duration: "20 min",
    },
  ],
  11: [
    {
      number: 1,
      title: "What a Healthy Relationship Actually Feels Like",
      duration: "20 min",
    },
    {
      number: 2,
      title: "Recognizing Red Flags Without Living in Fear",
      duration: "25 min",
    },
    {
      number: 3,
      title: "Green Flags — What to Look For and Why They Matter",
      duration: "25 min",
    },
    {
      number: 4,
      title: "Setting Boundaries Before You Need Them",
      duration: "25 min",
    },
    {
      number: 5,
      title: "You Get to Choose Who Has Access to You",
      duration: "20 min",
    },
  ],
  12: [
    { number: 1, title: "What Forgiveness Actually Means", duration: "20 min" },
    {
      number: 2,
      title: "The Things You've Been Blaming Yourself For",
      duration: "25 min",
    },
    {
      number: 3,
      title: "Survival Doesn't Always Look Pretty",
      duration: "25 min",
    },
    {
      number: 4,
      title: "Releasing the Weight of What You Wish You'd Done Differently",
      duration: "30 min",
    },
    {
      number: 5,
      title: "The Day You Decide You're Worth Forgiving",
      duration: "20 min",
    },
  ],
  13: [
    {
      number: 1,
      title: "You Are Not Who The Abuse Said You Were",
      duration: "20 min",
    },
    {
      number: 2,
      title: "What You Gained That No One Can Take",
      duration: "25 min",
    },
    { number: 3, title: "The Person You Are Becoming", duration: "25 min" },
    { number: 4, title: "Your Story Is Not Over", duration: "25 min" },
    { number: 5, title: "Welcome to Your Transformation", duration: "30 min" },
  ],
};

export default function CourseScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { courseId } = useLocalSearchParams();
  const courseNum = parseInt(courseId);
  const course = courses[courseNum];

  const [progress, setProgress] = useState([]);

  const loadProgress = useCallback(async () => {
    if (!course) return;
    try {
      const res = await fetchWithAuth(
        `/api/courses/progress?course=${courseNum}`,
      );
      if (!res.ok) {
        console.error("Failed to load progress:", res.status);
        return;
      }
      const data = await res.json();
      setProgress(data?.lessons || []);
    } catch (err) {
      console.error("Progress fetch error:", err);
    }
  }, [courseNum, course]);

  // Re-fetch every time this screen comes into focus (e.g. returning from lesson)
  useFocusEffect(loadProgress);

  // Handle invalid course ID
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
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#E32626",
              marginBottom: 10,
            }}
          >
            Course Not Found
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6E6480",
              marginBottom: 30,
              textAlign: "center",
            }}
          >
            This course doesn't exist. Please choose from courses 1-5.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              backgroundColor: "#5B2CA0",
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              ← Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const lessons = courseLessons[courseNum] || courseLessons[1];

  const isLessonCompleted = (lessonNum) => {
    return progress.some((p) => p.lesson_number === lessonNum && p.completed);
  };

  const canAccessLesson = (lessonNum) => {
    if (lessonNum === 1) return true;
    return isLessonCompleted(lessonNum - 1);
  };

  const allLessonsComplete = lessons.every((l) => isLessonCompleted(l.number));
  const quizPassed = progress.some((p) => p.quiz_passed);

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <SafetyButtons />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
          paddingTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 20 }}
        >
          <Text style={{ fontSize: 16, color: "#5B2CA0", fontWeight: "600" }}>
            ← Back
          </Text>
        </TouchableOpacity>

        {/* Course Header */}
        <LinearGradient
          colors={["#5B2CA0", "#D9A62B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 20, borderRadius: 12, marginBottom: 30 }}
        >
          <Text
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.8)",
              marginBottom: 8,
            }}
          >
            Course {courseNum}
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "white",
              marginBottom: 8,
            }}
          >
            {course.title}
          </Text>
          <Text style={{ fontSize: 18, color: "#D9A62B", fontStyle: "italic" }}>
            {course.subtitle}
          </Text>
        </LinearGradient>

        {/* Disclaimer */}
        <Text
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            marginBottom: 24,
            lineHeight: 18,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          This content is for educational and informational purposes only and
          does not replace professional legal, medical, or therapeutic advice.
        </Text>

        {/* Lessons */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#2B2438",
            marginBottom: 15,
          }}
        >
          Lessons
        </Text>

        {lessons.map((lesson) => {
          const completed = isLessonCompleted(lesson.number);
          const canAccess = canAccessLesson(lesson.number);

          return (
            <TouchableOpacity
              key={lesson.number}
              disabled={!canAccess}
              onPress={() =>
                router.push(`/course/${courseNum}/lesson/${lesson.number}`)
              }
              style={{
                backgroundColor: completed ? "#F0FDF4" : "#FDF6E3",
                borderWidth: 1,
                borderColor: completed ? "#22C55E" : "#D9D1E6",
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                opacity: canAccess ? 1 : 0.5,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: completed
                      ? "#22C55E"
                      : canAccess
                        ? "#5B2CA0"
                        : "#D1D5DB",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  {completed ? (
                    <CheckCircle color="white" size={20} />
                  ) : canAccess ? (
                    <Play color="white" size={18} />
                  ) : (
                    <Lock color="white" size={18} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#2B2438",
                      marginBottom: 4,
                    }}
                  >
                    Lesson {lesson.number}: {lesson.title}
                  </Text>
                  <Text style={{ fontSize: 13, color: "#6E6480" }}>
                    {lesson.duration} •{" "}
                    {completed
                      ? "Completed"
                      : canAccess
                        ? "Available"
                        : "Locked"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Quiz */}
        {allLessonsComplete && (
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#2B2438",
                marginBottom: 15,
              }}
            >
              Final Quiz
            </Text>
            <TouchableOpacity
              onPress={() => router.push(`/course/${courseNum}/quiz`)}
              style={{
                backgroundColor: quizPassed ? "#F0FDF4" : "#5B2CA0",
                borderWidth: quizPassed ? 1 : 0,
                borderColor: "#22C55E",
                padding: 20,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: quizPassed ? "#2B2438" : "white",
                    marginBottom: 4,
                  }}
                >
                  {quizPassed ? "Quiz Passed ✓" : "Take Quiz"}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: quizPassed ? "#6E6480" : "rgba(255,255,255,0.9)",
                  }}
                >
                  3 questions • Pass all 3 to unlock certificate
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Certificate */}
        {quizPassed && (
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#2B2438",
                marginBottom: 15,
              }}
            >
              Certificate
            </Text>
            <TouchableOpacity
              onPress={() => router.push(`/course/${courseNum}/certificate`)}
              style={{
                backgroundColor: "#D9A62B",
                padding: 20,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Award color="white" size={24} style={{ marginRight: 12 }} />
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "white" }}
              >
                View Certificate
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Next Course Button - only show if quiz passed and not course 5 */}
        {quizPassed && courseNum < 5 && (
          <TouchableOpacity
            onPress={() => router.push(`/course/${courseNum + 1}`)}
            style={{
              marginTop: 12,
              borderWidth: 2,
              borderColor: "#5B2CA0",
              backgroundColor: "#FDF6E3",
              padding: 20,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#5B2CA0" }}
            >
              Start Course {courseNum + 1} →
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
