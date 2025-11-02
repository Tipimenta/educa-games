import { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ChevronLeftIcon, FormattedDate } from '../../components';
import AppLayout from '../../components/AppLayout';
import { AuthContext, ClassesContext, ModulesContext, StudentsContext } from '../../context';
import { useAuth } from '../../hooks';

const StudentProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { students } = useContext(StudentsContext);
  const { classes } = useContext(ClassesContext);
  const { modules } = useContext(ModulesContext);
  const { logout } = useAuth();
  const { studentId } = useParams();

  const student = (students || []).find((s) => s.id === parseInt(studentId));
  const className = classes.find((c) => c.id === student?.classId)?.name || 'Turma não encontrada';
  const currentModuleTitle = modules.find((m) => m.id === student?.currentModuleId)?.title || 'N/A';

  // Sidebar é gerenciada pelo AppLayout

  if (!student) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-xl">Aluno não encontrado!</p>
        <Link to="/instructor/reports" className="text-blue-600 hover:underline">
          Voltar para Relatórios
        </Link>
      </div>
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
              <h3 className="text-2xl font-bold text-gray-800">{student.name}</h3>
              <p className="text-md text-gray-600">{className}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="font-semibold text-gray-700">Pontuação Total:</div>
              <div>{student.score} Pts</div>
              <div className="font-semibold text-gray-700">Módulo Atual:</div>
              <div>{currentModuleTitle}</div>
              <div className="font-semibold text-gray-700">Dias Seguidos de Acesso:</div>
              <div>{student.loginStreak} dias</div>
              <div className="font-semibold text-gray-700">Último Acesso:</div>
              <div>
                <FormattedDate date={student.lastLogin} timeZone="UTC" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentProfilePage;
