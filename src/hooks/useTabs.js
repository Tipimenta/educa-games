import { useMemo, useState } from 'react';

/**
 * Hook para gerenciar abas e seleção de dados baseado na aba ativa
 * @param {Object} config - Objeto de configuração
 * @param {Object} config.tabs - Objeto com dados das abas, indexado por ID da aba
 * @param {string} config.defaultTab - ID da aba ativa padrão
 * @param {Function} config.onTabChange - Callback opcional quando a aba muda
 * @returns {Object} - Estado da aba e dados atuais
 */
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
