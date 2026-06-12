import { Stack } from "expo-router";

export default function CourseLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[courseId]" />
      <Stack.Screen name="[courseId]/quiz" />
      <Stack.Screen name="[courseId]/certificate" />
      <Stack.Screen name="[courseId]/lesson/[lessonId]" />
    </Stack>
  );
}
