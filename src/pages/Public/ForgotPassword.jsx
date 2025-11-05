import { useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthLayout, Button, ErrorMessage, Input } from '../../components';
import { useToast } from '../../hooks';
import { emailSchema, isValid, validateAll, validateSingleField } from '../../schemas';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false });
  const [formErrors, setFormErrors] = useState({ email: '' });
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const errors = validateAll(emailSchema, { email: trimmedEmail });
    setFormErrors(errors);
    setTouched({ email: true });
    if (Object.keys(errors).length) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast({
        message: 'O link de recuperação de senha foi enviado com sucesso!',
        type: 'success',
      });
      setEmail('');
      setTouched({ email: false });
      setFormErrors({ email: '' });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = isValid(emailSchema, { email: email.trim() });

  return (
    <AuthLayout>
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">Recuperar senha</h2>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <Input
            type="email"
            name="email"
            placeholder="Informe seu email cadastrado"
            value={email}
            onChange={(e) => {
              const val = e.target.value;
              setEmail(val);
              if (touched.email) {
                setFormErrors((prev) => ({
                  ...prev,
                  email: validateSingleField(emailSchema, { email: val.trim() }, 'email'),
                }));
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, email: true }));
              setFormErrors((prev) => ({
                ...prev,
                email: validateSingleField(emailSchema, { email: email.trim() }, 'email'),
              }));
            }}
            error={Boolean(formErrors.email)}
          />
          <ErrorMessage message={formErrors.email} />
        </div>

        <Button type="submit" disabled={loading || !isFormValid} className="w-full">
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Lembrou sua senha?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:underline">
          Faça login
        </Link>
      </p>
    </AuthLayout>
  );
}
