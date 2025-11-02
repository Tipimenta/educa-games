const Modal = ({ isOpen, onClose, title, children, showCloseButton = true }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-8 shadow-xl">
        <div
          className={`flex items-center border-b pb-4 ${showCloseButton ? 'justify-between' : 'justify-start'}`}
        >
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          {showCloseButton && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
