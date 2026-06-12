import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";

export function InternalResourceCard({ title, description, path }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => path && router.push(path)}
      style={{
        backgroundColor: "#F3F0FF",
        borderWidth: 1,
        borderColor: "#D4C5F9",
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
        {path && (
          <ChevronRight color="#4A2D8F" size={20} style={{ marginLeft: 12 }} />
        )}
      </View>
    </TouchableOpacity>
  );
}
