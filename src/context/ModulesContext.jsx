import { createContext, useContext, useState } from 'react';

import { initialModules } from '../mocks/data';

export const ModulesContext = createContext({
  modules: [],
  setModules: () => {},
});

export function ModulesProvider({ children, initialData = initialModules }) {
  const [modules, setModules] = useState(initialData);

  return (
    <ModulesContext.Provider value={{ modules, setModules }}>{children}</ModulesContext.Provider>
  );
}

export const useModules = () => {
  const context = useContext(ModulesContext);
  if (!context) {
    throw new Error('useModules deve ser usado dentro de um ModulesProvider');
  }
  return context;
};
