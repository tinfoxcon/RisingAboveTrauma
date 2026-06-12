import { Stack } from "expo-router";

export default function CheckInLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="step2" />
      <Stack.Screen name="high-risk" />
      <Stack.Screen name="step3" />
      <Stack.Screen name="emergency" />
      <Stack.Screen name="step4" />
      <Stack.Screen name="step5" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
