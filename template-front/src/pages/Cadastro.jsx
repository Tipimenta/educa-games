import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';

const CadastroPage = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
 
    
    
    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">Cadastro</h2>
      <form onSubmit={handleSignup}>
        <Input type="email" placeholder="Digite seu e-mail" required />
        <Input type="password" placeholder="Digite sua senha" required />
        <Input type="password" placeholder="Digite novamente sua senha" required />
        <select
          required
          className="mb-4 w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="" disabled selected>
            Selecione sua turma
          </option>
          <option value="turma1">Turma 1</option>
          <option value="turma2">Turma 2</option>
          <option value="turma3">Turma 3</option>
        </select>
        <Button type="submit">Confirmar</Button>
      </form>
      <p className="mt-8 text-center text-sm text-gray-600">
        Já possui uma conta?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:underline">
          Faça login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default CadastroPage;
