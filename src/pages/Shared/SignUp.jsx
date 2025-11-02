import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { AuthLayout, Button, ErrorMessage, Input, PasswordInput } from '../../components';
import { ROLES } from '../../constants';
import { ClassesContext } from '../../context';
import { useToast } from '../../hooks';
import { NetworkError, UnauthorizedError, ValidationError } from '../../lib/errors';
import { createCadastroSchema, isValid, validateAll, validateSingleField } from '../../schemas';
import { api, isCorsError, presentError } from '../../services';

const SignUpPage = ({ userRole = ROLES.STUDENT }) => {
  const { classes } = useContext(ClassesContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [inviteToken, setInviteToken] = useState(null);
  const [inviteData, setInviteData] = useState(null);
  const [isLoadingInvite, setIsLoadingInvite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    class: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateInvite = useCallback(
    async (token) => {
      setIsLoadingInvite(true);
      try {
        const response_data = await api.auth.validateInvite(token);

        const inviteInfo = response_data?.data;
        const backendMessage = response_data?.message;

        if (!inviteInfo || !inviteInfo.email) {
          setInviteData(null);
          setErrors({ invite: backendMessage || 'Convite inválido ou expirado.' });
          return null;
        }

        setInviteData(inviteInfo);
        setFormData((prev) => ({
          ...prev,
          email: inviteInfo.email,
        }));
        setErrors((prev) => ({ ...prev, invite: '' }));
        return inviteInfo;
      } catch (error) {
        if (error instanceof NetworkError) {
          showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
          setErrors({ invite: '' });
        } else if (error instanceof UnauthorizedError) {
          setErrors({ invite: 'Sessão expirada. Faça login novamente.' });
        } else if (error instanceof ValidationError || error?.status) {
          presentError({
            status: error.status || 400,
            errData: error.data || { message: error.message },
            setInline: (msg) => setErrors({ invite: msg }),
            showToast,
          });
        } else {
          showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
          setErrors({ invite: '' });
        }
        return null;
      } finally {
        setIsLoadingInvite(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    const token = searchParams.get('token') || searchParams.get('invite');

    if (!window.__lastInviteTokenRef) {
      window.__lastInviteTokenRef = { value: null };
    }
    const last = window.__lastInviteTokenRef;

    if (token && token !== last.value) {
      last.value = token;
      setInviteToken(token);
      validateInvite(token);
    } else if (!token) {
      setErrors({
        invite: 'Acesso negado. Esta página só pode ser acessada através de um convite válido.',
      });
    }
  }, [searchParams, validateInvite]);

  const getSchema = () =>
    createCadastroSchema((inviteData ? inviteData.role : userRole) === ROLES.STUDENT);

  const validateForm = () => {
    const schemaErrors = validateAll(getSchema(), formData);

    setErrors(schemaErrors);
    return Object.keys(schemaErrors).length === 0;
  };

  // Handler para onBlur do nome
  const handleNameBlur = () => {
    setTouched((prev) => ({
      ...prev,
      name: true,
    }));
    const msg = validateSingleField(getSchema(), formData, 'name');
    setErrors((prev) => ({ ...prev, name: msg }));
  };

  // Handler para onBlur da senha
  const handlePasswordBlur = () => {
    setTouched((prev) => ({
      ...prev,
      password: true,
    }));
    const msg = validateSingleField(getSchema(), formData, 'password');
    setErrors((prev) => ({ ...prev, password: msg }));
  };

  // Handler para onBlur da confirmação de senha
  const handleConfirmPasswordBlur = () => {
    setTouched((prev) => ({
      ...prev,
      confirmPassword: true,
    }));
    const msg = validateSingleField(getSchema(), formData, 'confirmPassword');
    setErrors((prev) => ({ ...prev, confirmPassword: msg }));
  };

  // Handler para onBlur do e-mail
  const handleEmailBlur = () => {
    setTouched((prev) => ({
      ...prev,
      email: true,
    }));
    const msg = validateSingleField(getSchema(), formData, 'email');
    setErrors((prev) => ({ ...prev, email: msg }));
  };

  const isFormValid = () => {
    const baseValid = isValid(getSchema(), formData);
    return baseValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (name === 'password' && errors.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: '',
      }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        if (inviteToken) {
          const payload = {
            name: formData.name,
            password: formData.password,
            invite: inviteToken,
          };

          const successData = await api.auth.completeSignup(payload);
          setErrors({ submit: '' });
          showToast({
            message: successData.message || 'Cadastro realizado com sucesso! Redirecionando...',
            type: 'success',
            duration: 2000,
          });
          setTimeout(() => {
            navigate('/login?registered=true');
          }, 2000);
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        if (error instanceof NetworkError) {
          showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
          setErrors({ submit: '' });
        } else if (error instanceof ValidationError || error?.status) {
          const status = error?.status || 400;
          const errData = error?.data || { message: error?.message };
          if (status === 403 || isCorsError(status, errData)) {
            showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
            setErrors({ submit: '' });
          } else {
            presentError({
              status,
              errData,
              setInline: (msg) => setErrors({ submit: msg }),
              showToast,
            });
          }
        } else {
          showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
          setErrors({ submit: '' });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <AuthLayout>
      {isLoadingInvite ? (
        <div className="text-center">
          <p className="text-gray-600">Validando convite...</p>
        </div>
      ) : errors.invite ? (
        <div className="text-center">
          <h2 className="mb-4 text-xl font-bold text-red-600">
            {inviteToken ? 'Convite Inválido' : 'Acesso Restrito'}
          </h2>
          <p className="text-gray-600">{errors.invite}</p>
          {!inviteToken && (
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
      ) : (
        <>
          <h2 className="mb-8 text-center text-xl font-bold text-gray-800 md:text-2xl">
            {inviteToken ? 'Complete seu cadastro' : 'Crie a sua conta'}
          </h2>
          {inviteToken && (
            <p className="mb-6 text-center text-sm text-gray-600">
              Você foi convidado para se juntar ao EducaGames. Complete as informações abaixo para
              finalizar seu cadastro.
            </p>
          )}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleNameBlur}
                required
                error={Boolean(errors.name)}
              />
              <ErrorMessage message={touched.name ? errors.name : ''} />
            </div>

            <div>
              <Input
                type="email"
                name="email"
                placeholder="Digite seu e-mail"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleEmailBlur}
                readOnly={inviteData && inviteData.email}
                required
                error={Boolean(errors.email)}
              />
              <ErrorMessage message={touched.email ? errors.email : ''} />
            </div>

            <div>
              <PasswordInput
                name="password"
                placeholder="Digite sua senha (mínimo 8 caracteres)"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handlePasswordBlur}
                required
                error={Boolean(errors.password)}
              />
              <ErrorMessage message={touched.password ? errors.password : ''} />
            </div>

            <div>
              <PasswordInput
                name="confirmPassword"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleConfirmPasswordBlur}
                required
                error={Boolean(errors.confirmPassword)}
              />
              <ErrorMessage message={touched.confirmPassword ? errors.confirmPassword : ''} />
            </div>

            {(inviteData ? inviteData.role === ROLES.STUDENT : userRole === ROLES.STUDENT) && (
              <div>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  required
                  className={`w-full appearance-none rounded-lg border bg-white px-4 py-3 focus:ring-2 focus:outline-none ${
                    errors.class
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="" disabled>
                    Selecione sua turma
                  </option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.name}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
                {errors.class && (
                  <p className="mt-1 pl-1 text-left text-sm text-red-600">{errors.class}</p>
                )}
              </div>
            )}

            {errors.submit && (
              <div className="mb-4 text-center">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            <Button type="submit" disabled={!isFormValid() || isSubmitting}>
              {isSubmitting ? 'Processando...' : inviteToken ? 'Finalizar cadastro' : 'Confirmar'}
            </Button>
          </form>
          {!inviteToken && (
            <p className="mt-8 text-center text-sm text-gray-600">
              Já possui uma conta?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                Faça login
              </Link>
            </p>
          )}
        </>
      )}
    </AuthLayout>
  );
};

export default SignUpPage;
