import React from 'react';

import {
  BarChartIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  TargetIcon,
  TrophyIcon,
  UsersIcon,
} from './Icons';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,

      icon: <ClipboardDocumentCheckIcon className="h-8 w-8 text-blue-600" />,

      title: 'Sistema de Avaliação',

      description:
        'Crie quizzes, provas e exercícios interativos para avaliar o conhecimento dos alunos.',
    },

    {
      id: 2,

      icon: <BookOpenIcon className="h-8 w-8 text-green-600" />,

      title: 'Conteúdo Educacional',

      description:
        'Aulas organizadas, materiais didáticos e módulos estruturados para facilitar o aprendizado.',
    },

    {
      id: 3,

      icon: <TrophyIcon className="h-8 w-8 text-yellow-600" />,

      title: 'Sistema de Pontuação',

      description:
        'Acompanhe o progresso dos alunos com pontuações e rankings para motivar o estudo.',
    },

    {
      id: 4,

      icon: <BarChartIcon className="h-8 w-8 text-purple-600" />,

      title: 'Relatórios Detalhados',

      description: 'Acompanhe o desempenho com métricas detalhadas e relatórios personalizados.',
    },

    {
      id: 5,

      icon: <UsersIcon className="h-8 w-8 text-red-600" />,

      title: 'Gestão de Turmas',

      description:
        'Professores podem gerenciar turmas, criar conteúdo e acompanhar o progresso dos alunos.',
    },

    {
      id: 6,

      icon: <TargetIcon className="h-8 w-8 text-indigo-600" />,

      title: 'Metas Educacionais',

      description:
        'Defina objetivos de aprendizado e acompanhe a jornada educacional dos estudantes.',
    },
  ];

  return (
    <section id="features" className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Recursos que fazem a diferença
          </h2>

          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Descubra como o EducaGames pode revolucionar sua experiência de aprendizado
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="transform rounded-lg bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-lg"
            >
              <div className="mb-4">{feature.icon}</div>

              <h3 className="mb-2 text-xl font-semibold text-gray-900">{feature.title}</h3>

              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

