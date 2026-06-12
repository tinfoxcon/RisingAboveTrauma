import { useEffect, useMemo } from "react";
import {
  NativeModules,
  Platform,
  StyleSheet,
  processColor,
} from "react-native";
import { useAuthStore } from "@/utils/auth/store";

const STANDARD_THEME = {
  mode: "standard",
  appName: "Rising Above Trauma",
  launcherName: "Rising Above Trauma",
  splashIcon: "🕊️",
  displayNameLines: ["Rising Above", "Trauma"],
  subtitle: "DV Safety · Clarity · Next Steps",
  homeHeadline: "YOU ARE NOT HERE BY ACCIDENT",
  homeIntro: [
    "I know what it feels like to live through victimization, to fight through survival, and to rise into freedom. Many of the options in this app were not available to me. For much of my lived experience, I had to navigate it alone because I wasn't taken seriously. That reality led me to take my safety into my own hands.",
    "Rising Above Trauma was created so you won't have to feel alone in the midst of trauma. Inside this app, you'll find resources and courses designed to give you insight into the judicial system, domestic violence information, and national and international support available at your fingertips when you need it most.",
    "My hope is that this app helps fill the gaps in your journey toward freedom from abuse in every area of your life. What is happening to you is not your fault. The blame belongs to the abuser, not to you. Don't carry responsibility for harm you did not create.",
    "You have been, are, and always will be a MASTERPIECE.",
  ],
  founderAttribution: "Founder · Rising Above Trauma · My F.O.C.U.S. LLC",
  splashQuote:
    '"I built this because I needed it and it did not exist. Everything here comes from what I lived and what I wish someone had handed me. You are not alone."',
  onboardingFooter: "Founder · Rising Above Trauma · My F.O.C.U.S. LLC",
  colors: {
    background: "#F3F0F8",
    backgroundStrong: "#EEE8F7",
    surface: "#FFFFFF",
    surfaceAlt: "#FDF6E3",
    border: "#D9D1E6",
    primary: "#5B2CA0",
    primaryDark: "#4A2D8F",
    primarySoft: "#F0EBF8",
    accent: "#D9A62B",
    accentSoft: "#F0B429",
    text: "#2B2438",
    muted: "#6E6480",
    mutedStrong: "#7A6B8A",
    inactive: "#7E7A86",
    activeTab: "#7A6B8A",
    switchOn: "#4A2D8F",
    splashOverlayStart: "rgba(74, 45, 143, 0.7)",
    splashOverlayEnd: "rgba(240, 180, 41, 0.7)",
  },
};

const DISCREET_THEME = {
  mode: "discreet",
  appName: "My Journal",
  launcherName: Platform.OS === "android" ? "My Journal" : "Rising Above Trauma",
  splashIcon: "📓",
  displayNameLines: ["My", "Journal"],
  subtitle: "Private notes · Reflections · Check-ins",
  homeHeadline: "WELCOME BACK",
  homeIntro: [
    "This space is set up to look and feel quiet, neutral, and private whenever you need it to.",
    "Use My Journal for personal notes, reflection, check-ins, and planning at your own pace.",
    "Your settings, progress, and saved information stay with your account so the discreet experience is ready each time you return.",
  ],
  founderAttribution: "My Journal",
  splashQuote:
    '"A calm place for reflection, notes, and private check-ins whenever you need a moment to yourself."',
  onboardingFooter: "My Journal",
  colors: {
    background: "#F4F4F5",
    backgroundStrong: "#E4E4E7",
    surface: "#FFFFFF",
    surfaceAlt: "#FAFAFA",
    border: "#D4D4D8",
    primary: "#4B5563",
    primaryDark: "#374151",
    primarySoft: "#E5E7EB",
    accent: "#9CA3AF",
    accentSoft: "#D1D5DB",
    text: "#27272A",
    muted: "#71717A",
    mutedStrong: "#52525B",
    inactive: "#71717A",
    activeTab: "#52525B",
    switchOn: "#4B5563",
    splashOverlayStart: "rgba(39, 39, 42, 0.74)",
    splashOverlayEnd: "rgba(82, 82, 91, 0.74)",
  },
};

const THEMES = {
  standard: STANDARD_THEME,
  discreet: DISCREET_THEME,
};

const BRAND_COLOR_MAP = {
  "#f3f0f8": DISCREET_THEME.colors.background,
  "#eee8f7": DISCREET_THEME.colors.backgroundStrong,
  "#f0ebf8": DISCREET_THEME.colors.primarySoft,
  "#fdf6e3": DISCREET_THEME.colors.surfaceAlt,
  "#d9d1e6": DISCREET_THEME.colors.border,
  "#5b2ca0": DISCREET_THEME.colors.primary,
  "#4a2d8f": DISCREET_THEME.colors.primaryDark,
  "#d9a62b": DISCREET_THEME.colors.accent,
  "#f0b429": DISCREET_THEME.colors.accentSoft,
  "#2b2438": DISCREET_THEME.colors.text,
  "#6e6480": DISCREET_THEME.colors.muted,
  "#7a6b8a": DISCREET_THEME.colors.mutedStrong,
  "#7e7a86": DISCREET_THEME.colors.inactive,
  "rgba(74, 45, 143, 0.7)": DISCREET_THEME.colors.splashOverlayStart,
  "rgba(240, 180, 41, 0.7)": DISCREET_THEME.colors.splashOverlayEnd,
};

const COLOR_PREPROCESSOR_PROPS = [
  "color",
  "backgroundColor",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "shadowColor",
  "textDecorationColor",
  "textShadowColor",
  "overlayColor",
];

let preprocessorsInstalled = false;
let discreetModeEnabled = false;
let lastNativeSyncValue = null;

export function getBranding(isDiscreetMode = false) {
  return isDiscreetMode ? THEMES.discreet : THEMES.standard;
}

export function getBrandColor(value, isDiscreetMode = discreetModeEnabled) {
  if (!isDiscreetMode || typeof value !== "string") {
    return value;
  }

  return BRAND_COLOR_MAP[value.toLowerCase()] || value;
}

function preprocessColorValue(value) {
  const nextValue = getBrandColor(value);
  return processColor(nextValue);
}

export function installBrandColorPreprocessors() {
  if (
    preprocessorsInstalled ||
    typeof StyleSheet.setStyleAttributePreprocessor !== "function"
  ) {
    return;
  }

  COLOR_PREPROCESSOR_PROPS.forEach((prop) => {
    StyleSheet.setStyleAttributePreprocessor(prop, preprocessColorValue);
  });

  preprocessorsInstalled = true;
}

export function setDiscreetModeEnabled(enabled) {
  discreetModeEnabled = Boolean(enabled);
}

export function useBranding() {
  const isDiscreetMode = useAuthStore(
    (state) => Boolean(state.auth?.user?.discreet_mode),
  );

  useEffect(() => {
    setDiscreetModeEnabled(isDiscreetMode);
  }, [isDiscreetMode]);

  return useMemo(
    () => ({
      isDiscreetMode,
      theme: getBranding(isDiscreetMode),
    }),
    [isDiscreetMode],
  );
}

export async function syncNativeDiscreetMode(enabled, { force = false } = {}) {
  const nextValue = Boolean(enabled);
  setDiscreetModeEnabled(nextValue);

  if (!force && lastNativeSyncValue === nextValue) {
    return { supported: true, skipped: true };
  }

  const module = NativeModules.DiscreetModeModule;
  if (!module?.setDiscreetMode) {
    return { supported: false };
  }

  try {
    const result = await module.setDiscreetMode(nextValue);
    lastNativeSyncValue = nextValue;
    return result || { supported: true };
  } catch (error) {
    console.error("Native discreet mode sync failed:", error);
    return { supported: false, error };
  }
}
