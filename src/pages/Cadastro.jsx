import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import { ROLES } from '../constants/roles';

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

  // Função para validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para validar todos os campos
  const validateForm = () => {
    const newErrors = {};

    // Validação do nome
    const trimmedName = formData.name.trim();
    if (trimmedName.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    } else if (trimmedName.length > 120) {
      newErrors.name = 'O nome deve ter no máximo 120 caracteres';
    } else if (!validateName(trimmedName)) {
      newErrors.name = 'O nome deve conter apenas letras, espaços e hífens';
    }

    // Validação do email (apenas se não for convite)
    if (!inviteToken && !validateEmail(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    // Validação da senha
    if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    } else if (formData.password.length > 120) {
      newErrors.password = 'A senha excede o limite de caracteres';
    }

    // Validação da confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    // Validação da turma (apenas para estudantes)
    const currentRole = inviteData ? inviteData.role : userRole;
    if (currentRole === ROLES.STUDENT && !formData.turma) {
      newErrors.turma = 'Selecione uma turma';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função para validar se o nome contém apenas letras e espaços
  const validateName = (name) => {
    // Regex para permitir apenas letras (incluindo acentos), espaços e hífens
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
    return nameRegex.test(name);
  };

  // Função para verificar se o formulário está válido
  const isFormValid = () => {
    // Quando há inviteToken, o email já vem preenchido e é readonly
    const emailValidation = inviteToken ? true : validateEmail(formData.email);

    const baseValidation =
      formData.name.trim().length >= 3 &&
      formData.name.trim().length <= 120 &&
      validateName(formData.name.trim()) &&
      emailValidation &&
      formData.password.length >= 8 &&
      formData.password.length <= 120 &&
      formData.password === formData.confirmPassword;

    // Para usuários com convite (inviteData), usar o role do convite
    // Para usuários sem convite, usar o userRole padrão
    const currentRole = inviteData ? inviteData.role : userRole;

    if (currentRole === ROLES.STUDENT) {
      return baseValidation && formData.turma;
    }

    return baseValidation;
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

    // Validação dinâmica para o campo nome
    if (name === 'name') {
      const trimmedValue = value.trim();

      if (value.length > 120) {
        setErrors((prev) => ({
          ...prev,
          name: 'O nome deve ter no máximo 120 caracteres',
        }));
      } else if (trimmedValue.length > 0 && trimmedValue.length < 3) {
        setErrors((prev) => ({
          ...prev,
          name: 'O nome deve ter pelo menos 3 caracteres',
        }));
      } else if (trimmedValue.length > 0 && !validateName(trimmedValue)) {
        setErrors((prev) => ({
          ...prev,
          name: 'O nome não deve conter números ou caracteres especiais',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          name: '',
        }));
      }
    }

    // Validação dinâmica para o campo senha
    if (name === 'password') {
      if (value.length > 120) {
        setErrors((prev) => ({
          ...prev,
          password: 'A senha excede o limite de caracteres',
        }));
      } else if (value.length > 0 && value.length < 8) {
        setErrors((prev) => ({
          ...prev,
          password: 'Senha deve ter pelo menos 8 caracteres',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          password: '',
        }));
      }
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
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <ErrorMessage message={errors.name} />
            </div>

            <div>
              <Input
                type="email"
                name="email"
                placeholder="Digite seu e-mail"
                value={formData.email}
                onChange={handleInputChange}
                readOnly={inviteData && inviteData.email}
                required
              />
              <ErrorMessage message={errors.email} />
            </div>

            <div>
              <PasswordInput
                name="password"
                placeholder="Digite sua senha (mínimo 8 caracteres)"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <ErrorMessage message={errors.password} />
            </div>

            <div>
              <PasswordInput
                name="confirmPassword"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <ErrorMessage
                message={
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'As senhas não coincidem'
                    : errors.confirmPassword
                }
              />
            </div>

            {(inviteData ? inviteData.role === ROLES.STUDENT : userRole === ROLES.STUDENT) && (
              <div>
                <select
                  name="turma"
                  value={formData.turma}
                  onChange={handleInputChange}
                  required
                  className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                {errors.turma && <p className="mt-1 text-sm text-red-600">{errors.turma}</p>}
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
