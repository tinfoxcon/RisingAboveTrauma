import { Text } from "react-native";

export function SectionHeader({ children, style }) {
  return (
    <Text
      style={{
        fontSize: 18,
        fontWeight: "bold",
        color: "#4A2D8F",
        marginBottom: 15,
        marginTop: 30,
        ...style,
      }}
    >
      {children}
    </Text>
  );
}
