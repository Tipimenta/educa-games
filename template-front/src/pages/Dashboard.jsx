import React, { useState } from 'react';

import DashboardCard from '../components/DashboardCard';
import Header from '../components/Header';
import { BarChartIcon, TargetIcon, UsersIcon } from '../components/Icons';
import Sidebar from '../components/Sidebar';

const DashboardPage = () => {
  // Começa com o menu lateral recolhido por padrão
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Função para o botão de menu em telas pequenas (mobile)
  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  // Funções para controlar o estado ao passar o mouse (desktop)
  const handleMouseEnter = () => {
    setSidebarCollapsed(false); // Expande o menu
  };

  const handleMouseLeave = () => {
    setSidebarCollapsed(true); // Recolhe o menu
  };

  // Dados de exemplo para o ranking
  const rankingData = [
    { position: 1, student: 'Maria (você)', score: '125 Pts' },
    { position: 2, student: 'João', score: '100 Pts' },
    { position: 3, student: 'Pedro', score: '98 Pts' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}
      >
       
       
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-grow p-6">
          <h2 className="mb-6 text-3xl font-bold text-gray-800">Dashboard</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            <DashboardCard icon={<TargetIcon />} title="Pontuação Total" value="125" />
            <DashboardCard icon={<BarChartIcon />} title="Classificação" value="1" />
            <DashboardCard icon={<UsersIcon />} title="Pontuação da Turma" value="125" />
            <DashboardCard icon={<UsersIcon />} title="Pontuação da Turma" value="125" />
          </div>

          <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-bold text-gray-800">Ranking da Turma 1</h3>
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
                  </tr>
                </thead>
                <tbody>
                  {rankingData.map((item) => (
                    <tr
                      key={item.position}
                      className={`border-b last:border-b-0 ${item.student.includes('(você)') ? 'bg-blue-50' : ''}`}
                    >
                      <td
                        className={`px-4 py-4 font-medium ${item.student.includes('(você)') ? 'text-blue-700' : 'text-gray-800'}`}
                      >
                        {item.position}
                      </td>
                      <td
                        className={`px-4 py-4 font-medium ${item.student.includes('(você)') ? 'text-blue-700' : 'text-gray-800'}`}
                      >
                        {item.student}
                      </td>
                      <td
                        className={`px-4 py-4 font-medium ${item.student.includes('(você)') ? 'text-blue-700' : 'text-gray-800'}`}
                      >
                        {item.score}
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

export default DashboardPage;
