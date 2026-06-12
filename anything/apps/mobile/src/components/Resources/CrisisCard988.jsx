import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Phone, MessageCircle } from "lucide-react-native";

export function CrisisCard988() {
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
        988 Suicide & Crisis Lifeline
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#6B7280",
          lineHeight: 20,
          marginBottom: 12,
        }}
      >
        Free, confidential support for people in crisis or emotional distress.
        Available 24 hours a day, 7 days a week. Call or text 988.
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity
          onPress={() => Linking.openURL("tel:988")}
          style={{
            flex: 1,
            backgroundColor: "#E32626",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Phone color="white" size={16} style={{ marginRight: 6 }} />
          <Text
            style={{
              color: "white",
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            Call 988
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL("sms:988")}
          style={{
            flex: 1,
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
            Text 988
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
