import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { AuthLayout, Button, ErrorMessage, Input, PasswordInput } from '../components';
import { ROLES } from '../constants';
import { createCadastroSchema, isValid, validateAll, validateSingleField } from '../schemas';

const CadastroPage = ({ turmas, userRole = ROLES.STUDENT }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [inviteToken, setInviteToken] = useState(null);
  const [inviteData, setInviteData] = useState(null);
  const [isLoadingInvite, setIsLoadingInvite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    turma: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Função para validar convite
  const validateInvite = async (token) => {
    setIsLoadingInvite(true);
    try {
      const response = await fetch(`/api/auth/validate-invite?token=${token}`);
      if (response.ok) {
        const response_data = await response.json();

        // A API retorna { message: "...", data: { email: "...", role: "..." } }
        const inviteInfo = response_data.data;
        setInviteData(inviteInfo);
        setFormData((prev) => ({
          ...prev,
          email: inviteInfo.email,
        }));
        return inviteInfo;
      } else {
        const errorData = await response.json();
        let errorMessage = 'Convite inválido ou expirado';

        switch (response.status) {
          case 404:
            errorMessage = 'Convite inválido.';
            break;
          case 409:
            errorMessage = 'Este convite já foi utilizado.';
            break;
          case 410:
            errorMessage = 'Link expirado. Solicite um novo.';
            break;
          default:
            errorMessage = errorData.message || 'Convite inválido ou expirado';
        }

        setErrors({ invite: errorMessage });
        return null;
      }
    } catch (error) {
      console.error('Erro ao validar convite:', error);
      setErrors({ invite: 'Erro de rede ou na API' });
      return null;
    } finally {
      setIsLoadingInvite(false);
    }
  };

  // useEffect para capturar token da URL e validar convite
  useEffect(() => {
    const token = searchParams.get('token') || searchParams.get('invite');
    if (token) {
      setInviteToken(token);
      validateInvite(token);
    } else {
      // Se não há token, definir erro para bloquear acesso
      setErrors({
        invite: 'Acesso negado. Esta página só pode ser acessada através de um convite válido.',
      });
    }
  }, [searchParams]);

  // Função utilitária para obter o schema condicional de acordo com o papel
  const getSchema = () =>
    createCadastroSchema((inviteData ? inviteData.role : userRole) === ROLES.STUDENT);

  // Função para validar todos os campos
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

  // Função para verificar se o formulário está válido
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

    // Limpar erros quando o usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        if (inviteToken) {
          // Fluxo de convite - chamar /complete-signup
          const payload = {
            name: formData.name,
            password: formData.password,
            invite: inviteToken,
          };

          const response = await fetch('/api/auth/complete-signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            const successData = await response.json();
            // Exibir mensagem de sucesso e redirecionar para login
            setErrors({ submit: '' }); // Limpar erros anteriores

            // Mostrar feedback de sucesso usando a mensagem do backend
            const successMessage = document.createElement('div');
            successMessage.className =
              'fixed bottom-4 right-4 bg-white text-gray-800 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 border-l-4 border-green-500';
            successMessage.style.borderLeftColor = '#10b981';
            successMessage.textContent =
              successData.message || 'Cadastro realizado com sucesso! Redirecionando...';
            document.body.appendChild(successMessage);

            // Remover toast após 2 segundos
            setTimeout(() => {
              if (successMessage.parentNode) {
                successMessage.remove();
              }
            }, 2000);

            // Redirecionar após 2 segundos
            setTimeout(() => {
              navigate('/login?registered=true');
            }, 2000);
          } else {
            const errorData = await response.json();
            let errorMessage = 'Erro ao finalizar cadastro';

            switch (response.status) {
              case 400:
                errorMessage = errorData.message || 'Dados inválidos. Verifique os campos.';
                break;
              case 409:
                errorMessage = 'Já existe um usuário cadastrado com este email.';
                break;
              default:
                errorMessage = errorData.message || 'Erro ao finalizar cadastro';
            }

            setErrors({ submit: errorMessage });
          }
        } else {
          // Fluxo normal de cadastro
          console.log('Dados do formulário:', formData);
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Erro ao processar cadastro:', error);
        setErrors({ submit: 'Erro interno. Tente novamente.' });
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
                  name="turma"
                  value={formData.turma}
                  onChange={handleInputChange}
                  required
                  className={`w-full appearance-none rounded-lg border bg-white px-4 py-3 focus:ring-2 focus:outline-none ${
                    errors.turma
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="" disabled>
                    Selecione sua turma
                  </option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.name}>
                      {turma.name}
                    </option>
                  ))}
                </select>
                {errors.turma && (
                  <p className="mt-1 pl-1 text-left text-sm text-red-600">{errors.turma}</p>
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

export default CadastroPage;
