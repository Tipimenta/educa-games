import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { Button, ChevronLeftIcon, Header, Input, Sidebar, Stepper } from '../../components';
import { AuthContext, ModulesContext } from '../../context';
import { useAuth, useToast } from '../../hooks';
import { contentService } from '../../services';
import { LessonEditor, QuizEditor } from './components';

const ModuleEditor = () => {
  const { user } = useContext(AuthContext);
  const { modules, setModules } = useContext(ModulesContext);
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const courseId = location.state?.courseId;

  const [currentModule, setCurrentModule] = useState({
    title: '',
    lessons: [],
    quiz: { questions: [] },
  });
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (moduleId) {
      const moduleToEdit = modules.find((m) => m.id === parseInt(moduleId));
      if (moduleToEdit) {
        setCurrentModule(JSON.parse(JSON.stringify(moduleToEdit)));
      }
    } else if (!courseId) {
      showToast({
        message: "Nenhum curso selecionado. Volte à página de Módulos e clique em 'Novo Módulo'.",
        type: 'error',
      });
      navigate('/instructor/manage-content');
    }
  }, [moduleId, modules, courseId, navigate, showToast]);

  const nextStep = () => setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
  const prevStep = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));

  const handleSaveModule = () => {
    if (moduleId) {
      setModules(modules.map((m) => (m.id === parseInt(moduleId) ? currentModule : m)));
    } else {
      const newModule = contentService.createModule(courseId, currentModule);
      setModules([...modules, newModule]);
    }
    navigate('/instructor/manage-content', {
      state: { courseId: moduleId ? currentModule.courseId : courseId },
    });
  };

  const handleModuleChange = (field, value) => {
    setCurrentModule({ ...currentModule, [field]: value });
  };

  const addLesson = () => {
    const newLesson = contentService.createLesson();
    handleModuleChange('lessons', [...currentModule.lessons, newLesson]);
  };
  const removeLesson = (index) => {
    const newLessons = currentModule.lessons.filter((_, i) => i !== index);
    handleModuleChange('lessons', newLessons);
  };
  const handleLessonChange = (index, field, value) => {
    const newLessons = [...currentModule.lessons];
    newLessons[index] = { ...newLessons[index], [field]: value };
    handleModuleChange('lessons', newLessons);
  };
  const addResource = (lessonIndex, type) => {
    const newLessons = [...currentModule.lessons];
    const newResource = contentService.createResource(type);
    newLessons[lessonIndex].resources.push(newResource);
    handleModuleChange('lessons', newLessons);
  };
  const handleResourceChange = (lessonIndex, resourceIndex, value) => {
    const newLessons = [...currentModule.lessons];
    newLessons[lessonIndex].resources[resourceIndex].content = value;
    handleModuleChange('lessons', newLessons);
  };
  const removeResource = (lessonIndex, resourceId) => {
    const newLessons = [...currentModule.lessons];
    newLessons[lessonIndex].resources = newLessons[lessonIndex].resources.filter(
      (r) => r.id !== resourceId
    );
    handleModuleChange('lessons', newLessons);
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...currentModule.quiz.questions];
    newQuestions[qIndex] = { ...newQuestions[qIndex], [field]: value };
    handleModuleChange('quiz', { questions: newQuestions });
  };
  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...currentModule.quiz.questions];
    newQuestions[qIndex].options[oIndex] = value;
    handleModuleChange('quiz', { questions: newQuestions });
  };
  const addQuestion = () => {
    const newQuestion = contentService.createQuizQuestion();
    handleModuleChange('quiz', { questions: [...currentModule.quiz.questions, newQuestion] });
  };
  const removeQuestion = (qIndex) => {
    const newQuestions = currentModule.quiz.questions.filter((_, i) => i !== qIndex);
    handleModuleChange('quiz', { questions: newQuestions });
  };
  const addOption = (qIndex) => {
    const newQuestions = [...currentModule.quiz.questions];
    newQuestions[qIndex].options.push('');
    handleModuleChange('quiz', { questions: newQuestions });
  };
  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...currentModule.quiz.questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
    handleModuleChange('quiz', { questions: newQuestions });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 2:
        return (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-xl font-bold text-gray-800">Aulas do Módulo</h4>
              <button
                onClick={addLesson}
                className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                Adicionar Aula
              </button>
            </div>
            {currentModule.lessons.map((lesson, index) => (
              <LessonEditor
                key={index}
                lesson={lesson}
                index={index}
                onLessonChange={handleLessonChange}
                onRemoveLesson={removeLesson}
                onAddResource={addResource}
                onResourceChange={handleResourceChange}
                onRemoveResource={removeResource}
              />
            ))}
          </div>
        );
      case 3:
        return (
          <QuizEditor
            questions={currentModule.quiz.questions}
            onQuestionChange={handleQuestionChange}
            onOptionChange={handleOptionChange}
            onAddQuestion={addQuestion}
            onRemoveQuestion={removeQuestion}
            onAddOption={addOption}
            onRemoveOption={removeOption}
          />
        );
      default:
        return (
          <div>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="moduleTitle">
                Título do Módulo
              </label>
              <Input
                id="moduleTitle"
                type="text"
                placeholder="Ex: Introdução à Álgebra"
                value={currentModule.title}
                onChange={(e) => handleModuleChange('title', e.target.value)}
                required
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      />
      <div className={`flex flex-1 flex-col transition-all duration-300 ease-in-out`}>
        <Header
          user={user}
          toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
          onLogout={logout}
          leftPaddingClass={isSidebarCollapsed ? 'ml-12' : 'ml-60 lg:ml-52'}
        />
        <main className={`flex-grow p-6 ${isSidebarCollapsed ? 'ml-12' : 'ml-60 lg:ml-52'}`}>
          <Link
            to="/instructor/manage-content"
            state={{ courseId: moduleId ? currentModule.courseId : courseId }}
            className="mb-4 flex items-center text-sm font-semibold text-blue-600 hover:underline"
          >
            <ChevronLeftIcon className="mr-1 h-5 w-5" />
            Voltar para a Lista de Módulos
          </Link>
          <h2 className="mb-6 text-3xl font-bold text-gray-800">
            {moduleId ? 'Editar Módulo' : 'Criar Novo Módulo'}
          </h2>

          <div className="rounded-lg bg-white p-6 shadow-md md:p-8">
            <Stepper currentStep={currentStep} />
            {renderStepContent()}
            <div className="mt-8 flex justify-between border-t pt-6">
              <div>
                <Link
                  to="/instructor/manage-content"
                  state={{ courseId: moduleId ? currentModule.courseId : courseId }}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </Link>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="rounded-lg border border-gray-300 px-6 py-2 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>
                {currentStep < 3 ? (
                  <Button onClick={nextStep}>Próximo</Button>
                ) : (
                  <Button onClick={handleSaveModule}>
                    {moduleId ? 'Salvar Alterações' : 'Criar Módulo'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModuleEditor;
