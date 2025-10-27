import { useEffect, useState } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 2000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    if (!duration) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 250);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed right-4 bottom-4 z-50 flex items-center gap-3 rounded-lg border-l-4 bg-white px-6 py-3 text-gray-800 shadow-[0_2px_10px_rgba(0,0,0,0.1)] ${
        type === 'error'
          ? 'border-l-[#E53935]'
          : type === 'success'
            ? 'border-l-[#10B981]'
            : 'border-l-[#3b82f6]'
      } ${isVisible ? 'animate-fade-in-up' : 'animate-fade-out-down'}`}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <span className="text-sm">{message}</span>
      <button
        type="button"
        aria-label="Fechar notificação"
        onClick={() => setIsVisible(false)}
        className="ml-2 flex h-5 w-5 items-center justify-center rounded text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
