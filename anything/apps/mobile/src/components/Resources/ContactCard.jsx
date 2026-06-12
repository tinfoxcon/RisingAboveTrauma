import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Phone, MessageCircle, ExternalLink } from "lucide-react-native";

export function ContactCard({ title, description, phone, sms, url, children }) {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: description ? 8 : 12,
        }}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={{
            fontSize: 14,
            color: "#6B7280",
            lineHeight: 20,
            marginBottom: 12,
          }}
        >
          {description}
        </Text>
      )}
      {children ? (
        children
      ) : (
        <>
          {phone && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${phone}`)}
              style={{
                backgroundColor: "#4A2D8F",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 10,
                borderRadius: 8,
                marginBottom: sms || url ? 8 : 0,
              }}
            >
              <Phone color="white" size={14} style={{ marginRight: 6 }} />
              <Text
                style={{
                  color: "white",
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                Call {phone}
              </Text>
            </TouchableOpacity>
          )}
          {sms && (
            <TouchableOpacity
              onPress={() => Linking.openURL(sms)}
              style={{
                backgroundColor: "#4A2D8F",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 10,
                borderRadius: 8,
                marginBottom: url ? 8 : 0,
              }}
            >
              <MessageCircle
                color="white"
                size={14}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: "white",
                  fontSize: 13,
                  fontWeight: "bold",
                }}
              >
                {sms.includes("LOVEIS")
                  ? "Text LOVEIS to 22522"
                  : sms.includes("TEEN")
                    ? "Text TEEN to 839863"
                    : "Text"}
              </Text>
            </TouchableOpacity>
          )}
          {url && (
            <TouchableOpacity
              onPress={() => Linking.openURL(url)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 8,
              }}
            >
              <ExternalLink
                color="#4A2D8F"
                size={14}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: "#4A2D8F",
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                Visit{" "}
                {
                  url
                    .replace("https://", "")
                    .replace("http://", "")
                    .split("/")[0]
                }
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}
