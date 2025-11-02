import { useContext, useState } from 'react';

import {
  ClassSelector,
  FormattedDate,
  Label,
  PencilIcon,
  Textarea,
  Trash2Icon,
} from '../../components';
import AppLayout from '../../components/AppLayout';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import PageTitle from '../../components/PageTitle';
import { AnnouncementsContext, AuthContext, ClassesContext, useConfirm } from '../../context';
import { useAuth, useClassSelection } from '../../hooks';
import { getClassNames } from '../../utils';

const ManageAnnouncementsPage = () => {
  const { user } = useContext(AuthContext);
  const { announcements, setAnnouncements } = useContext(AnnouncementsContext);
  const { classes } = useContext(ClassesContext);
  const { logout } = useAuth();
  const { confirm } = useConfirm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const classSelection = useClassSelection([]);

  const handleOpenCreateModal = () => {
    setEditingAnnouncement(null);
    setTitle('');
    setContent('');
    classSelection.reset();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setTitle(announcement.title);
    setContent(announcement.content);
    classSelection.reset(announcement.assignedClasses || []);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
    setTitle('');
    setContent('');
    classSelection.reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '' || content.trim() === '') return;

    if (editingAnnouncement) {
      setAnnouncements(
        announcements.map((ann) =>
          ann.id === editingAnnouncement.id
            ? { ...ann, title, content, assignedClasses: classSelection.selectedClasses }
            : ann
        )
      );
    } else {
      const newAnnouncement = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        assignedClasses: classSelection.selectedClasses,
        date: new Date().toISOString().split('T')[0],
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }

    handleCloseModal();
  };

  const handleDelete = async (id) => {
    try {
      await confirm({
        title: 'Remover Aviso',
        message: 'Tem a certeza que quer apagar este aviso?',
        variant: 'danger',
        actionType: 'delete',
      });
      setAnnouncements(announcements.filter((ann) => ann.id !== id));
    } catch {
      // Usuário cancelou
    }
  };

  return (
    <AppLayout user={user} onLogout={logout}>
      <PageTitle>Gerir Avisos</PageTitle>

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
                    onClick={() => handleOpenEditModal(ann)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2Icon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={handleOpenCreateModal} className="w-full px-6 sm:w-auto">
          + Novo Aviso
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAnnouncement ? 'Editar Aviso' : 'Criar Novo Aviso'}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="announcement-title">Título</Label>
            <Input
              id="announcement-title"
              placeholder="Ex: Manutenção Programada"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="announcement-content">Conteúdo do Aviso</Label>
            <Textarea
              id="announcement-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
            {editingAnnouncement ? 'Salvar Alterações' : 'Publicar Aviso'}
          </Button>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default ManageAnnouncementsPage;
