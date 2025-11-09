import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthLayout, Button, ErrorMessage, Input, PasswordInput } from '../../components';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { ROLES } from '../../constants';
import { useInviteValidation, useSignUpForm } from './hooks';

const SignUpPage = ({ userRole = ROLES.STUDENT }) => {
  const invite = useInviteValidation();
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [hasShownDialog, setHasShownDialog] = useState(false);

  const form = useSignUpForm({
    userRole,
    inviteData: invite.inviteData,
    inviteToken: invite.inviteToken,
  });

  // Mostra o dialog quando requiresSignup é false (sempre é enviado pelo backend)
  useEffect(() => {
    if (
      invite.inviteData &&
      invite.inviteData.requiresSignup === false &&
      !hasShownDialog &&
      !invite.isLoadingInvite
    ) {
      setShowInfoDialog(true);
      setHasShownDialog(true);
    }
  }, [invite.inviteData, hasShownDialog, invite.isLoadingInvite]);

  // requiresSignup sempre é enviado pelo backend
  // false: esconde campos, mostra apenas turma
  // true: mostra fluxo completo de cadastro
  const requiresSignup = invite.inviteData?.requiresSignup === true;
  const showFullForm = requiresSignup || !invite.inviteToken;

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
    // Para erro de convite inválido ou já utilizado (status 409), sempre mostra "Acesso Restrito" e botão de login
    const isInviteError = invite.inviteError.toLowerCase().includes('convite');
    const showRestrictedAccess = isInviteError || !invite.inviteToken;

    return (
      <AuthLayout>
        <div className="text-center">
          <h2 className="mb-4 text-xl font-bold text-red-600">
            {showRestrictedAccess ? 'Acesso Restrito' : 'Convite Inválido'}
          </h2>
          <p className="text-gray-600">
            {isInviteError
              ? 'Acesso negado. Esta página só pode ser acessada através de um convite válido.'
              : invite.inviteError}
          </p>
          {showRestrictedAccess && (
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
    <>
      <ConfirmationDialog
        isOpen={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
        onConfirm={() => setShowInfoDialog(false)}
        title="Perfil existente"
        message="Já existe um perfil de estudante associado a este email. Você pode prosseguir com o aceite do convite para a turma."
        variant="info"
        confirmText="OK"
        showCancel={false}
      />
      <AuthLayout>
        <h2 className={`${invite.inviteToken && !requiresSignup ? 'mb-2' : 'mb-8'} text-center text-xl font-bold text-gray-800 md:text-2xl`}>
          {invite.inviteToken ? 'Complete seu cadastro' : 'Crie a sua conta'}
        </h2>
        {invite.inviteToken && requiresSignup && (
          <p className="mb-6 text-center text-sm text-gray-600">
            Você foi convidado para se juntar ao EducaGames. Complete as informações abaixo para
            finalizar seu cadastro.
          </p>
        )}
        {invite.inviteToken && !requiresSignup && (
          <p className="mb-6 text-center text-sm text-gray-600">
            Aceite o convite para se juntar à turma.
          </p>
        )}
        <form onSubmit={(e) => form.handleSignup(e)} className="space-y-4">
          {showFullForm && (
            <>
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
                <ErrorMessage
                  message={form.touched.confirmPassword ? form.errors.confirmPassword : ''}
                />
              </div>
            </>
          )}

          {(() => {
            if (!invite.inviteData) return userRole === ROLES.STUDENT;
            return invite.inviteData.role === ROLES.STUDENT;
          })() && (
            <div>
              {invite.inviteData?.className ? (
                <Input
                  type="text"
                  name="class"
                  placeholder="Turma"
                  value={form.values.class}
                  readOnly={true}
                  required
                  error={Boolean(form.errors.class)}
                />
              ) : (
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
              )}
              <ErrorMessage message={form.touched.class ? form.errors.class : ''} />
            </div>
          )}

          {form.submitError && (
            <div className="mb-4 text-center">
              <p className="text-sm text-red-600">{form.submitError}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={
              form.isSubmitting ||
              (requiresSignup
                ? !form.isFormValid
                : !invite.inviteData?.className)
            }
          >
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
    </>
  );
};

export default SignUpPage;
