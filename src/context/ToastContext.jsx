import { createContext, useCallback, useMemo, useState } from 'react';

import Toast from '../components/Toast';

export const ToastContext = createContext({ showToast: () => {}, hideToast: () => {} });

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const hideToast = useCallback(() => setToast(null), []);

  const showToast = useCallback(({ message, type = 'success', duration = 2000 }) => {
    setToast({ message, type, duration });
  }, []);

  const value = useMemo(() => ({ showToast, hideToast }), [showToast, hideToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toast ? (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={hideToast}
        />
      ) : null}
    </ToastContext.Provider>
  );
};
