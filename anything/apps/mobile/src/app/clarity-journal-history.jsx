import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { format } from "date-fns";
import { Trash2 } from "lucide-react-native";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function ClarityJournalHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const response = await fetchWithAuth("/api/clarity-journal/list");
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error("Load entries error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFullEntry = async (id) => {
    try {
      const response = await fetchWithAuth(`/api/clarity-journal/${id}`);
      const data = await response.json();
      setSelectedEntry(data.entry);
    } catch (error) {
      console.error("Load entry error:", error);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Journal Entry?",
      "This will permanently delete this entry. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetchWithAuth(
                `/api/clarity-journal/${id}/delete`,
                {
                  method: "DELETE",
                },
              );
              if (response.ok) {
                setSelectedEntry(null);
                loadEntries();
                Alert.alert("Deleted", "Entry has been removed.");
              }
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Could not delete entry.");
            }
          },
        },
      ],
    );
  };

  if (selectedEntry) {
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
            onPress={() => setSelectedEntry(null)}
            style={{ marginBottom: 20 }}
          >
            <Text style={{ fontSize: 16, color: "#F0B429", fontWeight: "600" }}>
              ← Back to Journal
            </Text>
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginBottom: 10,
              }}
            >
              {format(
                new Date(selectedEntry.created_at),
                "MMMM d, yyyy 'at' h:mm a",
              )}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  backgroundColor:
                    selectedEntry.entry_type === "victory"
                      ? "#10B981"
                      : "#6366F1",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 6,
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  {selectedEntry.entry_type === "victory"
                    ? "Victory Day"
                    : "Hard Day"}
                </Text>
              </View>

              {selectedEntry.significance_rating && (
                <View
                  style={{
                    backgroundColor: "#F0B429",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#4A2D8F",
                      fontWeight: "600",
                    }}
                  >
                    Rating: {selectedEntry.significance_rating}/5
                  </Text>
                </View>
              )}
            </View>

            {selectedEntry.building_toward &&
              selectedEntry.building_toward.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#1F2937",
                      marginBottom: 8,
                    }}
                  >
                    Building Toward:
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {selectedEntry.building_toward.map((item, idx) => (
                      <View
                        key={idx}
                        style={{
                          backgroundColor: "#F0B429",
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 6,
                          marginRight: 8,
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#4A2D8F",
                            fontWeight: "600",
                          }}
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

            {/* Victory Flow Fields */}
            {selectedEntry.victory_accomplished && (
              <EntryField
                label="What did you accomplish today?"
                value={selectedEntry.victory_accomplished}
              />
            )}
            {selectedEntry.victory_time_working && (
              <EntryField
                label="How long have you been working toward this?"
                value={selectedEntry.victory_time_working}
              />
            )}
            {selectedEntry.victory_almost_stopped && (
              <EntryField
                label="What almost stopped you?"
                value={selectedEntry.victory_almost_stopped}
              />
            )}
            {selectedEntry.victory_kept_going && (
              <EntryField
                label="What kept you going?"
                value={selectedEntry.victory_kept_going}
              />
            )}
            {selectedEntry.victory_what_it_took && (
              <EntryField
                label="What did it take to get here?"
                value={selectedEntry.victory_what_it_took}
              />
            )}
            {selectedEntry.victory_what_overcame && (
              <EntryField
                label="What did you overcome to make this happen?"
                value={selectedEntry.victory_what_overcame}
              />
            )}
            {selectedEntry.victory_surprised_self && (
              <EntryField
                label="What part of yourself showed up that surprised you?"
                value={selectedEntry.victory_surprised_self}
              />
            )}
            {selectedEntry.victory_who_becoming && (
              <EntryField
                label="What does this say about who you are becoming?"
                value={selectedEntry.victory_who_becoming}
              />
            )}
            {selectedEntry.victory_how_feel && (
              <EntryField
                label="How does this victory make you feel?"
                value={selectedEntry.victory_how_feel}
              />
            )}
            {selectedEntry.victory_strongest_emotion && (
              <EntryField
                label="What emotion is strongest right now?"
                value={selectedEntry.victory_strongest_emotion}
              />
            )}
            {selectedEntry.victory_celebrate_with && (
              <EntryField
                label="Who do you want to celebrate this with?"
                value={selectedEntry.victory_celebrate_with}
              />
            )}
            {selectedEntry.victory_advice_to_others && (
              <EntryField
                label="What would you tell another survivor who is still waiting for their victory?"
                value={selectedEntry.victory_advice_to_others}
              />
            )}
            {selectedEntry.victory_honor_how && (
              <EntryField
                label="What will you do to honor this victory today?"
                value={selectedEntry.victory_honor_how}
              />
            )}
            {selectedEntry.victory_next_step && (
              <EntryField
                label="What is your next step forward?"
                value={selectedEntry.victory_next_step}
              />
            )}

            {/* Hard Day Flow Fields */}
            {selectedEntry.what_is_happening && (
              <EntryField
                label="What is actually happening in my life right now?"
                value={selectedEntry.what_is_happening}
              />
            )}
            {selectedEntry.decision_facing && (
              <EntryField
                label="What decision am I facing?"
                value={selectedEntry.decision_facing}
              />
            )}
            {selectedEntry.second_guessing && (
              <EntryField
                label="What am I second guessing and why?"
                value={selectedEntry.second_guessing}
              />
            )}
            {selectedEntry.facts_of_situation && (
              <EntryField
                label="What are the facts of my situation?"
                value={selectedEntry.facts_of_situation}
              />
            )}
            {selectedEntry.what_is_true && (
              <EntryField
                label="What do I know to be true?"
                value={selectedEntry.what_is_true}
              />
            )}
            {selectedEntry.experience_tells_me && (
              <EntryField
                label="What does my own experience tell me?"
                value={selectedEntry.experience_tells_me}
              />
            )}
            {selectedEntry.advice_to_another && (
              <EntryField
                label="What would I tell another survivor in my exact situation?"
                value={selectedEntry.advice_to_another}
              />
            )}
            {selectedEntry.feeling_normal && (
              <EntryField
                label="Is what I am feeling normal?"
                value={selectedEntry.feeling_normal}
              />
            )}
            {selectedEntry.how_i_feel && (
              <EntryField
                label="Now that I understand it — how do I feel?"
                value={selectedEntry.how_i_feel}
              />
            )}
            {selectedEntry.emotions_to_process && (
              <EntryField
                label="What emotions am I ready to process today?"
                value={selectedEntry.emotions_to_process}
              />
            )}
            {selectedEntry.what_releasing && (
              <EntryField
                label="What am I releasing?"
                value={selectedEntry.what_releasing}
              />
            )}
            {selectedEntry.what_keeping && (
              <EntryField
                label="What am I keeping?"
                value={selectedEntry.what_keeping}
              />
            )}
            {selectedEntry.learned_about_self && (
              <EntryField
                label="What did I learn about myself today?"
                value={selectedEntry.learned_about_self}
              />
            )}
            {selectedEntry.step_taken && (
              <EntryField
                label="What step did I take — even a small one?"
                value={selectedEntry.step_taken}
              />
            )}
          </View>

          {/* NEW: Delete button at the end before closing ScrollView */}
          <TouchableOpacity
            onPress={() => handleDelete(selectedEntry.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FEE2E2",
              paddingVertical: 14,
              borderRadius: 8,
              marginTop: 20,
            }}
          >
            <Trash2 color="#DC2626" size={18} style={{ marginRight: 8 }} />
            <Text
              style={{
                color: "#DC2626",
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              Delete This Entry
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "#4A2D8F", paddingTop: insets.top }}
    >
      <StatusBar style="light" />

      <View
        style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 15 }}
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
          My Growth Journey
        </Text>
        <Text style={{ fontSize: 14, color: "#F0B429" }}>
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </Text>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#F0B429" />
        </View>
      ) : entries.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 40,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "white",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Your journal is empty
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/clarity-journal-entry")}
            style={{
              backgroundColor: "#F0B429",
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
          >
            <Text
              style={{ color: "#4A2D8F", fontSize: 16, fontWeight: "bold" }}
            >
              Create Your First Entry
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 100,
          }}
        >
          {entries.map((entry) => (
            <View
              key={entry.id}
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  marginBottom: 8,
                }}
              >
                {format(new Date(entry.created_at), "MMMM d, yyyy 'at' h:mm a")}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      entry.entry_type === "victory" ? "#10B981" : "#6366F1",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    {entry.entry_type === "victory"
                      ? "Victory Day"
                      : "Hard Day"}
                  </Text>
                </View>

                {entry.significance_rating && (
                  <View
                    style={{
                      backgroundColor: "#F0B429",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#4A2D8F",
                        fontWeight: "600",
                      }}
                    >
                      {entry.significance_rating}/5
                    </Text>
                  </View>
                )}
              </View>

              {entry.building_toward && entry.building_toward.length > 0 && (
                <Text
                  style={{
                    fontSize: 13,
                    color: "#4A2D8F",
                    fontWeight: "600",
                    marginBottom: 8,
                  }}
                >
                  Building toward: {entry.building_toward.join(", ")}
                </Text>
              )}

              {entry.what_is_happening && (
                <Text
                  style={{
                    fontSize: 14,
                    color: "#1F2937",
                    marginBottom: 12,
                    lineHeight: 20,
                  }}
                  numberOfLines={3}
                >
                  {entry.what_is_happening}
                </Text>
              )}

              <TouchableOpacity
                onPress={() => loadFullEntry(entry.id)}
                style={{
                  backgroundColor: "#4A2D8F",
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  Read Full Entry
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function EntryField({ label, value }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: "#1F2937",
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#4B5563",
          lineHeight: 22,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
