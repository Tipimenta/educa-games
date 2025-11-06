import { Link } from 'react-router-dom';

import { AuthLayout, Button, ErrorMessage, Input, PasswordInput } from '../../components';
import AuthErrorDisplay from './components/AuthErrorDisplay';
import LoginInfoCards from './components/LoginInfoCards';
import { useLoginForm } from './hooks/useLoginForm';

const LoginPage = () => {
  const form = useLoginForm();

  return (
    <AuthLayout>
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">Bem-vindo!</h2>

      <AuthErrorDisplay errorMessage={form.errorMessage} />

      <form onSubmit={form.handleSubmit} noValidate className="space-y-5">
        <div>
          <Input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={form.values.email}
            onChange={(e) => form.handleChange('email', e.target.value)}
            onBlur={() => form.handleBlur('email')}
            error={Boolean(form.errors.email)}
          />
          <ErrorMessage message={form.errors.email} />
        </div>

        <div>
          <PasswordInput
            name="password"
            placeholder="Sua Senha"
            value={form.values.password}
            onChange={(e) => form.handleChange('password', e.target.value)}
            onBlur={() => form.handleBlur('password')}
            error={Boolean(form.errors.password)}
          />
          <ErrorMessage message={form.errors.password} />
        </div>

        <Button type="submit" disabled={form.loading || !form.isFormValid} className="w-full">
          {form.loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/forgot-password" className="text-secondary text-sm hover:underline">
          Esqueceu a senha?
        </Link>
      </div>

      <div className="mt-10 mb-6">
        <hr className="border-gray-200" />
      </div>

      <LoginInfoCards />
    </AuthLayout>
  );
};

export default LoginPage;
