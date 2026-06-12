import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { format } from "date-fns";
import { Trash2 } from "lucide-react-native";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function GrowthTrackerHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [error, setError] = useState(null);

  // Reload entries every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, []),
  );

  const loadEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth("/api/growth-tracker/list");
      if (!response.ok) {
        throw new Error(`Failed to fetch entries: ${response.status}`);
      }
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (err) {
      console.error("Load entries error:", err);
      setError("Could not load entries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadFullEntry = async (id) => {
    try {
      const response = await fetchWithAuth(`/api/growth-tracker/${id}`);
      const data = await response.json();
      setSelectedEntry(data.entry);
    } catch (error) {
      console.error("Load entry error:", error);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Growth Tracker Entry?",
      "This will permanently delete this entry. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetchWithAuth(
                `/api/growth-tracker/${id}`,
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
        style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
      >
        <StatusBar style="dark" />

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
            <Text style={{ fontSize: 16, color: "#5B2CA0", fontWeight: "600" }}>
              ← Back to Growth Tracker History
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

            {selectedEntry.growth_rating && (
              <View
                style={{
                  backgroundColor: "#F0B429",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 6,
                  marginBottom: 15,
                  alignSelf: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: "#4A2D8F",
                    fontWeight: "600",
                  }}
                >
                  Rating: {selectedEntry.growth_rating}/5
                </Text>
              </View>
            )}

            {selectedEntry.behaviors && selectedEntry.behaviors.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: 8,
                  }}
                >
                  Victories Experienced:
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {selectedEntry.behaviors.map((behavior, idx) => (
                    <View
                      key={idx}
                      style={{
                        backgroundColor: "#EDE9FE",
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
                        {behavior}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {selectedEntry.frequency && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: 8,
                  }}
                >
                  Frequency:
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#4B5563",
                  }}
                >
                  {selectedEntry.frequency}
                </Text>
              </View>
            )}

            {selectedEntry.feelings && selectedEntry.feelings.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: 8,
                  }}
                >
                  Feelings:
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {selectedEntry.feelings.map((feeling, idx) => (
                    <View
                      key={idx}
                      style={{
                        backgroundColor: "#FEF3C7",
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
                          color: "#92400E",
                          fontWeight: "600",
                        }}
                      >
                        {feeling}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {selectedEntry.private_notes && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: 8,
                  }}
                >
                  Private Notes:
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#4B5563",
                    lineHeight: 20,
                  }}
                >
                  {selectedEntry.private_notes}
                </Text>
              </View>
            )}

            {selectedEntry.support_person && (
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: 8,
                  }}
                >
                  Support Person:
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#4B5563",
                  }}
                >
                  {selectedEntry.support_person}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => handleDelete(selectedEntry.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#FEE2E2",
              paddingVertical: 14,
              borderRadius: 8,
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
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />

      <View
        style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 15 }}
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
            marginBottom: 10,
          }}
        >
          Growth Tracker History 🌟
        </Text>
        <Text style={{ fontSize: 14, color: "#6E6480" }}>
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </Text>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#5B2CA0" />
        </View>
      ) : error ? (
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
              fontSize: 16,
              color: "#DC2626",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            {error}
          </Text>
          <TouchableOpacity
            onPress={loadEntries}
            style={{
              backgroundColor: "#5B2CA0",
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontSize: 15, fontWeight: "600" }}>
              Try Again
            </Text>
          </TouchableOpacity>
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
              color: "#6E6480",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            No growth tracker entries yet
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/growth-tracker")}
            style={{
              backgroundColor: "#5B2CA0",
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
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

              {entry.growth_rating && (
                <View
                  style={{
                    backgroundColor: "#F0B429",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    marginBottom: 8,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#4A2D8F",
                      fontWeight: "600",
                    }}
                  >
                    Rating: {entry.growth_rating}/5
                  </Text>
                </View>
              )}

              {entry.behaviors && entry.behaviors.length > 0 && (
                <Text
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                    marginBottom: 8,
                  }}
                >
                  {entry.behaviors.length} victor
                  {entry.behaviors.length !== 1 ? "ies" : "y"} recorded
                </Text>
              )}

              {entry.private_notes && (
                <Text
                  style={{
                    fontSize: 14,
                    color: "#1F2937",
                    marginBottom: 12,
                    lineHeight: 20,
                  }}
                  numberOfLines={3}
                >
                  {entry.private_notes}
                </Text>
              )}

              <TouchableOpacity
                onPress={() => loadFullEntry(entry.id)}
                style={{
                  backgroundColor: "#5B2CA0",
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
                  View Full Entry
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
