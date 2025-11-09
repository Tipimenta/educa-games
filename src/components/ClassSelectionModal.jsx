import { useEffect, useState } from 'react';

import Button from './Button';
import Modal from './Modal';

const ClassSelectionModal = ({
  isOpen,
  classes = [],
  onSelect,
  onCancel,
  isLoading = false,
  allowCancel = false,
  title = 'Selecione sua turma',
  message = 'Foram encontradas múltiplas turmas com matrícula ativa. Selecione qual você deseja acessar:',
}) => {
  const [selectedClassId, setSelectedClassId] = useState(null);

  // Reseta a seleção quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setSelectedClassId(null);
    }
  }, [isOpen]);

  const handleSelect = () => {
    if (selectedClassId && onSelect && !isLoading) {
      onSelect(selectedClassId);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={allowCancel ? handleCancel : () => {}} showCloseButton={allowCancel}>
      <div className="p-6">
        <h3 className="mb-2 text-center text-xl font-bold text-gray-900">{title}</h3>
        <p className="mb-6 text-center text-sm text-gray-600">{message}</p>

        <div className="mb-6 space-y-3">
          {classes.map((classItem) => (
            <button
              key={classItem.id}
              onClick={() => setSelectedClassId(classItem.id)}
              disabled={isLoading}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                selectedClassId === classItem.id
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
              } ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{classItem.className}</h4>
                  <p className="mt-1 text-sm text-gray-500">Turma {classItem.id}</p>
                </div>
                {selectedClassId === classItem.id && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className={`flex ${allowCancel ? 'justify-end' : 'justify-center'} gap-3`}>
          {allowCancel && (
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="min-w-[120px] rounded-lg border-2 border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
          )}
          <Button
            onClick={handleSelect}
            disabled={!selectedClassId || isLoading}
            className="min-w-[120px] bg-blue-600 text-white hover:bg-blue-700"
          >
            {isLoading ? 'Carregando...' : 'Continuar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClassSelectionModal;

