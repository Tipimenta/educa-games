import { useContext, useMemo, useState } from 'react';

import {
  ChevronLeftIcon,
  FileTextIcon,
  HelpCircleIcon,
  LibraryIcon,
  LockIcon,
  Modal,
  PageTitle,
  Quiz,
  YoutubeIcon,
} from '../../components';
import AppLayout from '../../components/AppLayout';
import { AuthContext, CoursesContext, ModulesContext } from '../../context';
import { useAuth, useStudentProgress } from '../../hooks';

const StudentCoursesPage = () => {
  const { user } = useContext(AuthContext);
  const { courses } = useContext(CoursesContext);
  const { modules } = useContext(ModulesContext);
  const { logout } = useAuth();
  const { updateStudentProgress } = useStudentProgress();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  const [activeSelection, setActiveSelection] = useState(0);
  const [viewingResource, setViewingResource] = useState(null);
  const [showPoints, setShowPoints] = useState({ show: false, points: 0 });
  const [completedLessonsUI, setCompletedLessonsUI] = useState(new Set());

  const availableCourses = courses.filter(
    (course) => course.assignedClasses && course.assignedClasses.includes(user?.classId)
  );

  const modulesForCourse = useMemo(() => {
    if (!selectedCourse) return [];
    return modules.filter((m) => m.courseId === selectedCourse.id).sort((a, b) => a.id - b.id);
  }, [selectedCourse, modules]);

  const activeLesson =
    typeof activeSelection === 'number' && selectedModule
      ? selectedModule.lessons[activeSelection]
      : null;
  const completedLessons = useMemo(() => new Set(completedLessonsUI), [completedLessonsUI]);
  const lessonProgress = useMemo(() => {
    if (!selectedModule || !selectedModule.lessons || selectedModule.lessons.length === 0) return 0;
    return (completedLessons.size / selectedModule.lessons.length) * 100;
  }, [completedLessons, selectedModule]);
  const allLessonsCompleted = useMemo(() => lessonProgress >= 100, [lessonProgress]);
  const isQuizFinalized = selectedModule && user.progress.finalizedQuizzes.has(selectedModule.id);

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  const handleSelectModule = (module) => {
    setSelectedModule(module);
    setActiveSelection(0);
    const studentProgress = user.progress.completedLessons;
    const moduleLessons = new Set(module.lessons.map((l) => l.id));
    const completedInThisModule = new Set(
      [...studentProgress].filter((id) => moduleLessons.has(id))
    );
    setCompletedLessonsUI(completedInThisModule);
  };

  const handleToggleLesson = (lesson) => {
    if (completedLessons.has(lesson.id)) return;
    setCompletedLessonsUI((prev) => new Set(prev).add(lesson.id));
    updateStudentProgress(user.id, 'completedLessons', lesson.id, lesson.points);
    setShowPoints({ show: true, points: lesson.points });
    setTimeout(() => setShowPoints({ show: false, points: 0 }), 2000);
  };

  const handleQuizComplete = (finalScore) => {
    updateStudentProgress(user.id, 'finalizedQuizzes', selectedModule.id, finalScore);
    setActiveSelection(0);
  };

  const _getResourceIcon = (type) => {
    return type === 'youtube' ? (
      <YoutubeIcon className="h-5 w-5 text-red-500" />
    ) : (
      <FileTextIcon className="h-5 w-5 text-green-500" />
    );
  };

  if (selectedCourse && selectedModule) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <div className="relative flex-grow p-6">
          {showPoints.show && (
            <div className="animate-fade-out-up pointer-events-none absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-green-500 px-6 py-3 text-lg font-bold text-white shadow-lg">
              +{showPoints.points} Pontos!
            </div>
          )}
          <button
            onClick={() => setSelectedModule(null)}
            className="mb-4 flex items-center text-sm font-semibold text-blue-600 hover:underline"
          >
            <ChevronLeftIcon className="mr-1 h-5 w-5" /> Voltar para Módulos
          </button>
          <h2 className="mb-4 text-3xl font-bold text-gray-800">{selectedModule.title}</h2>
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="w-full lg:w-1/4">
              <div className="rounded-lg bg-white p-4 shadow-md">
                <h3 className="mb-3 font-bold text-gray-800">Conteúdo do Módulo</h3>
                <ul className="space-y-1">
                  {selectedModule.lessons.map((lesson, index) => (
                    <li key={lesson.id}>
                      <button
                        onClick={() => setActiveSelection(index)}
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
                  {selectedModule.quiz?.questions?.length > 0 && (
                    <li key="quiz-item" className="mt-2 border-t pt-2">
                      <button
                        onClick={() => setActiveSelection('quiz')}
                        disabled={!allLessonsCompleted}
                        className={`flex w-full items-center gap-3 rounded-md p-3 text-left font-semibold transition-colors ${
                          activeSelection === 'quiz' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                        } ${
                          allLessonsCompleted
                            ? 'hover:bg-gray-100'
                            : 'cursor-not-allowed text-gray-400'
                        }`}
                      >
                        <HelpCircleIcon
                          className={`h-5 w-5 ${
                            allLessonsCompleted ? 'text-blue-600' : 'text-gray-400'
                          }`}
                        />
                        <span>Questionário</span>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="w-full lg:w-3/4">
              {activeSelection === 'quiz' ? (
                <Quiz
                  questions={selectedModule.quiz.questions}
                  onQuizComplete={handleQuizComplete}
                  isFinalized={isQuizFinalized}
                />
              ) : (
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
                      <h3 className="mb-4 text-2xl font-bold text-gray-800">
                        {activeLesson.title}
                      </h3>
                      <p className="mb-6 whitespace-pre-wrap text-gray-700">
                        {activeLesson.description}
                      </p>
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
                            onChange={() => handleToggleLesson(activeLesson)}
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
              )}
            </div>
          </div>
        </div>
        <Modal
          isOpen={!!viewingResource}
          onClose={() => setViewingResource(null)}
          title="Visualizador de Recurso"
        >
          {viewingResource?.type === 'youtube' && viewingResource.content && (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${
                  viewingResource.content.split('v=')[1] ||
                  viewingResource.content.split('youtu.be/')[1]
                }`}
                title="YouTube video player"
                style={{ border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </Modal>
      </AppLayout>
    );
  }

  if (selectedCourse) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <div className="flex-grow p-6">
          <button
            onClick={() => setSelectedCourse(null)}
            className="mb-4 flex items-center text-sm font-semibold text-blue-600 hover:underline"
          >
            <ChevronLeftIcon className="mr-1 h-5 w-5" /> Voltar para Cursos
          </button>
          <PageTitle>{selectedCourse.title}</PageTitle>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modulesForCourse.map((module) => {
              const isLocked = module.id > user.currentModuleId;
              const isCurrent = module.id === user.currentModuleId;
              return (
                <div
                  key={module.id}
                  onClick={() => !isLocked && handleSelectModule(module)}
                  className={`transform rounded-lg bg-white p-6 shadow-md transition-all ${
                    isLocked
                      ? 'cursor-not-allowed bg-gray-50 opacity-60'
                      : 'cursor-pointer hover:scale-105'
                  } ${isCurrent ? 'border-2 border-blue-500' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-xl font-bold ${
                        isLocked ? 'text-gray-500' : 'text-gray-800'
                      }`}
                    >
                      {module.title}
                    </h3>
                    {isLocked && <LockIcon className="h-5 w-5 text-gray-400" />}
                  </div>
                  <p className="text-sm text-gray-500">{module.lessons.length} aulas</p>
                  {isCurrent && (
                    <div className="mt-2 text-xs font-bold text-blue-600 uppercase">
                      Módulo Atual
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <div className="flex-grow p-6">
        <PageTitle>Meus Cursos</PageTitle>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleSelectCourse(course)}
              className="transform cursor-pointer rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <LibraryIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-gray-800">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentCoursesPage;
