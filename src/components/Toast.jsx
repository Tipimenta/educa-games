import { useEffect } from 'react';

const typeStyles = {
  success: {
    borderLeftColor: '#10b981', // green-500
  },

  error: {
    borderLeftColor: '#ef4444', // red-500
  },

  info: {
    borderLeftColor: '#3b82f6', // blue-500
  },
};

const Toast = ({ message, type = 'success', onClose, duration = 2000 }) => {
  useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const style = typeStyles[type] || typeStyles.success;

  return (
    <div
      className="fixed right-4 bottom-4 z-50 rounded-lg border-l-4 bg-white px-6 py-3 text-gray-800 shadow-lg transition-all duration-300"
      style={style}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm">{message}</span>

        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="ml-2 rounded p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
