import { useMemo, useState } from 'react';

/**
 * Hook para gerenciar progresso do módulo atual
 */
export const useModuleProgress = ({ selectedModule, user }) => {
  const [completedLessonsUI, setCompletedLessonsUI] = useState(new Set());

  const completedLessons = useMemo(() => new Set(completedLessonsUI), [completedLessonsUI]);

  const lessonProgress = useMemo(() => {
    if (!selectedModule || !selectedModule.lessons || selectedModule.lessons.length === 0)
      return 0;
    return (completedLessons.size / selectedModule.lessons.length) * 100;
  }, [completedLessons, selectedModule]);

  const allLessonsCompleted = useMemo(() => lessonProgress >= 100, [lessonProgress]);

  const isQuizFinalized =
    selectedModule && user.progress.finalizedQuizzes.has(selectedModule.id);

  const initializeProgress = (module) => {
    if (!module) return;
    const studentProgress = user.progress.completedLessons;
    const moduleLessons = new Set(module.lessons.map((l) => l.id));
    const completedInThisModule = new Set(
      [...studentProgress].filter((id) => moduleLessons.has(id))
    );
    setCompletedLessonsUI(completedInThisModule);
  };

  return {
    completedLessons,
    lessonProgress,
    allLessonsCompleted,
    isQuizFinalized,
    setCompletedLessonsUI,
    initializeProgress,
  };
};

