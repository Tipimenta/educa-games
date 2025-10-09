import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Button from '../../components/Button';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

const ManageContentPage = ({ user, userRole, onLogout, courses, modules, setModules }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
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
            <h2 className="mb-6 text-3xl font-bold text-gray-800">Gerir Módulos</h2>
            {selectedCourseId && (
              <Link to="/admin/content/new" state={{ courseId: selectedCourseId }}>
                <Button>+ Novo Módulo</Button>
              </Link>
            )}
          </div>

          {selectedCourseId ? (
            <h3 className="mb-4 text-xl font-semibold text-gray-700">
              Módulos do Curso: {getCourseTitle(selectedCourseId)}
            </h3>
          ) : (
            <p className="mb-4 rounded-md bg-blue-50 p-4 text-blue-700">
              Selecione "Ver Módulos" a partir da{' '}
              <Link to="/admin/courses" className="font-bold underline">
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
                          to={`/admin/content/edit/${module.id}`}
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
        </main>
      </div>
    </div>
  );
};

export default ManageContentPage;
