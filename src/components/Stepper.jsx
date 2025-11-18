import React from 'react';

const Stepper = ({ currentStep }) => {
  const steps = ['Detalhes e Turmas', 'Aulas', 'Questionário'];

  return (
    <div className="mb-8 flex items-center justify-between pb-4">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;

        return (
          <React.Fragment key={step}>
            <div className="flex items-center">
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors ${
                  isActive || isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`ml-3 hidden font-medium md:block ${
                  isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>
            {stepNumber < steps.length && (
              <div className="relative z-0 mt-4 flex-auto border-t-2 border-gray-200 opacity-70 transition-all"></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
