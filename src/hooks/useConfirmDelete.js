import { useConfirm } from '../context';
import { useToast } from './useToast';

/**
 * Hook para padronizar confirmação + delete com toast de sucesso
 * @param {Object} config - Configuração do hook
 * @param {Function} config.onDelete - Função que executa a exclusão
 * @param {string} config.title - Título da confirmação
 * @param {string} config.message - Mensagem da confirmação
 * @param {string} config.successMessage - Mensagem de sucesso (opcional)
 * @returns {Function} - Função para executar o delete com confirmação
 */
export const useConfirmDelete = ({ onDelete, title, message, successMessage }) => {
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  const handleDelete = async (...args) => {
    try {
      await confirm({
        title,
        message,
        variant: 'danger',
        actionType: 'delete',
      });

      const result = await onDelete(...args);

      if (successMessage) {
        showToast({ message: successMessage, type: 'success' });
      }

      return result;
    } catch {
      // Usuário cancelou - não fazer nada
    }
  };

  return handleDelete;
};
