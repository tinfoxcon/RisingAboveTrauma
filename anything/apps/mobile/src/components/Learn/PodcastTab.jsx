import { View, Text } from "react-native";
import { Image } from "expo-image";
import { WebView } from "react-native-webview";
import { ResourceCard } from "@/components/Resources/ResourceCard";

export function PodcastTab() {
  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 10,
        }}
      >
        Rising Above It All
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#6B7280",
          marginBottom: 15,
          lineHeight: 22,
        }}
      >
        with Dr. Mildred D. Muhammad, D.Hum
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 20,
          lineHeight: 22,
        }}
      >
        A no-nonsense podcast about healing, growth, and reclaiming your power.
        Drawing from lived experience and professional expertise, Dr. Muhammad
        tackles the inner struggles that keep us tied to unhealthy people and
        patterns.
      </Text>

      <ResourceCard
        title="Rising Above It All Podcast"
        description="Listen to Dr. Mildred D. Muhammad on Apple Podcasts. New episodes on healing, growth, and reclaiming your power."
        url="https://podcasts.apple.com/us/podcast/rising-above-it-all-with-dr-mildred-muhammad/id1456293764"
        linkLabel="Listen"
      />

      <Text
        style={{
          fontSize: 12,
          color: "#9CA3AF",
          textAlign: "center",
          marginTop: 2,
          marginBottom: 40,
        }}
      >
        Opens external website
      </Text>

      {/* SECTION 1 - Speaker Reel */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 15,
        }}
      >
        🎬 Meet Dr. Mildred D. Muhammad, D.Hum
      </Text>
      <View
        style={{
          backgroundColor: "#FEF3C7",
          padding: 12,
          borderRadius: 8,
          marginBottom: 15,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#92400E",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Watch only when it is safe to do so.
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          height: 220,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 40,
        }}
      >
        <WebView
          source={{ uri: "https://www.youtube.com/embed/mhsmezPcGuU" }}
          allowsFullscreenVideo={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          style={{ flex: 1 }}
        />
      </View>

      {/* SECTION 2 - Audiobook */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#4A2D8F",
          marginBottom: 8,
        }}
      >
        📖 Scared Silent: The Audiobook
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "#6B7280",
          fontStyle: "italic",
          marginBottom: 15,
        }}
      >
        When the One You Love Becomes the One You Fear
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#374151",
          marginBottom: 20,
          lineHeight: 22,
        }}
      >
        The powerful true story of survival, courage, and rising above, now
        available as an audiobook.
      </Text>
      <View
        style={{
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Image
          source={{
            uri: "https://ucarecdn.com/17dc9ee3-4145-4a81-a981-46727c694f4f/-/format/auto/",
          }}
          style={{
            width: 180,
            height: 270,
            borderRadius: 8,
          }}
          contentFit="cover"
        />
      </View>

      <ResourceCard
        title="Scared Silent: The Audiobook"
        description="Listen to Dr. Mildred D. Muhammad's powerful true story of survival and courage, now available on Apple Books."
        url="https://books.apple.com/us/audiobook/scared-silent-unabridged/id1877199612"
        linkLabel="Listen"
      />

      <Text
        style={{
          fontSize: 12,
          color: "#9CA3AF",
          textAlign: "center",
          marginTop: 2,
        }}
      >
        Opens external website
      </Text>
    </View>
  );
}
