import { useContext } from 'react';

import {
  BarChartIcon,
  CheckSquareIcon,
  DashboardCard,
  FlameIcon,
  FormattedDate,
  LatestBadges,
  TargetIcon,
} from '../../components';
import AppLayout from '../../components/AppLayout';
import PageTitle from '../../components/PageTitle';
import { AuthContext } from '../../context';
import { useAuth, useStudentAnnouncements, useStudentDashboard, useStudentRanking } from '../../hooks';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();

  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
    error: dashboardError,
  } = useStudentDashboard();

  const {
    data: rankingData = [],
    isLoading: isLoadingRanking,
    error: rankingError,
  } = useStudentRanking();

  const {
    data: announcements = [],
    isLoading: isLoadingAnnouncements,
  } = useStudentAnnouncements();

  if (isLoadingDashboard || isLoadingRanking || isLoadingAnnouncements) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <div className="mx-auto max-w-7xl">
          <PageTitle>Dashboard</PageTitle>
          <div className="text-center">
            <p className="text-gray-600">Carregando dados do dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (dashboardError || rankingError) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <div className="mx-auto max-w-7xl">
          <PageTitle>Dashboard</PageTitle>
          <div className="text-center">
            <p className="text-red-600">Erro ao carregar dados do dashboard.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const stats = dashboardData || {
    totalScore: 0,
    rank: 0,
    loginStreak: 0,
    completedModules: 0,
    totalModules: 0,
  };

  return (
    <AppLayout user={user} onLogout={logout}>
      <div className="mx-auto max-w-7xl">
        <PageTitle>Dashboard</PageTitle>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            icon={<TargetIcon />}
            title="Pontuação Total"
            value={stats.totalScore || 0}
          />
          <DashboardCard
            icon={<BarChartIcon />}
            title="Classificação"
            value={`${stats.rank || 0}º`}
          />
          <DashboardCard
            icon={<FlameIcon />}
            title="Dias Seguidos"
            value={stats.loginStreak || 0}
          />
          <DashboardCard
            icon={<CheckSquareIcon />}
            title="Módulos Concluídos"
            value={`${stats.completedModules || 0} de ${stats.totalModules || 0}`}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md lg:col-span-2">
            <h3 className="mb-4 text-xl font-bold text-gray-800">Ranking da Turma</h3>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white">
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
                    <th className="px-4 py-2 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Últimas Conquistas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rankingData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        Nenhum aluno no ranking ainda.
                      </td>
                    </tr>
                  ) : (
                    rankingData.map((entry) => {
                      const isCurrentUser = entry.studentId === user?.id;
                    return (
                      <tr
                          key={entry.studentId}
                          className={`border-b last:border-b-0 ${isCurrentUser ? 'bg-blue-50' : ''}`}
                      >
                        <td
                            className={`px-4 py-4 font-bold ${isCurrentUser ? 'text-blue-700' : 'text-gray-800'}`}
                        >
                            {entry.rank}º
                        </td>
                        <td
                            className={`px-4 py-4 font-medium ${isCurrentUser ? 'text-blue-700' : 'text-gray-800'}`}
                        >
                            {entry.studentName}
                            {isCurrentUser ? ' (você)' : ''}
                        </td>
                        <td
                            className={`px-4 py-4 font-medium ${isCurrentUser ? 'text-blue-700' : 'text-gray-800'}`}
                        >
                            {entry.score} Pts
                        </td>
                        <td className="px-4 py-4 text-center">
                            <LatestBadges badges={entry.latestBadges || []} />
                        </td>
                      </tr>
                    );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-bold text-gray-800">Quadro de Avisos</h3>
            {announcements.length > 0 ? (
              <ul className="max-h-96 space-y-4 overflow-y-auto">
                {announcements.map((ann) => (
                  <li key={ann.id} className="border-b pb-2 last:border-b-0">
                    <p className="font-semibold text-gray-700">{ann.title}</p>
                    <p className="text-sm text-gray-500">{ann.content}</p>
                    <p className="mt-1 text-right text-xs text-gray-400">
                      <FormattedDate date={ann.date} />
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Nenhum aviso para a sua turma no momento.</p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
