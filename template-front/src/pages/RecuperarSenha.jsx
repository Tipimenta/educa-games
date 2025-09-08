import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import Input from '../components/Input';

const RecuperarSenhaPage = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    
    setSent(true);
  };

  return (
    <AuthLayout>
      <h2 className="mb-8 text-center text-2xl font-bold text-gray-800">Recuperar senha</h2>
      <form onSubmit={handleSubmit}>
        <Input type="email" placeholder="Informe seu email cadastrado" required />
        <Button type="submit">Enviar</Button>
      </form>
      {sent && (
        <p className="mt-4 text-center text-sm text-green-600">
          O link de recuperação de senha foi enviado com sucesso!
        </p>
      )}
      <p className="mt-8 text-center text-sm text-gray-600">
        Lembrou a senha?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:underline">
          Faça login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RecuperarSenhaPage;
