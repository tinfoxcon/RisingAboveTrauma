import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

export default function YourNextChapterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ flex: 1, backgroundColor: "#4A2D8F", paddingTop: insets.top }}
    >
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: "#4A2D8F",
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 12 }}
          >
            <Text style={{ fontSize: 16, color: "#F0B429", fontWeight: "600" }}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#F0B429",
              textAlign: "center",
            }}
          >
            Your Next Chapter
          </Text>
        </View>

        {/* Dr. Muhammad's Message */}
        <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
          <LinearGradient
            colors={["#4A2D8F", "#F0B429"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 24,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "white",
                lineHeight: 24,
                marginBottom: 18,
              }}
            >
              You made it. What happened to you was not your fault, and you
              survived it. This part of your journey is about reclaiming what
              abuse tried to take from you: your voice, your confidence, your
              peace, and your future. You are not starting over. You are
              starting from what you now know.
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "white",
                lineHeight: 24,
                marginBottom: 18,
              }}
            >
              Those four words, voice, confidence, peace, and future, are in the
              right order. Voice comes first because that is often what abuse
              tries to silence first. Confidence follows. Then peace. And from
              there, the future begins to open up.
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "white",
                lineHeight: 24,
                marginBottom: 18,
              }}
            >
              That is not just a welcome message. It is a roadmap of recovery in
              one sentence.
            </Text>

            <View
              style={{
                backgroundColor: "#F0B429",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                alignSelf: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#4A2D8F",
                  fontWeight: "600",
                }}
              >
                Dr. Mildred D. Muhammad, D.Hum
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Fast Access Buttons */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
              marginBottom: 15,
            }}
          >
            Fast Access
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {/* Calm & Breathe */}
            <TouchableOpacity
              onPress={() => router.push("/calm")}
              style={{
                width: "48%",
                backgroundColor: "#F0B429",
                padding: 16,
                paddingVertical: 24,
                borderRadius: 12,
                marginBottom: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 48 }}>🫧</Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#4A2D8F",
                  fontWeight: "700",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                Calm & Breathe
              </Text>
            </TouchableOpacity>

            {/* Daily Affirmation */}
            <TouchableOpacity
              onPress={() => router.push("/calm")}
              style={{
                width: "48%",
                backgroundColor: "#F0B429",
                padding: 16,
                paddingVertical: 24,
                borderRadius: 12,
                marginBottom: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 48 }}>💛</Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#4A2D8F",
                  fontWeight: "700",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                Daily Affirmation
              </Text>
            </TouchableOpacity>

            {/* Find Help Near Me */}
            <TouchableOpacity
              onPress={() => Linking.openURL("https://findhelp.org")}
              style={{
                width: "48%",
                backgroundColor: "#F0B429",
                padding: 16,
                paddingVertical: 24,
                borderRadius: 12,
                marginBottom: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 48 }}>📍</Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#4A2D8F",
                  fontWeight: "700",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                Find Help Near Me
              </Text>
            </TouchableOpacity>

            {/* Growth Tracker */}
            <TouchableOpacity
              onPress={() => router.push("/growth-tracker")}
              style={{
                width: "48%",
                backgroundColor: "#F0B429",
                padding: 16,
                paddingVertical: 24,
                borderRadius: 12,
                marginBottom: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 48 }}>🌟</Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#4A2D8F",
                  fontWeight: "700",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                Growth Tracker
              </Text>
            </TouchableOpacity>

            {/* Growth Tracker History */}
            <TouchableOpacity
              onPress={() => router.push("/growth-tracker-history")}
              style={{
                width: "48%",
                backgroundColor: "#F0B429",
                padding: 16,
                paddingVertical: 24,
                borderRadius: 12,
                marginBottom: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 48 }}>📋</Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#4A2D8F",
                  fontWeight: "700",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                Growth Tracker History
              </Text>
            </TouchableOpacity>

            {/* My Growth Journal */}
            <TouchableOpacity
              onPress={() => router.push("/clarity-journal-history")}
              style={{
                width: "48%",
                backgroundColor: "#F0B429",
                padding: 16,
                paddingVertical: 24,
                borderRadius: 12,
                marginBottom: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 48 }}>📓</Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#4A2D8F",
                  fontWeight: "700",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                My Growth Journal
              </Text>
            </TouchableOpacity>

            {/* My Growth Journey Courses */}
            <TouchableOpacity
              onPress={() => router.push("/my-growth-journey-courses")}
              style={{
                width: "48%",
                backgroundColor: "#F0B429",
                padding: 16,
                paddingVertical: 24,
                borderRadius: 12,
                marginBottom: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 48 }}>📚</Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#4A2D8F",
                  fontWeight: "700",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                My Growth Journey Courses
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
