import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#EEE8F7",
          borderTopWidth: 1,
          borderColor: "#D9D1E6",
          paddingTop: 4,
          paddingBottom: 4,
        },
        tabBarActiveTintColor: "#5B2CA0",
        tabBarInactiveTintColor: "#7E7A86",
        tabBarLabelStyle: {
          fontSize: 9.5,
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, textAlign: "center", width: 24 }}>
              🏠
            </Text>
          ),
          href: "/(tabs)",
        }}
      />

      {/* What's Your Status */}
      <Tabs.Screen
        name="status"
        options={{
          title: "Status",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, textAlign: "center", width: 24 }}>
              🧭
            </Text>
          ),
          href: "/(tabs)/status",
        }}
      />

      {/* Rise (formerly Upgrade) */}
      <Tabs.Screen
        name="upgrade"
        options={{
          title: "Rise",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, textAlign: "center", width: 24 }}>
              ⬆️
            </Text>
          ),
          href: "/(tabs)/upgrade",
        }}
      />

      {/* Resources */}
      <Tabs.Screen
        name="resources"
        options={{
          title: "Resources",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, textAlign: "center", width: 24 }}>
              🆘
            </Text>
          ),
          href: "/(tabs)/resources",
        }}
      />

      {/* Learn */}
      <Tabs.Screen
        name="learn/index"
        options={{
          title: "Learn",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, textAlign: "center", width: 24 }}>
              📖
            </Text>
          ),
          href: "/(tabs)/learn",
        }}
      />

      {/* My Journal - hidden from tab bar */}
      <Tabs.Screen
        name="my-journal"
        options={{
          href: null,
        }}
      />

      {/* Check-In - hidden from tab bar, accessible via direct navigation */}
      <Tabs.Screen
        name="check-in"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
