import { useMemo, useState } from 'react';

import { useAuth } from '../../../hooks';
import { useForm } from '../../../hooks/useForm';
import { loginSchema } from '../../../schemas';

export const useLoginForm = () => {
  const { login, errorMessage } = useAuth();
  const [loading, setLoading] = useState(false);

  const initialValues = useMemo(() => ({ email: '', password: '' }), []);

  const form = useForm({
    initialValues,
    schema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await login(values.email, values.password);
      } finally {
        setLoading(false);
      }
    },
  });

  return {
    ...form,
    loading,
    errorMessage,
  };
};
