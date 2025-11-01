import { Info, Send, Trash2 } from 'lucide-react';

import Button from './Button';
import Modal from './Modal';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger', // 'danger', 'warning', 'info'
  actionType = 'delete', // 'delete', 'resend', 'custom'
  isLoading = false,
}) => {
  // Configurações baseadas no tipo de ação
  const getActionConfig = () => {
    switch (actionType) {
      case 'delete':
        return {
          icon: Trash2,
          defaultTitle: 'Confirmar Exclusão',
          defaultMessage:
            'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
          defaultConfirmText: 'Excluir',
          variant: 'danger',
        };
      case 'resend':
        return {
          icon: Send,
          defaultTitle: 'Reenviar',
          defaultMessage: 'Deseja reenviar este item?',
          defaultConfirmText: 'Reenviar',
          variant: 'info',
        };
      default:
        return {
          icon: Info,
          defaultTitle: 'Confirmar Ação',
          defaultMessage: 'Deseja continuar com esta ação?',
          defaultConfirmText: 'Confirmar',
          variant: 'info',
        };
    }
  };

  const actionConfig = getActionConfig();
  const IconComponent = actionConfig.icon;

  // Configurações visuais baseadas na variante
  const getVariantStyles = () => {
    const finalVariant = variant || actionConfig.variant;

    switch (finalVariant) {
      case 'danger':
        return {
          iconColor: 'text-red-600',
          iconBg: 'bg-red-100',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-600',
          iconBg: 'bg-yellow-100',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        };
      case 'info':
        return {
          iconColor: 'text-blue-600',
          iconBg: 'bg-blue-100',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
        };
      default:
        return {
          iconColor: 'text-gray-600',
          iconBg: 'bg-gray-100',
          confirmButton: 'bg-gray-600 hover:bg-gray-700 text-white',
        };
    }
  };

  const styles = getVariantStyles();

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        {/* Ícone */}
        <div
          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBg} mb-4`}
        >
          <IconComponent className={`h-6 w-6 ${styles.iconColor}`} />
        </div>

        {/* Título */}
        <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
          {title || actionConfig.defaultTitle}
        </h3>

        {/* Mensagem */}
        <p className="mb-6 text-center text-sm text-gray-600">
          {message || actionConfig.defaultMessage}
        </p>

        {/* Botões */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="px-4 py-2">
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 ${styles.confirmButton}`}
          >
            {isLoading ? 'Processando...' : confirmText || actionConfig.defaultConfirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
