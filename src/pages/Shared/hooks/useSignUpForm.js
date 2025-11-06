import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROLES } from '../../../constants';
import { ClassesContext } from '../../../context';
import { useToast } from '../../../hooks';
import { useCompleteSignup } from '../../../hooks/useAuthQuery';
import { useForm } from '../../../hooks/useForm';
import { NetworkError, ValidationError } from '../../../lib/errors';
import { createCadastroSchema, validateAll } from '../../../schemas';
import { isCorsError, presentError } from '../../../services';

export const useSignUpForm = ({ userRole = ROLES.STUDENT, inviteData, inviteToken }) => {
  const { classes } = useContext(ClassesContext);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const completeSignupMutation = useCompleteSignup();

  const schema = useMemo(() => {
    return createCadastroSchema((inviteData ? inviteData.role : userRole) === ROLES.STUDENT);
  }, [inviteData, userRole]);

  const [submitError, setSubmitError] = useState('');
  const lastInviteEmailRef = useRef(null);

  const initialValues = useMemo(
    () => ({
      name: '',
      email: inviteData?.email || '',
      password: '',
      confirmPassword: '',
      class: '',
    }),
    [inviteData?.email]
  );

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

        const message = await completeSignupMutation.mutateAsync(payload);
        showToast({
          message: message || 'Cadastro realizado com sucesso! Redirecionando...',
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

  const { setTouched, setFieldError } = form;
  useEffect(() => {
    const inviteEmail = inviteData?.email;
    if (inviteEmail && inviteEmail !== lastInviteEmailRef.current) {
      lastInviteEmailRef.current = inviteEmail;
      setTouched('email', true);
      setFieldError('email', '');
    }
  }, [inviteData?.email, setTouched, setFieldError]);

  const handleSignup = async (e) => {
    e.preventDefault();

    const errors = validateAll(schema, form.values);
    if (Object.keys(errors).length > 0) {
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
