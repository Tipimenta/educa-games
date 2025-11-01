import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import AppLayout from '../../components/AppLayout';
import PageTitle from '../../components/PageTitle';

const ReportsPage = ({ user, _userRole, onLogout, turmas, students, modules }) => {
  const [selectedTurma, setSelectedTurma] = useState(
    turmas && turmas.length > 0 ? turmas[0].name : ''
  );

  useEffect(() => {
    if ((!selectedTurma || !turmas.some((t) => t.name === selectedTurma)) && turmas?.length > 0) {
      setSelectedTurma(turmas[0].name);
    }
  }, [turmas, selectedTurma]);

  const filteredAndSortedStudents = (students || [])
    .filter((student) => {
      const turmaDoAluno = turmas.find((t) => t.id === student.turmaId);
      return turmaDoAluno?.name === selectedTurma;
    })
    .sort((a, b) => b.score - a.score);

  return (
    <AppLayout user={user} onLogout={onLogout}>
      <main className="flex-grow p-6">
        <div className="mx-auto max-w-7xl">
          <PageTitle>Demonstrativo de Alunos</PageTitle>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                Ranking e Progresso - {selectedTurma || 'Nenhuma turma selecionada'}
              </h3>
              <div className="flex items-center gap-2">
                <label htmlFor="turma-select" className="text-sm font-semibold text-gray-700">
                  Filtrar por Turma:
                </label>
                <select
                  id="turma-select"
                  value={selectedTurma}
                  onChange={(e) => setSelectedTurma(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {turmas && turmas.length > 0 ? (
                    turmas.map((turma) => (
                      <option key={turma.id} value={turma.name}>
                        {turma.name}
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
                  {filteredAndSortedStudents.length > 0 ? (
                    filteredAndSortedStudents.map((student, index) => {
                      const currentModuleTitle =
                        modules.find((m) => m.id === student.currentModuleId)?.title || 'N/A';
                      return (
                        <tr key={student.id} className="border-b last:border-b-0 hover:bg-gray-50">
                          <td className="px-4 py-4 font-bold text-gray-800">{index + 1}º</td>
                          <td className="px-4 py-4 font-medium text-gray-800">
                            <Link
                              to={`/admin/student/${student.id}`}
                              className="text-blue-600 hover:underline"
                            >
                              {student.name}
                            </Link>
                          </td>
                          <td className="px-4 py-4 font-medium text-gray-800">
                            {currentModuleTitle}
                          </td>
                          <td className="px-4 py-4 font-medium text-gray-800">
                            {student.score} Pts
                          </td>
                          <td className="px-4 py-4 font-medium text-gray-800">
                            {student.loginStreak}
                          </td>
                          <td className="px-4 py-4 font-medium text-gray-800">
                            {new Date(student.lastLogin).toLocaleDateString('pt-BR', {
                              timeZone: 'UTC',
                            })}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-4 text-center text-sm text-gray-500">
                        Nenhum aluno encontrado para esta turma.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default ReportsPage;
