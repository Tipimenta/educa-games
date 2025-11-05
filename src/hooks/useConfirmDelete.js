import { useConfirmAction } from './useConfirmAction';

export const useConfirmDelete = ({ onDelete, title, message, successMessage }) => {
  const { executeWithConfirmation } = useConfirmAction();

  const handleDelete = async (...args) => {
    return executeWithConfirmation({
      confirmConfig: {
        title,
        message,
        variant: 'danger',
        actionType: 'delete',
      },
      action: () => onDelete(...args),
      successMessage,
    });
  };

  return handleDelete;
};
