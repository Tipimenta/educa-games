import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { AppLayout, ChevronLeftIcon, EmptyState, FormattedDate } from '../../components';
import { AuthContext } from '../../context';
import { useAuth, useClassrooms, useModules, useStudent } from '../../hooks';

const StudentProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const { studentId } = useParams();

  const {
    data: student,
    isLoading: isLoadingStudent,
    error: studentError,
  } = useStudent(studentId ? parseInt(studentId) : null);
  const { data: classes = [], isLoading: isLoadingClasses } = useClassrooms();
  const { data: modulesData = { content: [] }, isLoading: isLoadingModules } = useModules();
  const modules = modulesData.content || [];

  const isLoading = isLoadingStudent || isLoadingClasses || isLoadingModules;

  const className = classes.find((c) => c.id === student?.classId)?.name || null;
  const currentModuleTitle = modules.find((m) => m.id === student?.currentModuleId)?.title || null;

  if (isLoading) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <div className="text-center">
          <p className="text-gray-600">Carregando perfil do aluno...</p>
        </div>
      </AppLayout>
    );
  }

  if (studentError || !student) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <Link
          to="/instructor/reports"
          className="mb-4 flex items-center text-sm font-semibold text-blue-600 hover:underline"
        >
          <ChevronLeftIcon className="mr-1 h-5 w-5" />
          Voltar para Relatórios
        </Link>
        <EmptyState
          message="Aluno não encontrado"
          description="O perfil do aluno solicitado não foi encontrado ou você não tem permissão para visualizá-lo."
          className="mt-4"
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <Link
        to="/instructor/reports"
        className="mb-4 flex items-center text-sm font-semibold text-blue-600 hover:underline"
      >
        <ChevronLeftIcon className="mr-1 h-5 w-5" />
        Voltar para Relatórios
      </Link>
      <h2 className="mb-6 text-3xl font-bold text-gray-800">Perfil do Aluno</h2>
      <div className="rounded-lg bg-white p-8 shadow-md">
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <div className="mb-6 flex flex-col items-center md:mr-10 md:mb-0">
            <img
              src={`https://placehold.co/100x100/E2E8F0/4A5568?text=${student.name.charAt(0)}`}
              alt="Foto do Aluno"
              className="h-32 w-32 rounded-full object-cover"
            />
          </div>
          <div className="w-full flex-1">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{student.name || 'Sem nome'}</h3>
              {className ? (
                <p className="text-md text-gray-600">{className}</p>
              ) : (
                <p className="text-md text-gray-400 italic">Turma não atribuída</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="font-semibold text-gray-700">Pontuação Total:</div>
              <div>{student.score ?? 0} Pts</div>
              <div className="font-semibold text-gray-700">Módulo Atual:</div>
              <div>{currentModuleTitle || 'Nenhum módulo atribuído'}</div>
              <div className="font-semibold text-gray-700">Dias Seguidos de Acesso:</div>
              <div>{student.loginStreak ?? 0} dias</div>
              <div className="font-semibold text-gray-700">Último Acesso:</div>
              <div>
                {student.lastLogin ? (
                  <FormattedDate date={student.lastLogin} timeZone="UTC" />
                ) : (
                  <span className="text-gray-400 italic">Nunca</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentProfilePage;
