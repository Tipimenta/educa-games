import { useState } from 'react';

import { emailSchema } from '../schemas/emailSchema';
import { isValid, validateSingleField } from '../schemas/helpers';

export const useInviteModal = ({ onSendInvite, showToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const openModal = () => {
    setIsOpen(true);
    setEmail('');
    setEmailError('');
  };

  const closeModal = () => {
    setIsOpen(false);
    setEmail('');
    setEmailError('');
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    const error = validateSingleField(emailSchema, { email: value.trim() }, 'email');
    setEmailError(error || '');
  };

  const isEmailValid = () => {
    return isValid(emailSchema, { email: email.trim() });
  };

  const handleSendInvite = () => {
    const trimmedEmail = email.trim();
    const error = validateSingleField(emailSchema, { email: trimmedEmail }, 'email');

    if (error) {
      setEmailError(error);
      return;
    }

    if (onSendInvite) {
      onSendInvite(trimmedEmail);
    }

    showToast({ message: `Convite enviado para ${trimmedEmail}`, type: 'success' });
    closeModal();
  };

  return {
    isOpen,
    email,
    emailError,
    openModal,
    closeModal,
    handleEmailChange,
    isEmailValid,
    handleSendInvite,
  };
};

