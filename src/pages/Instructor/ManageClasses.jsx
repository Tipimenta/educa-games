import { useContext, useState } from 'react';

import {
  AppLayout,
  Button,
  CheckIcon,
  EmptyState,
  Input,
  MailIcon,
  PageTitle,
  PencilIcon,
  Trash2Icon,
  XIcon,
} from '../../components';
import { AuthContext } from '../../context';
import {
  useAuth,
  useClassrooms,
  useConfirmDelete,
  useCreateClassroom,
  useDeleteClassroom,
  useUpdateClassroom,
} from '../../hooks';

const ManageClassesPage = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const { data: classes = [], isLoading: isLoadingClasses } = useClassrooms();
  const createClassroomMutation = useCreateClassroom();
  const updateClassroomMutation = useUpdateClassroom();
  const deleteClassroomMutation = useDeleteClassroom();

  const [newClassName, setNewClassName] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleInviteClick = (classItem) => {
    console.log('Convite para turma:', classItem);
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (newClassName.trim() === '') return;
    await createClassroomMutation.mutateAsync({ name: newClassName.trim() });
    setNewClassName('');
  };

  const handleDeleteClass = useConfirmDelete({
    onDelete: async (classId) => {
      await deleteClassroomMutation.mutateAsync(classId);
    },
    title: 'Remover Turma',
    message: 'Tem a certeza que deseja apagar esta turma? Esta ação não pode ser desfeita.',
    successMessage: 'Turma removida com sucesso',
  });

  const handleEditClick = (classItem) => {
    setEditingId(classItem.id);
    setEditingName(classItem.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async () => {
    if (editingName.trim() === '') return;
    await updateClassroomMutation.mutateAsync({
      id: editingId,
      data: { name: editingName },
    });
    handleCancelEdit();
  };

  if (isLoadingClasses) {
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
      <PageTitle>Gerir Turmas</PageTitle>
      {classes.length === 0 ? (
        <EmptyState
          message="Nenhuma turma encontrada"
          description="Comece criando sua primeira turma para organizar seus alunos."
          action={
            <form onSubmit={handleAddClass} className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Nome da Turma (ex: Bootcamp 2026)"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={newClassName.trim() === ''} className="w-auto px-6">
                Adicionar Turma
              </Button>
            </form>
          }
          className="mt-4"
        />
      ) : (
        <div className="mt-6 space-y-8">
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
              {classes.map((classItem) => (
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
                          aria-label={`Remover turma ${classItem.name}`}
                        >
                          <Trash2Icon className="h-5 w-5" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default ManageClassesPage;
