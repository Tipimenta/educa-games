import { useContext } from 'react';

import { AuthContext, ModulesContext, StudentsContext } from '../context';

export const useStudentProgress = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setStudents } = useContext(StudentsContext);
  const { modules } = useContext(ModulesContext);

  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const updateStudentProgress = (studentId, type, itemId, pointsToAdd) => {
    setStudents((prevStudents) => {
      const newStudents = [...prevStudents];
      const studentIndex = newStudents.findIndex((s) => s.id === studentId);

      if (studentIndex === -1) return prevStudents;

      const student = { ...newStudents[studentIndex] };
      const progressSet = student.progress[type];
      const todayDateString = getTodayDateString();

      let bonusPoints = 0;

      if (type === 'completedLessons' && student.progress.dailyBonusDay !== todayDateString) {
        bonusPoints = 25;
        student.progress.dailyBonusDay = todayDateString;
      }

      if (!progressSet.has(itemId)) {
        student.score += pointsToAdd + bonusPoints;
        progressSet.add(itemId);

        if (type === 'finalizedQuizzes') {
          const moduleId = itemId;
          const module = modules.find((m) => m.id === moduleId);

          const courseModules = modules
            .filter((m) => m.courseId === module.courseId)
            .sort((a, b) => a.id - b.id);

          const currentModuleIndex = courseModules.findIndex((m) => m.id === moduleId);

          const allLessonsInModule = module.lessons.every((lesson) =>
            student.progress.completedLessons.has(lesson.id)
          );

          if (
            allLessonsInModule &&
            student.currentModuleId === moduleId &&
            currentModuleIndex < courseModules.length - 1
          ) {
            student.currentModuleId = courseModules[currentModuleIndex + 1].id;
          }
        }

        if (user && user.id === studentId) {
          setUser((prevUser) => ({ ...prevUser, ...student }));
        }
      }

      newStudents[studentIndex] = student;

      return newStudents;
    });
  };

  return { updateStudentProgress };
};
