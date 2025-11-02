import { PlusCircleIcon, Trash2Icon } from '../../../components/Icons';
import Input from '../../../components/Input';

const QuizEditor = ({
  questions,
  onQuestionChange,
  onOptionChange,
  onAddQuestion,
  onRemoveQuestion,
  onAddOption,
  onRemoveOption,
}) => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-xl font-bold text-gray-800">Questionário</h4>
        <button
          onClick={onAddQuestion}
          className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          <PlusCircleIcon className="mr-1 h-5 w-5" /> Adicionar Pergunta
        </button>
      </div>
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-4 rounded-lg border bg-gray-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-bold text-gray-700">Pergunta {qIndex + 1}</span>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-500">Pontos</label>
              <Input
                type="number"
                value={q.points || 0}
                onChange={(e) =>
                  onQuestionChange(qIndex, 'points', parseInt(e.target.value, 10) || 0)
                }
                className="w-24"
              />
              <button
                onClick={() => onRemoveQuestion(qIndex)}
                aria-label={`Remover pergunta ${qIndex + 1}`}
              >
                <Trash2Icon className="h-5 w-5 text-red-500 hover:text-red-700" />
              </button>
            </div>
          </div>
          <textarea
            placeholder="Texto da pergunta"
            value={q.text}
            onChange={(e) => onQuestionChange(qIndex, 'text', e.target.value)}
            className="mb-2 w-full rounded-lg border bg-white p-2"
          />
          <h5 className="mb-2 text-sm font-bold">Opções (marque a correta):</h5>
          {q.options.map((opt, oIndex) => (
            <div key={oIndex} className="mb-2 flex items-center">
              <input
                type="radio"
                name={`q_${qIndex}_correct`}
                checked={q.correctAnswer === opt}
                onChange={() => onQuestionChange(qIndex, 'correctAnswer', opt)}
                className="mr-2 h-4 w-4"
              />
              <Input
                value={opt}
                onChange={(e) => onOptionChange(qIndex, oIndex, e.target.value)}
                className="mx-2 flex-grow"
              />
              <button
                onClick={() => onRemoveOption(qIndex, oIndex)}
                aria-label={`Remover opção ${oIndex + 1}`}
              >
                <Trash2Icon className="h-4 w-4 text-gray-500 hover:text-red-600" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onAddOption(qIndex)}
            className="mt-1 text-xs font-semibold text-blue-600 hover:underline"
          >
            + Adicionar Opção
          </button>
        </div>
      ))}
    </div>
  );
};

export default QuizEditor;
