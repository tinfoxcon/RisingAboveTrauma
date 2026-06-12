import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ChevronLeft, ChevronRight, Shuffle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import SafetyButtons from "@/components/SafetyButtons";

const affirmations = [
  "I am worthy of safety and peace.",
  "My feelings are valid.",
  "I am stronger than I know.",
  "I deserve to be treated with respect.",
  "This is not my fault.",
  "I am doing the best I can.",
  "I have the right to say no.",
  "I trust myself.",
  "I am brave for seeking help.",
  "My voice matters.",
  "I deserve love and kindness.",
  "I am not alone.",
  "I can take this one day at a time.",
  "I am rebuilding my life.",
  "I choose healing.",
  "I am in control of my choices.",
  "I am enough.",
  "I deserve a life free from fear.",
  "I am reclaiming my power.",
  "I am proud of how far I've come.",
  "I deserve support.",
  "I am worthy of a fresh start.",
  "I can set boundaries.",
  "I am courageous.",
  "I am creating a better future.",
];

export default function CalmScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState("inhale"); // inhale, hold, exhale, pause
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? affirmations.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === affirmations.length - 1 ? 0 : prev + 1,
    );
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setCurrentIndex(randomIndex);
  };

  useEffect(() => {
    if (showBreathing) {
      const breathCycle = () => {
        // Inhale (4 seconds)
        setBreathPhase("inhale");
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 4000,
          useNativeDriver: true,
        }).start(() => {
          // Hold (4 seconds)
          setBreathPhase("hold");
          setTimeout(() => {
            // Exhale (4 seconds)
            setBreathPhase("exhale");
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 4000,
              useNativeDriver: true,
            }).start(() => {
              // Pause (4 seconds)
              setBreathPhase("pause");
              setTimeout(breathCycle, 4000);
            });
          }, 4000);
        });
      };
      breathCycle();
    }
  }, [showBreathing]);

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

        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#2B2438",
            marginBottom: 30,
          }}
        >
          Calm & Affirmations
        </Text>

        {!showBreathing ? (
          <>
            {/* Affirmations */}
            <LinearGradient
              colors={["#5B2CA0", "#D9A62B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                padding: 40,
                borderRadius: 16,
                marginBottom: 30,
                minHeight: 200,
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  color: "white",
                  textAlign: "center",
                  fontWeight: "500",
                  lineHeight: 32,
                }}
              >
                {affirmations[currentIndex]}
              </Text>
            </LinearGradient>

            {/* Controls */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 40,
              }}
            >
              <TouchableOpacity
                onPress={handlePrevious}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#D9D1E6",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <ChevronLeft color="#5B2CA0" size={24} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShuffle}
                style={{
                  backgroundColor: "#5B2CA0",
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Shuffle color="white" size={20} style={{ marginRight: 8 }} />
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                >
                  Shuffle
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderWidth: 1,
                  borderColor: "#D9D1E6",
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <ChevronRight color="#5B2CA0" size={24} />
              </TouchableOpacity>
            </View>

            {/* Breathing Exercise */}
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
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#2B2438",
                  marginBottom: 10,
                }}
              >
                60-Second Box Breathing
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6E6480",
                  marginBottom: 15,
                  lineHeight: 22,
                }}
              >
                A simple breathing exercise to calm your nervous system
              </Text>
              <TouchableOpacity
                onPress={() => setShowBreathing(true)}
                style={{
                  backgroundColor: "#5B2CA0",
                  paddingVertical: 14,
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Start Breathing Exercise
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Breathing Exercise */}
            <View
              style={{ alignItems: "center", marginTop: 40, marginBottom: 40 }}
            >
              <Animated.View
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                  backgroundColor: "#5B2CA0",
                  transform: [{ scale: scaleAnim }],
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 40,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 18, fontWeight: "bold" }}
                >
                  {breathPhase === "inhale" && "Breathe In"}
                  {breathPhase === "hold" && "Hold"}
                  {breathPhase === "exhale" && "Breathe Out"}
                  {breathPhase === "pause" && "Pause"}
                </Text>
              </Animated.View>

              <Text
                style={{
                  fontSize: 16,
                  color: "#6E6480",
                  textAlign: "center",
                  marginBottom: 40,
                }}
              >
                {breathPhase === "inhale" &&
                  "Breathe in slowly through your nose (4 seconds)"}
                {breathPhase === "hold" &&
                  "Hold your breath gently (4 seconds)"}
                {breathPhase === "exhale" &&
                  "Breathe out slowly through your mouth (4 seconds)"}
                {breathPhase === "pause" &&
                  "Pause before the next breath (4 seconds)"}
              </Text>

              <TouchableOpacity
                onPress={() => setShowBreathing(false)}
                style={{
                  borderWidth: 2,
                  borderColor: "#5B2CA0",
                  paddingHorizontal: 32,
                  paddingVertical: 14,
                  borderRadius: 8,
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Text
                  style={{ color: "#5B2CA0", fontSize: 16, fontWeight: "bold" }}
                >
                  Stop Exercise
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
