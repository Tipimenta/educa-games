import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children, showCloseButton = true, size = "lg" }) => {
  // Controla bloqueio de rolagem do body enquanto o modal estiver aberto,
  // garantindo desbloqueio ao fechar ou desmontar.
  useEffect(() => {
    const body = document.body;
    if (isOpen) {
      body.dataset.prevOverflow = body.style.overflow || "";
      body.style.overflow = "hidden";
    }
    return () => {
      const prev = body.dataset.prevOverflow;
      if (typeof prev !== "undefined") {
        body.style.overflow = prev;
        delete body.dataset.prevOverflow;
      } else {
        body.style.overflow = "";
      }
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={
          `relative w-full ${
            size === "fullscreen"
              ? "max-w-none mx-4 md:mx-8 rounded-xl"
              : size === "xl"
                ? "max-w-5xl mx-4 md:mx-8 rounded-xl"
                : "max-w-lg rounded-lg"
          } bg-white p-6 md:p-8 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)] flex flex-col max-h-[80vh]`
        }
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div
            className={`flex items-center ${showCloseButton ? 'justify-between' : ''}`}
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
        )}
        <div className={`${title ? 'mt-3' : ''}`}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
