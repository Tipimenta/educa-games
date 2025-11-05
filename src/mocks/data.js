export const initialClasses = [
  { id: 1, name: 'Bootcamp Full Stack 2025' },
  { id: 2, name: 'Turma de Estágio 2025' },
];

export const initialCourses = [
  {
    id: 1,
    title: 'Frontend com React',
    description: 'Construa interfaces web modernas e reativas.',
    assignedClasses: [1, 2],
  },
  {
    id: 2,
    title: 'Backend com Node.js',
    description: 'Desenvolva APIs robustas e escaláveis.',
    assignedClasses: [1],
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
    classId: 1,
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
    classId: 1,
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
    classId: 2,
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
    assignedClasses: [1, 2],
  },
  {
    id: 2,
    title: 'Novo Módulo Disponível!',
    content: 'O Módulo 2 de React já está disponível para a turma do Bootcamp.',
    date: '2025-10-07',
    assignedClasses: [1],
  },
];

export const initialActiveInstructors = [
  { id: 1, name: 'Ingrid Silva', email: 'ingrid@exemplo.com' },
  { id: 2, name: 'João Paulo', email: 'joao@exemplo.com' },
  { id: 3, name: 'Marina Dev', email: 'marina@exemplo.com' },
  { id: 8, name: 'Pedro Oliveira', email: 'pedro@exemplo.com' },
  { id: 9, name: 'Lucia Santos', email: 'lucia@exemplo.com' },
  { id: 10, name: 'Rafael Costa', email: 'rafael@exemplo.com' },
  { id: 11, name: 'Fernanda Lima', email: 'fernanda@exemplo.com' },
  { id: 12, name: 'Gabriel Souza', email: 'gabriel@exemplo.com' },
  { id: 13, name: 'Camila Rocha', email: 'camila@exemplo.com' },
  { id: 14, name: 'Bruno Alves', email: 'bruno@exemplo.com' },
  { id: 15, name: 'Juliana Pereira', email: 'juliana@exemplo.com' },
];

export const initialInactiveInstructors = [
  { id: 4, name: 'Carlos Santos', email: 'carlos@exemplo.com' },
  { id: 5, name: 'Ana Costa', email: 'ana@exemplo.com' },
];

export const initialPendingInvites = [
  {
    id: 6,
    email: 'novo@exemplo.com',
    sentAt: '2024-01-15',
    expiresAt: '2024-01-22',
    status: 'Pendente',
  },
  {
    id: 7,
    email: 'outro@exemplo.com',
    sentAt: '2024-01-10',
    expiresAt: '2024-01-17',
    status: 'Pendente',
  },
];
