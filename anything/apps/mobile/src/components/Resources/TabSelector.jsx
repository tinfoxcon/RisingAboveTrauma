import { View, Text, TouchableOpacity } from "react-native";

export function TabSelector({ activeTab, onTabChange }) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#F3F4F6",
        borderRadius: 8,
        padding: 4,
        marginBottom: 20,
      }}
    >
      <TouchableOpacity
        onPress={() => onTabChange("us")}
        style={{
          flex: 1,
          paddingVertical: 12,
          borderRadius: 6,
          backgroundColor: activeTab === "us" ? "white" : "transparent",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 14,
            fontWeight: activeTab === "us" ? "bold" : "normal",
            color: activeTab === "us" ? "#4A2D8F" : "#6B7280",
          }}
        >
          US Resources
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onTabChange("international")}
        style={{
          flex: 1,
          paddingVertical: 12,
          borderRadius: 6,
          backgroundColor:
            activeTab === "international" ? "white" : "transparent",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 14,
            fontWeight: activeTab === "international" ? "bold" : "normal",
            color: activeTab === "international" ? "#4A2D8F" : "#6B7280",
          }}
        >
          International
        </Text>
      </TouchableOpacity>
    </View>
  );
}
