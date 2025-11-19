import { HelpCircleIcon } from '../../../components/Icons';

const ModuleSidebar = ({
  selectedModule,
  activeSelection,
  completedLessons,
  allLessonsCompleted,
  onLessonSelect,
  isQuizFinalized,
}) => {
  return (
    <div className="w-full lg:w-1/4">
      <div className="rounded-lg bg-white p-4 shadow-md">
        <h3 className="mb-3 font-bold text-gray-800">Conteúdo do Módulo</h3>
        <ul className="space-y-1">
          {selectedModule.lessons.map((lesson, index) => (
            <li key={lesson.id}>
              <button
                onClick={() => onLessonSelect(index)}
                className={`flex w-full items-center rounded-md p-3 text-left transition-colors ${
                  activeSelection === index
                    ? 'bg-blue-100 font-bold text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={completedLessons.has(lesson.id)}
                  className="pointer-events-none mr-3 h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                <span>{lesson.title}</span>
              </button>
            </li>
          ))}
          {selectedModule.quiz && selectedModule.quiz.quiz?.questions?.length > 0 && (
            <li key="quiz-item" className="mt-2 border-t pt-2">
              <button
                onClick={() => onLessonSelect('quiz')}
                disabled={!allLessonsCompleted || !selectedModule.quiz.isAvailable}
                className={`flex w-full items-center gap-3 rounded-md p-3 text-left font-semibold transition-colors ${
                  activeSelection === 'quiz' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                } ${
                  allLessonsCompleted && selectedModule.quiz.isAvailable
                    ? 'hover:bg-gray-100'
                    : 'cursor-not-allowed text-gray-400'
                }`}
              >
                <HelpCircleIcon
                  className={`h-5 w-5 ${
                    allLessonsCompleted && selectedModule.quiz.isAvailable ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
                <span>Questionário</span>
                {selectedModule.quiz.isCompleted && (
                  <span className="ml-auto text-xs text-green-600">✓ Concluído</span>
                )}
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ModuleSidebar;

