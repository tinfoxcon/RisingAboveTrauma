import { View, Text, TouchableOpacity, Linking } from "react-native";
import { ExternalLink, Phone } from "lucide-react-native";

export function ResourceCard({ title, description, url, linkLabel }) {
  const isCallLink = url && url.startsWith("tel:");
  const label = linkLabel || (isCallLink ? "Call" : "Visit");
  const Icon = isCallLink ? Phone : ExternalLink;

  return (
    <TouchableOpacity
      onPress={() => url && Linking.openURL(url)}
      style={{
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#4A2D8F",
              marginBottom: 4,
            }}
          >
            {title}
          </Text>
          {description && (
            <Text style={{ fontSize: 14, color: "#6B7280", lineHeight: 20 }}>
              {description}
            </Text>
          )}
        </View>
        {url && (
          <View style={{ alignItems: "center", marginLeft: 12 }}>
            <Icon color="#4A2D8F" size={18} />
            <Text
              style={{
                fontSize: 11,
                color: "#4A2D8F",
                fontWeight: "700",
                marginTop: 3,
              }}
            >
              {label}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
