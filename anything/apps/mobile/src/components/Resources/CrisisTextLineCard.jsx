import { View, Text, TouchableOpacity, Linking } from "react-native";
import { MessageCircle } from "lucide-react-native";

export function CrisisTextLineCard() {
  return (
    <View
      style={{
        backgroundColor: "#FFF8F8",
        borderWidth: 2,
        borderColor: "#E32626",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#E32626",
          marginBottom: 8,
        }}
      >
        Crisis Text Line
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#6B7280",
          lineHeight: 20,
          marginBottom: 12,
        }}
      >
        Free, confidential crisis counseling by text. Available 24 hours a day,
        7 days a week.
      </Text>
      <TouchableOpacity
        onPress={() => Linking.openURL("sms:741741&body=HOME")}
        style={{
          backgroundColor: "#E32626",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 12,
          borderRadius: 8,
        }}
      >
        <MessageCircle color="white" size={16} style={{ marginRight: 6 }} />
        <Text
          style={{
            color: "white",
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          Text HOME to 741741
        </Text>
      </TouchableOpacity>
    </View>
  );
}
