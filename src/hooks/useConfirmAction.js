import { useConfirm } from '../context';
import { useToast } from './useToast';

/**
 * Hook para padronizar confirmação + ação + toast
 * Mais genérico que useConfirmDelete, permite diferentes variantes
 */
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
    } catch {
      // Usuário cancelou - não fazer nada
    }
  };

  return { executeWithConfirmation };
};
