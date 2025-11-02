import { Ban, CircleCheck, RotateCw, Trash2 } from 'lucide-react';
import { useContext, useMemo, useState } from 'react';

import {
  ActionButton,
  Button,
  EmptyState,
  ErrorMessage,
  FormattedDate,
  Input,
  Label,
  Modal,
  PageSizeSelector,
  PageTitle,
  Pagination,
  SearchInput,
  SortableColumn,
  StatusBadge,
  Tabs,
} from '../../components';
import AppLayout from '../../components/AppLayout';
import { AuthContext } from '../../context';
import { useAuth, useInstructors, useInviteModal, useTableFilters, useToast } from '../../hooks';

const ManageInstructorsPage = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('active');

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
  } = useInstructors();

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

  // Usar o hook de filtros de tabela
  const tableFilters = useTableFilters({
    data: currentTabData,
    searchFields: ['name', 'email'],
    defaultSort: { column: 'name', direction: 'asc' },
    defaultPageSize: 10,
  });

  const inviteModal = useInviteModal({
    onSendInvite: sendNewInvite,
    showToast,
  });

  const tabs = [
    { id: 'active', label: 'Instrutores Ativos' },
    { id: 'inactive', label: 'Instrutores Inativos' },
    { id: 'invites', label: 'Convites Pendentes' },
  ];

  const getColumns = () => {
    if (activeTab === 'invites') {
      return [
        { key: 'email', label: 'E-mail', align: 'left', sortable: true },
        { key: 'status', label: 'Status', align: 'center', sortable: false },
        { key: 'expiresAt', label: 'Expira em', align: 'center', sortable: true },
        { key: 'actions', label: 'Ações', align: 'center', sortable: false },
      ];
    }
    return [
      { key: 'name', label: 'Nome', align: 'left', sortable: true },
      { key: 'email', label: 'E-mail', align: 'left', sortable: true },
      { key: 'actions', label: 'Ações', align: 'center', sortable: false },
    ];
  };

  const renderRow = (item) => {
    const cells = [];

    if (activeTab !== 'invites') {
      cells.push(
        <td
          key="name"
          className="px-6 py-4 text-left align-middle text-base font-medium text-gray-900"
        >
          {item.name}
        </td>
      );
    }

    cells.push(
      <td key="email" className="px-6 py-4 text-left align-middle text-base text-blue-600">
        {item.email}
      </td>
    );

    if (activeTab === 'invites') {
      cells.push(
        <td key="status" className="px-6 py-4 text-center align-middle text-base">
          <StatusBadge status={item.status} variant="pending" />
        </td>,
        <td key="expiresAt" className="px-6 py-4 text-center align-middle text-base text-gray-700">
          <FormattedDate date={item.expiresAt} />
        </td>
      );
    }

    cells.push(
      <td key="actions" className="px-6 py-4 text-center align-middle">
        <div className="flex items-center justify-center gap-1">
          {activeTab === 'active' && (
            <>
              <ActionButton
                icon={Ban}
                onClick={() => suspendInstructor(item.id)}
                title="Inativar instrutor"
                variant="suspend"
              />
              <ActionButton
                icon={Trash2}
                onClick={() => removeInstructor(item.id, true)}
                title="Excluir instrutor"
                variant="delete"
              />
            </>
          )}
          {activeTab === 'inactive' && (
            <>
              <ActionButton
                icon={CircleCheck}
                onClick={() => reactivateInstructor(item.id)}
                title="Reativar instrutor"
                variant="activate"
              />
              <ActionButton
                icon={Trash2}
                onClick={() => removeInstructor(item.id, false)}
                title="Excluir instrutor"
                variant="delete"
              />
            </>
          )}
          {activeTab === 'invites' && (
            <>
              <ActionButton
                icon={RotateCw}
                onClick={() => resendInvite(item.id)}
                title="Reenviar convite"
                variant="resend"
              />
              <ActionButton
                icon={Trash2}
                onClick={() => removeInvite(item.id)}
                title="Excluir convite"
                variant="delete"
              />
            </>
          )}
        </div>
      </td>
    );

    return cells;
  };

  // Reset página quando mudar de aba
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    tableFilters.handlePageChange(1);
  };

  const handlePageSizeChange = (size) => {
    tableFilters.handlePageSizeChange(size);
  };

  return (
    <AppLayout user={user} onLogout={logout} containerClassName="max-w-full">
      <div className="px-6">
        <PageTitle>Gerenciar Instrutores</PageTitle>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Filters and Actions */}
        <div className="mx-auto mb-6 flex max-w-[95%] flex-col justify-between gap-4 sm:flex-row">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row">
            <SearchInput
              placeholder="Pesquisar instrutores por nome ou e-mail"
              value={tableFilters.searchTerm}
              onChange={tableFilters.handleSearchChange}
            />
            <PageSizeSelector value={tableFilters.pageSize} onChange={handlePageSizeChange} />
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'invites' && (
              <Button onClick={inviteModal.openModal} className="px-6 whitespace-nowrap sm:w-auto">
                + Enviar Convite
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {tableFilters.paginatedData.data.length === 0 ? (
          <EmptyState
            message={
              tableFilters.searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum item encontrado'
            }
            className="mx-auto mt-2 max-w-[95%]"
          />
        ) : (
          <div className="mx-auto mt-2 max-w-[95%] overflow-x-auto rounded-lg bg-white shadow">
            <table className="w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {getColumns().map((column) => (
                    <SortableColumn
                      key={column.key}
                      columnKey={column.key}
                      label={column.label}
                      currentSort={tableFilters.sort}
                      sortable={column.sortable !== false}
                      align={column.align}
                      onSort={column.sortable !== false ? tableFilters.handleSort : () => {}}
                      className=""
                    />
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tableFilters.paginatedData.data.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {renderRow(item)}
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={tableFilters.currentPage}
              totalItems={tableFilters.paginatedData.totalItems}
              pageSize={tableFilters.pageSize}
              onPageChange={tableFilters.handlePageChange}
            />
          </div>
        )}

        {/* Modal de Novo Convite */}
        <Modal
          isOpen={inviteModal.isOpen}
          onClose={inviteModal.closeModal}
          title="Enviar Novo Convite"
          showCloseButton={false}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="invite-email">E-mail do instrutor</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="instrutor@exemplo.com"
                value={inviteModal.email}
                onChange={(e) => inviteModal.handleEmailChange(e.target.value)}
                className={inviteModal.emailError ? 'border-red-500' : ''}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inviteModal.isEmailValid()) {
                    inviteModal.handleSendInvite();
                  }
                }}
              />
              {inviteModal.emailError && <ErrorMessage message={inviteModal.emailError} />}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                onClick={inviteModal.closeModal}
                className="w-auto bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancelar
              </Button>
              <Button
                onClick={inviteModal.handleSendInvite}
                disabled={!inviteModal.isEmailValid()}
                className="w-auto bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Enviar Convite
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default ManageInstructorsPage;
