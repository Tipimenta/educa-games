const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;

  return <div className={`mt-1 text-center text-sm text-red-600 ${className}`}>{message}</div>;
};

export default ErrorMessage;
