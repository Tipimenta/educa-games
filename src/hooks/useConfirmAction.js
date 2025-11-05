import { useConfirm } from '../context';
import { presentError } from '../services';
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
      const status = err?.status || 500;
      const errData = err?.data || err;
      presentError({
        status,
        errData,
        setInline: () => {},
        showToast,
      });
      throw err;
    }
  };

  return { executeWithConfirmation };
};
