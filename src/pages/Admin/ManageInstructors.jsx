import { Ban, CircleCheck, RotateCw, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

import {
  Button,
  ErrorMessage,
  Input,
  Modal,
  PageTitle,
  Pagination,
  SortableColumn,
} from '../../components';
import AppLayout from '../../components/AppLayout';
import { useAuth } from '../../hooks';
import { useToast } from '../../hooks/useToast';
import {
  initialActiveInstructors,
  initialInactiveInstructors,
  initialPendingInvites,
} from '../../mocks/data';
import { emailSchema } from '../../schemas/emailSchema';
import { isValid, validateSingleField } from '../../schemas/helpers';

const ManageInstructorsPage = ({ user, onLogout }) => {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState({ column: 'name', direction: 'asc' });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteEmailError, setInviteEmailError] = useState('');

  const [activeInstructors, setActiveInstructors] = useState([...initialActiveInstructors]);
  const [inactiveInstructors, setInactiveInstructors] = useState([...initialInactiveInstructors]);
  const [pendingInvites, setPendingInvites] = useState([...initialPendingInvites]);

  const handleSuspendInstructor = (id) => {
    const instructor = activeInstructors.find((i) => i.id === id);
    if (instructor && window.confirm(`Tem certeza que deseja inativar ${instructor.name}?`)) {
      setActiveInstructors((prev) => prev.filter((i) => i.id !== id));
      setInactiveInstructors((prev) => [...prev, instructor]);
    }
  };

  const handleReactivateInstructor = (id) => {
    const instructor = inactiveInstructors.find((i) => i.id === id);
    if (instructor && window.confirm(`Tem certeza que deseja reativar ${instructor.name}?`)) {
      setInactiveInstructors((prev) => prev.filter((i) => i.id !== id));
      setActiveInstructors((prev) => [...prev, instructor]);
    }
  };

  const handleRemoveInstructor = (id, isActive = true) => {
    const instructors = isActive ? activeInstructors : inactiveInstructors;
    const instructor = instructors.find((i) => i.id === id);
    if (
      instructor &&
      window.confirm(`Tem certeza que deseja remover ${instructor.name} permanentemente?`)
    ) {
      if (isActive) {
        setActiveInstructors((prev) => prev.filter((i) => i.id !== id));
      } else {
        setInactiveInstructors((prev) => prev.filter((i) => i.id !== id));
      }
    }
  };

  const handleResendInvite = (id) => {
    const invite = pendingInvites.find((i) => i.id === id);
    if (invite) {
      alert(`Convite reenviado para ${invite.email}`);
      setPendingInvites((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, sentAt: new Date().toISOString().split('T')[0] } : i
        )
      );
    }
  };

  const handleRemoveInvite = (id) => {
    const invite = pendingInvites.find((i) => i.id === id);
    if (
      invite &&
      window.confirm(`Tem certeza que deseja remover o convite para ${invite.email}?`)
    ) {
      setPendingInvites((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleOpenInviteModal = () => {
    setIsInviteModalOpen(true);
    setInviteEmail('');
    setInviteEmailError('');
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setInviteEmail('');
    setInviteEmailError('');
  };

  const isEmailValid = () => {
    return isValid(emailSchema, { email: inviteEmail.trim() });
  };

  const handleSendNewInvite = () => {
    const email = inviteEmail.trim();
    const emailError = validateSingleField(emailSchema, { email }, 'email');

    if (emailError) {
      setInviteEmailError(emailError);
      return;
    }

    const newInvite = {
      id: Date.now(),
      email: email,
      sentAt: new Date().toISOString().split('T')[0],
      status: 'Pendente',
    };

    setPendingInvites((prev) => [...prev, newInvite]);
    showToast({ message: `Convite enviado para ${email}`, type: 'success' });
    handleCloseInviteModal();
  };

  const getFilteredAndSortedData = () => {
    let data = [];
    switch (activeTab) {
      case 'active':
        data = activeInstructors;
        break;
      case 'inactive':
        data = inactiveInstructors;
        break;
      case 'invites':
        data = pendingInvites;
        break;
      default:
        data = [];
    }

    // Filtrar por busca
    if (searchTerm) {
      data = data.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Ordenar reutilizável por coluna/direção
    const key = sort.column;
    const dir = sort.direction === 'asc' ? 1 : -1;
    data.sort((a, b) => {
      const aVal = key === 'name' ? a.name || a.email || '' : a[key] || '';
      const bVal = key === 'name' ? b.name || b.email || '' : b[key] || '';
      return aVal.localeCompare(bVal) * dir;
    });

    return data;
  };

  const getPaginatedData = () => {
    const filteredData = getFilteredAndSortedData();
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      data: filteredData.slice(startIndex, endIndex),
      totalItems: filteredData.length,
      totalPages: Math.ceil(filteredData.length / pageSize),
    };
  };

  const renderTabContent = () => {
    const { data, totalItems } = getPaginatedData();

    if (data.length === 0) {
      return (
        <div className="rounded-lg bg-white shadow">
          <div className="py-8 text-center text-gray-500">
            {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum item encontrado'}
          </div>
        </div>
      );
    }

    return (
      <div className="mx-auto mt-2 max-w-[95%] overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {activeTab !== 'invites' && (
                <SortableColumn
                  columnKey="name"
                  label="Nome"
                  currentSort={sort}
                  className=""
                  align="left"
                  onSort={(column) => {
                    setSort((prev) => ({
                      column,
                      direction:
                        prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
                    }));
                    setCurrentPage(1);
                  }}
                />
              )}
              <SortableColumn
                columnKey="email"
                label="E-mail"
                currentSort={sort}
                className=""
                align="left"
                onSort={(column) => {
                  setSort((prev) => ({
                    column,
                    direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
                  }));
                  setCurrentPage(1);
                }}
              />
              {activeTab === 'invites' && (
                <SortableColumn
                  columnKey="status"
                  label="Status"
                  sortable={false}
                  currentSort={sort}
                  className=""
                  align="center"
                  onSort={() => {}}
                />
              )}
              <SortableColumn
                columnKey="actions"
                label="Ações"
                sortable={false}
                currentSort={sort}
                className=""
                align="center"
                onSort={() => {}}
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {activeTab !== 'invites' && (
                  <td className="px-6 py-4 text-left align-middle text-base font-medium text-gray-900">
                    {item.name}
                  </td>
                )}
                <td className="px-6 py-4 text-left align-middle text-base text-blue-600">
                  {item.email}
                </td>
                {activeTab === 'invites' && (
                  <td className="px-6 py-4 text-center align-middle text-base text-gray-500">
                    <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-yellow-800">
                      {item.status}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex items-center justify-center gap-1">
                    {activeTab === 'active' && (
                      <>
                        <button
                          onClick={() => handleSuspendInstructor(item.id)}
                          className="icon-aligned h-8 w-8 rounded text-yellow-600 hover:bg-gray-100 hover:text-yellow-900"
                          title="Inativar instrutor"
                        >
                          <Ban className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleRemoveInstructor(item.id, true)}
                          className="icon-aligned h-8 w-8 rounded text-red-600 hover:bg-gray-100 hover:text-red-900"
                          title="Excluir instrutor"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    {activeTab === 'inactive' && (
                      <>
                        <button
                          onClick={() => handleReactivateInstructor(item.id)}
                          className="icon-aligned h-8 w-8 rounded text-green-600 hover:bg-gray-100 hover:text-green-900"
                          title="Reativar instrutor"
                        >
                          <CircleCheck className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleRemoveInstructor(item.id, false)}
                          className="icon-aligned h-8 w-8 rounded text-red-600 hover:bg-gray-100 hover:text-red-900"
                          title="Excluir instrutor"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    {activeTab === 'invites' && (
                      <>
                        <button
                          onClick={() => handleResendInvite(item.id)}
                          className="icon-aligned h-8 w-8 rounded text-blue-600 hover:bg-gray-100 hover:text-blue-900"
                          title="Reenviar convite"
                        >
                          <RotateCw className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleRemoveInvite(item.id)}
                          className="icon-aligned h-8 w-8 rounded text-red-600 hover:bg-gray-100 hover:text-red-900"
                          title="Excluir convite"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>
    );
  };

  // Reset página quando mudar de aba ou filtros
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(parseInt(value));
    setCurrentPage(1);
  };

  return (
    <AppLayout user={user} onLogout={onLogout || logout} containerClassName="max-w-full">
      <div className="px-6">
        <PageTitle>Gerenciar Instrutores</PageTitle>

        {/* Tabs */}
        <div className="mb-8">
          <div className="mx-auto max-w-[95%] border-b border-gray-200">
            <nav className="-mb-px flex justify-center">
              <button
                onClick={() => handleTabChange('active')}
                className={`border-b-2 px-4 py-3 text-base font-medium transition-colors ${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Instrutores Ativos
              </button>
              <button
                onClick={() => handleTabChange('inactive')}
                className={`border-b-2 px-4 py-3 text-base font-medium transition-colors ${
                  activeTab === 'inactive'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Instrutores Inativos
              </button>
              <button
                onClick={() => handleTabChange('invites')}
                className={`border-b-2 px-4 py-3 text-base font-medium transition-colors ${
                  activeTab === 'invites'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Convites Pendentes
              </button>
            </nav>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="mx-auto mb-6 flex max-w-[95%] flex-col justify-between gap-4 sm:flex-row">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Pesquisar instrutores por nome ou e-mail"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="bg-white pl-10"
              />
            </div>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="custom-select rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value={5}>5 ITENS</option>
              <option value={10}>10 ITENS</option>
              <option value={20}>20 ITENS</option>
              <option value={50}>50 ITENS</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'invites' && (
              <Button onClick={handleOpenInviteModal} className="px-6 whitespace-nowrap sm:w-auto">
                + Enviar Convite
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {renderTabContent()}

        {/* Modal de Novo Convite */}
        <Modal
          isOpen={isInviteModalOpen}
          onClose={handleCloseInviteModal}
          title="Enviar Novo Convite"
          showCloseButton={false}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="invite-email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                E-mail do instrutor
              </label>
              <Input
                id="invite-email"
                type="email"
                placeholder="instrutor@exemplo.com"
                value={inviteEmail}
                onChange={(e) => {
                  const value = e.target.value;
                  setInviteEmail(value);
                  const error = validateSingleField(emailSchema, { email: value.trim() }, 'email');
                  setInviteEmailError(error || '');
                }}
                className={inviteEmailError ? 'border-red-500' : ''}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isEmailValid()) {
                    handleSendNewInvite();
                  }
                }}
              />
              {inviteEmailError && <ErrorMessage message={inviteEmailError} />}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                onClick={handleCloseInviteModal}
                className="w-auto bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSendNewInvite}
                disabled={!isEmailValid()}
                className="w-auto bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Enviar Convite
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default ManageInstructorsPage;
