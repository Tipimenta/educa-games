import { useState } from 'react';
import { Link } from 'react-router-dom';

import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, errorMessage } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  const errorMessages = errorMessage ? errorMessage.split('\n') : [];

  return (
    <AuthLayout>
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">Bem-vindo!</h2>

      {errorMessages.length > 0 && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
          {errorMessages.length === 1 ? (
            // Erro único
            <p className="text-center text-sm text-red-600">{errorMessages[0]}</p>
          ) : (
            // Múltiplos erros de validação
            <div className="text-sm text-red-600">
              <p className="mb-2 text-center font-semibold">Erros de validação:</p>
              <ul className="list-inside list-disc space-y-1">
                {errorMessages.map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <Input
          type="password"
          placeholder="Sua Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/recuperar-senha" className="text-secondary text-sm hover:underline">
          Esqueceu a senha?
        </Link>
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Não tem uma conta?{' '}
        <Link to="/cadastro" className="text-primary font-semibold hover:underline">
          Cadastre-se
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
