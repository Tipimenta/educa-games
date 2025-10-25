import { useState } from 'react';
import { Link } from 'react-router-dom';

import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, errorMessage } = useAuth();
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validateEmail = (value) => {
    if (!value) return 'E-mail é obrigatório';
    if (!emailRegex.test(value)) return 'Digite um e-mail válido';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Senha é obrigatória';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setFormErrors({ email: emailErr, password: passErr });
    setTouched({ email: true, password: true });
    if (emailErr || passErr) return;

    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  const errorMessages = errorMessage ? errorMessage.split('\n') : [];

  // Verificar se o formulário é válido para habilitar o botão
  const isFormValid =
    email.trim() !== '' && password.trim() !== '' && !formErrors.email && !formErrors.password;

  return (
    <AuthLayout>
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">Bem-vindo!</h2>

      {errorMessages.length > 0 && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
          {errorMessages.length === 1 ? (
            // Erro único
            <p className="text-center text-sm text-red-600">{errorMessages[0]}</p>
          ) : (
            // Múltiplos erros de validação
            <div className="text-sm text-red-600">
              <p className="mb-2 text-center font-medium">Por favor, corrija os seguintes erros:</p>
              <ul className="space-y-1">
                {errorMessages.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-red-500">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <Input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => {
              const val = e.target.value;
              setEmail(val);
              if (touched.email) {
                setFormErrors((prev) => ({ ...prev, email: validateEmail(val) }));
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, email: true }));
              setFormErrors((prev) => ({ ...prev, email: validateEmail(email) }));
            }}
            error={Boolean(formErrors.email)}
          />
          <ErrorMessage message={formErrors.email} />
        </div>

        <div>
          <PasswordInput
            name="password"
            placeholder="Sua Senha"
            value={password}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              if (touched.password) {
                setFormErrors((prev) => ({ ...prev, password: validatePassword(val) }));
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, password: true }));
              setFormErrors((prev) => ({ ...prev, password: validatePassword(password) }));
            }}
            error={Boolean(formErrors.password)}
          />
          <ErrorMessage message={formErrors.password} />
        </div>

        <Button type="submit" disabled={loading || !isFormValid} className="w-full">
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/recuperar-senha" className="text-secondary text-sm hover:underline">
          Esqueceu a senha?
        </Link>
      </div>

      {/* Linha divisória */}
      <div className="mt-10 mb-6">
        <hr className="border-gray-200" />
      </div>

      {/* Seções de ajuda */}
      <div className="space-y-4">
        {/* Primeiro acesso */}
        <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-5">
          <div className="flex items-start space-x-3">
            <span className="text-lg">📧</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">Primeiro acesso?</p>
              <p className="mt-1 text-xs text-gray-500">
                Verifique seu email e clique no link de convite
              </p>
            </div>
          </div>
        </div>

        {/* Oferecer cursos */}
        <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-5">
          <div className="flex items-start space-x-3">
            <span className="text-lg">🎓</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Quer oferecer cursos gamificados?
              </p>
              <p className="mt-1 text-xs text-gray-500">
                <a href="mailto:contato@educagames.com" className="text-secondary hover:underline">
                  Fale conosco
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
