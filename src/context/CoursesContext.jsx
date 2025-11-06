import { createContext, useContext, useState } from 'react';

import { initialCourses } from '../mocks/data';

export const CoursesContext = createContext({
  courses: [],
  setCourses: () => {},
});

export function CoursesProvider({ children, initialData = initialCourses }) {
  const [courses, setCourses] = useState(initialData);

  return (
    <CoursesContext.Provider value={{ courses, setCourses }}>{children}</CoursesContext.Provider>
  );
}

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses deve ser usado dentro de um CoursesProvider');
  }
  return context;
};
