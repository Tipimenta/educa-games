import { useMemo, useState } from 'react';

export const useTableFilters = ({
  data = [],
  searchFields = [],
  defaultSort = { column: 'name', direction: 'asc' },
  defaultPageSize = 10,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState(defaultSort);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const lowerSearch = searchTerm.toLowerCase();
    return data.filter((item) => {
      if (searchFields.length === 0) {
        // Se não especificar campos, busca em todos os valores string
        return Object.values(item).some((value) => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(lowerSearch);
          }
          return false;
        });
      }
      return searchFields.some((field) => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(lowerSearch);
      });
    });
  }, [data, searchTerm, searchFields]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    const { column, direction } = sort;
    const dir = direction === 'asc' ? 1 : -1;

    sorted.sort((a, b) => {
      const aVal = a[column] || '';
      const bVal = b[column] || '';
      return String(aVal).localeCompare(String(bVal)) * dir;
    });

    return sorted;
  }, [filteredData, sort]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      data: sortedData.slice(startIndex, endIndex),
      totalItems: sortedData.length,
      totalPages: Math.ceil(sortedData.length / pageSize),
    };
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (column) => {
    setSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    searchTerm,
    sort,
    pageSize,
    currentPage,
    filteredData,
    sortedData,
    paginatedData,
    handleSort,
    handleSearchChange,
    handlePageChange,
    handlePageSizeChange,
  };
};
