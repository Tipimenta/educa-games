import { useMemo, useState } from 'react';

export const useTabs = ({ tabs, defaultTab, onTabChange: onTabChangeCallback }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const currentData = useMemo(() => {
    return tabs[activeTab] || null;
  }, [tabs, activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onTabChangeCallback) {
      onTabChangeCallback(tabId);
    }
  };

  return {
    activeTab,
    setActiveTab,
    currentData,
    handleTabChange,
  };
};
