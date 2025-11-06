const ModuleContentViewer = ({
  selectedModule,
  activeSelection,
  activeLesson,
  completedLessons,
  lessonProgress,
  allLessonsCompleted,
  onLessonSelect,
  onToggleLesson,
  renderQuiz,
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600">
          Progresso: {Math.round(lessonProgress)}%
        </p>
        <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-500 transition-all"
            style={{ width: `${lessonProgress}%` }}
          ></div>
        </div>
      </div>
      {activeLesson ? (
        <>
          <h3 className="mb-4 text-2xl font-bold text-gray-800">{activeLesson.title}</h3>
          <p className="mb-6 whitespace-pre-wrap text-gray-700">{activeLesson.description}</p>
          <div className="border-t pt-4">
            <label
              className={`flex items-center ${
                completedLessons.has(activeLesson.id)
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-pointer'
              }`}
            >
              <input
                type="checkbox"
                checked={completedLessons.has(activeLesson.id)}
                onChange={() => onToggleLesson(activeLesson)}
                disabled={completedLessons.has(activeLesson.id)}
                className="h-5 w-5 rounded border-gray-300 text-blue-600"
              />
              <span className="ml-3 font-semibold text-gray-700">
                Marcar como concluída (+{activeLesson.points} pontos)
              </span>
            </label>
          </div>
        </>
      ) : (
        <p>Selecione um item no menu para começar.</p>
      )}
    </div>
  );
};

export default ModuleContentViewer;

