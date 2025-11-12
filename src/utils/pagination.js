export const paginate = (data = [], page = 0, size = 10) => {
  const totalElements = Array.isArray(data) ? data.length : 0;
  const pageSize = Number.isFinite(size) && size > 0 ? size : 10;
  const pageNumber = Number.isFinite(page) && page >= 0 ? page : 0;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const start = pageNumber * pageSize;
  const end = start + pageSize;
  const content = (Array.isArray(data) ? data : []).slice(start, end);
  return {
    content,
    totalElements,
    totalPages,
    size: pageSize,
    number: pageNumber,
    first: pageNumber === 0,
    last: pageNumber >= totalPages - 1,
  };
};

export const sortArray = (data = [], key = 'name', dir = 'ASC') => {
  const direction = String(dir).toUpperCase() === 'DESC' ? -1 : 1;
  return [...(Array.isArray(data) ? data : [])].sort((a, b) => {
    const av = (a?.[key] ?? '').toString().toLowerCase();
    const bv = (b?.[key] ?? '').toString().toLowerCase();
    if (av < bv) return -1 * direction;
    if (av > bv) return 1 * direction;
    return 0;
  });
};