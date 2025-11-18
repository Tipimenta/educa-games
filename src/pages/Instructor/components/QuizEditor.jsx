import { useState } from 'react';
import { Trash2Icon } from '../../../components/Icons';
import Input from '../../../components/Input';
import { ErrorMessage, Label, Textarea, PointsField, Button, Modal } from '../../../components';
import { validateSingleField } from '../../../schemas/helpers';
import { quizOptionSchema, quizQuestionTextSchema } from '../../../schemas/quizSchema';
import { useQuizForm } from '../../../hooks';

const QuizEditor = ({
  questions,
  onQuestionChange,
  onOptionChange,
  onAddQuestion,
  onRemoveQuestion,
  onAddOption,
  onRemoveOption,
}) => {
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [dontRemind, setDontRemind] = useState(
    typeof window !== 'undefined' && localStorage.getItem('quiz_add_question_skip') === '1'
  );
  const {
    onQuestionTextChange,
    onQuestionTextBlur,
    onOptionChange: onOptionChangeValidate,
    onOptionBlur,
    onPointsChange,
    onPointsBlur,
    getQuestionError,
    getOptionError,
    getPointsError,
  } = useQuizForm();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-xl font-bold text-gray-800">Questionário</h4>
        {/* Aviso ao adicionar nova pergunta */}
        <Button
          className="px-6 whitespace-nowrap sm:w-auto w-auto inline-flex items-center gap-2 py-2"
          onClick={() => {
            const skip = localStorage.getItem('quiz_add_question_skip') === '1';
            if (skip) {
              onAddQuestion();
            } else {
              setIsReminderOpen(true);
            }
          }}
        >
          + Adicionar Pergunta
        </Button>
      </div>
      {(!Array.isArray(questions) || questions.length === 0) && (
        <p className="mb-4 text-sm text-gray-600">
          Nenhuma pergunta adicionada. Clique em “+ Adicionar Pergunta” para começar.
        </p>
      )}
      {/* Modal de lembrete para nova pergunta */}
      <AddQuestionReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        onConfirm={() => {
          if (dontRemind) {
            localStorage.setItem('quiz_add_question_skip', '1');
          }
          onAddQuestion();
          setIsReminderOpen(false);
        }}
        dontRemind={dontRemind}
        setDontRemind={setDontRemind}
      />
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-4 rounded-lg border bg-gray-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-bold text-gray-700">Pergunta {qIndex + 1}</span>
            <div className="flex items-center gap-2">
              <PointsField
                label=""
                value={q.points}
                onChange={(nextVal) => onQuestionChange(qIndex, 'points', nextVal)}
                onChangeValidate={(nextVal) => onPointsChange(qIndex, nextVal)}
                onBlurValidate={(nextVal) => onPointsBlur(qIndex, nextVal)}
                errorMessage={getPointsError(qIndex)}
              />
              <button
                onClick={() => onRemoveQuestion(qIndex)}
                aria-label={`Remover pergunta ${qIndex + 1}`}
              >
                <Trash2Icon className="h-5 w-5 text-red-500 hover:text-red-700" />
              </button>
            </div>
          </div>
          <div className="mb-2">
            <Label htmlFor={`question-text-${qIndex}`}>Texto da pergunta</Label>
            <Textarea
              id={`question-text-${qIndex}`}
              rows={3}
              placeholder="Digite o enunciado da pergunta"
              value={q.text || ''}
              onChange={(e) => {
                const val = e.target.value;
                onQuestionChange(qIndex, 'text', val);
                onQuestionTextChange(qIndex, val);
              }}
              onBlur={(e) => {
                onQuestionTextBlur(qIndex, e.target.value);
              }}
              error={!!getQuestionError(qIndex)}
            />
            <ErrorMessage message={getQuestionError(qIndex)} />
          </div>
          <h5 className="mb-2 text-sm font-bold">Opções (marque a correta):</h5>
          {q.options.map((opt, oIndex) => (
            <div key={oIndex} className="mb-2 flex items-start gap-2">
              <input
                type="radio"
                name={`q_${qIndex}_correct`}
                checked={q.correctAnswer === opt}
                onChange={() => onQuestionChange(qIndex, 'correctAnswer', opt)}
                className="mt-3 h-4 w-4"
              />
              <div className="flex-grow flex flex-col">
                <Input
                  value={opt}
                  onChange={(e) => {
                    const val = e.target.value;
                    onOptionChange(qIndex, oIndex, val);
                    onOptionChangeValidate(qIndex, oIndex, val);
                  }}
                  onBlur={(e) => {
                    onOptionBlur(qIndex, oIndex, e.target.value);
                  }}
                  className="mx-0"
                  error={!!getOptionError(qIndex, oIndex)}
                />
                <ErrorMessage message={getOptionError(qIndex, oIndex)} />
              </div>
              <button
                onClick={() => onRemoveOption(qIndex, oIndex)}
                aria-label={`Remover opção ${oIndex + 1}`}
                className="mt-3"
              >
                <Trash2Icon className="h-4 w-4 text-gray-500 hover:text-red-600" />
              </button>
            </div>
          ))}
          {/* Erro inline: só mostra se houver ao menos 1 opção */}
          {(() => {
            const opts = Array.isArray(q.options) ? q.options : [];
            const nonEmpty = opts
              .map((o) => (o || '').trim())
              .filter((o) => o.length > 0);
            // Só mostrar o erro quando já existe ao menos 1 alternativa preenchida,
            // mas ainda não atingiu 2 preenchidas.
            const showMinError = nonEmpty.length > 0 && nonEmpty.length < 2;
            return (
              <ErrorMessage
                message={showMinError ? 'A pergunta precisa de pelo menos 2 alternativas.' : ''}
              />
            );
          })()}
          <Button
            className="mt-2 px-3 py-2 text-sm sm:w-auto w-auto inline-flex items-center gap-2"
            onClick={() => onAddOption(qIndex)}
          >
            + Adicionar Opção
          </Button>
        </div>
      ))}
    </div>
  );
};

/* Modal interno para lembrete ao adicionar pergunta */
const AddQuestionReminderModal = ({ isOpen, onClose, onConfirm, dontRemind, setDontRemind }) => {
  if (!isOpen) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova Pergunta" showCloseButton={true} size="lg">
      <p className="text-sm text-gray-700">
        Para salvar o módulo, cada pergunta do questionário deve ter pelo menos duas alternativas.
      </p>
      <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={!!dontRemind}
          onChange={(e) => setDontRemind(e.target.checked)}
        />
        Não lembrar novamente
      </label>
      <div className="mt-6 flex justify-end gap-3">
        <Button onClick={onConfirm} className="px-4 py-2 w-auto">OK</Button>
      </div>
    </Modal>
  );
};

export default QuizEditor;
