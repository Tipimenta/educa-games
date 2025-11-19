import { useEffect, useMemo, useState } from 'react';

export const useModuleProgress = ({ selectedModule, user }) => {
  const [completedLessonsUI, setCompletedLessonsUI] = useState(new Set());

  const completedLessons = useMemo(() => {
    if (!selectedModule?.lessons) return new Set();
    const completed = new Set(
      selectedModule.lessons.filter((lesson) => lesson.isCompleted).map((lesson) => lesson.id)
    );
    return new Set([...completed, ...completedLessonsUI]);
  }, [selectedModule, completedLessonsUI]);

  const lessonProgress = useMemo(() => {
    if (!selectedModule || !selectedModule.lessons || selectedModule.lessons.length === 0) return 0;
    return selectedModule.progress || 0;
  }, [selectedModule]);

  const allLessonsCompleted = useMemo(() => {
    if (!selectedModule?.lessons || selectedModule.lessons.length === 0) return false;
    return selectedModule.lessons.every((lesson) => lesson.isCompleted);
  }, [selectedModule]);

  const isQuizFinalized = useMemo(() => {
    return selectedModule?.quiz?.isCompleted || false;
  }, [selectedModule]);

  const initializeProgress = (module) => {
    if (!module?.lessons) return;
    const completedInThisModule = new Set(
      module.lessons.filter((l) => l.isCompleted).map((l) => l.id)
    );
    setCompletedLessonsUI(completedInThisModule);
  };

  useEffect(() => {
    if (selectedModule) {
      initializeProgress(selectedModule);
    }
  }, [selectedModule]);

  return {
    completedLessons,
    lessonProgress,
    allLessonsCompleted,
    isQuizFinalized,
    setCompletedLessonsUI,
    initializeProgress,
  };
};
