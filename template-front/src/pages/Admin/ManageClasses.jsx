import React, { useState } from 'react';

import Button from '../../components/Button';
import Header from '../../components/Header';
import { CheckIcon, PencilIcon, Trash2Icon, XIcon } from '../../components/Icons';
import Input from '../../components/Input';
import Sidebar from '../../components/Sidebar';

const ManageClassesPage = ({ user, userRole, onLogout, turmas, setTurmas }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);


  const [newClassName, setNewClassName] = useState('');

 
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleAddClass = (e) => {
    e.preventDefault();
    if (newClassName.trim() === '') return;
    setTurmas([...turmas, { id: Date.now(), name: newClassName.trim() }]);
    setNewClassName('');
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm('Tem a certeza que deseja apagar esta turma?')) {
      setTurmas(turmas.filter((t) => t.id !== classId));
    }
  };

  const handleEditClick = (turma) => {
    setEditingId(turma.id);
    setEditingName(turma.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = () => {
    if (editingName.trim() === '') return;
    setTurmas(turmas.map((t) => (t.id === editingId ? { ...t, name: editingName } : t)));
    handleCancelEdit(); 
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
          onLogout={onLogout}
        />
        <main className="flex-grow p-6">
          <h2 className="mb-6 text-3xl font-bold text-gray-800">Gerir Turmas</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-gray-800">Criar Nova Turma</h3>
              <form onSubmit={handleAddClass}>
                <Input
                  placeholder="Nome da Turma (ex: Bootcamp 2026)"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
                <Button type="submit">Adicionar Turma</Button>
              </form>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-gray-800">Turmas Existentes</h3>
              <ul className="space-y-2">
                {turmas.length > 0 ? (
                  turmas.map((turma) => (
                    <li
                      key={turma.id}
                      className="flex h-[58px] items-center justify-between rounded-md bg-gray-50 p-3"
                    >
                      {editingId === turma.id ? (
                  
                        <>
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="my-0 mr-2"
                            autoFocus
                          />
                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleSaveEdit}
                              className="text-green-600 hover:text-green-800"
                            >
                              <CheckIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-500 hover:text-red-700"
                            >
                              <XIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </>
                      ) : (
                    
                        <>
                          <span className="font-medium text-gray-700">{turma.name}</span>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleEditClick(turma)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClass(turma.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2Icon className="h-5 w-5" />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Nenhuma turma criada ainda.</p>
                )}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageClassesPage;
