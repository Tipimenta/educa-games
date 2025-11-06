import { createContext, useContext, useState } from 'react';

import ConfirmationDialog from '../components/ConfirmationDialog';

// Classe de erro específica para cancelamento pelo usuário
export class UserCancelledError extends Error {
  constructor() {
    super('Cancelado pelo usuário');
    this.name = 'UserCancelledError';
  }
}

export const ConfirmContext = createContext({
  confirm: () => Promise.reject(new Error('ConfirmContext não encontrado')),
});

export function ConfirmProvider({ children }) {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    variant: 'danger',
    actionType: 'delete',
  });

  const confirm = ({ title, message, variant = 'danger', actionType = 'delete' }) => {
    return new Promise((resolve, reject) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        variant,
        actionType,
        onConfirm: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          resolve();
        },
        onCancel: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          reject(new UserCancelledError());
        },
      });
    });
  };

  const handleCancel = () => {
    if (confirmState.onCancel) {
      confirmState.onCancel();
    }
  };

  const handleConfirm = () => {
    if (confirmState.onConfirm) {
      confirmState.onConfirm();
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {confirmState.isOpen && (
        <ConfirmationDialog
          isOpen={confirmState.isOpen}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          title={confirmState.title}
          message={confirmState.message}
          variant={confirmState.variant}
          actionType={confirmState.actionType}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm deve ser usado dentro de um ConfirmProvider');
  }
  return context;
};
