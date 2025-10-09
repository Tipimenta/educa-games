import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import ManageAnnouncementsPage from './pages/Admin/ManageAnnouncements';
import ManageClassesPage from './pages/Admin/ManageClasses';
import ManageCoursesPage from './pages/Admin/ManageCourses';
import ManageContentPage from './pages/Admin/ManageContent';
import ModuleEditor from './pages/Admin/ModuleEditor';
import ReportsPage from './pages/Admin/Reports';
import StudentProfilePage from './pages/Admin/StudentProfile';
import CadastroPage from './pages/Cadastro';
import DashboardPage from './pages/Dashboard';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import RecuperarSenhaPage from './pages/RecuperarSenha';
import RedefinirSenhaPage from './pages/RedefinirSenha';
import StudentCoursesPage from './pages/StudentCourses';


const initialTurmas = [
  { id: 1, name: 'Bootcamp Full Stack 2025' },
  { id: 2, name: 'Turma de Estágio 2025' },
];
const initialCourses = [
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
const initialModules = [
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
const initialStudents = [
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
const initialAnnouncements = [
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

// --- Componentes ---
const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role))
    return <Navigate to={user.role === 'admin' ? '/admin/courses' : '/dashboard'} replace />;
  return children;
};

const AppRoutes = ({
  user,
  setUser,
  students,
  setStudents,
  courses,
  setCourses,
  modules,
  setModules,
  turmas,
  setTurmas,
  announcements,
  setAnnouncements,
}) => {
  const navigate = useNavigate();
  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const handleLogin = (email) => {
    let foundStudent = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (foundStudent) {
      if (!foundStudent.progress)
        foundStudent.progress = {
          completedLessons: new Set(),
          finalizedQuizzes: new Set(),
          dailyBonusDay: null,
        };
      if (!foundStudent.currentModuleId) foundStudent.currentModuleId = 1;
    }

    if (email.toLowerCase() === 'admin@email.com') {
      setUser({ name: 'Admin Tech', role: 'admin' });
      navigate('/admin/courses');
    } else if (foundStudent) {
      const today = new Date();
      const lastLogin = new Date(foundStudent.lastLogin);
      const todayDateString = getTodayDateString();

      const diffTime = today.setHours(0, 0, 0, 0) - lastLogin.setHours(0, 0, 0, 0);
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (foundStudent.lastLogin !== todayDateString) {
        if (diffDays === 1) {
          foundStudent.loginStreak = (foundStudent.loginStreak || 0) + 1;
        } else {
          foundStudent.loginStreak = 1;
        }
        foundStudent.lastLogin = todayDateString;
      }

      const studentIndex = students.findIndex((s) => s.id === foundStudent.id);
      const updatedStudents = [...students];
      updatedStudents[studentIndex] = foundStudent;
      setStudents(updatedStudents);

      setUser({ ...foundStudent, role: 'aluno' });
      navigate('/dashboard');
    } else {
      alert('Aluno não encontrado!');
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const updateStudentProgress = (studentId, type, itemId, pointsToAdd) => {
    setStudents((prevStudents) => {
      const newStudents = [...prevStudents];
      const studentIndex = newStudents.findIndex((s) => s.id === studentId);
      if (studentIndex === -1) return prevStudents;

      const student = { ...newStudents[studentIndex] };
      const progressSet = student.progress[type];
      const todayDateString = getTodayDateString();
      let bonusPoints = 0;

      if (type === 'completedLessons' && student.progress.dailyBonusDay !== todayDateString) {
        bonusPoints = 25;
        student.progress.dailyBonusDay = todayDateString;
      }

      if (!progressSet.has(itemId)) {
        student.score += pointsToAdd + bonusPoints;
        progressSet.add(itemId);

        if (type === 'finalizedQuizzes') {
          const moduleId = itemId;
          const module = modules.find((m) => m.id === moduleId);
          const courseModules = modules
            .filter((m) => m.courseId === module.courseId)
            .sort((a, b) => a.id - b.id);
          const currentModuleIndex = courseModules.findIndex((m) => m.id === moduleId);
          const allLessonsInModule = module.lessons.every((lesson) =>
            student.progress.completedLessons.has(lesson.id)
          );

          if (
            allLessonsInModule &&
            student.currentModuleId === moduleId &&
            currentModuleIndex < courseModules.length - 1
          ) {
            student.currentModuleId = courseModules[currentModuleIndex + 1].id;
          }
        }

        if (user && user.id === studentId) {
          setUser((prevUser) => ({ ...prevUser, ...student }));
        }
      }

      newStudents[studentIndex] = student;
      return newStudents;
    });
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/cadastro" element={<CadastroPage turmas={turmas} />} />
      <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
      <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user} allowedRoles={['aluno']}>
            <DashboardPage
              user={user}
              students={students}
              onLogout={handleLogout}
              courses={courses}
              modules={modules}
              announcements={announcements}
              turmas={turmas}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses"
        element={
          <ProtectedRoute user={user} allowedRoles={['aluno']}>
            <StudentCoursesPage
              user={user}
              onLogout={handleLogout}
              courses={courses}
              modules={modules}
              updateStudentProgress={updateStudentProgress}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute user={user} allowedRoles={['aluno', 'admin']}>
            <ProfilePage user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/announcements"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <ManageAnnouncementsPage
              user={user}
              userRole={user?.role}
              onLogout={handleLogout}
              announcements={announcements}
              setAnnouncements={setAnnouncements}
              turmas={turmas}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <ManageCoursesPage
              user={user}
              userRole={user?.role}
              onLogout={handleLogout}
              courses={courses}
              setCourses={setCourses}
              turmas={turmas}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/classes"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <ManageClassesPage
              user={user}
              userRole={user?.role}
              onLogout={handleLogout}
              turmas={turmas}
              setTurmas={setTurmas}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/content"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <ManageContentPage
              user={user}
              userRole={user?.role}
              onLogout={handleLogout}
              courses={courses}
              modules={modules}
              setModules={setModules}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/content/new"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <ModuleEditor
              user={user}
              userRole={user?.role}
              onLogout={handleLogout}
              modules={modules}
              setModules={setModules}
              turmas={turmas}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/content/edit/:moduleId"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <ModuleEditor
              user={user}
              userRole={user?.role}
              onLogout={handleLogout}
              modules={modules}
              setModules={setModules}
              turmas={turmas}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <ReportsPage
              user={user}
              userRole={user?.role}
              onLogout={handleLogout}
              turmas={turmas}
              students={students}
              modules={modules}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/student/:studentId"
        element={
          <ProtectedRoute user={user} allowedRoles={['admin']}>
            <StudentProfilePage
              user={user}
              userRole={user?.role}
              onLogout={handleLogout}
              students={students}
              turmas={turmas}
              modules={modules}
            />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState(initialStudents);
  const [courses, setCourses] = useState(initialCourses);
  const [modules, setModules] = useState(initialModules);
  const [turmas, setTurmas] = useState(initialTurmas);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  return (
    <BrowserRouter>
      <AppRoutes
        user={user}
        setUser={setUser}
        students={students}
        setStudents={setStudents}
        courses={courses}
        setCourses={setCourses}
        modules={modules}
        setModules={setModules}
        turmas={turmas}
        setTurmas={setTurmas}
        announcements={announcements}
        setAnnouncements={setAnnouncements}
      />
    </BrowserRouter>
  );
}

export default App;
