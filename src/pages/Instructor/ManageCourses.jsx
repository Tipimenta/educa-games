import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { ClassSelector, Label, Textarea } from '../../components';
import AppLayout from '../../components/AppLayout';
import Button from '../../components/Button';
import { Trash2Icon } from '../../components/Icons';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import PageTitle from '../../components/PageTitle';
import { AuthContext, ClassesContext, CoursesContext } from '../../context';
import { useAuth, useClassSelection, useConfirmDelete, useModalForm } from '../../hooks';

const ManageCoursesPage = () => {
  const { user } = useContext(AuthContext);
  const { courses, setCourses } = useContext(CoursesContext);
  const { classes } = useContext(ClassesContext);
  const { logout } = useAuth();
  const classSelection = useClassSelection([]);

  const modalForm = useModalForm({
    initialValues: { title: '', description: '' },
    onReset: () => {
      classSelection.reset();
    },
    onSubmit: (values, editingItem, closeModal) => {
      if (values.title.trim() === '') return;
      if (editingItem) {
        setCourses(
          courses.map((c) =>
            c.id === editingItem.id
              ? { ...c, ...values, assignedClasses: classSelection.selectedClasses }
              : c
          )
        );
      } else {
        setCourses([
          ...courses,
          {
            id: Date.now(),
            title: values.title.trim(),
            description: values.description.trim(),
            assignedClasses: classSelection.selectedClasses,
          },
        ]);
      }
      closeModal();
    },
  });

  const handleDeleteCourse = useConfirmDelete({
    onDelete: (courseId) => {
      setCourses(courses.filter((c) => c.id !== courseId));
    },
    title: 'Remover Curso',
    message:
      'Tem a certeza que quer apagar este curso e todos os seus módulos associados? Esta ação não pode ser desfeita.',
    successMessage: 'Curso removido com sucesso',
  });


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
        <Button onClick={modalForm.openCreateModal} className="w-full px-6 sm:w-auto">
          + Novo Curso
        </Button>
      </div>

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
          <Button type="submit">{modalForm.editingItem ? 'Salvar Alterações' : 'Criar Curso'}</Button>
        </form>
      </Modal>
    </AppLayout>
  );
};

export default ManageCoursesPage;
