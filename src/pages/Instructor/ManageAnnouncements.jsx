import { useContext } from 'react';

import {
  AppLayout,
  Button,
  ClassSelector,
  EmptyState,
  FormattedDate,
  Input,
  Label,
  Modal,
  PageTitle,
  PencilIcon,
  Textarea,
  Trash2Icon,
} from '../../components';
import { AuthContext } from '../../context';
import {
  useAnnouncements,
  useAuth,
  useClassrooms,
  useClassSelection,
  useConfirmDelete,
  useCreateAnnouncement,
  useDeleteAnnouncement,
  useModalForm,
  useUpdateAnnouncement,
} from '../../hooks';
import { getClassNames } from '../../utils';

const ManageAnnouncementsPage = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const { data: announcements = [], isLoading: isLoadingAnnouncements } = useAnnouncements();
  const { data: classes = [], isLoading: isLoadingClasses } = useClassrooms();
  const createAnnouncementMutation = useCreateAnnouncement();
  const updateAnnouncementMutation = useUpdateAnnouncement();
  const deleteAnnouncementMutation = useDeleteAnnouncement();
  const classSelection = useClassSelection([]);

  const modalForm = useModalForm({
    initialValues: { title: '', content: '' },
    onReset: (item) => {
      classSelection.reset(item?.assignedClasses || []);
    },
    onSubmit: async (values, editingItem, closeModal) => {
      if (values.title.trim() === '' || values.content.trim() === '') return;

      if (editingItem) {
        await updateAnnouncementMutation.mutateAsync({
          id: editingItem.id,
          data: {
            ...values,
            assignedClasses: classSelection.selectedClasses,
          },
        });
      } else {
        await createAnnouncementMutation.mutateAsync({
          ...values,
          assignedClasses: classSelection.selectedClasses,
        });
      }

      closeModal();
    },
  });

  const handleDelete = useConfirmDelete({
    onDelete: async (id) => {
      await deleteAnnouncementMutation.mutateAsync(id);
    },
    title: 'Remover Aviso',
    message: 'Tem a certeza que quer apagar este aviso?',
    successMessage: 'Aviso removido com sucesso',
  });

  const isLoading = isLoadingAnnouncements || isLoadingClasses;

  if (isLoading) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <PageTitle>Gerir Avisos</PageTitle>
        <div className="text-center">
          <p className="text-gray-600">Carregando avisos...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <PageTitle>Gerir Avisos</PageTitle>

      {announcements.length === 0 ? (
        <EmptyState
          message="Nenhum aviso encontrado"
          description="Comece criando seu primeiro aviso para comunicar informações importantes aos alunos."
          action={
            <Button onClick={modalForm.openCreateModal} className="w-auto px-6">
              + Novo Aviso
            </Button>
          }
          className="mt-4"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((ann) => (
          <div
            key={ann.id}
            className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-md"
          >
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">{ann.title}</h3>
              <p className="mb-4 text-sm text-gray-600">{ann.content}</p>
            </div>
            <div>
              <div className="mb-4 text-xs text-gray-400">
                <span className="font-semibold">Para:</span>{' '}
                {getClassNames(ann.assignedClasses, classes)}
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-xs text-gray-500">
                  <FormattedDate date={ann.date} />
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => modalForm.openEditModal(ann)}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label={`Editar aviso ${ann.title}`}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Remover aviso ${ann.title}`}
                  >
                    <Trash2Icon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {announcements.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button onClick={modalForm.openCreateModal} className="w-full px-6 sm:w-auto">
            + Novo Aviso
          </Button>
        </div>
      )}

      <Modal
        isOpen={modalForm.isOpen}
        onClose={modalForm.closeModal}
        title={modalForm.editingItem ? 'Editar Aviso' : 'Criar Novo Aviso'}
      >
        <form onSubmit={modalForm.handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="announcement-title">Título</Label>
            <Input
              id="announcement-title"
              placeholder="Ex: Manutenção Programada"
              value={modalForm.formValues.title}
              onChange={(e) => modalForm.updateFormValue('title', e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="announcement-content">Conteúdo do Aviso</Label>
            <Textarea
              id="announcement-content"
              value={modalForm.formValues.content}
              onChange={(e) => modalForm.updateFormValue('content', e.target.value)}
              rows={4}
            />
          </div>
          <div className="mb-6">
            <Label>Direcionar para Turmas</Label>
            <ClassSelector
              classes={classes}
              selectedClasses={classSelection.selectedClasses}
              onChange={classSelection.setSelectedClasses}
              namePrefix="announcement-class"
            />
          </div>
          <Button type="submit">
            {modalForm.editingItem ? 'Salvar Alterações' : 'Publicar Aviso'}
          </Button>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default ManageAnnouncementsPage;
