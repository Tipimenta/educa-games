import React, { useState } from 'react';

import Button from './Button';

const CheckCircleIcon = ({ className }) => (
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
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
const XCircleIcon = ({ className }) => (
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
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const Quiz = ({ questions, onQuizComplete, isFinalized }) => {
  
  const [quizState, setQuizState] = useState('intro');
  const [attempts, setAttempts] = useState(0);
  const [scores, setScores] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const currentQuestion = questions[currentQuestionIndex];

  const handleStartAttempt = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizState('taking');
  };

  const handleSubmitAttempt = () => {
    const currentScore = questions.reduce((acc, q) => {
      const selectedOptionIndex = selectedAnswers[q.id];
      if (q.options[selectedOptionIndex] === q.correctAnswer) {
        return acc + (q.points || 0);
      }
      return acc;
    }, 0);

    setAttempts((prev) => prev + 1);
    setScores((prev) => [...prev, currentScore]);
    setQuizState('results');
  };

  const handleFinalize = () => {
    const maxScore = Math.max(...scores, 0);
    
    onQuizComplete(maxScore);
  };

  if (quizState === 'intro') {
    
    if (isFinalized) {
      return (
        <div className="rounded-lg bg-white p-8 text-center shadow-md">
          <h3 className="mb-4 text-2xl font-bold text-gray-800">Questionário Concluído</h3>
          <p className="text-gray-600">
            Você já finalizou este questionário e a sua pontuação já foi registada.
          </p>
        </div>
      );
    }

   
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow-md">
        <h3 className="mb-4 text-2xl font-bold text-gray-800">Instruções do Questionário</h3>
        <p className="mb-2 text-gray-600">
          Você terá até <span className="font-bold">3 tentativas</span> para responder.
        </p>
        <p className="mb-6 text-gray-600">
          A sua <span className="font-bold">maior nota</span> será a que ficará registada.
        </p>
        <Button onClick={handleStartAttempt}>Começar 1ª Tentativa</Button>
      </div>
    );
  }


  if (quizState === 'results') {
    const lastScore = scores[scores.length - 1];
    const maxScore = Math.max(...scores);

    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800">Resultado da {attempts}ª Tentativa</h3>
          <p className="mt-2 text-lg text-gray-700">Você fez</p>
          <p className="my-2 text-4xl font-bold text-blue-600">{lastScore} pontos</p>
          <p className="text-md mb-6 font-semibold text-gray-600">
            Sua maior pontuação até agora é: {maxScore} pontos.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 border-t pt-6 sm:flex-row">
          {attempts < 3 && (
            <Button onClick={handleStartAttempt} className="w-full sm:w-auto">
              Tentar Novamente ({attempts}/3)
            </Button>
          )}
          <button
            onClick={handleFinalize}
            className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
          >
            Finalizar e Salvar Maior Nota
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between border-b pb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Pergunta {currentQuestionIndex + 1} de {questions.length}
        </h3>
        <span className="font-semibold text-gray-500">Tentativa {attempts + 1} de 3</span>
      </div>
      <p className="mb-6 text-lg text-gray-700">{currentQuestion.text}</p>
      <div className="space-y-4">
        {currentQuestion.options.map((option, index) => (
          <label
            key={index}
            className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors ${
              selectedAnswers[currentQuestion.id] === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={`question-${currentQuestion.id}`}
              checked={selectedAnswers[currentQuestion.id] === index}
              onChange={() =>
                setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: index })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-800">{option}</span>
          </label>
        ))}
      </div>
      <div className="mt-8 flex justify-between border-t pt-6">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
          disabled={currentQuestionIndex === 0}
          className="rounded-lg border border-gray-300 px-6 py-2 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>
        {currentQuestionIndex < questions.length - 1 ? (
          <Button onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}>Próxima</Button>
        ) : (
          <Button onClick={handleSubmitAttempt}>Enviar Respostas</Button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
