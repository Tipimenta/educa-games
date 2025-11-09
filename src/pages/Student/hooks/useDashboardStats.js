import { useMemo } from 'react';

export const useDashboardStats = ({ user, students, courses, modules }) => {
  const currentUserData = useMemo(() => {
    const found = students.find((s) => s.id === user.id);
    // Se encontrou nos students, usa ele, senão usa o user mas garante campos padrão
    if (found) {
      return found;
    }
    // Garante que o user tenha os campos necessários
    return {
      ...user,
      score: user.score || 0,
      previousScore: user.previousScore || 0,
      loginStreak: user.loginStreak || 0,
      progress: user.progress || {
        completedLessons: new Set(),
        finalizedQuizzes: new Set(),
        dailyBonusDay: null,
      },
    };
  }, [students, user]);

  const studentsInClass = useMemo(() => {
    return students.filter((s) => s.classId === user.classId);
  }, [students, user.classId]);

  const currentRanking = useMemo(() => {
    return [...studentsInClass].sort((a, b) => b.score - a.score);
  }, [studentsInClass]);

  const previousRanking = useMemo(() => {
    return [...studentsInClass].sort((a, b) => (b.previousScore || 0) - (a.previousScore || 0));
  }, [studentsInClass]);

  const userRank = useMemo(() => {
    return currentRanking.findIndex((s) => s.id === user.id) + 1;
  }, [currentRanking, user.id]);

  const coursesForClass = useMemo(() => {
    return courses.filter((c) => c.assignedClasses.includes(user.classId));
  }, [courses, user.classId]);

  const courseIdsForClass = useMemo(() => {
    return coursesForClass.map((c) => c.id);
  }, [coursesForClass]);

  const totalAssignedModules = useMemo(() => {
    return modules.filter((m) => courseIdsForClass.includes(m.courseId));
  }, [modules, courseIdsForClass]);

  const completedModulesCount = useMemo(() => {
    // Garante que progress existe, caso contrário retorna 0
    if (!currentUserData.progress) {
      return 0;
    }
    return totalAssignedModules.filter((module) => {
      const hasLessons = module.lessons && Array.isArray(module.lessons);
      const allLessonsDone = hasLessons
        ? module.lessons.every((lesson) => {
            const completedLessons = currentUserData.progress.completedLessons;
            return completedLessons && completedLessons.has && completedLessons.has(lesson.id);
          })
        : false;

      const hasQuiz = module.quiz && module.quiz.questions && module.quiz.questions.length > 0;
      const finalizedQuizzes = currentUserData.progress.finalizedQuizzes;
      const quizDone =
        !hasQuiz || (finalizedQuizzes && finalizedQuizzes.has && finalizedQuizzes.has(module.id));

      return allLessonsDone && quizDone;
    }).length;
  }, [totalAssignedModules, currentUserData.progress]);

  const totalModulesCount = useMemo(() => {
    return totalAssignedModules.length;
  }, [totalAssignedModules]);

  return {
    currentUserData,
    studentsInClass,
    currentRanking,
    previousRanking,
    userRank,
    coursesForClass,
    totalAssignedModules,
    completedModulesCount,
    totalModulesCount,
  };
};
