const AuthErrorDisplay = ({ errorMessage }) => {
  if (!errorMessage) return null;

  const errorMessages = errorMessage.split('\n');

  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
      {errorMessages.length === 1 ? (
        <p className="text-center text-sm text-red-600">{errorMessages[0]}</p>
      ) : (
        <div className="text-sm text-red-600">
          <p className="mb-2 text-center font-medium">Por favor, corrija os seguintes erros:</p>
          <ul className="space-y-1">
            {errorMessages.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 text-red-500">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AuthErrorDisplay;
