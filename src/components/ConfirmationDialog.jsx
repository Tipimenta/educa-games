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
  showCancel = true, // Se false, mostra apenas o botão de confirmar
}) => {
  const getActionConfig = () => {
    switch (actionType) {
      case 'delete':
        return {
          defaultTitle: 'Confirmar Exclusão',
          defaultMessage:
            'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
          defaultConfirmText: 'Excluir',
          variant: 'danger',
        };
      case 'resend':
        return {
          defaultTitle: 'Reenviar',
          defaultMessage: 'Deseja reenviar este item?',
          defaultConfirmText: 'Reenviar',
          variant: 'info',
        };
      default:
        return {
          defaultTitle: 'Confirmar Ação',
          defaultMessage: 'Deseja continuar com esta ação?',
          defaultConfirmText: 'Confirmar',
          variant: 'info',
        };
    }
  };

  const actionConfig = getActionConfig();

  const getVariantStyles = () => {
    const finalVariant = variant || actionConfig.variant;

    switch (finalVariant) {
      case 'danger':
        return {
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
        };
      case 'warning':
        return {
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        };
      case 'info':
        return {
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
        };
      default:
        return {
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
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="p-6">
        {/* Título */}
        <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
          {title || actionConfig.defaultTitle}
        </h3>

        {/* Mensagem */}
        <p className="mb-6 text-center text-sm text-gray-600">
          {message || actionConfig.defaultMessage}
        </p>

        {/* Botões */}
        <div className={`flex ${showCancel ? 'justify-end' : 'justify-center'} gap-3`}>
          {showCancel && (
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="px-4 py-2">
              {cancelText}
            </Button>
          )}
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
