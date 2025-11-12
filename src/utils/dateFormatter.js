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
    if (import.meta.env.DEV) console.error('Error formatting date:', error);
    return '-';
  }
};

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
    if (import.meta.env.DEV) console.error('Error formatting date with timezone:', error);
    return '-';
  }
};

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
    if (import.meta.env.DEV) console.error('Error calculating relative time:', error);
    return '-';
  }
};
