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
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Clock, ChevronRight, Trash2 } from "lucide-react-native";
import SafetyButtons from "@/components/SafetyButtons";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function PatternTrackerHistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [trackers, setTrackers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reload every time the screen comes into focus (e.g. navigating back after save/edit)
  useFocusEffect(
    useCallback(() => {
      loadTrackers();
    }, []),
  );

  const loadTrackers = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth("/api/pattern-tracker/list");

      if (response.ok) {
        const data = await response.json();
        setTrackers(data.trackers || []);
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error("List fetch failed:", errData);
        Alert.alert("Error", "Could not load pattern tracker history");
      }
    } catch (error) {
      console.error("Load trackers error:", error);
      Alert.alert("Error", "Could not load pattern tracker history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this pattern tracker entry? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetchWithAuth(
                `/api/pattern-tracker/${id}`,
                {
                  method: "DELETE",
                },
              );

              if (response.ok) {
                setTrackers((prev) => prev.filter((t) => t.id !== id));
                Alert.alert("Deleted", "Entry deleted successfully");
              } else {
                throw new Error("Failed to delete");
              }
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Could not delete entry");
            }
          },
        },
      ],
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F3F0F8",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: insets.top,
        }}
      >
        <StatusBar style="dark" />
        <SafetyButtons />
        <ActivityIndicator size="large" color="#4A2D8F" />
        <Text style={{ marginTop: 15, color: "#6B7280" }}>
          Loading your history...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <SafetyButtons />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 16, color: "#4A2D8F", fontWeight: "600" }}>
            ← Back
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
          paddingTop: 20,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#4A2D8F",
            marginBottom: 10,
          }}
        >
          Pattern Tracker History
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#6B7280",
            marginBottom: 25,
            lineHeight: 20,
          }}
        >
          View and edit your previously saved pattern tracker entries.
        </Text>

        {trackers.length === 0 ? (
          <View
            style={{
              backgroundColor: "#FDF6E3",
              padding: 20,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#6B7280",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              No entries yet
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#9CA3AF",
                textAlign: "center",
              }}
            >
              Complete a Pattern Map Tracker entry to see it here.
            </Text>
          </View>
        ) : (
          trackers.map((tracker) => (
            <View
              key={tracker.id}
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                borderLeftWidth: 4,
                borderLeftColor: "#F0B429",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Clock color="#4A2D8F" size={18} style={{ marginRight: 8 }} />
                <Text
                  style={{
                    fontSize: 14,
                    color: "#4A2D8F",
                    fontWeight: "600",
                    flex: 1,
                  }}
                >
                  {formatDate(tracker.created_at)}
                </Text>
              </View>

              {tracker.behaviors && tracker.behaviors.length > 0 && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#6B7280",
                      marginBottom: 4,
                      fontWeight: "600",
                    }}
                  >
                    Behaviors:
                  </Text>
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}
                  >
                    {tracker.behaviors.slice(0, 3).map((b, idx) => (
                      <View
                        key={idx}
                        style={{
                          backgroundColor: "#EDE9FE",
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 4,
                        }}
                      >
                        <Text style={{ color: "#4A2D8F", fontSize: 12 }}>
                          {b}
                        </Text>
                      </View>
                    ))}
                    {tracker.behaviors.length > 3 && (
                      <Text style={{ color: "#6B7280", fontSize: 12 }}>
                        +{tracker.behaviors.length - 3} more
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {tracker.safety_rating && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#6B7280",
                      marginBottom: 4,
                      fontWeight: "600",
                    }}
                  >
                    Safety Rating:
                  </Text>
                  <Text style={{ fontSize: 14, color: "#1F2937" }}>
                    {tracker.safety_rating}/5
                  </Text>
                </View>
              )}

              {tracker.private_notes && (
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#6B7280",
                      marginBottom: 4,
                      fontWeight: "600",
                    }}
                  >
                    Notes:
                  </Text>
                  <Text
                    style={{ fontSize: 14, color: "#1F2937" }}
                    numberOfLines={2}
                  >
                    {tracker.private_notes}
                  </Text>
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: "#F3F4F6",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/pattern-tracker-rebuild",
                      params: { editId: tracker.id },
                    })
                  }
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#4A2D8F",
                    paddingVertical: 10,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{ color: "white", fontWeight: "600", fontSize: 14 }}
                  >
                    Edit Entry
                  </Text>
                  <ChevronRight
                    color="white"
                    size={16}
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(tracker.id)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 8,
                    backgroundColor: "#FEE2E2",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Trash2 color="#DC2626" size={18} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
