export const getClassNames = (classIds, classes) => {
  if (!classIds || classIds.length === 0) return 'Nenhuma turma';
  if (classIds.length === classes.length) return 'Todas as turmas';
  return classIds
    .map((id) => classes.find((c) => c.id === id)?.name)
    .filter(Boolean)
    .join(', ');
};

export const getClassNameById = (classId, classes) => {
  const classItem = classes.find((c) => c.id === classId);
  return classItem?.name || '';
};

export const isClassAssigned = (classId, assignedClasses) => {
  return assignedClasses.includes(classId);
};
