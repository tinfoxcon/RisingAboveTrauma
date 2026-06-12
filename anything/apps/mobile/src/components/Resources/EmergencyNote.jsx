import { View, Text } from "react-native";

export function EmergencyNote() {
  return (
    <View
      style={{
        backgroundColor: "#FEF3C7",
        padding: 14,
        borderRadius: 12,
        marginBottom: 30,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          color: "#92400E",
          fontWeight: "600",
          textAlign: "center",
          lineHeight: 20,
        }}
      >
        If you are in immediate danger, call 911. You are not alone and help is
        available right now.
      </Text>
    </View>
  );
}
