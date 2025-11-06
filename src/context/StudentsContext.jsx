import { createContext, useContext, useState } from 'react';

import { initialStudents } from '../mocks/data';

export const StudentsContext = createContext({
  students: [],
  setStudents: () => {},
});

export function StudentsProvider({ children, initialData = initialStudents }) {
  const [students, setStudents] = useState(initialData);

  return (
    <StudentsContext.Provider value={{ students, setStudents }}>
      {children}
    </StudentsContext.Provider>
  );
}

export const useStudents = () => {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error('useStudents deve ser usado dentro de um StudentsProvider');
  }
  return context;
};
