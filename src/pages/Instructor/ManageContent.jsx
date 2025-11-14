import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { AppLayout, Button, EmptyState, PageTitle } from '../../components';
import { AuthContext } from '../../context';
import { useAuth, useConfirmDelete, useCourses, useDeleteModule, useModules } from '../../hooks';

const ManageContentPage = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const location = useLocation();

  const selectedCourseId = location.state?.courseId;
  const { data: courses = [], isLoading: isLoadingCourses } = useCourses();
  const { data: modules = [], isLoading: isLoadingModules } = useModules(selectedCourseId);
  const deleteModuleMutation = useDeleteModule();

  const getCourseTitle = (courseId) =>
    courses.find((c) => c.id === courseId)?.title || 'Curso não encontrado';

  const handleDeleteModule = useConfirmDelete({
    onDelete: async (moduleId) => {
      await deleteModuleMutation.mutateAsync(moduleId);
    },
    title: 'Remover Módulo',
    message:
      'Tem a certeza que quer apagar este módulo e todo o seu conteúdo? Esta ação não pode ser desfeita.',
    successMessage: 'Módulo removido com sucesso',
  });

  if (isLoadingCourses || isLoadingModules) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <PageTitle>Gerir Módulos</PageTitle>
        <div className="text-center">
          <p className="text-gray-600">Carregando módulos...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <PageTitle>Gerenciar Módulos</PageTitle>
      {/* Botão de criação movido para dentro do EmptyState via prop 'action' */}

      {selectedCourseId ? (
        <h3 className="mb-4 text-xl font-semibold text-gray-700">
          Módulos do Curso: {getCourseTitle(selectedCourseId)}
        </h3>
      ) : (
        modules.length > 0 && (
          <p className="mb-4 rounded-md bg-blue-50 p-4 text-blue-700">
            Selecione "Ver Módulos" a partir da{' '}
            <Link to="/instructor/manage-courses" className="font-bold underline">
              página de Cursos
            </Link>{' '}
            para ver os módulos de um curso específico.
          </p>
        )
      )}

      {modules.length === 0 ? (
        <EmptyState
          message="Nenhum módulo encontrado"
          description={
            selectedCourseId
              ? 'Comece criando seu primeiro módulo para este curso.'
              : 'Selecione um curso para ver seus módulos ou crie um novo módulo.'
          }
          action={
            selectedCourseId ? (
              <Link to="/instructor/module-editor" state={{ courseId: selectedCourseId }}>
                <Button className="w-auto">+ Novo Módulo</Button>
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Título do Módulo
                  </th>
                  {!selectedCourseId && (
                    <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Curso
                    </th>
                  )}
                  <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Aulas
                  </th>
                  <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Questionário
                  </th>
                  <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                <tr key={module.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-gray-800">{module.title}</td>
                  {!selectedCourseId && (
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {getCourseTitle(module.courseId)}
                    </td>
                  )}
                  <td className="px-4 py-4 font-medium text-gray-800">
                    {module.lessons?.length || 0}
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-800">
                    {module.quiz?.questions?.length > 0 ? (
                      <span className="rounded-full bg-green-200 px-2 py-1 text-xs text-green-800">
                        Sim
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-200 px-2 py-1 text-xs text-red-800">
                        Não
                      </span>
                    )}
                  </td>
                  <td className="space-x-4 px-4 py-4">
                    <Link
                      to={`/instructor/module-editor/${module.id}`}
                      className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="text-sm font-semibold text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default ManageContentPage;
