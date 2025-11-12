import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  useAuth,
  useConfirmDelete,
  useDeleteInstructor,
  useInstructorInvites,
  useInviteModal,
  useReactivateUser,
  useRemoveInvite,
  useResendInvite,
  useSendInvite,
  useSuspendUser,
  useToast,
} from '../../../hooks';
import { useInstructors } from '../../../hooks/useUsers';

export const useManageInstructorsPage = (activeTab) => {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState({ column: 'email', direction: 'ASC' });
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
  const sortBy =
    sort.column === 'name' ? 'name' : sort.column === 'expiresAt' ? 'expiresAt' : 'email';
  const sortDir = sort.direction.toUpperCase();

  const activeInstructorsQuery = useInstructors({
    active: true,
    page: backendPage,
    size: pageSize,
    search: searchTerm,
    sortBy,
    sortDir,
    enabled: activeTab === 'active',
  });

  const inactiveInstructorsQuery = useInstructors({
    active: false,
    page: backendPage,
    size: pageSize,
    search: searchTerm,
    sortBy,
    sortDir,
    enabled: activeTab === 'inactive',
  });

  const invitesQuery = useInstructorInvites({
    page: backendPage,
    size: pageSize,
    search: searchTerm,
    sortBy,
    sortDir,
    enabled: activeTab === 'invites',
  });

  const currentQuery = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return activeInstructorsQuery;
      case 'inactive':
        return inactiveInstructorsQuery;
      case 'invites':
        return invitesQuery;
      default:
        return null;
    }
  }, [activeTab, activeInstructorsQuery, inactiveInstructorsQuery, invitesQuery]);

  const isLoading = currentQuery?.isLoading || false;

  const { data, totalElements, totalPages } = useMemo(
    () => ({
      data: currentQuery?.data?.content ?? [],
      totalElements: currentQuery?.data?.totalElements ?? 0,
      totalPages: currentQuery?.data?.totalPages ?? 0,
    }),
    [currentQuery]
  );

  const suspendMutation = useSuspendUser();
  const reactivateMutation = useReactivateUser();
  const deleteInstructorMutation = useDeleteInstructor();
  const resendInviteMutation = useResendInvite();
  const removeInviteMutation = useRemoveInvite();
  const sendInviteMutation = useSendInvite();

  const suspendInstructor = useConfirmDelete({
    onDelete: async (id) => {
      await suspendMutation.mutateAsync(id);
    },
    title: 'Inativar Instrutor',
    message: 'Tem certeza que deseja inativar este instrutor?',
    successMessage: 'Instrutor inativado com sucesso',
  });

  const reactivateInstructor = useConfirmDelete({
    onDelete: async (id) => {
      await reactivateMutation.mutateAsync(id);
    },
    title: 'Reativar Instrutor',
    message: 'Tem certeza que deseja reativar este instrutor?',
    successMessage: 'Instrutor reativado com sucesso',
  });

  const removeInstructor = useConfirmDelete({
    onDelete: async (id) => {
      await deleteInstructorMutation.mutateAsync(id);
    },
    title: 'Remover Instrutor',
    message:
      'Tem certeza que deseja remover este instrutor permanentemente? Esta ação não pode ser desfeita.',
    successMessage: 'Instrutor removido com sucesso',
  });

  const resendInvite = useConfirmDelete({
    onDelete: async (id) => {
      await resendInviteMutation.mutateAsync(id);
    },
    title: 'Reenviar Convite',
    message: 'Deseja reenviar este convite?',
    successMessage: 'Convite reenviado com sucesso',
  });

  const removeInvite = useConfirmDelete({
    onDelete: async (id) => {
      await removeInviteMutation.mutateAsync(id);
    },
    title: 'Remover Convite',
    message: 'Tem certeza que deseja remover este convite?',
    successMessage: 'Convite removido com sucesso',
  });

  const sendNewInvite = async (email) => {
    await sendInviteMutation.mutateAsync({ email });
    showToast({ message: 'Convite enviado com sucesso', type: 'success' });
    return { success: true };
  };

  const inviteModal = useInviteModal({
    onSendInvite: sendNewInvite,
    showToast,
  });

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

  const actions = useMemo(
    () => ({
      suspendInstructor,
      reactivateInstructor,
      removeInstructor,
      resendInvite,
      removeInvite,
    }),
    [suspendInstructor, reactivateInstructor, removeInstructor, resendInvite, removeInvite]
  );

  return {
    logout,
    tableFilters,
    inviteModal,
    actions,
    isLoading,
    handleSearchChange,
    handlePageSizeChange,
    searchInputValue: inputValue,
  };
};
