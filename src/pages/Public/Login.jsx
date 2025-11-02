import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import { AuthLayout, Button, ErrorMessage, Input, PasswordInput } from '../../components';
import { useAuth } from '../../hooks';
import { isValid, loginSchema, validateAll, validateSingleField } from '../../schemas';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, errorMessage } = useAuth();
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateAll(loginSchema, { email, password });
    setFormErrors(errors);
    setTouched({ email: true, password: true });
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  const errorMessages = errorMessage ? errorMessage.split('\n') : [];

  const isFormValid = isValid(loginSchema, { email, password });

  return (
    <AuthLayout>
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">Bem-vindo!</h2>

      {errorMessages.length > 0 && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
          {errorMessages.length === 1 ? (
            <p className="text-center text-sm text-red-600">{errorMessages[0]}</p>
          ) : (
            <div className="text-sm text-red-600">
              <p className="mb-2 text-center font-medium">Por favor, corrija os seguintes erros:</p>
              <ul className="space-y-1">
                {errorMessages.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-red-500">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <Input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => {
              const val = e.target.value;
              setEmail(val);
              if (touched.email) {
                setFormErrors((prev) => ({
                  ...prev,
                  email: validateSingleField(loginSchema, { email: val, password }, 'email'),
                }));
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, email: true }));
              setFormErrors((prev) => ({
                ...prev,
                email: validateSingleField(loginSchema, { email, password }, 'email'),
              }));
            }}
            error={Boolean(formErrors.email)}
          />
          <ErrorMessage message={formErrors.email} />
        </div>

        <div>
          <PasswordInput
            name="password"
            placeholder="Sua Senha"
            value={password}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              if (touched.password) {
                setFormErrors((prev) => ({
                  ...prev,
                  password: validateSingleField(loginSchema, { email, password: val }, 'password'),
                }));
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, password: true }));
              setFormErrors((prev) => ({
                ...prev,
                password: validateSingleField(loginSchema, { email, password }, 'password'),
              }));
            }}
            error={Boolean(formErrors.password)}
          />
          <ErrorMessage message={formErrors.password} />
        </div>

        <Button type="submit" disabled={loading || !isFormValid} className="w-full">
          {loading ? 'Entrando...' : 'Entrar'}
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

      <div className="space-y-4">
        <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-5">
          <div className="flex items-start space-x-3">
            <span className="text-lg">📧</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">Primeiro acesso?</p>
              <p className="mt-1 text-xs text-gray-500">
                Verifique seu email e clique no link de convite
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50/30 p-5">
          <div className="flex items-start space-x-3">
            <span className="text-lg">🎓</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Quer oferecer cursos gamificados?
              </p>
              <p className="mt-1 text-xs text-gray-500">
                <HashLink
                  to="/#pricing"
                  scroll={(el) => {
                    setTimeout(() => {
                      if (el) {
                        const headerOffset = 80;
                        const elementPosition = el.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth',
                        });
                      }
                    }, 100);
                  }}
                  className="text-secondary hover:underline"
                >
                  Fale conosco
                </HashLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
