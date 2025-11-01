import { Link, useLocation } from 'react-router-dom';

import AppLayout from '../../components/AppLayout';
import Button from '../../components/Button';
import PageTitle from '../../components/PageTitle';
import { useAuth } from '../../hooks/useAuth';

const ManageContentPage = ({ user, courses, modules, setModules }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const selectedCourseId = location.state?.courseId;
  const filteredModules = selectedCourseId
    ? modules.filter((m) => m.courseId === selectedCourseId)
    : modules;

  const getCourseTitle = (courseId) =>
    courses.find((c) => c.id === courseId)?.title || 'Curso não encontrado';

  const handleDeleteModule = (moduleId) => {
    if (window.confirm('Tem a certeza que quer apagar este módulo e todo o seu conteúdo?')) {
      setModules(modules.filter((module) => module.id !== moduleId));
    }
  };

  return (
    <AppLayout user={user} onLogout={logout}>
      <PageTitle>Gerir Módulos</PageTitle>
          {selectedCourseId && (
            <div className="mb-6 flex justify-center">
              <Link to="/admin/module-editor" state={{ courseId: selectedCourseId }}>
                <Button>+ Novo Módulo</Button>
              </Link>
            </div>
          )}

          {selectedCourseId ? (
            <h3 className="mb-4 text-xl font-semibold text-gray-700">
              Módulos do Curso: {getCourseTitle(selectedCourseId)}
            </h3>
          ) : (
            <p className="mb-4 rounded-md bg-blue-50 p-4 text-blue-700">
              Selecione "Ver Módulos" a partir da{' '}
              <Link to="/admin/manage-courses" className="font-bold underline">
                página de Cursos
              </Link>{' '}
              para ver os módulos de um curso específico.
            </p>
          )}

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
                  {filteredModules.map((module) => (
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
                          to={`/admin/module-editor/${module.id}`}
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
    </AppLayout>
  );
};

export default ManageContentPage;
