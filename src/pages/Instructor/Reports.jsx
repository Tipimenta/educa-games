import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppLayout, EmptyState, FormattedDate, PageTitle } from '../../components';
import { AuthContext } from '../../context';
import { useAuth, useClassroomReport, useClassrooms } from '../../hooks';

const ReportsPage = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const { data: classes = [], isLoading: isLoadingClasses } = useClassrooms();

  const [selectedClassId, setSelectedClassId] = useState(null);

  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const selectedClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId);
  }, [classes, selectedClassId]);

  const { data: report = [], isLoading: isLoadingReport } = useClassroomReport(selectedClassId, {
    enabled: !!selectedClassId,
  });

  const isLoading = isLoadingClasses || isLoadingReport;

  if (isLoading) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <PageTitle>Demonstrativo de Alunos</PageTitle>
        <div className="text-center">
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <PageTitle>Demonstrativo de Alunos</PageTitle>

      {classes.length === 0 ? (
        <EmptyState
          message="Nenhuma turma encontrada"
          description="Crie turmas para ver o demonstrativo de alunos."
          className="mt-4"
        />
      ) : (
        <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                Ranking e Progresso - {selectedClass?.name || 'Nenhuma turma selecionada'}
              </h3>
              <div className="flex items-center gap-2">
                <label htmlFor="class-select" className="text-sm font-semibold text-gray-700">
                  Filtrar por Turma:
                </label>
                <select
                  id="class-select"
                  value={selectedClassId || ''}
                  onChange={(e) => setSelectedClassId(Number(e.target.value))}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {classes && classes.length > 0 ? (
                    classes.map((classItem) => (
                      <option key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Nenhuma turma disponível</option>
                  )}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Pos.
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Aluno
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Módulo Atual
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Pontuação
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Dias Seguidos
                    </th>
                    <th className="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Último Acesso
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.length > 0 ? (
                    report.map((entry) => {
                      return (
                        <tr key={entry.studentId} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="px-4 py-4 font-bold text-gray-800">{entry.rank}º</td>
                          <td className="px-4 py-4 font-medium text-gray-800">
                            <Link
                              to={`/instructor/classroom/${selectedClassId}/student/${entry.studentId}`}
                              className="text-blue-600 hover:underline"
                            >
                              {entry.studentName}
                            </Link>
                          </td>
                          <td className="px-4 py-4 font-medium text-gray-800">{entry.currentModule || 'N/A'}</td>
                          <td className="px-4 py-4 font-medium text-gray-800">
                            {entry.score} Pts
                          </td>
                          <td className="px-4 py-4 font-medium text-gray-800">
                            {entry.loginStreak || 0}
                          </td>
                          <td className="px-4 py-4 font-medium text-gray-800">
                            {entry.lastAccessAt ? (
                              <FormattedDate date={entry.lastAccessAt} timeZone="UTC" />
                            ) : (
                              'N/A'
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-sm text-gray-500">
                        Nenhum aluno encontrado para esta turma.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </AppLayout>
  );
};

export default ReportsPage;
