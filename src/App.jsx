import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import ForgotPasswordPage from './pages/Public/ForgotPassword';
import LandingPage from './pages/Public/LandingPage';
import LoginPage from './pages/Public/Login';
import ResetPasswordPage from './pages/Public/ResetPassword';
import SignUpPage from './pages/Shared/SignUp';
import { AppProviders } from './providers';
import { AppRoutes } from './routes';

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
