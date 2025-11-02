import { createContext, useContext, useState } from 'react';

import { initialClasses } from '../mocks/data';

export const ClassesContext = createContext({
  classes: [],
  setClasses: () => {},
});

export function ClassesProvider({ children, initialData = initialClasses }) {
  const [classes, setClasses] = useState(initialData);

  return (
    <ClassesContext.Provider value={{ classes, setClasses }}>{children}</ClassesContext.Provider>
  );
}

export const useClasses = () => {
  const context = useContext(ClassesContext);
  if (!context) {
    throw new Error('useClasses deve ser usado dentro de um ClassesProvider');
  }
  return context;
};
