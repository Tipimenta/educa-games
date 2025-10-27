const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`mt-1.5 mb-4 pl-1 text-left text-sm text-red-600 ${className}`}>{message}</div>
  );
};

export default ErrorMessage;
