import { useState } from 'react';

import { studentService } from '../services/student';
import Button from './Button';
import Modal from './Modal';

const Quiz = ({ quizId, questions, onQuizComplete, isFinalized }) => {
  const [quizState, setQuizState] = useState('intro');
  const [attempts, setAttempts] = useState(0);
  const [scores, setScores] = useState([]);
  const [attemptAnswers, setAttemptAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [errorDialog, setErrorDialog] = useState({ isOpen: false, message: '' });

  const currentQuestion = questions[currentQuestionIndex];

  const handleStartAttempt = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizState('taking');
  };

  const formatAnswers = () => {
    return questions
      .map((question) => {
        if (!question.id) return null;

        const selectedAlternativeId = selectedAnswers[question.id];
        if (!selectedAlternativeId) return null;

        return {
          questionId: question.id,
          selectedAlternativeId: selectedAlternativeId,
        };
      })
      .filter((answer) => answer !== null);
  };

  const handleSubmitAttempt = async () => {
    // Verifica se todas as questões foram respondidas
    const unansweredQuestions = questions.filter((question) => {
      return !question.id || !selectedAnswers[question.id];
    });

    if (unansweredQuestions.length > 0) {
      setErrorDialog({
        isOpen: true,
        message: `Por favor, responda todas as ${questions.length} questões antes de enviar. Você ainda não respondeu ${unansweredQuestions.length} questão(ões).`,
      });
      return;
    }

    const answers = formatAnswers();

    if (answers.length === 0) {
      setErrorDialog({
        isOpen: true,
        message: 'Erro ao processar as respostas. Por favor, tente novamente.',
      });
      return;
    }

    try {
      const score = await studentService.calculateQuizScore(quizId, answers);
      setAttempts((prev) => prev + 1);
      setScores((prev) => [...prev, score]);
      setAttemptAnswers((prev) => [...prev, answers]);
      setQuizState('results');
    } catch (error) {
      console.error('Erro ao calcular score:', error);
      setAttempts((prev) => prev + 1);
      setScores((prev) => [...prev, 0]);
      setAttemptAnswers((prev) => [...prev, answers]);
      setQuizState('results');
    }
  };

  const handleFinalize = () => {
    if (scores.length === 0) {
      setErrorDialog({
        isOpen: true,
        message: 'Por favor, complete pelo menos uma tentativa antes de finalizar.',
      });
      return;
    }

    // Encontra o índice da tentativa com maior score
    const maxScoreIndex = scores.reduce((maxIndex, score, index) =>
      score > scores[maxIndex] ? index : maxIndex, 0
    );

    // Envia apenas a melhor tentativa
    const bestAttemptAnswers = attemptAnswers[maxScoreIndex];
    onQuizComplete(bestAttemptAnswers);
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

  if (!currentQuestion) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="text-red-500">Erro: Questão não encontrada</p>
      </div>
    );
  }

  if (!currentQuestion.id) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="text-red-500">Erro: Questão sem ID. O backend precisa retornar o ID da questão.</p>
      </div>
    );
  }

  const alternatives = currentQuestion.alternatives || [];

  if (alternatives.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <p className="text-red-500">Erro: Questão sem alternativas. O backend precisa retornar alternatives com IDs.</p>
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
        {alternatives.map((alternative) => {
          if (!alternative.id) {
            console.error('Alternativa sem ID:', alternative);
            return null;
          }

          const isSelected = selectedAnswers[currentQuestion.id] === alternative.id;

          return (
            <label
              key={alternative.id}
              className={`flex cursor-pointer items-center rounded-lg border p-4 transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={alternative.id}
                checked={isSelected}
                onChange={() =>
                  setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: alternative.id })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-800">{alternative.text}</span>
            </label>
          );
        })}
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

      {/* Dialog de Erro */}
      <Modal
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog({ isOpen: false, message: '' })}
        title="Atenção"
        size="md"
      >
        <div className="p-4">
          <p className="text-gray-700">{errorDialog.message}</p>
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setErrorDialog({ isOpen: false, message: '' })}>
              Entendi
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Quiz;
