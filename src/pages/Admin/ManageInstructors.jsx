import { useContext, useState } from 'react';

import {
  Button,
  DataTable,
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

  const { logout, tableFilters, inviteModal, actions } = useManageInstructorsPage(activeTab);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    tableFilters.handlePageChange(1);
  };

  const handlePageSizeChange = (size) => {
    tableFilters.handlePageSizeChange(size);
  };

  const renderRow = (item) => <InstructorTableRow item={item} tab={activeTab} actions={actions} />;

  return (
    <AppLayout user={user} onLogout={logout} containerClassName="max-w-full">
      <div className="px-6">
        <PageTitle>Gerenciar Instrutores</PageTitle>

        <Tabs tabs={INSTRUCTOR_TABS} activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="mx-auto mb-6 flex max-w-[95%] flex-col justify-between gap-4 sm:flex-row">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row">
            <SearchInput
              placeholder="Pesquisar instrutores por nome ou e-mail"
              value={tableFilters.searchTerm}
              onChange={tableFilters.handleSearchChange}
            />
            <PageSizeSelector value={tableFilters.pageSize} onChange={handlePageSizeChange} />
          </div>
          {activeTab === 'invites' && (
            <Button onClick={inviteModal.openModal} className="px-6 whitespace-nowrap sm:w-auto">
              + Enviar Convite
            </Button>
          )}
        </div>

        <DataTable
          columns={getInstructorColumns(activeTab)}
          data={tableFilters.paginatedData.data}
          currentSort={tableFilters.sort}
          onSort={tableFilters.handleSort}
          currentPage={tableFilters.currentPage}
          totalItems={tableFilters.paginatedData.totalItems}
          pageSize={tableFilters.pageSize}
          onPageChange={tableFilters.handlePageChange}
          hasSearch={!!tableFilters.searchTerm}
          renderRow={renderRow}
        />

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
