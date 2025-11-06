import { useState } from 'react';

import { emailSchema } from '../schemas/emailSchema';
import { isValid, validateSingleField } from '../schemas/helpers';
import { presentError } from '../services';

export const useInviteModal = ({ onSendInvite, showToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    setEmail('');
    setEmailError('');
    setIsLoading(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEmail('');
    setEmailError('');
    setIsLoading(false);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    const error = validateSingleField(emailSchema, { email: value.trim() }, 'email');
    setEmailError(error || '');
  };

  const isEmailValid = () => {
    return isValid(emailSchema, { email: email.trim() });
  };

  const handleSendInvite = async () => {
    const trimmedEmail = email.trim();
    const error = validateSingleField(emailSchema, { email: trimmedEmail }, 'email');

    if (error) {
      setEmailError(error);
      return;
    }

    if (!onSendInvite) {
      return;
    }

    setIsLoading(true);
    setEmailError('');

    try {
      await onSendInvite(trimmedEmail);
      showToast({ message: `Convite enviado para ${trimmedEmail}`, type: 'success' });
      closeModal();
    } catch (err) {
      setIsLoading(false);

      if (err?.status) {
        presentError({
          status: err.status,
          errData: err.data || err,
          setInline: (msg) => setEmailError(msg),
          showToast,
        });
      } else {
        setEmailError('Erro ao enviar convite. Tente novamente.');
      }
    }
  };

  return {
    isOpen,
    email,
    emailError,
    isLoading,
    openModal,
    closeModal,
    handleEmailChange,
    isEmailValid,
    handleSendInvite,
  };
};
