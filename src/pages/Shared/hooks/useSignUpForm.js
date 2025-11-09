import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROLES } from '../../../constants';
import { ClassesContext } from '../../../context';
import { useToast } from '../../../hooks';
import { useCompleteSignup } from '../../../hooks/useAuthQuery';
import { useForm } from '../../../hooks/useForm';
import { NetworkError, ValidationError } from '../../../lib/errors';
import { createSignUpSchema, validateAll } from '../../../schemas';
import { isCorsError, presentError } from '../../../services';

export const useSignUpForm = ({ userRole = ROLES.STUDENT, inviteData, inviteToken }) => {
  const { classes } = useContext(ClassesContext);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const completeSignupMutation = useCompleteSignup();

  const schema = useMemo(() => {
    return createSignUpSchema((inviteData ? inviteData.role : userRole) === ROLES.STUDENT);
  }, [inviteData, userRole]);

  const [submitError, setSubmitError] = useState('');
  const [isSubmittingDirect, setIsSubmittingDirect] = useState(false);
  const lastInviteEmailRef = useRef(null);
  const lastInviteClassNameRef = useRef(null);

  const initialValues = useMemo(
    () => ({
      name: '',
      email: inviteData?.email || '',
      password: '',
      confirmPassword: '',
      class: inviteData?.className || '',
    }),
    [inviteData?.email, inviteData?.className]
  );

  const form = useForm({
    initialValues,
    schema,
    onSubmit: async (values) => {
      if (inviteToken) {
        // requiresSignup sempre é enviado pelo backend
        const requiresSignup = inviteData?.requiresSignup === true;
        const payload = {
          invite: inviteToken,
        };

        // Só inclui name e password se requiresSignup for true
        if (requiresSignup) {
          payload.name = values.name;
          payload.password = values.password;
        }

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

  const { setTouched, setFieldError, setFieldValue } = form;
  useEffect(() => {
    const inviteEmail = inviteData?.email;
    if (inviteEmail && inviteEmail !== lastInviteEmailRef.current) {
      lastInviteEmailRef.current = inviteEmail;
      setTouched('email', true);
      setFieldError('email', '');
    }
  }, [inviteData?.email, setTouched, setFieldError]);

  useEffect(() => {
    const inviteClassName = inviteData?.className;
    if (inviteClassName && inviteClassName !== lastInviteClassNameRef.current) {
      lastInviteClassNameRef.current = inviteClassName;
      setTouched('class', true);
      setFieldError('class', '');
      // Garante que o valor do campo seja atualizado
      setFieldValue('class', inviteClassName);
    }
  }, [inviteData?.className, setTouched, setFieldError, setFieldValue]);

  const handleSignup = async (e) => {
    e.preventDefault();

    // requiresSignup sempre é enviado pelo backend
    const requiresSignup = inviteData?.requiresSignup === true;

    // Se requiresSignup é false, só valida o campo de turma (se for estudante)
    if (!requiresSignup && inviteToken) {
      const isStudent = (inviteData ? inviteData.role : userRole) === ROLES.STUDENT;
      // Garante que o valor da turma esteja no form se vier do inviteData
      if (isStudent && inviteData?.className && !form.values.class) {
        setFieldValue('class', inviteData.className);
      }
      if (isStudent && !form.values.class) {
        form.handleBlur('class');
        return;
      }
      // Quando requiresSignup é false, chama a lógica de submit diretamente
      try {
        setSubmitError('');
        setIsSubmittingDirect(true);
        const payload = {
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
      } catch (error) {
        setIsSubmittingDirect(false);
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
      return;
    }

    // Validação normal quando requiresSignup é true
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
    isSubmitting: form.isSubmitting || isSubmittingDirect,
    submitError,
    handleSignup,
    classes,
  };
};
