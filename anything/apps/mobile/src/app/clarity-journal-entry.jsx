import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";
import { Heart, Wind, MapPin, Headphones } from "lucide-react-native";
import useInAppPurchase from "@/utils/useInAppPurchase";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import useSinglePress from "@/utils/useSinglePress";

export default function ClarityJournalEntryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { hasShieldAccess, hasRiseAccess } = useInAppPurchase();

  const [entryType, setEntryType] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const guard = useSinglePress();

  // Victory flow - Step 1: Name Your Victory
  const [victoryAccomplished, setVictoryAccomplished] = useState("");
  const [victoryTimeWorking, setVictoryTimeWorking] = useState("");
  const [victoryAlmostStopped, setVictoryAlmostStopped] = useState("");
  const [victoryKeptGoing, setVictoryKeptGoing] = useState("");

  // Victory flow - Step 2: Own Your Strength
  const [victoryWhatItTook, setVictoryWhatItTook] = useState("");
  const [victoryWhatOvercame, setVictoryWhatOvercame] = useState("");
  const [victorySurprisedSelf, setVictorySurprisedSelf] = useState("");
  const [victoryWhoBecoming, setVictoryWhoBecoming] = useState("");

  // Victory flow - Step 3: Feel It Fully
  const [victoryHowFeel, setVictoryHowFeel] = useState("");
  const [victoryStrongestEmotion, setVictoryStrongestEmotion] = useState("");
  const [victoryCelebrateWith, setVictoryCelebrateWith] = useState("");
  const [victoryAdviceToOthers, setVictoryAdviceToOthers] = useState("");

  // Victory flow - Step 4: Record Your Victory
  const [victoryHonorHow, setVictoryHonorHow] = useState("");
  const [victoryNextStep, setVictoryNextStep] = useState("");
  const [significanceRating, setSignificanceRating] = useState(null);
  const [buildingToward, setBuildingToward] = useState([]);

  // Hard Day flow - Step 1: Think It Through
  const [whatMadeTodayDifficult, setWhatMadeTodayDifficult] = useState("");
  const [whatIsHappening, setWhatIsHappening] = useState("");
  const [decisionFacing, setDecisionFacing] = useState("");
  const [factsOfSituation, setFactsOfSituation] = useState("");

  // Hard Day flow - Step 2: Find The Answer
  const [whatIsTrue, setWhatIsTrue] = useState("");
  const [experienceTellsMe, setExperienceTellsMe] = useState("");
  const [adviceToAnother, setAdviceToAnother] = useState("");
  const [feelingNormal, setFeelingNormal] = useState("");

  // Hard Day flow - Step 3: Add Your Emotions
  const [howFeelingNow, setHowFeelingNow] = useState("");
  const [whatNeedMost, setWhatNeedMost] = useState("");
  const [emotionsToProcess, setEmotionsToProcess] = useState("");
  const [releasingAndKeeping, setReleasingAndKeeping] = useState("");

  // Hard Day flow - Step 4: Record Your Day
  const [whatGotThroughToday, setWhatGotThroughToday] = useState("");
  const [tellYourselfTomorrow, setTellYourselfTomorrow] = useState("");
  const [stepTaken, setStepTaken] = useState("");
  const [hardDayRating, setHardDayRating] = useState(null);

  const buildingOptions = [
    "Peace",
    "Love",
    "Abundance",
    "Freedom",
    "All of these",
  ];

  const toggleBuildingToward = (option) => {
    if (buildingToward.includes(option)) {
      setBuildingToward(buildingToward.filter((o) => o !== option));
    } else {
      setBuildingToward([...buildingToward, option]);
    }
  };

  const handleSave = guard(async () => {
    setSaving(true);
    try {
      const payload = {
        entry_type: entryType,
      };

      if (entryType === "victory") {
        payload.victory_accomplished = victoryAccomplished;
        payload.victory_time_working = victoryTimeWorking;
        payload.victory_almost_stopped = victoryAlmostStopped;
        payload.victory_kept_going = victoryKeptGoing;
        payload.victory_what_it_took = victoryWhatItTook;
        payload.victory_what_overcame = victoryWhatOvercame;
        payload.victory_surprised_self = victorySurprisedSelf;
        payload.victory_who_becoming = victoryWhoBecoming;
        payload.victory_how_feel = victoryHowFeel;
        payload.victory_strongest_emotion = victoryStrongestEmotion;
        payload.victory_celebrate_with = victoryCelebrateWith;
        payload.victory_advice_to_others = victoryAdviceToOthers;
        payload.victory_honor_how = victoryHonorHow;
        payload.victory_next_step = victoryNextStep;
        payload.significance_rating = significanceRating;
        payload.building_toward = buildingToward;
      } else if (entryType === "hard_day") {
        payload.what_made_today_difficult = whatMadeTodayDifficult;
        payload.what_is_happening = whatIsHappening;
        payload.decision_facing = decisionFacing;
        payload.facts_of_situation = factsOfSituation;
        payload.what_is_true = whatIsTrue;
        payload.experience_tells_me = experienceTellsMe;
        payload.advice_to_another = adviceToAnother;
        payload.feeling_normal = feelingNormal;
        payload.how_feeling_now = howFeelingNow;
        payload.what_need_most = whatNeedMost;
        payload.emotions_to_process = emotionsToProcess;
        payload.releasing_and_keeping = releasingAndKeeping;
        payload.what_got_through_today = whatGotThroughToday;
        payload.tell_yourself_tomorrow = tellYourselfTomorrow;
        payload.step_taken = stepTaken;
        payload.hard_day_rating = hardDayRating;
      }

      const response = await fetchWithAuth("/api/clarity-journal/save", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowCompletion(true);
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Journal save error:", error);
      Alert.alert("Error", "Could not save journal entry. Please try again.");
    } finally {
      setSaving(false);
    }
  });

  const handleScriptsPress = guard(() => {
    if (hasShieldAccess || hasRiseAccess) {
      router.push("/in-the-moment-scripts");
    } else {
      router.push("/(tabs)/upgrade");
    }
  });

  if (showCompletion) {
    return (
      <View
        style={{ flex: 1, backgroundColor: "#4A2D8F", paddingTop: insets.top }}
      >
        <StatusBar style="light" />

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 40,
            paddingBottom: insets.bottom + 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 30,
              marginBottom: 30,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "#1F2937",
                lineHeight: 32,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              {entryType === "victory"
                ? "Victory Recorded. You are getting to know who you are now. That is the most important work you will ever do."
                : "You showed up today. On a hard day, that is the victory."}
            </Text>

            <View
              style={{
                backgroundColor: "#F0B429",
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#4A2D8F",
                  fontWeight: "600",
                }}
              >
                — Dr. Mildred D. Muhammad, D.Hum
              </Text>
            </View>
          </View>

          {entryType === "hard_day" && (
            <>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 15,
                }}
              >
                Here for you now
              </Text>

              <TouchableOpacity
                onPress={guard(() => router.push("/calm"))}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F0B429",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                }}
              >
                <Heart color="#4A2D8F" size={24} style={{ marginRight: 12 }} />
                <Text
                  style={{ fontSize: 16, color: "#4A2D8F", fontWeight: "600" }}
                >
                  Daily Affirmation
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={guard(() => router.push("/calm"))}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F0B429",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                }}
              >
                <Wind color="#4A2D8F" size={24} style={{ marginRight: 12 }} />
                <Text
                  style={{ fontSize: 16, color: "#4A2D8F", fontWeight: "600" }}
                >
                  Calm & Breathe
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={guard(() => Linking.openURL("https://findhelp.org"))}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F0B429",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                }}
              >
                <MapPin color="#4A2D8F" size={24} style={{ marginRight: 12 }} />
                <Text
                  style={{ fontSize: 16, color: "#4A2D8F", fontWeight: "600" }}
                >
                  Find Help Near Me
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleScriptsPress}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F0B429",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 12,
                }}
              >
                <Headphones
                  color="#4A2D8F"
                  size={24}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={{ fontSize: 16, color: "#4A2D8F", fontWeight: "600" }}
                >
                  Suggested Scripts Library
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            onPress={guard(() => router.replace("/your-next-chapter"))}
            style={{
              backgroundColor: "white",
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text
              style={{ color: "#4A2D8F", fontSize: 16, fontWeight: "bold" }}
            >
              Back to Your Next Chapter
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  if (entryType === null) {
    return (
      <View
        style={{ flex: 1, backgroundColor: "#4A2D8F", paddingTop: insets.top }}
      >
        <StatusBar style="light" />

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: insets.bottom + 20,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 20 }}
          >
            <Text style={{ fontSize: 16, color: "#F0B429", fontWeight: "600" }}>
              ← Back
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "white",
              marginBottom: 10,
            }}
          >
            My Growth Journal
          </Text>

          <View
            style={{
              backgroundColor: "#F0B429",
              padding: 16,
              borderRadius: 12,
              marginBottom: 30,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#4A2D8F",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              This journal is yours alone. Everything you write here is private
              and secure.
            </Text>
          </View>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            How are you coming in today?
          </Text>

          <TouchableOpacity
            onPress={guard(() => {
              setEntryType("victory");
              setCurrentStep(1);
            })}
            style={{
              backgroundColor: "#F0B429",
              padding: 20,
              borderRadius: 12,
              marginBottom: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#4A2D8F",
                fontWeight: "bold",
              }}
            >
              I Have a Victory to Record
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={guard(() => {
              setEntryType("hard_day");
              setCurrentStep(1);
            })}
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#4A2D8F",
                fontWeight: "bold",
              }}
            >
              I Had a Bad Day
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const renderStep = () => {
    if (entryType === "victory") {
      // VICTORY FLOW
      switch (currentStep) {
        case 1:
          return (
            <>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 15,
                }}
              >
                Step 1: Name Your Victory
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What did you accomplish today?
              </Text>
              <TextInput
                value={victoryAccomplished}
                onChangeText={setVictoryAccomplished}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                How long have you been working toward this?
              </Text>
              <TextInput
                value={victoryTimeWorking}
                onChangeText={setVictoryTimeWorking}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What almost stopped you?
              </Text>
              <TextInput
                value={victoryAlmostStopped}
                onChangeText={setVictoryAlmostStopped}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What kept you going?
              </Text>
              <TextInput
                value={victoryKeptGoing}
                onChangeText={setVictoryKeptGoing}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />
            </>
          );

        case 2:
          return (
            <>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 15,
                }}
              >
                Step 2: Own Your Strength
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What did it take to get here?
              </Text>
              <TextInput
                value={victoryWhatItTook}
                onChangeText={setVictoryWhatItTook}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What did you overcome to make this happen?
              </Text>
              <TextInput
                value={victoryWhatOvercame}
                onChangeText={setVictoryWhatOvercame}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What part of yourself showed up that surprised you?
              </Text>
              <TextInput
                value={victorySurprisedSelf}
                onChangeText={setVictorySurprisedSelf}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What does this say about who you are becoming?
              </Text>
              <TextInput
                value={victoryWhoBecoming}
                onChangeText={setVictoryWhoBecoming}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />
            </>
          );

        case 3:
          return (
            <>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 15,
                }}
              >
                Step 3: Feel It Fully
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                How does this victory make you feel?
              </Text>
              <TextInput
                value={victoryHowFeel}
                onChangeText={setVictoryHowFeel}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What emotion is strongest right now?
              </Text>
              <TextInput
                value={victoryStrongestEmotion}
                onChangeText={setVictoryStrongestEmotion}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                Who do you want to celebrate this with?
              </Text>
              <TextInput
                value={victoryCelebrateWith}
                onChangeText={setVictoryCelebrateWith}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What would you tell another survivor who is still waiting for
                their victory?
              </Text>
              <TextInput
                value={victoryAdviceToOthers}
                onChangeText={setVictoryAdviceToOthers}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />
            </>
          );

        case 4:
          return (
            <>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 15,
                }}
              >
                Step 4: Record Your Victory
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                On a scale of 1 to 5, how significant was this victory?
              </Text>
              <View style={{ marginBottom: 20 }}>
                {[
                  { value: 1, label: "Small step forward" },
                  { value: 2, label: "Steady progress" },
                  { value: 3, label: "Significant growth" },
                  { value: 4, label: "Major breakthrough" },
                  { value: 5, label: "Transformative victory" },
                ].map((rating) => (
                  <TouchableOpacity
                    key={rating.value}
                    onPress={() => setSignificanceRating(rating.value)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor:
                        significanceRating === rating.value
                          ? "#F0B429"
                          : "white",
                      borderWidth: 1,
                      borderColor: "#F0B429",
                      borderRadius: 8,
                      padding: 14,
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        borderWidth: 2,
                        borderColor:
                          significanceRating === rating.value
                            ? "white"
                            : "#4A2D8F",
                        backgroundColor:
                          significanceRating === rating.value
                            ? "#4A2D8F"
                            : "white",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          color:
                            significanceRating === rating.value
                              ? "white"
                              : "#4A2D8F",
                        }}
                      >
                        {rating.value}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        color:
                          significanceRating === rating.value
                            ? "#4A2D8F"
                            : "#1F2937",
                        fontWeight:
                          significanceRating === rating.value
                            ? "600"
                            : "normal",
                      }}
                    >
                      {rating.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What are you building toward?
              </Text>
              <View style={{ marginBottom: 20 }}>
                {buildingOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => toggleBuildingToward(option)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: buildingToward.includes(option)
                        ? "#F0B429"
                        : "white",
                      borderWidth: 1,
                      borderColor: "#F0B429",
                      borderRadius: 8,
                      padding: 14,
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        color: buildingToward.includes(option)
                          ? "#4A2D8F"
                          : "#1F2937",
                        fontWeight: buildingToward.includes(option)
                          ? "600"
                          : "normal",
                      }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What will you do to honor this victory today?
              </Text>
              <TextInput
                value={victoryHonorHow}
                onChangeText={setVictoryHonorHow}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What is your next step forward?
              </Text>
              <TextInput
                value={victoryNextStep}
                onChangeText={setVictoryNextStep}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />
            </>
          );

        default:
          return null;
      }
    } else {
      // HARD DAY FLOW
      switch (currentStep) {
        case 1:
          return (
            <>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 15,
                }}
              >
                Step 1: Think It Through
              </Text>

              <View
                style={{
                  backgroundColor: "#F0B429",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 25,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#4A2D8F",
                    lineHeight: 22,
                  }}
                >
                  It is okay to have hard days. This is a safe space. Think
                  through what is happening without judgment.
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What made today difficult?
              </Text>
              <TextInput
                value={whatMadeTodayDifficult}
                onChangeText={setWhatMadeTodayDifficult}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What is actually happening in my life right now?
              </Text>
              <TextInput
                value={whatIsHappening}
                onChangeText={setWhatIsHappening}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What decision am I facing?
              </Text>
              <TextInput
                value={decisionFacing}
                onChangeText={setDecisionFacing}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What are the facts of my situation?
              </Text>
              <TextInput
                value={factsOfSituation}
                onChangeText={setFactsOfSituation}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />
            </>
          );

        case 2:
          return (
            <>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 15,
                }}
              >
                Step 2: Find The Answer
              </Text>

              <View
                style={{
                  backgroundColor: "#F0B429",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 25,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#4A2D8F",
                    lineHeight: 22,
                  }}
                >
                  You have more answers inside you than you realize. Think
                  logically before adding emotions.
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What do I know to be true?
              </Text>
              <TextInput
                value={whatIsTrue}
                onChangeText={setWhatIsTrue}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What does my own experience tell me?
              </Text>
              <TextInput
                value={experienceTellsMe}
                onChangeText={setExperienceTellsMe}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What would I tell another survivor in my exact situation?
              </Text>
              <TextInput
                value={adviceToAnother}
                onChangeText={setAdviceToAnother}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                Is what I am feeling normal?
              </Text>
              <TextInput
                value={feelingNormal}
                onChangeText={setFeelingNormal}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />
            </>
          );

        case 3:
          return (
            <>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 15,
                }}
              >
                Step 3: Add Your Emotions
              </Text>

              <View
                style={{
                  backgroundColor: "#F0B429",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 25,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#4A2D8F",
                    lineHeight: 22,
                  }}
                >
                  Now that you have thought it through — you have earned the
                  right to feel it. Add your emotions from a place of clarity,
                  not confusion.
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                How are you feeling right now?
              </Text>
              <TextInput
                value={howFeelingNow}
                onChangeText={setHowFeelingNow}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What do you need most in this moment?
              </Text>
              <TextInput
                value={whatNeedMost}
                onChangeText={setWhatNeedMost}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What emotions am I ready to process today?
              </Text>
              <TextInput
                value={emotionsToProcess}
                onChangeText={setEmotionsToProcess}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What am I releasing and what am I keeping?
              </Text>
              <TextInput
                value={releasingAndKeeping}
                onChangeText={setReleasingAndKeeping}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />
            </>
          );

        case 4:
          return (
            <>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 15,
                }}
              >
                Step 4: Record Your Day
              </Text>

              <View
                style={{
                  backgroundColor: "#F0B429",
                  padding: 16,
                  borderRadius: 12,
                  marginBottom: 25,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#4A2D8F",
                    lineHeight: 22,
                  }}
                >
                  You showed up today. That matters. Record what got you
                  through.
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What got you through today?
              </Text>
              <TextInput
                value={whatGotThroughToday}
                onChangeText={setWhatGotThroughToday}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What would you tell yourself tomorrow?
              </Text>
              <TextInput
                value={tellYourselfTomorrow}
                onChangeText={setTellYourselfTomorrow}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                What step did you take — even a small one?
              </Text>
              <TextInput
                value={stepTaken}
                onChangeText={setStepTaken}
                placeholder="Your thoughts..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  padding: 14,
                  fontSize: 15,
                  color: "#1F2937",
                  textAlignVertical: "top",
                  minHeight: 100,
                  marginBottom: 20,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                On a scale of 1 to 5
              </Text>
              <View style={{ marginBottom: 20 }}>
                {[
                  { value: 1, label: "Survived the day" },
                  { value: 2, label: "Found some peace" },
                  { value: 3, label: "Made progress" },
                  { value: 4, label: "Had a breakthrough" },
                  { value: 5, label: "Turned it around" },
                ].map((rating) => (
                  <TouchableOpacity
                    key={rating.value}
                    onPress={() => setHardDayRating(rating.value)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor:
                        hardDayRating === rating.value ? "#F0B429" : "white",
                      borderWidth: 1,
                      borderColor: "#F0B429",
                      borderRadius: 8,
                      padding: 14,
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        borderWidth: 2,
                        borderColor:
                          hardDayRating === rating.value ? "white" : "#4A2D8F",
                        backgroundColor:
                          hardDayRating === rating.value ? "#4A2D8F" : "white",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          color:
                            hardDayRating === rating.value
                              ? "white"
                              : "#4A2D8F",
                        }}
                      >
                        {rating.value}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        color:
                          hardDayRating === rating.value
                            ? "#4A2D8F"
                            : "#1F2937",
                        fontWeight:
                          hardDayRating === rating.value ? "600" : "normal",
                      }}
                    >
                      {rating.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          );

        default:
          return null;
      }
    }
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#4A2D8F", paddingTop: insets.top }}
    >
      <StatusBar style="light" />

      <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: insets.bottom + 100,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                setEntryType(null);
                setCurrentStep(0);
              }
            }}
            style={{ marginBottom: 20 }}
          >
            <Text style={{ fontSize: 16, color: "#F0B429", fontWeight: "600" }}>
              ← Back
            </Text>
          </TouchableOpacity>

          {renderStep()}
        </ScrollView>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 20,
            paddingBottom: insets.bottom + 20,
            backgroundColor: "#4A2D8F",
            borderTopWidth: 1,
            borderTopColor: "#F0B429",
          }}
        >
          {currentStep < 4 ? (
            <TouchableOpacity
              onPress={guard(() => setCurrentStep(currentStep + 1))}
              style={{
                backgroundColor: "#F0B429",
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#4A2D8F", fontSize: 16, fontWeight: "bold" }}
              >
                Continue to Step {currentStep + 1}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={{
                backgroundColor: "#F0B429",
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#4A2D8F", fontSize: 16, fontWeight: "bold" }}
              >
                {saving ? "Saving..." : "Save Journal Entry"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingAnimatedView>
    </View>
  );
}
