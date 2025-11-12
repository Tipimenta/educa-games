import { useCallback, useContext, useState } from 'react';

import {
  AppLayout,
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
import { AuthContext } from '../../context';
import { useAuth, useCreateClassroom, useModalForm } from '../../hooks';
import ClassroomTableRow from './components/ClassroomTableRow';
import { CLASSROOM_COLUMNS, CLASSROOM_TABS } from './config/classroomConfig';
import { useManageClassroomsPage } from './hooks/useManageClassroomsPage';

const ManageClassesPage = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const { logout: logoutHook, tableFilters, isLoading, handleSearchChange, handlePageSizeChange, searchInputValue, refetch } = useManageClassroomsPage(activeTab);

  const createClassroom = useCreateClassroom();

  const createModal = useModalForm({
    initialValues: { name: '' },
    onReset: () => setNameTouched(false),
    onSubmit: async (values) => {
      const name = values.name?.trim();
      if (!name || name.length < 3) {
        setNameTouched(true);
        return;
      }
      try {
        await createClassroom.mutateAsync({ name });
        createModal.closeModal();
        refetch();
      } catch (err) {
        // Silently fail; error boundaries/toast can handle
      }
    },
  });

  const [nameTouched, setNameTouched] = useState(false);
  const isNameValid = (createModal.formValues.name || '').trim().length >= 3;

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    tableFilters.handlePageChange(1);
  }, [tableFilters]);

  if (isLoading) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <PageTitle>Gerir Turmas</PageTitle>
        <div className="text-center">
          <p className="text-gray-600">Carregando turmas...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <PageTitle>Gerenciar Turmas</PageTitle>

      <Tabs tabs={CLASSROOM_TABS} activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="mx-auto mb-6 flex max-w-[95%] flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          <SearchInput
            key={`search-${activeTab}`}
            placeholder="Pesquisar turmas por nome"
            value={searchInputValue}
            onChange={handleSearchChange}
          />
          <div className="flex items-center gap-3">
            <PageSizeSelector
              value={tableFilters.pageSize}
              onChange={handlePageSizeChange}
              className="h-[48px] px-4 !py-0 text-base"
            />
            {activeTab === 'active' && (
              <Button className="px-6 whitespace-nowrap sm:w-auto" onClick={createModal.openCreateModal}>
                + Criar Turma
              </Button>
            )}
          </div>
        </div>
      </div>

      {tableFilters.paginatedData.data.length === 0 ? (
        <EmptyState
          message={activeTab === 'active' ? 'Nenhuma turma ativa encontrada' : 'Nenhuma turma inativa encontrada'}
          description={activeTab === 'active' ? 'Não há turmas ativas no momento.' : 'Não há turmas inativas no momento.'}
          className="mx-auto mt-4 max-w-[95%]"
        />
      ) : (
        <DataTable
          columns={CLASSROOM_COLUMNS}
          data={tableFilters.paginatedData.data}
          currentSort={tableFilters.sort}
          onSort={tableFilters.handleSort}
          currentPage={tableFilters.currentPage}
          totalItems={tableFilters.paginatedData.totalItems}
          pageSize={tableFilters.pageSize}
          onPageChange={tableFilters.handlePageChange}
          hasSearch={!!searchInputValue}
          renderRow={(item) => <ClassroomTableRow key={item.id} item={item} />}
        />
      )}

      <Modal isOpen={createModal.isOpen} onClose={createModal.closeModal} title="Criar Turma" showCloseButton={false}>
        <form onSubmit={createModal.handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="class-name" required>Nome da turma</Label>
            <Input
              id="class-name"
              placeholder="Ex.: Turma 5º Ano - Matemática"
              value={createModal.formValues.name}
              onChange={(e) => createModal.updateFormValue('name', e.target.value)}
              error={nameTouched && !isNameValid}
            />
            {nameTouched && !isNameValid && (
              <ErrorMessage message="Campo inválido" />
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" className="w-auto bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={createModal.closeModal}>
              Cancelar
            </Button>
            <Button type="submit" className="w-auto" disabled={!isNameValid || createClassroom.isPending}>
              {createClassroom.isPending ? 'Criando...' : 'Criar'}
            </Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default ManageClassesPage;
