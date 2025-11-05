import { useContext } from 'react';
import { Link } from 'react-router-dom';

import {
  AppLayout,
  Button,
  ClassSelector,
  EmptyState,
  Input,
  Label,
  Modal,
  PageTitle,
  Textarea,
  Trash2Icon,
} from '../../components';
import { AuthContext } from '../../context';
import {
  useAuth,
  useClassrooms,
  useClassSelection,
  useConfirmDelete,
  useCourses,
  useCreateCourse,
  useDeleteCourse,
  useModalForm,
  useUpdateCourse,
} from '../../hooks';

const ManageCoursesPage = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const { data: courses = [], isLoading: isLoadingCourses } = useCourses();
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();
  const classSelection = useClassSelection([]);
  const { data: classes = [], refetch: refetchClassrooms } = useClassrooms({
    enabled: false, // Só carregar quando o modal abrir
  });

  const modalForm = useModalForm({
    initialValues: { title: '', description: '' },
    onReset: () => {
      classSelection.reset();
    },
    onSubmit: async (values, editingItem, closeModal) => {
      if (values.title.trim() === '') return;
      if (editingItem) {
        await updateCourseMutation.mutateAsync({
          id: editingItem.id,
          data: {
            ...values,
            assignedClasses: classSelection.selectedClasses,
          },
        });
      } else {
        await createCourseMutation.mutateAsync({
          ...values,
          assignedClasses: classSelection.selectedClasses,
        });
      }
      closeModal();
    },
  });

  const handleDeleteCourse = useConfirmDelete({
    onDelete: async (courseId) => {
      await deleteCourseMutation.mutateAsync(courseId);
    },
    title: 'Remover Curso',
    message:
      'Tem a certeza que quer apagar este curso e todos os seus módulos associados? Esta ação não pode ser desfeita.',
    successMessage: 'Curso removido com sucesso',
  });

  if (isLoadingCourses) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <PageTitle>Gerir Cursos</PageTitle>
        <div className="text-center">
          <p className="text-gray-600">Carregando cursos...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onLogout={logout}>
      <PageTitle>Gerir Cursos</PageTitle>

      {courses.length === 0 ? (
        <EmptyState
          message="Nenhum curso encontrado"
          description="Comece criando seu primeiro curso para organizar seus módulos e conteúdos."
          action={
            <Button
              onClick={() => {
                refetchClassrooms();
                modalForm.openCreateModal();
              }}
              className="w-auto px-6"
            >
              + Novo Curso
            </Button>
          }
          className="mt-4"
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-md"
          >
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">{course.title}</h3>
              <p className="mb-4 text-sm text-gray-600">{course.description}</p>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <Link
                to="/instructor/manage-content"
                state={{ courseId: course.id }}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Ver Módulos
              </Link>
              <button
                onClick={() => handleDeleteCourse(course.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2Icon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {courses.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => {
              refetchClassrooms();
              modalForm.openCreateModal();
            }}
            className="w-full px-6 sm:w-auto"
          >
            + Novo Curso
          </Button>
        </div>
      )}

      <Modal
        isOpen={modalForm.isOpen}
        onClose={modalForm.closeModal}
        title={modalForm.editingItem ? 'Editar Curso' : 'Criar Novo Curso'}
      >
        <form onSubmit={modalForm.handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="course-title">Título do Curso</Label>
            <Input
              id="course-title"
              placeholder="Ex: Matemática Financeira"
              value={modalForm.formValues.title}
              onChange={(e) => modalForm.updateFormValue('title', e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="course-description">Descrição</Label>
            <Textarea
              id="course-description"
              value={modalForm.formValues.description}
              onChange={(e) => modalForm.updateFormValue('description', e.target.value)}
              rows={3}
            />
          </div>
          <div className="mb-6">
            <Label>Vincular às Turmas</Label>
            <ClassSelector
              classes={classes}
              selectedClasses={classSelection.selectedClasses}
              onChange={classSelection.setSelectedClasses}
              namePrefix="course-class"
            />
          </div>
          <Button type="submit">
            {modalForm.editingItem ? 'Salvar Alterações' : 'Criar Curso'}
          </Button>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default ManageCoursesPage;
