import { useQueryClient } from '@tanstack/react-query';
import { useContext, useState } from 'react';

import {
  ChevronLeftIcon,
  EmptyState,
  LibraryIcon,
  LockIcon,
  Modal,
  PageTitle,
  Quiz,
} from '../../components';
import AppLayout from '../../components/AppLayout';
import { AuthContext } from '../../context';
import { useAuth, useStudentCourseModules, useStudentCourses, useStudentModuleDetails } from '../../hooks';
import { studentService } from '../../services';
import ModuleContentViewer from './components/ModuleContentViewer';
import ModuleSidebar from './components/ModuleSidebar';
import { useModuleProgress } from './hooks/useModuleProgress';

const StudentCoursesPage = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [activeSelection, setActiveSelection] = useState(0);
  const [viewingResource, setViewingResource] = useState(null);
  const [showPoints, setShowPoints] = useState({ show: false, points: 0 });

  const { data: courses = [], isLoading: isLoadingCourses } = useStudentCourses();
  const { data: modules = [], isLoading: isLoadingModules } = useStudentCourseModules(selectedCourseId);
  const { data: moduleDetails, isLoading: isLoadingModuleDetails } = useStudentModuleDetails(selectedModuleId);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const selectedModule = moduleDetails;

  const progress = useModuleProgress({
    selectedModule: selectedModule,
    user,
  });

  const activeLesson =
    typeof activeSelection === 'number' && selectedModule?.lessons
      ? selectedModule.lessons[activeSelection]
      : null;

  const handleToggleLesson = async (lesson) => {
    if (progress.completedLessons.has(lesson.id)) return;
    try {
      await studentService.completeLesson(lesson.id);
      progress.setCompletedLessonsUI((prev) => new Set(prev).add(lesson.id));
      setShowPoints({ show: true, points: lesson.points || 0 });
      setTimeout(() => setShowPoints({ show: false, points: 0 }), 2000);

      queryClient.invalidateQueries({ queryKey: ['student', 'modules', selectedModuleId] });
      queryClient.invalidateQueries({ queryKey: ['student', 'dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['student', 'ranking'] });
    } catch (error) {
      console.error('Erro ao completar aula:', error);
    }
  };

  const handleQuizComplete = async (answers) => {
    if (selectedModule?.quiz?.id) {
      try {
        const score = await studentService.completeQuiz(selectedModule.quiz.id, answers);
        setShowPoints({ show: true, points: score });
        setTimeout(() => setShowPoints({ show: false, points: 0 }), 2000);
        setActiveSelection(0);

        queryClient.invalidateQueries({ queryKey: ['student', 'modules', selectedModuleId] });
        queryClient.invalidateQueries({ queryKey: ['student', 'dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['student', 'ranking'] });
      } catch (error) {
        console.error('Erro ao completar quiz:', error);
      }
    }
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setSelectedModuleId(null);
    setActiveSelection(0);
  };

  const handleSelectModule = (moduleId) => {
    setSelectedModuleId(moduleId);
    setActiveSelection(0);
  };

  const handleBackToCourses = () => {
    setSelectedCourseId(null);
    setSelectedModuleId(null);
    setActiveSelection(0);
  };

  const handleBackToModules = () => {
    setSelectedModuleId(null);
    setActiveSelection(0);
  };

  if (isLoadingCourses) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <div className="flex-grow p-6">
          <PageTitle>Meus Cursos</PageTitle>
          <div className="text-center">
            <p className="text-gray-600">Carregando cursos...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (selectedModule) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <div className="relative flex-grow p-6">
          {showPoints.show && (
            <div className="animate-fade-out-up pointer-events-none absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-green-500 px-6 py-3 text-lg font-bold text-white shadow-lg">
              +{showPoints.points} Pontos!
            </div>
          )}
          <button
            onClick={handleBackToModules}
            className="mb-4 flex items-center text-sm font-semibold text-blue-600 hover:underline"
          >
            <ChevronLeftIcon className="mr-1 h-5 w-5" /> Voltar para Módulos
          </button>
          <h2 className="mb-4 text-3xl font-bold text-gray-800">{selectedModule.title}</h2>
          <div className="flex flex-col gap-8 lg:flex-row">
            <ModuleSidebar
              selectedModule={selectedModule}
              activeSelection={activeSelection}
              completedLessons={progress.completedLessons}
              allLessonsCompleted={progress.allLessonsCompleted}
              onLessonSelect={setActiveSelection}
              isQuizFinalized={progress.isQuizFinalized}
            />
            <div className="w-full lg:w-3/4">
              {activeSelection === 'quiz' && selectedModule.quiz ? (
                <Quiz
                  quizId={selectedModule.quiz.id}
                  questions={selectedModule.quiz.quiz?.questions || []}
                  onQuizComplete={handleQuizComplete}
                  isFinalized={progress.isQuizFinalized}
                />
              ) : (
                <ModuleContentViewer
                  selectedModule={selectedModule}
                  activeSelection={activeSelection}
                  activeLesson={activeLesson}
                  completedLessons={progress.completedLessons}
                  lessonProgress={progress.lessonProgress}
                  allLessonsCompleted={progress.allLessonsCompleted}
                  onLessonSelect={setActiveSelection}
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

  if (selectedCourseId) {
    if (isLoadingModules) {
      return (
        <AppLayout user={user} onLogout={logout}>
          <div className="flex-grow p-6">
            <button
              onClick={handleBackToCourses}
              className="mb-4 flex items-center text-sm font-semibold text-blue-600 hover:underline"
            >
              <ChevronLeftIcon className="mr-1 h-5 w-5" /> Voltar para Cursos
            </button>
            <PageTitle>{selectedCourse?.title || 'Carregando...'}</PageTitle>
            <div className="text-center">
              <p className="text-gray-600">Carregando módulos...</p>
            </div>
          </div>
        </AppLayout>
      );
    }

    return (
      <AppLayout user={user} onLogout={logout}>
        <div className="flex-grow p-6">
          <button
            onClick={handleBackToCourses}
            className="mb-4 flex items-center text-sm font-semibold text-blue-600 hover:underline"
          >
            <ChevronLeftIcon className="mr-1 h-5 w-5" /> Voltar para Cursos
          </button>
          <PageTitle>{selectedCourse?.title}</PageTitle>
          {modules.length === 0 ? (
            <EmptyState
              message="Nenhum módulo disponível"
              description="Este curso ainda não possui módulos cadastrados."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => {
              const isLocked = module.isLocked;
              const isCompleted = module.isCompleted;
              return (
                <div
                  key={module.id}
                  onClick={() => !isLocked && handleSelectModule(module.id)}
                  className={`transform rounded-lg bg-white p-6 shadow-md transition-all ${
                    isLocked
                      ? 'cursor-not-allowed bg-gray-50 opacity-60'
                      : 'cursor-pointer hover:scale-105'
                  } ${isCompleted ? 'border-2 border-green-500' : ''}`}
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
                  <p className="text-sm text-gray-500">
                    {module.lessonsCount || 0} aulas
                  </p>
                  {module.progress !== undefined && (
                    <div className="mt-2">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">{module.progress}% completo</p>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="mt-2 text-xs font-bold text-green-600 uppercase">
                      Concluído
                    </div>
                  )}
                </div>
              );
              })}
            </div>
          )}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <div className="flex-grow p-6">
        <PageTitle>Meus Cursos</PageTitle>
        {courses.length === 0 ? (
          <EmptyState
            message="Nenhum curso disponível"
            description="Você ainda não possui cursos atribuídos à sua turma."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => handleSelectCourse(course.id)}
              className="transform cursor-pointer rounded-lg bg-white p-6 shadow-md transition-transform hover:scale-105"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <LibraryIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-gray-800">{course.title}</h3>
                  <p className="text-sm text-gray-500">{course.description}</p>
                  <p className="mt-2 text-xs text-gray-400">{course.modulesCount || 0} módulos</p>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default StudentCoursesPage;
