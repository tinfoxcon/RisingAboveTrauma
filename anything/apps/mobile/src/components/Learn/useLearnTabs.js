import { useState } from "react";

export function useLearnTabs() {
  const [activeTab, setActiveTab] = useState("podcast");

  return {
    activeTab,
    setActiveTab,
  };
}
