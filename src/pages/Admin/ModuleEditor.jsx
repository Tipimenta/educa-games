import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import Button from '../../components/Button';
import Header from '../../components/Header';
import { ChevronLeftIcon, PlusCircleIcon, Trash2Icon } from '../../components/Icons';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar';
import Stepper from '../../components/Stepper';

const ModuleEditor = ({ user, userRole, onLogout, modules, setModules }) => {
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
      alert("Nenhum curso selecionado. Volte à página de Módulos e clique em 'Novo Módulo'.");
      navigate('/admin/content');
    }
  }, [moduleId, modules, courseId, navigate]);

  const nextStep = () => setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
  const prevStep = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));

  const handleSaveModule = () => {
    if (moduleId) {
      setModules(modules.map((m) => (m.id === parseInt(moduleId) ? currentModule : m)));
    } else {
      const newModule = { ...currentModule, id: Date.now(), courseId: courseId };
      setModules([...modules, newModule]);
    }
    navigate('/admin/content', {
      state: { courseId: moduleId ? currentModule.courseId : courseId },
    });
  };

  const handleModuleChange = (field, value) => {
    setCurrentModule({ ...currentModule, [field]: value });
  };

  const addLesson = () => {
    const newLesson = { id: Date.now(), title: '', points: 5, description: '', resources: [] };
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
    const newResource = { id: Date.now(), type, content: '' };
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
    const newQuestion = {
      id: Date.now(),
      text: '',
      options: ['', ''],
      correctAnswer: '',
      points: 10,
    };
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
                <PlusCircleIcon className="mr-1 h-5 w-5" /> Adicionar Aula
              </button>
            </div>
            {currentModule.lessons.map((lesson, index) => (
              <div key={index} className="mb-6 rounded-lg border bg-gray-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-bold text-gray-700">Aula {index + 1}</span>
                  <button onClick={() => removeLesson(index)}>
                    <Trash2Icon className="h-5 w-5 text-red-500 hover:text-red-700" />
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-5">
                  <div className="md:col-span-4">
                    <label className="text-xs font-medium text-gray-500">Título da Aula</label>
                    <Input
                      value={lesson.title}
                      onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Pontos da Aula</label>
                    <Input
                      type="number"
                      value={lesson.points || 0}
                      onChange={(e) =>
                        handleLessonChange(index, 'points', parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-xs font-medium text-gray-500">
                    Descrição / Conteúdo Principal
                  </label>
                  <textarea
                    value={lesson.description}
                    onChange={(e) => handleLessonChange(index, 'description', e.target.value)}
                    rows="4"
                    className="w-full rounded-lg border bg-white p-2 text-gray-700"
                  />
                </div>
                <div className="mt-4">
                  <h5 className="mb-2 text-sm font-bold text-gray-600">Recursos da Aula</h5>
                  {lesson.resources &&
                    lesson.resources.map((resource, resIndex) => (
                      <div key={resource.id} className="mb-2 flex items-center gap-2">
                        {resource.type === 'youtube' && (
                          <Input
                            placeholder="URL do YouTube (ex: https://youtu.be/ID_DO_VIDEO)"
                            value={resource.content}
                            onChange={(e) => handleResourceChange(index, resIndex, e.target.value)}
                          />
                        )}
                        {resource.type === 'pdf' && <Input type="file" />}
                        <button onClick={() => removeResource(index, resource.id)}>
                          <Trash2Icon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                  <div className="mt-2 flex gap-4">
                    <button
                      onClick={() => addResource(index, 'youtube')}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      + Vídeo do YouTube
                    </button>
                    <button
                      onClick={() => addResource(index, 'pdf')}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      + Ficheiro PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-xl font-bold text-gray-800">Questionário</h4>
              <button
                onClick={addQuestion}
                className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                <PlusCircleIcon className="mr-1 h-5 w-5" /> Adicionar Pergunta
              </button>
            </div>
            {currentModule.quiz.questions.map((q, qIndex) => (
              <div key={qIndex} className="mb-4 rounded-lg border bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-bold text-gray-700">Pergunta {qIndex + 1}</span>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-500">Pontos</label>
                    <Input
                      type="number"
                      value={q.points || 0}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, 'points', parseInt(e.target.value, 10) || 0)
                      }
                      className="w-24"
                    />
                    <button onClick={() => removeQuestion(qIndex)}>
                      <Trash2Icon className="h-5 w-5 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                </div>
                <textarea
                  placeholder="Texto da pergunta"
                  value={q.text}
                  onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                  className="mb-2 w-full rounded-lg border bg-white p-2"
                />
                <h5 className="mb-2 text-sm font-bold">Opções (marque a correta):</h5>
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="mb-2 flex items-center">
                    <input
                      type="radio"
                      name={`q_${qIndex}_correct`}
                      checked={q.correctAnswer === opt}
                      onChange={() => handleQuestionChange(qIndex, 'correctAnswer', opt)}
                      className="mr-2 h-4 w-4"
                    />
                    <Input
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      className="mx-2 flex-grow"
                    />
                    <button onClick={() => removeOption(qIndex, oIndex)}>
                      <Trash2Icon className="h-4 w-4 text-gray-500 hover:text-red-600" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addOption(qIndex)}
                  className="mt-1 text-xs font-semibold text-blue-600 hover:underline"
                >
                  + Adicionar Opção
                </button>
              </div>
            ))}
          </div>
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
        userRole={userRole}
      />
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Header
          user={user}
          toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
          onLogout={onLogout}
        />
        <main className="flex-grow p-6">
          <Link
            to="/admin/content"
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
                  to="/admin/content"
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
