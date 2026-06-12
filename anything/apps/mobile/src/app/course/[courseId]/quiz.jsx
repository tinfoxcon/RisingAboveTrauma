import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import SafetyButtons from "@/components/SafetyButtons";
import { CheckCircle, XCircle, Award } from "lucide-react-native";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

const quizQuestions = {
  1: [
    {
      question:
        "What is the most important first step in understanding what happened?",
      options: [
        "Blaming yourself for not leaving sooner",
        "Recognizing that abuse is never your fault",
        "Trying to fix the relationship",
      ],
      correct: 1,
    },
    {
      question: "Which statement is true about domestic violence?",
      options: [
        "It only involves physical abuse",
        "It follows a pattern and often escalates",
        "It happens equally in all relationships",
      ],
      correct: 1,
    },
    {
      question: "What should you prioritize when healing?",
      options: [
        "Your safety and wellbeing",
        "What others think you should do",
        "Getting back to normal quickly",
      ],
      correct: 0,
    },
  ],
  2: [
    {
      question: "What is the first step in reclaiming your identity?",
      options: [
        "Becoming who others want you to be",
        "Remembering who you were before the abuse",
        "Forgetting everything that happened",
      ],
      correct: 1,
    },
    {
      question: "Your core values are:",
      options: [
        "What you believe is important and guides your choices",
        "Things you should change to please others",
        "Not important during recovery",
      ],
      correct: 0,
    },
    {
      question: "Rediscovering your voice means:",
      options: [
        "Being louder than everyone else",
        "Expressing your thoughts and feelings honestly",
        "Always agreeing with others",
      ],
      correct: 1,
    },
  ],
  3: [
    {
      question: "What are boundaries?",
      options: [
        "Ways to control other people",
        "Limits you set to protect your wellbeing",
        "Signs of weakness",
      ],
      correct: 1,
    },
    {
      question: "Setting boundaries is about:",
      options: [
        "Being selfish and mean",
        "Protecting yourself and your peace",
        "Making others uncomfortable on purpose",
      ],
      correct: 1,
    },
    {
      question: "When people push back against your boundaries, you should:",
      options: [
        "Give in to keep the peace",
        "Hold firm and reinforce your limits",
        "Apologize for having boundaries",
      ],
      correct: 1,
    },
  ],
  4: [
    {
      question: "Building a new life starts with:",
      options: [
        "Knowing what you actually want for yourself",
        "Doing what others expect of you",
        "Rushing to move on quickly",
      ],
      correct: 0,
    },
    {
      question: "Financial independence means:",
      options: [
        "Being wealthy",
        "Having control over your own money and choices",
        "Never accepting help from anyone",
      ],
      correct: 1,
    },
    {
      question: "Making peace with the past involves:",
      options: [
        "Forgetting everything that happened",
        "Accepting what happened while choosing to move forward",
        "Staying angry forever",
      ],
      correct: 1,
    },
  ],
  5: [
    {
      question: "Self-leadership means:",
      options: [
        "Controlling everyone around you",
        "Taking ownership of your life and choices",
        "Never asking for help",
      ],
      correct: 1,
    },
    {
      question: "Rediscovering joy is:",
      options: [
        "Something you have to earn",
        "Only possible after everything is perfect",
        "Your right, starting right now",
      ],
      correct: 2,
    },
    {
      question: "Your purpose beyond survival is about:",
      options: [
        "Living intentionally and creating the life you want",
        "Just getting through each day",
        "Proving something to others",
      ],
      correct: 0,
    },
  ],
  6: [
    {
      question: "Self trust was silenced because:",
      options: [
        "You were weak or not paying attention",
        "It was a deliberate survival mechanism in an unsafe situation",
        "You didn't know what you were doing",
      ],
      correct: 1,
    },
    {
      question: "Self worth is based on:",
      options: [
        "What you do and how well you perform",
        "The fact that you exist and matter",
        "What others think of you",
      ],
      correct: 1,
    },
    {
      question: "Self advocacy means:",
      options: [
        "Being aggressive and confrontational",
        "Speaking up for your needs, rights, and truth clearly",
        "Always putting others first",
      ],
      correct: 1,
    },
  ],
  7: [
    {
      question: "Your voice went quiet because:",
      options: [
        "You were weak or didn't have anything to say",
        "Your nervous system learned silence kept you safer",
        "You chose to stop talking",
      ],
      correct: 1,
    },
    {
      question: "The difference between peace and survival silence is:",
      options: [
        "There is no difference, silence is always good",
        "Peace is chosen and restores you, survival silence is imposed and depletes you",
        "Peace is louder than survival silence",
      ],
      correct: 1,
    },
    {
      question: "Your voice is your power because:",
      options: [
        "It lets you control other people",
        "It's the full expression of who you are and what you stand for",
        "It makes you louder than everyone else",
      ],
      correct: 1,
    },
  ],
  8: [
    {
      question: "Shame was planted in you:",
      options: [
        "Because you deserved it",
        "By accident, it just happens",
        "Deliberately as a tool of control and abuse",
      ],
      correct: 2,
    },
    {
      question: "The difference between shame and guilt is:",
      options: [
        "Guilt says I did something bad, shame says I am bad",
        "They are the same thing",
        "Guilt is worse than shame",
      ],
      correct: 0,
    },
    {
      question: "Forgiving yourself for surviving means:",
      options: [
        "Pretending nothing happened",
        "Releasing the weight of survival guilt and accepting you did your best",
        "Forgetting everything and moving on immediately",
      ],
      correct: 1,
    },
  ],
  9: [
    {
      question: "The person you were before the abuse:",
      options: [
        "Is lost forever and can never be recovered",
        "Went underground and can be found again",
        "Was weak and shouldn't be recovered",
      ],
      correct: 1,
    },
    {
      question: "Abuse replaced your joy with:",
      options: [
        "Anger and bitterness",
        "Relief (the absence of pain)",
        "Complete numbness forever",
      ],
      correct: 1,
    },
    {
      question: "Rebuilding your relationship with your body starts with:",
      options: [
        "Loving it immediately and completely",
        "Small acts of care and basic kindness",
        "Changing how it looks",
      ],
      correct: 1,
    },
  ],
  10: [
    {
      question: "Choosing your own life means:",
      options: [
        "Making decisions to avoid conflict",
        "Decisions driven by what you actually want, value, and need",
        "Always doing what's expected of you",
      ],
      correct: 1,
    },
    {
      question: "Peace-based decision making asks:",
      options: [
        "Will this keep me safe from someone else's reaction?",
        "What's the least risky option?",
        "Does this align with what I actually want and need?",
      ],
      correct: 2,
    },
    {
      question: "The life you deserve is:",
      options: [
        "A reward you earn after healing completely",
        "Your right simply because you exist",
        "Something only other people get to have",
      ],
      correct: 1,
    },
  ],
  11: [
    {
      question: "A healthy relationship feels safe because:",
      options: [
        "There is never any conflict or disagreement",
        "You can disagree, express needs, and have bad days without fear of consequences",
        "The other person never gets upset or frustrated",
      ],
      correct: 1,
    },
    {
      question: "Which of these is a red flag in a relationship?",
      options: [
        "Someone who respects your boundaries and gives you space",
        "Someone who pushes for commitment very early and isolates you from friends and family",
        "Someone who apologizes sincerely when they're wrong",
      ],
      correct: 1,
    },
    {
      question: "Green flags in a healthy relationship include:",
      options: [
        "They respect your no, celebrate your growth, and take accountability when wrong",
        "They always agree with you to avoid conflict",
        "They need constant reassurance and attention",
      ],
      correct: 0,
    },
  ],
  12: [
    {
      question: "Forgiveness is:",
      options: [
        "Saying what happened was okay and excusing the abuser",
        "The decision to stop letting what happened continue to cost you",
        "Something you do for the person who hurt you",
      ],
      correct: 1,
    },
    {
      question: "You blame yourself for staying, but the truth is:",
      options: [
        "You were weak and made bad choices",
        "You stayed for reasons that made sense given what you knew and had at the time",
        "You should have left sooner no matter what",
      ],
      correct: 1,
    },
    {
      question: "Deciding you're worth forgiving means:",
      options: [
        "You've arrived at a perfect place with no more work to do",
        "You're choosing to stop punishing yourself for being human in an inhuman situation",
        "You're letting yourself off the hook and avoiding accountability",
      ],
      correct: 1,
    },
  ],
  13: [
    {
      question: "The truth about who you are is:",
      options: [
        "You are who the abuse said you were",
        "You are damaged and broken beyond repair",
        "You are not who the abuse said you were — you are forged, not damaged",
      ],
      correct: 2,
    },
    {
      question: "What you gained through this journey includes:",
      options: [
        "Only pain and trauma that can never be used for good",
        "Discernment, resilience, empathy, clarity, and your own voice",
        "Nothing — abuse only takes, it never gives anything worthwhile",
      ],
      correct: 1,
    },
    {
      question: "Your story after abuse is:",
      options: [
        "Over — survival is the end of your story",
        "Still being written with wisdom, purpose, and the freedom to choose your life",
        "Defined only by what happened to you, not what you did after",
      ],
      correct: 1,
    },
  ],
};

const courses = {
  1: {
    title: "Understanding What Happened To Me",
    subtitle: "Healing — You Are A Victim And That Is Okay",
  },
  2: { title: "Reclaiming My Identity", subtitle: "Clarity" },
  3: { title: "Setting Boundaries That Hold", subtitle: "Strength" },
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

export default function CourseQuizScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { courseId } = useLocalSearchParams();
  const courseNum = parseInt(courseId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  // Validate course exists (after all hooks)
  const course = courses[courseNum];
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

  const questions = quizQuestions[courseNum] || quizQuestions[1];

  const handleSelectAnswer = (questionIndex, optionIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: optionIndex });
  };

  const handleSubmit = async () => {
    const correctCount = questions.filter(
      (q, i) => selectedAnswers[i] === q.correct,
    ).length;
    const passed = correctCount === questions.length;

    if (passed) {
      // Save quiz pass to database
      try {
        await fetchWithAuth("/api/courses/complete-quiz", {
          method: "POST",
          body: JSON.stringify({ course_number: courseNum }),
        });
        setQuizPassed(true);
        setShowResults(true);
      } catch (error) {
        console.error("Quiz save error:", error);
      }
    } else {
      setQuizPassed(false);
      setShowResults(true);
    }
  };

  if (showResults) {
    const correctCount = questions.filter(
      (q, i) => selectedAnswers[i] === q.correct,
    ).length;

    if (quizPassed) {
      // Pass results - automatically navigate to certificate
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#F3F0F8",
            paddingTop: insets.top,
          }}
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
            <View
              style={{ alignItems: "center", marginTop: 40, marginBottom: 40 }}
            >
              <CheckCircle color="#22C55E" size={64} />
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  color: "#22C55E",
                  marginTop: 20,
                  marginBottom: 10,
                }}
              >
                Perfect Score!
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: "#2B2438",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                {correctCount} of {questions.length} Correct
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#6E6480",
                  textAlign: "center",
                  lineHeight: 24,
                }}
              >
                You've unlocked your certificate of completion!
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push(`/course/${courseNum}/certificate`)}
              style={{
                backgroundColor: "#D9A62B",
                paddingVertical: 16,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Award color="white" size={20} style={{ marginRight: 8 }} />
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                View Certificate
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }

    // Fail results
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
          <View
            style={{ alignItems: "center", marginTop: 40, marginBottom: 40 }}
          >
            <XCircle color="#E32626" size={64} />
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#2B2438",
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              {correctCount} of {questions.length} Correct
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#6E6480",
                textAlign: "center",
                lineHeight: 24,
                paddingHorizontal: 20,
              }}
            >
              You need all {questions.length} correct to unlock the certificate.
              Review the lessons and try again when you're ready. You've got
              this! 💜
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setShowResults(false);
              setSelectedAnswers({});
              setCurrentQuestion(0);
              setQuizPassed(false);
            }}
            style={{
              backgroundColor: "#5B2CA0",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Try Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              borderWidth: 2,
              borderColor: "#5B2CA0",
              backgroundColor: "#FFFFFF",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text
              style={{ color: "#5B2CA0", fontSize: 16, fontWeight: "bold" }}
            >
              Review Lessons
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const question = questions[currentQuestion];
  const hasAnswered = selectedAnswers[currentQuestion] !== undefined;
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <SafetyButtons />

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
            ← Back
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 14, color: "#6E6480", marginBottom: 10 }}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>

        {/* Progress Bar */}
        <View style={{ flexDirection: "row", marginBottom: 30 }}>
          {questions.map((_, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                height: 4,
                backgroundColor:
                  index <= currentQuestion ? "#5B2CA0" : "#D9D1E6",
                marginRight: index < questions.length - 1 ? 4 : 0,
                borderRadius: 2,
              }}
            />
          ))}
        </View>

        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#2B2438",
            marginBottom: 30,
            lineHeight: 32,
          }}
        >
          {question.question}
        </Text>

        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSelectAnswer(currentQuestion, index)}
            style={{
              backgroundColor:
                selectedAnswers[currentQuestion] === index
                  ? "#5B2CA0"
                  : "#FFFFFF",
              borderWidth: 2,
              borderColor:
                selectedAnswers[currentQuestion] === index
                  ? "#5B2CA0"
                  : "#D9D1E6",
              padding: 20,
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color:
                  selectedAnswers[currentQuestion] === index
                    ? "white"
                    : "#2B2438",
                lineHeight: 24,
              }}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Navigation */}
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
        {isLastQuestion ? (
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!hasAnswered}
            style={{
              backgroundColor: hasAnswered ? "#5B2CA0" : "#D1D5DB",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Submit Quiz
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={!hasAnswered}
            style={{
              backgroundColor: hasAnswered ? "#5B2CA0" : "#D1D5DB",
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Next Question
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
