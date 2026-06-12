import { TouchableOpacity, Text } from "react-native";

export function Tab({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: active ? "#7A6B8A" : "#F3F4F6",
        marginRight: 8,
      }}
    >
      <Text style={{ fontSize: 18, marginRight: 6 }}>{icon}</Text>
      <Text
        style={{
          fontSize: 14,
          fontWeight: active ? "bold" : "normal",
          color: active ? "#FFFFFF" : "#6B7280",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
