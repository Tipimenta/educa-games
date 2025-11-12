import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAuth, useInstructorClassrooms } from '../../../hooks';

export const useManageClassroomsPage = (activeTab) => {
  const { logout } = useAuth();

  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState({ column: 'name', direction: 'ASC' });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setInputValue('');
    setSearchTerm('');
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(inputValue);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const backendPage = currentPage - 1;
  const sortBy = sort.column === 'createdAt' ? 'createdAt' : 'name';
  const sortDir = sort.direction.toUpperCase();

  const activeClassroomsQuery = useInstructorClassrooms({
    active: true,
    page: backendPage,
    size: pageSize,
    search: searchTerm,
    sortBy,
    sortDir,
    enabled: activeTab === 'active',
  });

  const inactiveClassroomsQuery = useInstructorClassrooms({
    active: false,
    page: backendPage,
    size: pageSize,
    search: searchTerm,
    sortBy,
    sortDir,
    enabled: activeTab === 'inactive',
  });

  const currentQuery = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return activeClassroomsQuery;
      case 'inactive':
        return inactiveClassroomsQuery;
      default:
        return null;
    }
  }, [activeTab, activeClassroomsQuery, inactiveClassroomsQuery]);

  const isLoading = currentQuery?.isLoading || false;

  const { data, totalElements, totalPages } = useMemo(
    () => ({
      data: currentQuery?.data?.content ?? [],
      totalElements: currentQuery?.data?.totalElements ?? 0,
      totalPages: currentQuery?.data?.totalPages ?? 0,
    }),
    [currentQuery]
  );

  const handleSort = useCallback((column) => {
    setSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setInputValue(value);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const paginatedData = useMemo(
    () => ({
      data,
      totalItems: totalElements,
      totalPages,
    }),
    [data, totalElements, totalPages]
  );

  const tableFilters = useMemo(
    () => ({
      sort,
      pageSize,
      currentPage,
      paginatedData,
      handleSort,
      handlePageChange,
    }),
    [sort, pageSize, currentPage, paginatedData, handleSort, handlePageChange]
  );

  const refetch = useCallback(() => {
    if (currentQuery && typeof currentQuery.refetch === 'function') {
      currentQuery.refetch();
    }
  }, [currentQuery]);

  return {
    logout,
    tableFilters,
    isLoading,
    handleSearchChange,
    handlePageSizeChange,
    searchInputValue: inputValue,
    refetch,
  };
};