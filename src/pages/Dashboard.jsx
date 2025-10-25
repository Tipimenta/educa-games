import { useState } from 'react';

import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  BarChartIcon,
  CheckSquareIcon,
  DashboardCard,
  FlameIcon,
  Header,
  MinusCircleIcon,
  Sidebar,
  TargetIcon,
} from '../components';
import { useAuth } from '../hooks';

const RankingIndicator = ({ change }) => {
  if (change > 0) {
    return (
      <span className="flex items-center gap-1 text-xs text-green-500">
        <ArrowUpCircleIcon className="h-4 w-4" /> Subiu {change}
      </span>
    );
  }
  if (change < 0) {
    return (
      <span className="flex items-center gap-1 text-xs text-red-500">
        <ArrowDownCircleIcon className="h-4 w-4" /> Desceu {Math.abs(change)}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-gray-400">
      <MinusCircleIcon className="h-4 w-4" /> Manteve
    </span>
  );
};

const DashboardPage = ({ user, students, courses, modules, announcements }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { logout } = useAuth();

  const currentUserData = students.find((s) => s.id === user.id) || user;
  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);

  const studentsInTurma = students.filter((s) => s.turmaId === user.turmaId);

  const currentRanking = [...studentsInTurma].sort((a, b) => b.score - a.score);
  const previousRanking = [...studentsInTurma].sort(
    (a, b) => (b.previousScore || 0) - (a.previousScore || 0)
  );

  const userRank = currentRanking.findIndex((s) => s.id === user.id) + 1;

  const coursesForTurma = courses.filter((c) => c.assignedTurmas.includes(user.turmaId));
  const courseIdsForTurma = coursesForTurma.map((c) => c.id);
  const totalAssignedModules = modules.filter((m) => courseIdsForTurma.includes(m.courseId));

  const completedModulesCount = totalAssignedModules.filter((module) => {
    const allLessonsDone = module.lessons.every((lesson) =>
      user.progress.completedLessons.has(lesson.id)
    );
    const quizDone =
      !module.quiz?.questions?.length > 0 || user.progress.finalizedQuizzes.has(module.id);
    return allLessonsDone && quizDone;
  }).length;

  const totalModulesCount = totalAssignedModules.length;

  const filteredAnnouncements = (announcements || []).filter((ann) =>
    ann.assignedTurmas.includes(user.turmaId)
  );

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
        userRole={user.role}
      />
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Header user={user} toggleSidebar={toggleSidebar} onLogout={logout} />
        <main className="flex-grow p-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-6 text-3xl font-bold text-gray-800">Dashboard</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
              <DashboardCard
                icon={<TargetIcon />}
                title="Pontuação Total"
                value={currentUserData.score}
              />
              <DashboardCard icon={<BarChartIcon />} title="Classificação" value={`${userRank}º`} />
              <DashboardCard
                icon={<FlameIcon />}
                title="Dias Seguidos"
                value={currentUserData.loginStreak}
              />
              <DashboardCard
                icon={<CheckSquareIcon />}
                title="Módulos Concluídos"
                value={`${completedModulesCount} de ${totalModulesCount}`}
              />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-md lg:col-span-2">
                <h3 className="mb-4 text-xl font-bold text-gray-800">Ranking da Turma</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Posição
                        </th>
                        <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Aluno
                        </th>
                        <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Pontuação
                        </th>
                        <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                          Progresso
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRanking.map((student, index) => {
                        const currentRank = index + 1;
                        const previousRank =
                          previousRanking.findIndex((s) => s.id === student.id) + 1;
                        const rankChange = previousRank > 0 ? previousRank - currentRank : 0;
                        return (
                          <tr
                            key={student.id}
                            className={`border-b last:border-b-0 ${
                              student.id === user.id ? 'bg-blue-50' : ''
                            }`}
                          >
                            <td
                              className={`px-4 py-4 font-bold ${student.id === user.id ? 'text-blue-700' : 'text-gray-800'}`}
                            >
                              {currentRank}º
                            </td>
                            <td
                              className={`px-4 py-4 font-medium ${student.id === user.id ? 'text-blue-700' : 'text-gray-800'}`}
                            >
                              {student.name}
                              {student.id === user.id ? ' (você)' : ''}
                            </td>
                            <td
                              className={`px-4 py-4 font-medium ${student.id === user.id ? 'text-blue-700' : 'text-gray-800'}`}
                            >
                              {student.score} Pts
                            </td>
                            <td className="px-4 py-4">
                              <RankingIndicator change={rankChange} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="mb-4 text-xl font-bold text-gray-800">Quadro de Avisos</h3>
                <ul className="space-y-4">
                  {filteredAnnouncements.length > 0 ? (
                    filteredAnnouncements.slice(0, 3).map((ann) => (
                      <li key={ann.id} className="border-b pb-2 last:border-b-0">
                        <p className="font-semibold text-gray-700">{ann.title}</p>
                        <p className="text-sm text-gray-500">{ann.content}</p>
                        <p className="mt-1 text-right text-xs text-gray-400">
                          {new Date(ann.date).toLocaleDateString('pt-BR')}
                        </p>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      Nenhum aviso para a sua turma no momento.
                    </p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
