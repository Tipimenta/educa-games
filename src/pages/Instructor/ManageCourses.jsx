import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { ClassSelector, Label, Textarea } from '../../components';
import AppLayout from '../../components/AppLayout';
import Button from '../../components/Button';
import { Trash2Icon } from '../../components/Icons';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import PageTitle from '../../components/PageTitle';
import { AuthContext, ClassesContext, CoursesContext, useConfirm } from '../../context';
import { useAuth, useClassSelection } from '../../hooks';

const ManageCoursesPage = () => {
  const { user } = useContext(AuthContext);
  const { courses, setCourses } = useContext(CoursesContext);
  const { classes } = useContext(ClassesContext);
  const { logout } = useAuth();
  const { confirm } = useConfirm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const classSelection = useClassSelection([]);

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (title.trim() === '') return;
    setCourses([
      ...courses,
      {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        assignedClasses: classSelection.selectedClasses,
      },
    ]);
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    classSelection.reset();
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await confirm({
        title: 'Remover Curso',
        message:
          'Tem a certeza que quer apagar este curso e todos os seus módulos associados? Esta ação não pode ser desfeita.',
        variant: 'danger',
        actionType: 'delete',
      });
      setCourses(courses.filter((c) => c.id !== courseId));
    } catch {
      // Usuário cancelou
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    classSelection.reset();
  };

  return (
    <AppLayout user={user} onLogout={logout}>
      <PageTitle>Gerir Cursos</PageTitle>
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

      <div className="mt-8 flex justify-center">
        <Button onClick={() => setIsModalOpen(true)} className="w-full px-6 sm:w-auto">
          + Novo Curso
        </Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Criar Novo Curso">
        <form onSubmit={handleAddCourse}>
          <div className="mb-4">
            <Label htmlFor="course-title">Título do Curso</Label>
            <Input
              id="course-title"
              placeholder="Ex: Matemática Financeira"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="course-description">Descrição</Label>
            <Textarea
              id="course-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          <Button type="submit">Criar Curso</Button>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default ManageCoursesPage;
