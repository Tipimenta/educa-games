/**
 * Funções utilitárias para formatação de datas
 */

/**
 * Formata uma string de data ou objeto Date para o formato brasileiro (dd/mm/yyyy)
 * @param {string|Date} date - String de data (YYYY-MM-DD) ou objeto Date
 * @param {Object} options - Opções do Intl.DateTimeFormat
 * @returns {string} String de data formatada
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '-';

  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  };

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR', defaultOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

/**
 * Formata uma string de data para o formato brasileiro com tratamento de fuso horário
 * @param {string} dateString - String de data (YYYY-MM-DD)
 * @param {string} timeZone - Fuso horário (padrão: UTC)
 * @returns {string} String de data formatada
 */
export const formatDateWithTimezone = (dateString, timeZone = 'UTC') => {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone,
    });
  } catch (error) {
    console.error('Error formatting date with timezone:', error);
    return '-';
  }
};

/**
 * Obtém string de tempo relativo (ex: "há 2 dias", "em 3 dias")
 * @param {string|Date} date - String de data ou objeto Date
 * @returns {string} String de tempo relativo
 */
export const getRelativeTime = (date) => {
  if (!date) return '-';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = dateObj.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays === -1) return 'Ontem';
    if (diffDays > 0) return `Em ${diffDays} dias`;
    return `Há ${Math.abs(diffDays)} dias`;
  } catch (error) {
    console.error('Error calculating relative time:', error);
    return '-';
  }
};
