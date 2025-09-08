import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import { GoogleIcon } from '../components/Icons';
import Input from '../components/Input';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Lógica de login com e-mail/senha aqui
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    // Lógica de login com Google aqui
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">Bem-vindo!</h2>
      <form onSubmit={handleLogin}>
        <Input type="email" placeholder="Seu e-mail" required />
        <Input type="password" placeholder="Sua Senha" required />
        <Button type="submit">Entrar</Button>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500">OU</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none"
      >
        <GoogleIcon className="mr-3" />
        <span>Entrar com Google</span>
      </button>

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
