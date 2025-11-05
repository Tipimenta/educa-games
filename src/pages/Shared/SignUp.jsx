import { Link } from 'react-router-dom';

import { AuthLayout, Button, ErrorMessage, Input, PasswordInput } from '../../components';
import { ROLES } from '../../constants';
import { useInviteValidation, useSignUpForm } from './hooks';

const SignUpPage = ({ userRole = ROLES.STUDENT }) => {
  const invite = useInviteValidation();
  const form = useSignUpForm({
    userRole,
    inviteData: invite.inviteData,
    inviteToken: invite.inviteToken,
  });

  if (invite.isLoadingInvite) {
    return (
      <AuthLayout>
        <div className="text-center">
          <p className="text-gray-600">Validando convite...</p>
        </div>
      </AuthLayout>
    );
  }

  if (invite.inviteError) {
    return (
      <AuthLayout>
        <div className="text-center">
          <h2 className="mb-4 text-xl font-bold text-red-600">
            {invite.inviteToken ? 'Convite Inválido' : 'Acesso Restrito'}
          </h2>
          <p className="text-gray-600">{invite.inviteError}</p>
          {!invite.inviteToken && (
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Ir para Login
              </Link>
            </div>
          )}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="mb-8 text-center text-xl font-bold text-gray-800 md:text-2xl">
        {invite.inviteToken ? 'Complete seu cadastro' : 'Crie a sua conta'}
      </h2>
      {invite.inviteToken && (
        <p className="mb-6 text-center text-sm text-gray-600">
          Você foi convidado para se juntar ao EducaGames. Complete as informações abaixo para
          finalizar seu cadastro.
        </p>
      )}
      <form onSubmit={(e) => form.handleSignup(e)} className="space-y-4">
        <div>
          <Input
            type="text"
            name="name"
            placeholder="Digite seu nome completo"
            value={form.values.name}
            onChange={(e) => form.handleChange('name', e.target.value)}
            onBlur={() => form.handleBlur('name')}
            required
            error={Boolean(form.errors.name)}
          />
          <ErrorMessage message={form.touched.name ? form.errors.name : ''} />
        </div>

        <div>
          <Input
            type="email"
            name="email"
            placeholder="Digite seu e-mail"
            value={form.values.email}
            onChange={(e) => form.handleChange('email', e.target.value)}
            onBlur={() => {
              if (!invite.inviteData?.email) {
                form.handleBlur('email');
              }
            }}
            readOnly={!!invite.inviteData?.email}
            autoComplete="email"
            required
            error={Boolean(form.errors.email)}
          />
          <ErrorMessage message={form.touched.email ? form.errors.email : ''} />
        </div>

        <div>
          <PasswordInput
            name="password"
            placeholder="Digite sua senha (mínimo 8 caracteres)"
            value={form.values.password}
            onChange={(e) => form.handleChange('password', e.target.value)}
            onBlur={() => form.handleBlur('password')}
            autoComplete="new-password"
            required
            error={Boolean(form.errors.password)}
          />
          <ErrorMessage message={form.touched.password ? form.errors.password : ''} />
        </div>

        <div>
          <PasswordInput
            name="confirmPassword"
            placeholder="Confirme sua senha"
            value={form.values.confirmPassword}
            onChange={(e) => form.handleChange('confirmPassword', e.target.value)}
            onBlur={() => form.handleBlur('confirmPassword')}
            autoComplete="new-password"
            required
            error={Boolean(form.errors.confirmPassword)}
          />
          <ErrorMessage message={form.touched.confirmPassword ? form.errors.confirmPassword : ''} />
        </div>

        {(() => {
          if (!invite.inviteData) return userRole === ROLES.STUDENT;
          return invite.inviteData.role === ROLES.STUDENT;
        })() && (
          <div>
            <select
              name="class"
              value={form.values.class}
              onChange={(e) => form.handleChange('class', e.target.value)}
              required
              className={`w-full appearance-none rounded-lg border bg-white px-4 py-3 focus:ring-2 focus:outline-none ${
                form.errors.class
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="" disabled>
                Selecione sua turma
              </option>
              {form.classes.map((classItem) => (
                <option key={classItem.id} value={classItem.name}>
                  {classItem.name}
                </option>
              ))}
            </select>
            {form.errors.class && (
              <p className="mt-1 pl-1 text-left text-sm text-red-600">{form.errors.class}</p>
            )}
          </div>
        )}

        {form.submitError && (
          <div className="mb-4 text-center">
            <p className="text-sm text-red-600">{form.submitError}</p>
          </div>
        )}

        <Button type="submit" disabled={!form.isFormValid || form.isSubmitting}>
          {form.isSubmitting
            ? 'Processando...'
            : invite.inviteToken
              ? 'Finalizar cadastro'
              : 'Confirmar'}
        </Button>
      </form>
      {!invite.inviteToken && (
        <p className="mt-8 text-center text-sm text-gray-600">
          Já possui uma conta?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Faça login
          </Link>
        </p>
      )}
    </AuthLayout>
  );
};

export default SignUpPage;
