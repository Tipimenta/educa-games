/**
 * Funções utilitárias para operações relacionadas a turmas
 */

/**
 * Obtém string formatada com nomes de turmas a partir de IDs de turmas
 * @param {Array} classIds - Array de IDs de turmas
 * @param {Array} classes - Array de todas as turmas com {id, name}
 * @returns {string} String formatada com nomes de turmas
 */
export const getClassNames = (classIds, classes) => {
  if (!classIds || classIds.length === 0) return 'Nenhuma turma';
  if (classIds.length === classes.length) return 'Todas as turmas';
  return classIds
    .map((id) => classes.find((c) => c.id === id)?.name)
    .filter(Boolean)
    .join(', ');
};

/**
 * Obtém nome da turma por ID
 * @param {number|string} classId - ID da turma
 * @param {Array} classes - Array de todas as turmas
 * @returns {string} Nome da turma ou string vazia
 */
export const getClassNameById = (classId, classes) => {
  const classItem = classes.find((c) => c.id === classId);
  return classItem?.name || '';
};

/**
 * Verifica se uma turma está atribuída a um curso/anúncio
 * @param {number|string} classId - ID da turma para verificar
 * @param {Array} assignedClasses - Array de IDs de turmas atribuídas
 * @returns {boolean} True se a turma está atribuída
 */
export const isClassAssigned = (classId, assignedClasses) => {
  return assignedClasses.includes(classId);
};
