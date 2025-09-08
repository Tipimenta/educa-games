import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';

const RedefinirSenhaPage = () => {
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    // Lógica para verificar os tokens da URL e redefinir a senha do usuário no backend
    console.log('Senha redefinida!');
    navigate('/login');
  };

  return (
    <AuthLayout>
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">Redefinir senha</h2>
      <form onSubmit={handleReset}>
        <Input type="password" placeholder="Digite sua nova senha" required />
        <Input type="password" placeholder="Digite novamente sua nova senha" required />
        <Button type="submit">Confirmar</Button>
      </form>
      <p className="mt-8 text-center text-sm text-gray-600">
        <Link to="/login" className="font-semibold text-blue-600 hover:underline">
          Voltar para o Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RedefinirSenhaPage;
