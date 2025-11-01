import { useState } from 'react';

import AppLayout from '../../components/AppLayout';
import Button from '../../components/Button';
import { CheckIcon, MailIcon, PencilIcon, Trash2Icon, XIcon } from '../../components/Icons';
import Input from '../../components/Input';
import PageTitle from '../../components/PageTitle';
import { useAuth } from '../../hooks/useAuth';

const ManageClassesPage = ({ user, turmas, setTurmas }) => {
  const { logout } = useAuth();

  const [newClassName, setNewClassName] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleInviteClick = (turma) => {
    // Placeholder: aguardando definição da rota de convite
    // Mantemos apenas um log para não quebrar navegação
    console.log('Convite para turma:', turma);
    // Quando a rota estiver definida, poderemos navegar com useNavigate
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (newClassName.trim() === '') return;
    setTurmas([...turmas, { id: Date.now(), name: newClassName.trim() }]);
    setNewClassName('');
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm('Tem a certeza que deseja apagar esta turma?')) {
      setTurmas(turmas.filter((t) => t.id !== classId));
    }
  };

  const handleEditClick = (turma) => {
    setEditingId(turma.id);
    setEditingName(turma.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = () => {
    if (editingName.trim() === '') return;
    setTurmas(turmas.map((t) => (t.id === editingId ? { ...t, name: editingName } : t)));
    handleCancelEdit();
  };

  return (
    <AppLayout user={user} onLogout={logout}>
      <PageTitle>Gerir Turmas</PageTitle>
          <div className="space-y-8">
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-gray-800">Criar Nova Turma</h3>
              <form onSubmit={handleAddClass} className="flex items-center gap-3">
                <Input
                  placeholder="Nome da Turma (ex: Bootcamp 2026)"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" disabled={newClassName.trim() === ''} className="w-auto px-4">
                  Adicionar Turma
                </Button>
              </form>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-gray-800">Turmas Existentes</h3>
              <ul className="space-y-2">
                {turmas.length > 0 ? (
                  turmas.map((turma) => (
                    <li
                      key={turma.id}
                      className="flex h-[58px] items-center justify-between rounded-md bg-gray-50 p-3"
                    >
                      {editingId === turma.id ? (
                        <>
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="my-0 mr-2"
                            autoFocus
                          />
                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleSaveEdit}
                              className="text-green-600 hover:text-green-800"
                            >
                              <CheckIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="font-medium text-gray-700">{turma.name}</span>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleInviteClick(turma)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <MailIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleEditClick(turma)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClass(turma.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2Icon className="h-5 w-5" />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Nenhuma turma criada ainda.</p>
                )}
              </ul>
            </div>
          </div>
    </AppLayout>
  );
};

export default ManageClassesPage;
