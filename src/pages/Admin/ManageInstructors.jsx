import { useContext, useCallback, useMemo, useState } from 'react';

import {
  Button,
  DataTable,
  EmptyState,
  ErrorMessage,
  Input,
  Label,
  Modal,
  PageSizeSelector,
  PageTitle,
  SearchInput,
  Tabs,
} from '../../components';
import AppLayout from '../../components/AppLayout';
import { AuthContext } from '../../context';
import InstructorTableRow from './components/InstructorTableRow';
import { getInstructorColumns, INSTRUCTOR_TABS } from './config/instructorConfig';
import { useManageInstructorsPage } from './hooks/useManageInstructorsPage';

const ManageInstructorsPage = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('active');

  const { logout, tableFilters, inviteModal, actions, isLoading, handleSearchChange, handlePageSizeChange, searchInputValue } = useManageInstructorsPage(activeTab);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    tableFilters.handlePageChange(1);
  };

  const renderRow = useCallback(
    (item) => <InstructorTableRow key={item.id} item={item} tab={activeTab} actions={actions} />,
    [activeTab, actions]
  );

  if (isLoading) {
    return (
      <AppLayout user={user} onLogout={logout} containerClassName="max-w-full">
        <div className="px-6">
          <PageTitle>Gerenciar Instrutores</PageTitle>
          <div className="text-center">
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onLogout={logout} containerClassName="max-w-full">
      <div className="px-6">
        <PageTitle>Gerenciar Instrutores</PageTitle>

        <Tabs tabs={INSTRUCTOR_TABS} activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="mx-auto mb-6 flex max-w-[95%] flex-col justify-between gap-4 sm:flex-row">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row">
            <SearchInput
              key={`search-${activeTab}`}
              placeholder="Pesquisar instrutores por nome ou e-mail"
              value={searchInputValue}
              onChange={handleSearchChange}
            />
            <PageSizeSelector value={tableFilters.pageSize} onChange={handlePageSizeChange} />
          </div>
          {activeTab === 'invites' && (
            <Button onClick={inviteModal.openModal} className="px-6 whitespace-nowrap sm:w-auto">
              + Enviar Convite
            </Button>
          )}
        </div>

        {tableFilters.paginatedData.data.length === 0 ? (
          <EmptyState
            message={
              activeTab === 'invites'
                ? 'Nenhum convite encontrado'
                : activeTab === 'active'
                  ? 'Nenhum instrutor ativo encontrado'
                  : 'Nenhum instrutor inativo encontrado'
            }
            description={
              activeTab === 'invites'
                ? 'Comece enviando seu primeiro convite para novos instrutores.'
                : activeTab === 'active'
                  ? 'Não há instrutores ativos no momento.'
                  : 'Não há instrutores inativos no momento.'
            }
            className="mx-auto mt-4 max-w-[95%]"
          />
        ) : (
          <DataTable
            columns={getInstructorColumns(activeTab)}
            data={tableFilters.paginatedData.data}
            currentSort={tableFilters.sort}
            onSort={tableFilters.handleSort}
            currentPage={tableFilters.currentPage}
            totalItems={tableFilters.paginatedData.totalItems}
            pageSize={tableFilters.pageSize}
            onPageChange={tableFilters.handlePageChange}
            hasSearch={!!searchInputValue}
            renderRow={renderRow}
          />
        )}

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
                disabled={!inviteModal.isEmailValid() || inviteModal.isLoading}
                className="w-auto bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {inviteModal.isLoading ? 'Enviando...' : 'Enviar Convite'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default ManageInstructorsPage;
