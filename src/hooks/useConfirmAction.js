import { useConfirm, UserCancelledError } from '../context';
import { extractErrorMessage, presentError } from '../services';
import { useToast } from './useToast';

export const useConfirmAction = () => {
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  const executeWithConfirmation = async ({ confirmConfig, action, successMessage, itemName }) => {
    try {
      await confirm(confirmConfig);

      const result = await action();

      if (result?.success !== false && successMessage) {
        showToast({
          message: itemName ? `${itemName} ${successMessage}` : successMessage,
          type: 'success',
        });
      }

      return result;
    } catch (err) {
      if (err instanceof UserCancelledError) {
        return;
      }

      const status = err?.status || err?.response?.status || err?.error?.status || 500;
      const errData = err?.data || err?.response?.data || err?.error?.data || err || {};

      // Para erros 400-499, mostrar toast com a mensagem do erro
      if (status >= 400 && status < 500) {
        const msg = extractErrorMessage(errData);
        showToast({ message: msg || 'Erro ao processar a solicitação', type: 'error' });
      } else {
        // Para outros erros, usar presentError que já trata 500+ e outros casos
        presentError({
          status,
          errData,
          setInline: () => {},
          showToast,
        });
      }

      throw err;
    }
  };

  return { executeWithConfirmation };
};
