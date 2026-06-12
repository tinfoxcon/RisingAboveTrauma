import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { CourseCard } from "./CourseCard";

export function CoursesTab() {
  const router = useRouter();

  return (
    <View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        The Healing to Freedom Journey
      </Text>
      <TouchableOpacity onPress={() => router.push("/course/1")}>
        <CourseCard
          number={1}
          title="Understanding What Happened To Me"
          subtitle="Healing — You Are A Victim And That Is Okay"
          badge="Rise"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/course/2")}>
        <CourseCard
          number={2}
          title="Reclaiming My Identity"
          subtitle="Clarity — You Are A Survivor And You Are Emerging"
          badge="Rise"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/course/3")}>
        <CourseCard
          number={3}
          title="Setting Boundaries That Hold"
          subtitle="Strength — You Are A Warrior And You Are Growing"
          badge="Rise"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/course/4")}>
        <CourseCard
          number={4}
          title="Building My New Life"
          subtitle="Rebuilding — You Are A Thriver And You Are Building"
          badge="Rise"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/course/5")}>
        <CourseCard
          number={5}
          title="Leading My Own Life Again"
          subtitle="Freedom — You Are A Leader And You Are Free"
          badge="Rise"
        />
      </TouchableOpacity>
    </View>
  );
}
