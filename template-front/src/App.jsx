import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import CadastroPage from './pages/Cadastro';
import DashboardPage from './pages/Dashboard';
import LoginPage from './pages/Login';
import RecuperarSenhaPage from './pages/RecuperarSenha';
import RedefinirSenhaPage from './pages/RedefinirSenha';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial redireciona para o login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rotas de Autenticação */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
        <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />

        {/* Rota principal da aplicação */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
