import { useState } from 'react';

export const useClassSelection = (initialSelection = []) => {
  const [selectedClasses, setSelectedClasses] = useState(initialSelection);

  const toggleClass = (classId) => {
    setSelectedClasses((prev) => {
      if (prev.includes(classId)) {
        return prev.filter((id) => id !== classId);
      }
      return [...prev, classId];
    });
  };

  const selectClass = (classId) => {
    setSelectedClasses((prev) => {
      if (!prev.includes(classId)) {
        return [...prev, classId];
      }
      return prev;
    });
  };

  const deselectClass = (classId) => {
    setSelectedClasses((prev) => prev.filter((id) => id !== classId));
  };

  const selectAll = (allClassIds) => {
    setSelectedClasses([...allClassIds]);
  };

  const deselectAll = () => {
    setSelectedClasses([]);
  };

  const reset = (newSelection = initialSelection) => {
    setSelectedClasses(newSelection);
  };

  return {
    selectedClasses,
    setSelectedClasses,
    toggleClass,
    selectClass,
    deselectClass,
    selectAll,
    deselectAll,
    reset,
  };
};
