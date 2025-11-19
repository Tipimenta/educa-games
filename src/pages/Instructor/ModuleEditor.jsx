import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { AppLayout, Button, ChevronLeftIcon, ConfirmationDialog, Input, Stepper } from '../../components';
import { AuthContext } from '../../context';
import { useAuth, useCourses, useCreateModule, useModule, useToast, useUpdateModule } from '../../hooks';
import { isValid } from '../../schemas/helpers';
import { lessonPointsSchema, lessonTitleSchema } from '../../schemas/lessonSchema';
import { quizSchema } from '../../schemas/quizSchema';
import { modulesService } from '../../services';
import { LessonEditor, QuizEditor } from './components';

  const ModuleEditor = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const { showToast } = useToast();
  const { data: courses = [] } = useCourses();
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: moduleData } = useModule(moduleId ? parseInt(moduleId) : undefined);
  const createModuleMutation = useCreateModule();
  const updateModuleMutation = useUpdateModule();

  const courseId = location.state?.courseId;

  const [currentModule, setCurrentModule] = useState({
    title: '',
    lessons: [],
    quiz: { questions: [] },
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [moduleTitleError, setModuleTitleError] = useState('');
  const [linkedCourseIds, setLinkedCourseIds] = useState([]);
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  const coursesDropdownRef = useRef(null);
  const [coursesPage, setCoursesPage] = useState(0);
  const [isSavingLessons, setIsSavingLessons] = useState(false);
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [savedLessonsState, setSavedLessonsState] = useState(null);
  const COURSES_PAGE_SIZE = 8;
  const handleCoursesScroll = (e) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 16;
    if (nearBottom) {
      setCoursesPage((p) => ((p + 1) * COURSES_PAGE_SIZE >= courses.length ? p : p + 1));
    }
  };

  useEffect(() => {
    if (moduleData) {
      const cloned = JSON.parse(JSON.stringify(moduleData));
      cloned.lessons = (cloned.lessons || []).map((lesson) => ({
        ...lesson,
        resources: Array.isArray(lesson.resources) ? lesson.resources : [],
      }));
      cloned.quiz = {
        questions: Array.isArray(cloned.quiz?.questions) ? cloned.quiz.questions : [],
      };
      setCurrentModule(cloned);
      // Salvar estado inicial das aulas para comparação
      setSavedLessonsState(JSON.stringify(cloned.lessons));
      if (cloned.courseId) {
        setLinkedCourseIds([cloned.courseId]);
      }
    }
  }, [moduleData]);

  useEffect(() => {
    if (location.state?.step && moduleId) {
      setCurrentStep(location.state.step);
      const courseIdFromState = location.state.courseId;
      navigate(location.pathname, { replace: true, state: courseIdFromState ? { courseId: courseIdFromState } : undefined });
    }
  }, [moduleId, location.state?.step, location.pathname, navigate]);

  useEffect(() => {
    if (!moduleId && courseId && linkedCourseIds.length === 0) {
      setLinkedCourseIds([courseId]);
    }
  }, [moduleId, courseId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isCoursesDropdownOpen &&
        coursesDropdownRef.current &&
        !coursesDropdownRef.current.contains(e.target)
      ) {
        setIsCoursesDropdownOpen(false);
        setCoursesPage(0);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCoursesDropdownOpen]);

  const purgeDeletedResources = (moduleObj) => {
    const cloned = JSON.parse(JSON.stringify(moduleObj));
    cloned.lessons = (cloned.lessons || []).map((lesson) => ({
      ...lesson,
      resources: (lesson.resources || []).filter((r) => !r.deleted),
    }));
    return cloned;
  };
  const nextStep = () => {
    setCurrentModule((prev) => {
      const sanitized = purgeDeletedResources(prev);
      // Atualizar estado salvo quando avançar do step 2
      if (currentStep === 2) {
        setSavedLessonsState(JSON.stringify(sanitized.lessons));
      }
      return sanitized;
    });
    setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
  };

  const hasUnsavedChanges = () => {
    if (currentStep !== 2) return false;
    // Se não há módulo salvo ainda, verificar se há aulas adicionadas
    if (!moduleId || savedLessonsState === null) {
      const lessons = currentModule.lessons || [];
      return lessons.length > 0;
    }
    const sanitized = purgeDeletedResources(currentModule);
    const currentState = JSON.stringify(sanitized.lessons);
    return currentState !== savedLessonsState;
  };

  const handlePrevStep = () => {
    if (currentStep === 2 && hasUnsavedChanges()) {
      setShowDiscardDialog(true);
    } else {
      prevStep();
    }
  };

  const handleDiscardChanges = () => {
    // Restaurar estado salvo
    if (moduleData && savedLessonsState !== null) {
      const restoredLessons = JSON.parse(savedLessonsState);
      setCurrentModule((prev) => ({
        ...prev,
        lessons: restoredLessons,
      }));
    } else {
      // Se não há módulo salvo, limpar as aulas
      setCurrentModule((prev) => ({
        ...prev,
        lessons: [],
      }));
    }
    setShowDiscardDialog(false);
    prevStep();
  };

  const prevStep = () => {
    setCurrentModule((prev) => purgeDeletedResources(prev));
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleSaveModuleAndNext = async () => {
    if (createModuleMutation.isPending || updateModuleMutation.isPending) {
      return;
    }

    const selectedCourseId = linkedCourseIds.length > 0 ? linkedCourseIds[0] : null;
    try {
      let savedModuleId = moduleId;
      if (moduleId) {
        const payload = {
          title: currentModule.title,
          courseId: selectedCourseId || null,
        };
        await updateModuleMutation.mutateAsync({ id: parseInt(moduleId), data: payload });
        savedModuleId = parseInt(moduleId);
        showToast({ message: 'Módulo salvo com sucesso.', type: 'success' });
        nextStep();
      } else {
        const payload = {
          title: currentModule.title,
          courseId: selectedCourseId || null,
          lessons: [],
        };
        const result = await createModuleMutation.mutateAsync(payload);
        savedModuleId = result?.data?.data ?? result?.data ?? result;
        showToast({ message: 'Módulo salvo com sucesso.', type: 'success' });
        // Inicializar estado salvo para novo módulo (sem aulas ainda)
        setSavedLessonsState(JSON.stringify([]));
        navigate(`/instructor/module-editor/${savedModuleId}`, { replace: true, state: { courseId, step: 2 } });
      }
    } catch (err) {
      showToast({ message: 'Falha ao salvar módulo. Tente novamente.', type: 'error' });
    }
  };

  const handleSaveLessonsAndNext = async () => {
    if (!moduleId) {
      showToast({ message: 'Salve o módulo primeiro antes de adicionar aulas.', type: 'error' });
      setCurrentStep(1);
      return;
    }

    if (isSavingLessons) {
      return;
    }

    setIsSavingLessons(true);
    try {
      const files = [];
      const lessonsForSave = (currentModule.lessons || []).map((lesson) => {
        const resources = (lesson.resources || []).filter((r) => !r.deleted).map((resource) => {
          if (resource.file && resource.file instanceof File) {
            files.push(resource.file);
            return {
              id: resource.id,
              type: resource.type,
              label: resource.label,
              content: '',
            };
          }
          return {
            id: resource.id,
            type: resource.type,
            label: resource.label,
            content: resource.content || '',
          };
        });
        return {
          id: lesson.id,
          title: lesson.title,
          points: lesson.points,
          description: lesson.description,
          resources: resources,
        };
      });

      const sanitizedCurrent = purgeDeletedResources(currentModule);

      await modulesService.updateLessons(parseInt(moduleId), lessonsForSave, files.length > 0 ? files : null);
      showToast({ message: 'Aulas salvas com sucesso.', type: 'success' });
      // Atualizar estado salvo após salvar
      setSavedLessonsState(JSON.stringify(sanitizedCurrent.lessons));
      nextStep();
    } catch (err) {
      showToast({ message: 'Falha ao salvar aulas. Tente novamente.', type: 'error' });
    } finally {
      setIsSavingLessons(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!moduleId) {
      showToast({ message: 'Salve o módulo primeiro antes de adicionar quiz.', type: 'error' });
      setCurrentStep(1);
      return;
    }

    if (isSavingQuiz) {
      return;
    }

    setCurrentModule((prev) => purgeDeletedResources(prev));
    const sanitizedCurrent = purgeDeletedResources(currentModule);

    const hasQuiz = sanitizedCurrent.quiz?.questions?.length > 0;

    if (!hasQuiz) {
      showToast({ message: 'Módulo salvo com sucesso. (Quiz não foi adicionado)', type: 'success' });
      navigate('/instructor/manage-content');
      return;
    }

    const quizValidation = quizSchema.safeParse(sanitizedCurrent.quiz);
    if (!quizValidation.success) {
      const firstError = quizValidation.error.issues[0];
      showToast({ message: firstError.message || 'Erro de validação no quiz', type: 'error' });
      return;
    }

    setIsSavingQuiz(true);
    try {
      const moduleData = await modulesService.getById(parseInt(moduleId));
      if (moduleData?.quiz?.id) {
        await modulesService.updateQuiz(parseInt(moduleId), sanitizedCurrent.quiz);
        showToast({ message: 'Quiz atualizado com sucesso.', type: 'success' });
      } else {
        await modulesService.createQuiz(parseInt(moduleId), sanitizedCurrent.quiz);
        showToast({ message: 'Quiz criado com sucesso.', type: 'success' });
      }
      navigate('/instructor/manage-content');
    } catch (err) {
      showToast({ message: 'Falha ao salvar quiz. Tente novamente.', type: 'error' });
    } finally {
      setIsSavingQuiz(false);
    }
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
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = currentModule.lessons.map((l, idx) => l.id ?? idx);
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(currentModule.lessons, oldIndex, newIndex);
    handleModuleChange('lessons', reordered);
  };
  const handleLessonChange = (index, field, value) => {
    const newLessons = [...currentModule.lessons];
    newLessons[index] = { ...newLessons[index], [field]: value };
    handleModuleChange('lessons', newLessons);
  };
  const addResource = (lessonIndex, type, init = {}) => {
    const newLessons = [...currentModule.lessons];
    const newResource = {
      id: Date.now(),
      type,
      content: typeof init.content === 'string' ? init.content : '',
      label: typeof init.label === 'string' ? init.label : '',
      file: init.file || null,
    };
    const prevLesson = newLessons[lessonIndex] || {};
    const prevResources = Array.isArray(prevLesson.resources) ? prevLesson.resources : [];
    const nextResources = [...prevResources, newResource];
    newLessons[lessonIndex] = { ...prevLesson, resources: nextResources };
    handleModuleChange('lessons', newLessons);
  };
  const updateResource = (lessonIndex, resourceId, updates = {}) => {
    const newLessons = [...currentModule.lessons];
    const prevLesson = newLessons[lessonIndex];
    if (!prevLesson || !Array.isArray(prevLesson.resources)) return;
    const nextResources = (prevLesson.resources || []).map((r) => {
      if (r.id === resourceId) {
        const updated = { ...r, ...updates };
        if (updates.file === null && r.file) {
          updated.file = null;
        } else if (updates.file) {
          updated.file = updates.file;
        }
        return updated;
      }
      return r;
    });
    newLessons[lessonIndex] = { ...prevLesson, resources: nextResources };
    handleModuleChange('lessons', newLessons);
  };
  const handleResourceChange = (lessonIndex, resourceIndex, value) => {
    const newLessons = [...currentModule.lessons];
    const prevLesson = newLessons[lessonIndex];
    if (!prevLesson || !Array.isArray(prevLesson.resources)) return;
    const prevResources = prevLesson.resources;
    if (!prevResources[resourceIndex]) return;
    const nextResources = [...prevResources];
    nextResources[resourceIndex] = { ...nextResources[resourceIndex], content: value };
    newLessons[lessonIndex] = { ...prevLesson, resources: nextResources };
    handleModuleChange('lessons', newLessons);
  };
  const removeResource = (lessonIndex, resourceId, resourceIndex) => {
    const newLessons = [...currentModule.lessons];
    const prevLesson = newLessons[lessonIndex];
    if (!prevLesson || !Array.isArray(prevLesson.resources)) return;

    const nextResources = (prevLesson.resources || []).map((r, i) => {
      const match = resourceId != null ? r.id === resourceId : typeof resourceIndex === 'number' ? i === resourceIndex : false;
      return match ? { ...r, deleted: true } : r;
    });
    newLessons[lessonIndex] = { ...prevLesson, resources: nextResources };
    handleModuleChange('lessons', newLessons);
  };

  const restoreResource = (lessonIndex, resourceId, resourceIndex) => {
    const newLessons = [...currentModule.lessons];
    const prevLesson = newLessons[lessonIndex];
    if (!prevLesson || !Array.isArray(prevLesson.resources)) return;
    const nextResources = (prevLesson.resources || []).map((r, i) => {
      const match = resourceId != null ? r.id === resourceId : typeof resourceIndex === 'number' ? i === resourceIndex : false;
      return match ? { ...r, deleted: false } : r;
    });
    newLessons[lessonIndex] = { ...prevLesson, resources: nextResources };
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
    const newQuestion = { id: Date.now(), text: '', options: [], correctAnswer: '', points: 10 };
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
              <Button className="px-6 whitespace-nowrap sm:w-auto" onClick={addLesson}>+ Nova aula</Button>
            </div>
            {currentModule.lessons.length === 0 && (
              <p className="mb-4 text-sm text-gray-600">
                Nenhuma aula criada. Clique em “+ Nova aula” para começar.
              </p>
            )}
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext
                items={currentModule.lessons.map((l, idx) => l.id ?? idx)}
                strategy={verticalListSortingStrategy}
              >
                {currentModule.lessons.map((lesson, index) => (
                  <LessonEditor
                    key={lesson.id ?? index}
                    id={lesson.id ?? index}
                    moduleId={moduleId ? parseInt(moduleId) : undefined}
                    lesson={lesson}
                    index={index}
                    onLessonChange={handleLessonChange}
                    onRemoveLesson={removeLesson}
                    onAddResource={addResource}
                    onResourceChange={handleResourceChange}
                    onRemoveResource={removeResource}
                    onRestoreResource={restoreResource}
                    onUpdateResource={updateResource}
                  />
                ))}
              </SortableContext>
            </DndContext>
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
                onBlur={(e) => {
                  const v = e.target.value || '';
                  const len = v.trim().length;
                  if (len === 0) {
                    setModuleTitleError('Preencha este campo.');
                  } else if (len < 2) {
                    setModuleTitleError('O título precisa ter pelo menos 2 caracteres.');
                  } else if (len > 120) {
                    setModuleTitleError('Excedeu o limite de 120 caracteres.');
                  } else {
                    setModuleTitleError('');
                  }
                }}
                error={!!moduleTitleError}
              />
              {moduleTitleError && (
                <p className="mt-2 text-sm text-red-600">{moduleTitleError}</p>
              )}
            </div>
            <div className="mb-6" ref={coursesDropdownRef}>
              <label className="mb-2 block text-sm font-bold text-gray-700">Cursos vinculados</label>
              <div className="relative">
                <div
                  role="button"
                  tabIndex={0}
                  className={`flex w-full min-h-[48px] items-center justify-between bg-white px-3 py-2 text-gray-800 hover:bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                    isCoursesDropdownOpen ? 'rounded-t-md rounded-b-none' : 'rounded-md'
                  }`}
                  onClick={() => setIsCoursesDropdownOpen((prev) => !prev)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsCoursesDropdownOpen((prev) => !prev);
                    }
                  }}
                >
                  <div className="flex flex-1 flex-wrap gap-2">
                    {linkedCourseIds.length === 0 && (
                      <span className="text-gray-500">Selecione cursos...</span>
                    )}
                    {linkedCourseIds.map((cid) => {
                      const course = courses.find((c) => c.id === cid);
                      const title = course?.title || `Curso #${cid}`;
                      return (
                        <span
                          key={`chip-${cid}`}
                          className="inline-flex items-center gap-2 rounded border border-blue-200 bg-blue-50 px-2 py-1 text-sm text-blue-700"
                        >
                          {title}
                          <span
                            role="button"
                            tabIndex={0}
                            className="rounded bg-blue-100 px-1 text-blue-700 hover:bg-blue-200"
                            title="Remover curso"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setLinkedCourseIds((prev) => prev.filter((id) => id !== cid));
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                setLinkedCourseIds((prev) => prev.filter((id) => id !== cid));
                              }
                            }}
                          >
                            ×
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
                {isCoursesDropdownOpen && (
                  <div className="absolute left-0 top-full z-20 w-full rounded-b-md rounded-t-none bg-white shadow-sm">
                    <ul className="max-h-64 overflow-auto" onScroll={handleCoursesScroll}>
                      {courses
                        .slice(0, (coursesPage + 1) * COURSES_PAGE_SIZE)
                        .map((c) => {
                          const isSelected = linkedCourseIds.includes(c.id);
                          return (
                            <li key={`opt-${c.id}`} className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-50">
                            <button
                              type="button"
                              className={`text-left flex-1 ${isSelected ? 'text-gray-600' : 'text-gray-800'}`}
                              onClick={() => {
                                setLinkedCourseIds((prev) =>
                                  prev.includes(c.id) ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                                );
                              }}
                            >
                              {c.title}
                            </button>
                            {isSelected && (
                              <button
                                type="button"
                                className="ml-3 rounded bg-gray-100 px-2 text-gray-700 hover:bg-gray-200"
                                title="Remover"
                                onClick={() => setLinkedCourseIds((prev) => prev.filter((id) => id !== c.id))}
                              >
                                ×
                              </button>
                            )}
                          </li>
                        );
                        })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  const hasQuizErrors = currentModule?.quiz?.questions?.length > 0
    ? !isValid(quizSchema, currentModule.quiz)
    : false;

  const moduleTitleInvalid = !!moduleTitleError || !((currentModule?.title || '').trim().length > 0);
  const isSaving = createModuleMutation.isPending || updateModuleMutation.isPending;
  const disableSave = moduleTitleInvalid || hasQuizErrors || isSaving;

  // Validar se todas as aulas têm título e pontuação válidos
  const validateAllLessons = () => {
    if (currentStep !== 2) return true;
    const lessons = currentModule.lessons || [];
    if (lessons.length === 0) return true; // Permite salvar sem aulas

    return lessons.every((lesson) => {
      const titleValid = lessonTitleSchema.safeParse({ title: lesson.title || '' }).success;
      const pointsValid = lessonPointsSchema.safeParse({ points: lesson.points }).success;
      return titleValid && pointsValid;
    });
  };

  const allLessonsValid = validateAllLessons();
  const canSaveLessons = allLessonsValid && !isSavingLessons;

  return (
    <AppLayout user={user} onLogout={logout} containerClassName="max-w-full">
      <Link
        to="/instructor/manage-content"
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
        <div className="mt-4 flex justify-between pt-3">
          <div>
            <Link
              to="/instructor/manage-content"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </Link>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="rounded-lg border border-gray-300 px-6 py-2 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            {currentStep === 1 ? (
              <Button
                onClick={handleSaveModuleAndNext}
                className="w-auto px-6 py-2"
                disabled={moduleTitleInvalid || isSaving}
              >
                {isSaving ? 'Salvando...' : 'Salvar e Próxima Página'}
              </Button>
            ) : currentStep === 2 ? (
              <Button
                onClick={handleSaveLessonsAndNext}
                className="w-auto px-6 py-2"
                disabled={!canSaveLessons}
              >
                {isSavingLessons ? 'Salvando...' : 'Salvar e Próxima Página'}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSaveQuiz}
                  className="w-auto px-6 py-2 whitespace-nowrap"
                  disabled={hasQuizErrors || isSavingQuiz}
                >
                  {isSavingQuiz ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <Button
                  onClick={() => navigate('/instructor/manage-content')}
                  className="w-auto px-6 py-2 bg-gray-500 hover:bg-gray-600 whitespace-nowrap"
                  disabled={isSavingQuiz}
                >
                  Pular Quiz
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dialog de confirmação para descartar alterações */}
      <ConfirmationDialog
        isOpen={showDiscardDialog}
        onClose={() => setShowDiscardDialog(false)}
        onConfirm={handleDiscardChanges}
        title="Descartar Alterações?"
        message="Todas as alterações não salvas serão perdidas. Deseja continuar?"
        variant="warning"
        confirmText="Sim, descartar"
        cancelText="Não"
      />
    </AppLayout>
  );
};

export default ModuleEditor;
