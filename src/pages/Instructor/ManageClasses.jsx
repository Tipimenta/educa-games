import { useContext, useState } from 'react';

import { CheckIcon, MailIcon, PencilIcon, Trash2Icon, XIcon } from '../../components';
import AppLayout from '../../components/AppLayout';
import Button from '../../components/Button';
import Input from '../../components/Input';
import PageTitle from '../../components/PageTitle';
import { AuthContext, ClassesContext, useConfirm } from '../../context';
import { useAuth } from '../../hooks';

const ManageClassesPage = () => {
  const { user } = useContext(AuthContext);
  const { classes, setClasses } = useContext(ClassesContext);
  const { logout } = useAuth();
  const { confirm } = useConfirm();

  const [newClassName, setNewClassName] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleInviteClick = (classItem) => {
    // Placeholder: aguardando definição da rota de convite
    // Mantemos apenas um log para não quebrar navegação
    console.log('Convite para turma:', classItem);
    // Quando a rota estiver definida, poderemos navegar com useNavigate
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (newClassName.trim() === '') return;
    setClasses([...classes, { id: Date.now(), name: newClassName.trim() }]);
    setNewClassName('');
  };

  const handleDeleteClass = async (classId) => {
    try {
      await confirm({
        title: 'Remover Turma',
        message: 'Tem a certeza que deseja apagar esta turma? Esta ação não pode ser desfeita.',
        variant: 'danger',
        actionType: 'delete',
      });
      setClasses(classes.filter((c) => c.id !== classId));
    } catch {
      // Usuário cancelou
    }
  };

  const handleEditClick = (classItem) => {
    setEditingId(classItem.id);
    setEditingName(classItem.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = () => {
    if (editingName.trim() === '') return;
    setClasses(classes.map((c) => (c.id === editingId ? { ...c, name: editingName } : c)));
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
            {classes.length > 0 ? (
              classes.map((classItem) => (
                <li
                  key={classItem.id}
                  className="flex h-[58px] items-center justify-between rounded-md bg-gray-50 p-3"
                >
                  {editingId === classItem.id ? (
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
                      <span className="font-medium text-gray-700">{classItem.name}</span>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleInviteClick(classItem)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <MailIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(classItem)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(classItem.id)}
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
              <li className="py-4 text-center text-sm text-gray-500">
                Nenhuma turma criada ainda.
              </li>
            )}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
};

export default ManageClassesPage;
