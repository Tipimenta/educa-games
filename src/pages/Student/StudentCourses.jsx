import { useContext, useEffect, useState } from 'react';

import {
  ChevronLeftIcon,
  LibraryIcon,
  LockIcon,
  Modal,
  PageTitle,
  Quiz,
} from '../../components';
import AppLayout from '../../components/AppLayout';
import { AuthContext, CoursesContext, ModulesContext } from '../../context';
import { useAuth, useStudentProgress } from '../../hooks';
import ModuleContentViewer from './components/ModuleContentViewer';
import ModuleSidebar from './components/ModuleSidebar';
import { useModuleProgress } from './hooks/useModuleProgress';
import { useStudentCourseNavigation } from './hooks/useStudentCourseNavigation';

const StudentCoursesPage = () => {
  const { user } = useContext(AuthContext);
  const { courses } = useContext(CoursesContext);
  const { modules } = useContext(ModulesContext);
  const { logout } = useAuth();
  const { updateStudentProgress } = useStudentProgress();
  const [viewingResource, setViewingResource] = useState(null);
  const [showPoints, setShowPoints] = useState({ show: false, points: 0 });

  const navigation = useStudentCourseNavigation({ courses, modules, user });

  const progress = useModuleProgress({
    selectedModule: navigation.selectedModule,
    user,
  });

  useEffect(() => {
    if (navigation.selectedModule) {
      progress.initializeProgress(navigation.selectedModule);
    }
  }, [navigation.selectedModule]);

  const activeLesson =
    typeof navigation.activeSelection === 'number' && navigation.selectedModule
      ? navigation.selectedModule.lessons[navigation.activeSelection]
      : null;

  const handleToggleLesson = (lesson) => {
    if (progress.completedLessons.has(lesson.id)) return;
    progress.setCompletedLessonsUI((prev) => new Set(prev).add(lesson.id));
    updateStudentProgress(user.id, 'completedLessons', lesson.id, lesson.points);
    setShowPoints({ show: true, points: lesson.points });
    setTimeout(() => setShowPoints({ show: false, points: 0 }), 2000);
  };

  const handleQuizComplete = (finalScore) => {
    if (navigation.selectedModule) {
      updateStudentProgress(user.id, 'finalizedQuizzes', navigation.selectedModule.id, finalScore);
      navigation.setActiveSelection(0);
    }
  };

  if (navigation.selectedCourse && navigation.selectedModule) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <div className="relative flex-grow p-6">
          {showPoints.show && (
            <div className="animate-fade-out-up pointer-events-none absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-green-500 px-6 py-3 text-lg font-bold text-white shadow-lg">
              +{showPoints.points} Pontos!
            </div>
          )}
          <button
            onClick={navigation.handleBackToModules}
            className="mb-4 flex items-center text-sm font-semibold text-blue-600 hover:underline"
          >
            <ChevronLeftIcon className="mr-1 h-5 w-5" /> Voltar para Módulos
          </button>
          <h2 className="mb-4 text-3xl font-bold text-gray-800">
            {navigation.selectedModule.title}
          </h2>
          <div className="flex flex-col gap-8 lg:flex-row">
            <ModuleSidebar
              selectedModule={navigation.selectedModule}
              activeSelection={navigation.activeSelection}
              completedLessons={progress.completedLessons}
              allLessonsCompleted={progress.allLessonsCompleted}
              onLessonSelect={navigation.setActiveSelection}
              isQuizFinalized={progress.isQuizFinalized}
            />
            <div className="w-full lg:w-3/4">
              {navigation.activeSelection === 'quiz' ? (
                <Quiz
                  questions={navigation.selectedModule.quiz.questions}
                  onQuizComplete={handleQuizComplete}
                  isFinalized={progress.isQuizFinalized}
                />
              ) : (
                <ModuleContentViewer
                  selectedModule={navigation.selectedModule}
                  activeSelection={navigation.activeSelection}
                  activeLesson={activeLesson}
                  completedLessons={progress.completedLessons}
                  lessonProgress={progress.lessonProgress}
                  allLessonsCompleted={progress.allLessonsCompleted}
                  onLessonSelect={navigation.setActiveSelection}
                  onToggleLesson={handleToggleLesson}
                />
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

  if (navigation.selectedCourse) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <div className="flex-grow p-6">
          <button
            onClick={navigation.handleBackToCourses}
            className="mb-4 flex items-center text-sm font-semibold text-blue-600 hover:underline"
          >
            <ChevronLeftIcon className="mr-1 h-5 w-5" /> Voltar para Cursos
          </button>
          <PageTitle>{navigation.selectedCourse.title}</PageTitle>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {navigation.modulesForCourse.map((module) => {
              const isLocked = module.id > user.currentModuleId;
              const isCurrent = module.id === user.currentModuleId;
              return (
                <div
                  key={module.id}
                  onClick={() => !isLocked && navigation.handleSelectModule(module)}
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
          {navigation.availableCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigation.handleSelectCourse(course)}
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
