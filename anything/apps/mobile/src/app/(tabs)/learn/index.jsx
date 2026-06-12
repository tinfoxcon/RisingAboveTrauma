import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import SafetyButtons from "@/components/SafetyButtons";
import useUser from "@/utils/auth/useUser";
import { Tab } from "@/components/Learn/Tab";
import { useLearnTabs } from "@/components/Learn/useLearnTabs";
import { PodcastTab } from "@/components/Learn/PodcastTab";
import { CoursesTab } from "@/components/Learn/CoursesTab";
import { LegalTab } from "@/components/Learn/LegalTab";
import { RightsTab } from "@/components/Learn/RightsTab";
import { CompensationTab } from "@/components/Learn/CompensationTab";
import { LeavingTab } from "@/components/Learn/LeavingTab";
import { WorkplaceTab } from "@/components/Learn/WorkplaceTab";
import { InterfamilyTab } from "@/components/Learn/InterfamilyTab";
import { CrimeVictimsRightsTab } from "@/components/Learn/CrimeVictimsRightsTab";

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
  const { activeTab, setActiveTab } = useLearnTabs();
  const { data: user } = useUser();

  return (
    <View
      style={{ flex: 1, backgroundColor: "#F3F0F8", paddingTop: insets.top }}
    >
      <StatusBar style="dark" />
      <SafetyButtons />

      <View
        style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#4A2D8F",
            marginBottom: 20,
          }}
        >
          Learn
        </Text>

        {/* Tab Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, marginBottom: 20 }}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <Tab
            icon="🎓"
            label="Courses"
            active={activeTab === "courses"}
            onPress={() => setActiveTab("courses")}
          />
          <Tab
            icon="🏛️"
            label="Crime Victims Rights"
            active={activeTab === "crimevictims"}
            onPress={() => setActiveTab("crimevictims")}
          />
          <Tab
            icon="❤️‍🩹"
            label="Interfamily Violence"
            active={activeTab === "interfamily"}
            onPress={() => setActiveTab("interfamily")}
          />
          <Tab
            icon="🛡️"
            label="Know Your Rights"
            active={activeTab === "rights"}
            onPress={() => setActiveTab("rights")}
          />
          <Tab
            icon="⚖️"
            label="Legal"
            active={activeTab === "legal"}
            onPress={() => setActiveTab("legal")}
          />
          <Tab
            icon="🎧"
            label="Podcast"
            active={activeTab === "podcast"}
            onPress={() => setActiveTab("podcast")}
          />
          <Tab
            icon="💰"
            label="Victim Compensation"
            active={activeTab === "compensation"}
            onPress={() => setActiveTab("compensation")}
          />
          <Tab
            icon="⏰"
            label="Why Leaving Takes Time"
            active={activeTab === "leaving"}
            onPress={() => setActiveTab("leaving")}
          />
          <Tab
            icon="💼"
            label="Workplace Violence"
            active={activeTab === "workplace"}
            onPress={() => setActiveTab("workplace")}
          />
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 80,
        }}
      >
        {activeTab === "courses" && <CoursesTab />}
        {activeTab === "crimevictims" && <CrimeVictimsRightsTab />}
        {activeTab === "interfamily" && <InterfamilyTab />}
        {activeTab === "rights" && <RightsTab />}
        {activeTab === "legal" && <LegalTab />}
        {activeTab === "podcast" && <PodcastTab />}
        {activeTab === "compensation" && <CompensationTab />}
        {activeTab === "leaving" && <LeavingTab />}
        {activeTab === "workplace" && <WorkplaceTab />}
      </ScrollView>
    </View>
  );
}
