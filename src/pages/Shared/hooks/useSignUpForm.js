import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROLES } from '../../../constants';
import { ClassesContext } from '../../../context';
import { useToast } from '../../../hooks';
import { useForm } from '../../../hooks/useForm';
import { NetworkError, ValidationError } from '../../../lib/errors';
import { createCadastroSchema, validateAll } from '../../../schemas';
import { api, isCorsError, presentError } from '../../../services';

export const useSignUpForm = ({ userRole = ROLES.STUDENT, inviteData, inviteToken }) => {
  const { classes } = useContext(ClassesContext);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const schema = useMemo(() => {
    return createCadastroSchema((inviteData ? inviteData.role : userRole) === ROLES.STUDENT);
  }, [inviteData, userRole]);

  const initialValues = useMemo(
    () => ({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      class: '',
    }),
    []
  );

  const [submitError, setSubmitError] = useState('');

  const form = useForm({
    initialValues,
    schema,
    onSubmit: async (values) => {
      if (inviteToken) {
        const payload = {
          name: values.name,
          password: values.password,
          invite: inviteToken,
        };

        const successData = await api.auth.completeSignup(payload);
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
    },
  });

  // Atualizar email quando inviteData mudar
  useEffect(() => {
    if (inviteData?.email && form.values.email !== inviteData.email) {
      form.setFieldValue('email', inviteData.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteData?.email]);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validar antes de chamar handleSubmit do form
    const errors = validateAll(schema, form.values);
    if (Object.keys(errors).length > 0) {
      // Marcar todos como touched
      Object.keys(form.values).forEach((key) => {
        form.handleBlur(key);
      });
      return;
    }

    try {
      setSubmitError('');
      await form.handleSubmit(e);
    } catch (error) {
      if (error instanceof NetworkError) {
        showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
        setSubmitError('');
      } else if (error instanceof ValidationError || error?.status) {
        const status = error?.status || 400;
        const errData = error?.data || { message: error?.message };
        if (status === 403 || isCorsError(status, errData)) {
          showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
          setSubmitError('');
        } else {
          presentError({
            status,
            errData,
            setInline: (msg) => setSubmitError(msg),
            showToast,
          });
        }
      } else {
        showToast({ message: 'Erro ao se comunicar com o servidor', type: 'error' });
        setSubmitError('');
      }
    }
  };

  return {
    ...form,
    submitError,
    handleSignup,
    classes,
  };
};
