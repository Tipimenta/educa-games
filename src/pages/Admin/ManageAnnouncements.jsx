import { useState } from 'react';

import Button from '../../components/Button';
import Header from '../../components/Header';
import { PencilIcon, Trash2Icon } from '../../components/Icons';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Sidebar from '../../components/Sidebar';

const ManageAnnouncementsPage = ({
  user,
  userRole,
  onLogout,
  announcements,
  setAnnouncements,
  turmas,
}) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const [formState, setFormState] = useState({ title: '', content: '', assignedTurmas: [] });

  const handleOpenCreateModal = () => {
    setEditingAnnouncement(null);
    setFormState({ title: '', content: '', assignedTurmas: [] });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormState({ ...announcement });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnnouncement(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formState.title.trim() === '' || formState.content.trim() === '') return;

    if (editingAnnouncement) {
      setAnnouncements(
        announcements.map((ann) =>
          ann.id === editingAnnouncement.id ? { ...ann, ...formState } : ann
        )
      );
    } else {
      const newAnnouncement = {
        ...formState,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem a certeza que quer apagar este aviso?')) {
      setAnnouncements(announcements.filter((ann) => ann.id !== id));
    }
  };

  const handleTurmaSelection = (turmaId) => {
    const { assignedTurmas } = formState;
    if (assignedTurmas.includes(turmaId)) {
      setFormState({ ...formState, assignedTurmas: assignedTurmas.filter((id) => id !== turmaId) });
    } else {
      setFormState({ ...formState, assignedTurmas: [...assignedTurmas, turmaId] });
    }
  };

  const getTurmaNames = (turmaIds) => {
    if (!turmaIds || turmaIds.length === 0) return 'Nenhuma turma';
    if (turmaIds.length === turmas.length) return 'Todas as turmas';
    return turmaIds.map((id) => turmas.find((t) => t.id === id)?.name).join(', ');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
        userRole={userRole}
      />
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}
      >
        <Header
          user={user}
          toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
          onLogout={onLogout}
        />
        <main className="flex-grow p-6">
          <div className="flex items-center justify-between">
            <h2 className="mb-6 text-3xl font-bold text-gray-800">Gerir Avisos</h2>
          </div>

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
                    <span className="font-semibold">Para:</span> {getTurmaNames(ann.assignedTurmas)}
                  </div>
                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-xs text-gray-500">
                      {new Date(ann.date).toLocaleDateString('pt-BR')}
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
        </main>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAnnouncement ? 'Editar Aviso' : 'Criar Novo Aviso'}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">Título</label>
            <Input
              placeholder="Ex: Manutenção Programada"
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">Conteúdo do Aviso</label>
            <textarea
              value={formState.content}
              onChange={(e) => setFormState({ ...formState, content: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Direcionar para Turmas
            </label>
            <div className="space-y-2 rounded-lg border p-4">
              {turmas.map((turma) => (
                <div key={turma.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`turma-ann-${turma.id}`}
                    checked={formState.assignedTurmas.includes(turma.id)}
                    onChange={() => handleTurmaSelection(turma.id)}
                    className="h-4 w-4 rounded"
                  />
                  <label htmlFor={`turma-ann-${turma.id}`} className="ml-3 text-sm text-gray-700">
                    {turma.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit">
            {editingAnnouncement ? 'Salvar Alterações' : 'Publicar Aviso'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageAnnouncementsPage;
