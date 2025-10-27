export const initialTurmas = [
  { id: 1, name: 'Bootcamp Full Stack 2025' },
  { id: 2, name: 'Turma de Estágio 2025' },
];

export const initialCourses = [
  {
    id: 1,
    title: 'Frontend com React',
    description: 'Construa interfaces web modernas e reativas.',
    assignedTurmas: [1, 2],
  },
  {
    id: 2,
    title: 'Backend com Node.js',
    description: 'Desenvolva APIs robustas e escaláveis.',
    assignedTurmas: [1],
  },
];

export const initialModules = [
  {
    id: 1,
    courseId: 1,
    title: 'Módulo 1: Fundamentos de React',
    lessons: [
      {
        id: 1,
        title: 'O que é JSX?',
        description: 'Aprenda a sintaxe que mistura HTML e JavaScript.',
        points: 10,
      },
      {
        id: 2,
        title: 'Componentes e Props',
        description: 'Entenda como construir e reutilizar componentes.',
        points: 15,
      },
    ],
    quiz: {
      questions: [
        {
          id: 1,
          text: 'O que são props?',
          options: ['Funções especiais', 'Dados passados para um componente', 'Estilos CSS'],
          correctAnswer: 'Dados passados para um componente',
          points: 25,
        },
      ],
    },
  },
  {
    id: 2,
    courseId: 1,
    title: 'Módulo 2: Hooks Essenciais',
    lessons: [
      {
        id: 3,
        title: 'useState e useEffect',
        description: 'Controle o estado e o ciclo de vida dos seus componentes.',
        points: 15,
      },
    ],
    quiz: { questions: [] },
  },
  {
    id: 3,
    courseId: 2,
    title: 'Módulo 1: Introdução ao Node.js',
    lessons: [{ id: 4, title: 'Criando um servidor HTTP', points: 20 }],
    quiz: { questions: [] },
  },
  {
    id: 4,
    courseId: 2,
    title: 'Módulo 2: API com Express',
    lessons: [{ id: 5, title: 'Rotas e Middlewares', points: 20 }],
    quiz: { questions: [] },
  },
];

export const initialStudents = [
  {
    id: 1,
    name: 'Ana Coder',
    email: 'aluno@email.com',
    turmaId: 1,
    score: 190,
    previousScore: 150,
    loginStreak: 3,
    lastLogin: '2025-10-07',
    currentModuleId: 1,
    progress: { completedLessons: new Set([1]), finalizedQuizzes: new Set(), dailyBonusDay: null },
  },
  {
    id: 2,
    name: 'Bruno Dev',
    email: 'bruno@email.com',
    turmaId: 1,
    score: 170,
    previousScore: 180,
    loginStreak: 1,
    lastLogin: '2025-10-08',
    currentModuleId: 1,
    progress: { completedLessons: new Set(), finalizedQuizzes: new Set(), dailyBonusDay: null },
  },
  {
    id: 3,
    name: 'Carla Script',
    email: 'carla@email.com',
    turmaId: 2,
    score: 25,
    previousScore: 25,
    loginStreak: 2,
    lastLogin: '2025-10-07',
    currentModuleId: 1,
    progress: { completedLessons: new Set(), finalizedQuizzes: new Set(), dailyBonusDay: null },
  },
];

export const initialAnnouncements = [
  {
    id: 1,
    title: 'Manutenção Programada',
    content: 'A plataforma estará em manutenção no próximo sábado das 10h às 11h.',
    date: '2025-10-08',
    assignedTurmas: [1, 2],
  },
  {
    id: 2,
    title: 'Novo Módulo Disponível!',
    content: 'O Módulo 2 de React já está disponível para a turma do Bootcamp.',
    date: '2025-10-07',
    assignedTurmas: [1],
  },
];