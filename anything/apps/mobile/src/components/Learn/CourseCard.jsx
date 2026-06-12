import { View, Text, TouchableOpacity } from "react-native";

export function CourseCard({ number, title, subtitle, badge }) {
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>
            Course {number}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#1F2937",
              marginBottom: 4,
            }}
          >
            {title}
          </Text>
          <Text style={{ fontSize: 14, color: "#F0B429", fontStyle: "italic" }}>
            {subtitle}
          </Text>
        </View>
        {badge && (
          <View
            style={{
              backgroundColor: "#F0B429",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 11, color: "white", fontWeight: "bold" }}>
              {badge}
            </Text>
          </View>
        )}
      </View>
      <Text style={{ fontSize: 12, color: "#6B7280" }}>
        5 lessons • 20-30 min each
      </Text>
    </View>
  );
}
