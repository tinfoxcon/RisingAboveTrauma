import { Text } from "react-native";

export function SectionTitle({ children }) {
  return (
    <Text
      style={{
        fontSize: 14,
        fontWeight: "bold",
        color: "#7A6B8A",
        marginTop: 16,
        marginBottom: 8,
      }}
    >
      {children}
    </Text>
  );
}

export function SectionText({ children }) {
  return (
    <Text
      style={{
        fontSize: 14,
        color: "#374151",
        lineHeight: 22,
        marginBottom: 8,
      }}
    >
      {children}
    </Text>
  );
}

export function BulletPoint({ text }) {
  return (
    <Text
      style={{
        fontSize: 14,
        color: "#374151",
        lineHeight: 22,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: "#7A6B8A", marginRight: 8 }}>•</Text>
      {text}
    </Text>
  );
}

export function StepItem({ number, text }) {
  return (
    <Text
      style={{
        fontSize: 14,
        color: "#374151",
        lineHeight: 22,
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: "#7A6B8A",
          color: "#FFFFFF",
          fontSize: 12,
          fontWeight: "bold",
          textAlign: "center",
          lineHeight: 24,
          marginRight: 12,
        }}
      >
        {number}
      </Text>
      {"  "}
      {text}
    </Text>
  );
}
