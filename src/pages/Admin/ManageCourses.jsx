import { useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '../../components/Button';
import Header from '../../components/Header';
import { Trash2Icon } from '../../components/Icons';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';

const ManageCoursesPage = ({ user, userRole, courses, setCourses, turmas }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', assignedTurmas: [] });
  const { logout } = useAuth();

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (newCourse.title.trim() === '') return;
    setCourses([...courses, { ...newCourse, id: Date.now() }]);
    setIsModalOpen(false);
    setNewCourse({ title: '', description: '', assignedTurmas: [] });
  };

  const handleDeleteCourse = (courseId) => {
    if (
      window.confirm('Tem a certeza que quer apagar este curso e todos os seus módulos associados?')
    ) {
      setCourses(courses.filter((c) => c.id !== courseId));
    }
  };

  const handleTurmaSelection = (turmaId) => {
    const { assignedTurmas } = newCourse;
    const isSelected = assignedTurmas.includes(turmaId);
    if (isSelected) {
      setNewCourse({ ...newCourse, assignedTurmas: assignedTurmas.filter((id) => id !== turmaId) });
    } else {
      setNewCourse({ ...newCourse, assignedTurmas: [...assignedTurmas, turmaId] });
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
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}
      >
        <Header
          user={user}
          toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
          onLogout={logout}
        />
        <main className="flex-grow p-6">
          <div className="flex items-center justify-between">
            <h2 className="mb-6 text-3xl font-bold text-gray-800">Gerir Cursos</h2>
          </div>

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
                    to="/admin/content"
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
        </main>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Novo Curso">
        <form onSubmit={handleAddCourse}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">Título do Curso</label>
            <Input
              placeholder="Ex: Matemática Financeira"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">Descrição</label>
            <textarea
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 p-2"
              rows="3"
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-700">Vincular às Turmas</label>
            <div className="space-y-2 rounded-lg border p-4">
              {turmas.map((turma) => (
                <div key={turma.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`turma-${turma.id}`}
                    checked={newCourse.assignedTurmas.includes(turma.id)}
                    onChange={() => handleTurmaSelection(turma.id)}
                    className="h-4 w-4 rounded"
                  />
                  <label htmlFor={`turma-${turma.id}`} className="ml-3 text-sm text-gray-700">
                    {turma.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit">Criar Curso</Button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCoursesPage;
