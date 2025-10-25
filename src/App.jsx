import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider, ToastProvider } from './context';
import {
  initialAnnouncements,
  initialCourses,
  initialModules,
  initialStudents,
  initialTurmas,
} from './mocks/data';
import CadastroPage from './pages/Cadastro';
import LoginPage from './pages/Login';
import RecuperarSenhaPage from './pages/RecuperarSenha';
import RedefinirSenhaPage from './pages/RedefinirSenha';
import { AppRoutes } from './routes';

function App() {
  const [students, setStudents] = useState(initialStudents);
  const [courses, setCourses] = useState(initialCourses);
  const [modules, setModules] = useState(initialModules);
  const [turmas, setTurmas] = useState(initialTurmas);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage turmas={turmas} />} />
            <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
            <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />

            {/* Rotas protegidas */}
            <Route
              path="/*"
              element={
                <AppRoutes
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
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
