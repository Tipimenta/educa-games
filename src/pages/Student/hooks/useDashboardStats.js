import { useMemo } from 'react';

export const useDashboardStats = ({ user, students, courses, modules }) => {
  const currentUserData = useMemo(() => {
    return students.find((s) => s.id === user.id) || user;
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
    return totalAssignedModules.filter((module) => {
      const allLessonsDone = module.lessons.every((lesson) =>
        user.progress.completedLessons.has(lesson.id)
      );
      const quizDone =
        !module.quiz?.questions?.length > 0 || user.progress.finalizedQuizzes.has(module.id);
      return allLessonsDone && quizDone;
    }).length;
  }, [totalAssignedModules, user.progress]);

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
