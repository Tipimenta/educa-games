import { useMemo } from 'react';

import { useAuth, useInstructors, useInviteModal, useTableFilters, useToast } from '../../../hooks';

export const useManageInstructorsPage = (activeTab) => {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const instructors = useInstructors();
  const {
    activeInstructors,
    inactiveInstructors,
    pendingInvites,
    suspendInstructor,
    reactivateInstructor,
    removeInstructor,
    resendInvite,
    removeInvite,
    sendNewInvite,
  } = instructors;

  // Determinar qual conjunto de dados usar baseado na tab ativa
  const currentTabData = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return activeInstructors;
      case 'inactive':
        return inactiveInstructors;
      case 'invites':
        return pendingInvites;
      default:
        return [];
    }
  }, [activeTab, activeInstructors, inactiveInstructors, pendingInvites]);

  // Configurar filtros de tabela
  const tableFilters = useTableFilters({
    data: currentTabData,
    searchFields: ['name', 'email'],
    defaultSort: { column: 'name', direction: 'asc' },
    defaultPageSize: 10,
  });

  // Modal de convite
  const inviteModal = useInviteModal({
    onSendInvite: sendNewInvite,
    showToast,
  });

  // Ações disponíveis
  const actions = {
    suspendInstructor,
    reactivateInstructor,
    removeInstructor,
    resendInvite,
    removeInvite,
  };

  return {
    logout,
    tableFilters,
    inviteModal,
    actions,
  };
};
