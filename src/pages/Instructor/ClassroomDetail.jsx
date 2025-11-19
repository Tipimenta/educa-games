import { Ban, CircleCheck, RotateCw, Trash2, Unlink } from 'lucide-react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  ActionButton,
  AppLayout,
  Breadcrumb,
  Button,
  ConfirmationDialog,
  DataTable,
  EmptyState,
  ErrorMessage,
  FormattedDate,
  Input,
  Label,
  Modal,
  MoreHorizontalIcon,
  PageSizeSelector,
  PageTitle,
  SearchInput,
  StatusBadge,
  Tabs,
  Textarea,
} from '../../components';
import { AuthContext } from '../../context';
import { useAttachCoursesToClassroom, useAuth, useClassroom, useClassroomCourses, useClassroomStudents, useConfirmAction, useCourses, useCreateCourse, useDeleteClassroom, useDetachCourseFromClassroom, useForm, useInviteModal, useInvites, useRemoveClassroomStudent, useRemoveInvite, useResendInvite, useSendInvite, useToast, useUpdateClassroom, useUpdateClassroomStudentStatus } from '../../hooks';
import { courseSchema } from '../../schemas/courseSchema';

const TABS = [
  { id: 'active', label: 'Alunos Ativos' },
  { id: 'inactive', label: 'Alunos Inativos' },
  { id: 'invites', label: 'Convites' },
  { id: 'courses', label: 'Cursos Vinculados' },
];

const ClassroomDetailPage = () => {
  const { classroomId } = useParams();
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const classroomQuery = useClassroom(classroomId);
  const classroom = classroomQuery.data;
  const isInactive = !((classroom || {}).active);

  const updateClassroom = useUpdateClassroom();
  const deleteClassroom = useDeleteClassroom();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  const [activeTab, setActiveTab] = useState('active');

  const [tabState, setTabState] = useState({
    active: { search: '', pageSize: 10, page: 1 },
    inactive: { search: '', pageSize: 10, page: 1 },
    invites: { search: '', pageSize: 10, page: 1 },
    courses: { search: '', pageSize: 10, page: 1 },
  });

  useEffect(() => {
    setTabState((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], page: 1 },
    }));
  }, [activeTab]);

  const detachCourseMutation = useDetachCourseFromClassroom();
  const attachCoursesMutation = useAttachCoursesToClassroom();

  const [addCourseChoiceOpen, setAddCourseChoiceOpen] = useState(false);

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const createCourseMutation = useCreateCourse();
  const courseForm = useForm({
    initialValues: { title: '', description: '' },
    schema: courseSchema,
    onSubmit: async (values) => {
      try {
        const resp = await createCourseMutation.mutateAsync({
          title: values.title,
          description: values.description,
          classroomId: Number(classroomId),
        });
        const msg = resp?.message || 'Curso criado e vinculado à turma';
        showToast({ message: msg, type: 'success' });
        setCourseModalOpen(false);
        courseForm.reset({ title: '', description: '' });
      } catch (err) {
        const status = err?.status || err?.response?.status || 500;
        const errData = err?.data || err?.response?.data || {};
        console.error('Erro ao criar curso:', err);
        const message = errData?.message || 'Erro ao criar curso. Tente novamente.';
        showToast({ message, type: 'error' });
      }
    },
  });



  const [renameOpen, setRenameOpen] = useState(false);
  const [renameConfirmOpen, setRenameConfirmOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const isNameValid = (newName || '').trim().length >= 3;

  const [toggleActiveConfirmOpen, setToggleActiveConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const pageSizeOptions = [10, 25, 50];
  const currentTabData = tabState[activeTab];
  const pageSize = currentTabData.pageSize;
  const currentPage = currentTabData.page;
  const search = currentTabData.search;
  const setPageSize = (size) =>
    setTabState((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], pageSize: size, page: 1 } }));
  const setCurrentPage = (page) =>
    setTabState((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], page } }));
  const setSearch = (text) =>
    setTabState((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], search: text, page: 1 } }));

  const columns = useMemo(() => {
    if (activeTab === 'invites') {
      return [
        { key: 'nome', label: 'E-MAIL', align: 'left' },
        { key: 'status', label: 'STATUS', align: 'center' },
        { key: 'expires', label: 'EXPIRA EM', align: 'center' },
        { key: 'acoes', label: 'AÇÕES', align: 'center' },
      ];
    }
    if (activeTab === 'courses') {
      return [
        { key: 'titulo', label: 'TÍTULO', align: 'left' },
        { key: 'descricao', label: 'DESCRIÇÃO', align: 'left' },
        { key: 'acoes', label: 'AÇÕES', align: 'center' },
      ];
    }
    return [
      { key: 'matricula', label: 'MATRICULA', align: 'left' },
      { key: 'nome', label: 'NOME', align: 'left' },
      { key: 'data', label: 'DATA DE INGRESSO', align: 'center' },
      { key: 'acoes', label: 'AÇÕES', align: 'center' },
    ];
  }, [activeTab]);

  const backendPage = Math.max(0, (currentPage || 1) - 1);

  const activeStudentsQuery = useClassroomStudents({
    classroomId,
    active: true,
    page: backendPage,
    size: pageSize,
    search,
    sortBy: 'name',
    sortDir: 'ASC',
    enabled: activeTab === 'active' && !!classroomId,
  });
  const inactiveStudentsQuery = useClassroomStudents({
    classroomId,
    active: false,
    page: backendPage,
    size: pageSize,
    search,
    sortBy: 'name',
    sortDir: 'ASC',
    enabled: activeTab === 'inactive' && !!classroomId,
  });
  const invitesQuery = useInvites({
    page: backendPage,
    size: pageSize,
    search,
    sortBy: 'email',
    sortDir: 'ASC',
    classroomId: Number(classroomId),
    enabled: activeTab === 'invites' && !!classroomId,
  });

  const classroomCoursesQuery = useClassroomCourses({
    classroomId: Number(classroomId),
    page: backendPage,
    size: pageSize,
    search,
    sortBy: 'title',
    sortDir: 'ASC',
    enabled: activeTab === 'courses' && !!classroomId,
  });

  const [attachModalOpen, setAttachModalOpen] = useState(false);
  const PAGE_CHUNK_SIZE = 20;
  const [visibleCount, setVisibleCount] = useState(PAGE_CHUNK_SIZE);
  const [attachSearch, setAttachSearch] = useState('');
  const allCoursesQuery = useCourses({ enabled: attachModalOpen });
  const availableCourses = useMemo(() => {
    const all = allCoursesQuery.data || [];
    const classroomCourses = classroomCoursesQuery.data?.content || [];
    const attachedIds = new Set(classroomCourses.map((c) => c.id));
    return all.filter((c) => !attachedIds.has(c.id));
  }, [allCoursesQuery.data, classroomCoursesQuery.data]);
  const filteredCourses = useMemo(() => {
    const term = attachSearch.trim().toLowerCase();
    if (!term) return availableCourses;
    return availableCourses.filter(
      (c) => (c.title || '').toLowerCase().includes(term) || (c.description || '').toLowerCase().includes(term)
    );
  }, [attachSearch, availableCourses]);
  const visibleCourses = useMemo(() => filteredCourses.slice(0, visibleCount), [filteredCourses, visibleCount]);
  const canLoadMore = filteredCourses.length > visibleCount;
  const [selectedCourseIds, setSelectedCourseIds] = useState(new Set());
  const toggleSelect = (id) => {
    setSelectedCourseIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const loadMore = () => setVisibleCount((c) => c + PAGE_CHUNK_SIZE);

  const confirmAttach = async () => {
    try {
      const ids = Array.from(selectedCourseIds);
      await attachCoursesMutation.mutateAsync({ classroomId: Number(classroomId), courseIds: ids });
      setAttachModalOpen(false);
      setSelectedCourseIds(new Set());
      setVisibleCount(PAGE_CHUNK_SIZE);
      classroomCoursesQuery.refetch?.();
      classroomQuery.refetch?.();
      showToast({ message: 'Cursos vinculados à turma.', type: 'success' });
    } catch (error) {
      if (import.meta.env.DEV) console.error('Erro ao vincular cursos:', error);
      showToast({ message: 'Erro ao vincular cursos. Tente novamente.', type: 'error' });
    }
  };

  const sendInviteMutation = useSendInvite();
  const resendInviteMutation = useResendInvite();
  const removeInviteMutation = useRemoveInvite();
  const { executeWithConfirmation } = useConfirmAction();
  const updateStudentStatusMutation = useUpdateClassroomStudentStatus();
  const removeStudentMutation = useRemoveClassroomStudent();
  const getOccurrenceId = (student) => {
    const raw = student || {};
    const occId = raw.occurrenceId ?? raw.classroomStudentId ?? raw.id;
    return Number(occId);
  };
  const sendNewInvite = async (email) => {
    await sendInviteMutation.mutateAsync({ email, classroomId: Number(classroomId) });
    showToast({ message: 'Convite enviado com sucesso', type: 'success' });
    invitesQuery.refetch?.();
    return { success: true };
  };

  const inviteModal = useInviteModal({
    onSendInvite: sendNewInvite,
    showToast,
  });

  const handleResendInvite = async (invite) => {
    await executeWithConfirmation({
      confirmConfig: {
        title: 'Reenviar Convite',
        message: `Deseja reenviar o convite para ${invite.email}?`,
        variant: 'info',
        actionType: 'resend',
      },
      action: () => resendInviteMutation.mutateAsync(invite.id),
      successMessage: `Convite reenviado para ${invite.email}`,
    });
    invitesQuery.refetch?.();
  };

  const handleRemoveInvite = async (invite) => {
    await executeWithConfirmation({
      confirmConfig: {
        title: 'Remover Convite',
        message: `Tem certeza que deseja remover o convite para ${invite.email}?`,
        variant: 'danger',
        actionType: 'delete',
      },
      action: () => removeInviteMutation.mutateAsync(invite.id),
      successMessage: 'Convite removido',
    });
    invitesQuery.refetch?.();
  };

  const handleSuspendStudent = async (student) => {
    await executeWithConfirmation({
      confirmConfig: {
        title: 'Inativar Aluno',
        message: `Tem certeza que deseja inativar ${student.name}?`,
        variant: 'warning',
        actionType: 'delete',
      },
      action: async () => updateStudentStatusMutation.mutateAsync({ classroomId: Number(classroomId), id: getOccurrenceId(student), active: false }),
      successMessage: 'foi inativado',
      itemName: student.name,
    });
    activeStudentsQuery.refetch?.();
    inactiveStudentsQuery.refetch?.();
    classroomQuery.refetch?.();
  };

  const handleActivateStudent = async (student) => {
    await executeWithConfirmation({
      confirmConfig: {
        title: 'Reativar Aluno',
        message: `Tem certeza que deseja reativar ${student.name}?`,
        variant: 'info',
        actionType: 'delete',
      },
      action: async () =>
        updateStudentStatusMutation.mutateAsync({ classroomId: Number(classroomId), id: getOccurrenceId(student), active: true }),
      successMessage: 'foi reativado',
      itemName: student.name,
    });
    inactiveStudentsQuery.refetch?.();
    activeStudentsQuery.refetch?.();
    classroomQuery.refetch?.();
  };

  const handleDeleteStudent = async (student) => {
    await executeWithConfirmation({
      confirmConfig: {
        title: 'Excluir Aluno',
        message: `Tem certeza que deseja excluir ${student.name}? Esta ação não pode ser desfeita.`,
        variant: 'danger',
        actionType: 'delete',
      },
      action: async () => removeStudentMutation.mutateAsync({ classroomId: Number(classroomId), id: getOccurrenceId(student) }),
      successMessage: 'foi excluído',
      itemName: student.name,
    });
    activeStudentsQuery.refetch?.();
    inactiveStudentsQuery.refetch?.();
    // Refaz o get de detalhes da turma apenas em atualizações relevantes
    classroomQuery.refetch?.();
  };

  const currentPageData = useMemo(() => {
    if (activeTab === 'active') return activeStudentsQuery.data || { content: [], totalElements: 0 };
    if (activeTab === 'inactive') return inactiveStudentsQuery.data || { content: [], totalElements: 0 };
    if (activeTab === 'invites') return invitesQuery.data || { content: [], totalElements: 0 };
    if (activeTab === 'courses') return classroomCoursesQuery.data || { content: [], totalElements: 0 };
    return { content: [], totalElements: 0 };
  }, [activeTab, activeStudentsQuery.data, inactiveStudentsQuery.data, invitesQuery.data, classroomCoursesQuery.data]);

  const data = useMemo(() => {
    const content = currentPageData?.content || [];
    if (activeTab === 'invites') {
      return content.map((inv) => ({
        nome: inv.email ?? '—',
        email: inv.email ?? '—',
        status: inv.status ?? '—',
        expires: inv.expiresAt ?? null,
        _raw: inv,
      }));
    }
    if (activeTab === 'courses') {
      return content.map((course) => ({
        titulo: course.title ?? '-',
        descricao: (course.description && course.description.trim()) ? course.description : '-',
        _raw: course,
      }));
    }
    // Students
    return content.map((s) => ({
      matricula: s.enrollment ?? '—',
      nome: s.name ?? '—',
      email: s.email ?? '—',
      data: s.createdAt ?? null,
      _raw: s,
    }));
  }, [currentPageData?.content, activeTab]);

  const handleUnlinkCourse = async (course) => {
    await executeWithConfirmation({
      confirmConfig: {
        title: 'Desvincular Curso',
        message: `Tem certeza que deseja desvincular "${course.title}" desta turma?`,
        variant: 'warning',
      },
      action: async () =>
        detachCourseMutation.mutateAsync({ classroomId: Number(classroomId), courseId: course.id }),
      successMessage: 'foi desvinculado',
      itemName: course.title,
    });
    classroomCoursesQuery.refetch?.();
    classroomQuery.refetch?.();
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (trimmed.length < 3) {
      setNameTouched(true);
      return;
    }
    setRenameConfirmOpen(true);
  };

  const confirmRename = async () => {
    try {
      await updateClassroom.mutateAsync({ id: classroomId, data: { name: newName.trim() } });
      setRenameConfirmOpen(false);
      setRenameOpen(false);
      setMenuOpen(false);
      classroomQuery.refetch?.();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Erro ao renomear turma:', error);
      showToast({ message: 'Erro ao renomear turma. Tente novamente.', type: 'error' });
    }
  };

  const confirmToggleActive = async () => {
    try {
      await updateClassroom.mutateAsync({ id: classroomId, data: { active: !classroom.active } });
      setToggleActiveConfirmOpen(false);
      setMenuOpen(false);
      classroomQuery.refetch?.();
    } catch (error) {
      if (import.meta.env.DEV) console.error('Erro ao alternar status da turma:', error);
      showToast({ message: 'Erro ao atualizar status da turma.', type: 'error' });
    }
  };

  useEffect(() => {
    const onClickAway = (e) => {
      if (!menuOpen) return;
      const menuEl = menuRef.current;
      const buttonEl = menuButtonRef.current;
      if (
        menuEl && !menuEl.contains(e.target) &&
        buttonEl && !buttonEl.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickAway);
    document.addEventListener('touchstart', onClickAway);
    return () => {
      document.removeEventListener('mousedown', onClickAway);
      document.removeEventListener('touchstart', onClickAway);
    };
  }, [menuOpen]);

  const confirmDelete = async () => {
    try {
      await deleteClassroom.mutateAsync(classroomId);
      setDeleteConfirmOpen(false);
      setMenuOpen(false);
      navigate('/instructor/manage-classes');
    } catch (error) {
      if (import.meta.env.DEV) console.error('Erro ao excluir turma:', error);
      showToast({ message: 'Erro ao excluir turma. Tente novamente.', type: 'error' });
    }
  };

  if (classroomQuery.isLoading) {
    return (
      <AppLayout user={user} onLogout={logout} containerClassName="max-w-[1200px]">
        <PageTitle>Detalhes da Turma</PageTitle>
        <div className="p-6 text-center text-gray-600">Carregando turma...</div>
      </AppLayout>
    );
  }

  if (!classroom) {
    return (
      <AppLayout user={user} onLogout={logout} containerClassName="max-w-[1200px]">
        <Breadcrumb items={[{ href: '/instructor/manage-classes', label: 'Gerenciar Turmas' }, { label: 'Turma' }]} />
        <EmptyState message="Turma não encontrada" description="Volte à listagem e selecione uma turma válida." />
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user} onLogout={logout} containerClassName="max-w-[1200px]">
      <PageTitle className="mb-8">Detalhes da Turma</PageTitle>
      <div className="bg-gray-50 py-4 sm:py-6">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ href: '/instructor/manage-classes', label: 'Gerenciar Turmas' }, { label: classroom.name }]} />

        <div className="mb-3 flex items-center justify-between pr-2">
          <h1 className="text-3xl font-bold text-blue-800">
            {classroom.name}
          </h1>
          <div className="relative">
            <button
              ref={menuButtonRef}
              className="icon-aligned mr-2 h-9 w-9 rounded-md border border-gray-300 bg-gray-50 text-gray-600 shadow-sm hover:bg-blue-50"
              aria-label="Ações da turma"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <MoreHorizontalIcon className="h-5 w-5" />
            </button>
            {menuOpen && (
              <div ref={menuRef} className="absolute right-0 z-20 mt-2 w-56 rounded-lg border bg-white p-2 text-sm shadow">
                <button
                  className="flex w-full items-center justify-between rounded px-3 py-2 hover:bg-gray-50"
                  onClick={() => {
                    setNewName(classroom.name || '');
                    setNameTouched(false);
                    setRenameOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  <span className="text-gray-800">Editar nome da turma</span>
                </button>
                <button
                  className="flex w-full items-center justify-between rounded px-3 py-2 text-yellow-700 hover:bg-gray-50"
                  onClick={() => {
                    setToggleActiveConfirmOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  <span>{classroom.active ? 'Inativar turma' : 'Reativar turma'}</span>
                </button>
                <button
                  className="flex w-full items-center justify-between rounded px-3 py-2 text-red-700 hover:bg-gray-50"
                  onClick={() => {
                    setDeleteConfirmOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  <span>Excluir turma</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mb-3 text-sm text-gray-600">
          Criada em {classroom.createdAt ? new Date(classroom.createdAt).toLocaleDateString('pt-BR') : '—'} • {classroom?.studentCount ?? '—'} alunos • {classroom?.coursesCount ?? '—'} cursos vinculados • {classroom.active ? 'Ativa' : 'Inativa'}
        </p>

        <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} align="left" fluid containerClassName="mb-3" />

        {/* Controles acima da listagem */}
        <div className="mt-3 mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <SearchInput
            key={`search-${activeTab}`}
            placeholder={activeTab === 'courses' ? 'Pesquisar cursos...' : activeTab === 'invites' ? 'Pesquisar convites...' : 'Pesquisar alunos...'}
            value={search}
            onChange={setSearch}
          />
          <div className="flex items-center gap-3">
            <PageSizeSelector value={pageSize} onChange={(s) => { setPageSize(s); }} className="h-[48px] px-4 !py-0 text-base" />
            {activeTab === 'active' ? (
              <Button className="px-6 whitespace-nowrap sm:w-auto" onClick={inviteModal.openModal} disabled={isInactive}>+ Adicionar Aluno</Button>
            ) : activeTab === 'invites' ? (
              <Button className="px-6 whitespace-nowrap sm:w-auto" onClick={inviteModal.openModal} disabled={isInactive}>+ Enviar Convite</Button>
            ) : activeTab === 'courses' ? (
              <Button
                className="px-6 whitespace-nowrap sm:w-auto"
                onClick={() => setAddCourseChoiceOpen(true)}
                disabled={isInactive}
              >
                + Adicionar Curso
              </Button>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow mb-8 p-5 sm:p-6">
          {data.length === 0 ? (
            <div className="flex min-h-[260px] items-center justify-center p-8">
              <EmptyState
                variant="inline"
                message={
                  activeTab === 'active'
                    ? (isInactive ? 'Turma inativa: não é possível adicionar alunos.' : 'Nenhum aluno encontrado. Convide alunos clicando no botão.')
                    : activeTab === 'inactive'
                    ? 'Nenhum aluno encontrado.'
                    : activeTab === 'invites'
                    ? (isInactive ? 'Turma inativa: convites desativados.' : 'Nenhum convite enviado. Envie um convite.')
                    : (isInactive ? 'Turma inativa: vinculação de cursos desativada.' : 'Nenhum curso vinculado. Vincule o primeiro curso.')
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable
                embedded
                columns={columns}
                data={data}
                currentSort={{ column: 'nome', direction: 'asc' }}
                onSort={() => {}}
                currentPage={currentPage}
                totalItems={currentPageData?.totalElements || 0}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                hasSearch={!!search}
                renderRow={(row) => (
                  <>
                    {activeTab === 'invites' ? (
                      <>
                        <td className="px-6 py-4 text-left align-middle">
                          <span className="text-gray-800">{row.nome}</span>
                        </td>
                        <td className="px-6 py-4 text-center align-middle">
                          <StatusBadge status={row.status} variant="pending" />
                        </td>
                        <td className="px-6 py-4 text-center align-middle text-base text-gray-700">
                          {row.expires ? <FormattedDate date={row.expires} /> : '—'}
                        </td>
                        <td className="px-6 py-4 text-center align-middle">
                          <div className="flex items-center justify-center gap-2">
                            <ActionButton icon={RotateCw} title="Reenviar convite" variant="resend" onClick={isInactive ? undefined : () => handleResendInvite(row._raw)} className={isInactive ? 'opacity-50 cursor-not-allowed' : ''} />
                            <ActionButton icon={Trash2} title="Remover convite" variant="delete" onClick={() => handleRemoveInvite(row._raw)} />
                          </div>
                        </td>
                      </>
                    ) : activeTab === 'courses' ? (
                      <>
                        <td className="px-6 py-4 text-left align-middle">
                          <Link
                            to="/instructor/manage-content"
                            state={{ courseId: row._raw.id }}
                            className="text-blue-600 hover:underline"
                          >
                            {row.titulo}
                          </Link>
                        </td>
                        <td
                          className={`px-6 py-4 align-middle text-sm text-gray-700 ${row.descricao === '-' ? 'text-center' : 'text-left'}`}
                        >
                          {row.descricao === '-' ? (
                            <span className="text-gray-400">———</span>
                          ) : (
                            row.descricao
                          )}
                        </td>
                        <td className="px-6 py-4 text-center align-middle">
                          <div className="flex items-center justify-center gap-2">
                            <ActionButton
                              icon={Unlink}
                              title="Desvincular curso"
                              variant="delete"
                              onClick={() => handleUnlinkCourse(row._raw)}
                            />
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-left align-middle text-base text-gray-700">{row.matricula}</td>
                        <td className="px-6 py-4 text-left align-middle">
                          <Link
                            to={`/instructor/classroom/${classroomId}/student/${row._raw.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {row.nome}
                          </Link>
                          <div className="text-sm text-gray-500">{row.email}</div>
                        </td>
                        <td className="px-6 py-4 text-center align-middle text-base text-gray-700">
                          {row.data ? <FormattedDate date={row.data} /> : '—'}
                        </td>
                        <td className="px-6 py-4 text-center align-middle">
                          <div className="flex items-center justify-center gap-2">
                            {activeTab === 'inactive' ? (
                              <ActionButton icon={CircleCheck} title="Reativar aluno" variant="activate" onClick={isInactive ? undefined : () => handleActivateStudent(row._raw)} className={isInactive ? 'opacity-50 cursor-not-allowed' : ''} />
                            ) : (
                              <ActionButton icon={Ban} title="Inativar aluno" variant="suspend" onClick={isInactive ? undefined : () => handleSuspendStudent(row._raw)} className={isInactive ? 'opacity-50 cursor-not-allowed' : ''} />
                            )}
                            <ActionButton icon={Trash2} title="Excluir aluno" variant="delete" onClick={() => handleDeleteStudent(row._raw)} />
                          </div>
                        </td>
                      </>
                    )}
                  </>
                )}
              />
            </div>
          )}
        </div>

      <Modal isOpen={addCourseChoiceOpen} onClose={() => setAddCourseChoiceOpen(false)} title="Adicionar Curso" showCloseButton={false}>
          <div className="space-y-4">
            <p className="text-gray-700">Como você deseja adicionar o curso?</p>
            <div className="flex gap-3 justify-end">
              <Button className="w-auto bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setAddCourseChoiceOpen(false)}>Cancelar</Button>
              <Button className="w-auto" onClick={() => { setAddCourseChoiceOpen(false); setCourseModalOpen(true); }}>Criar novo</Button>
              <Button className="w-auto bg-blue-600 hover:bg-blue-700" onClick={() => { setAddCourseChoiceOpen(false); setAttachModalOpen(true); setVisibleCount(PAGE_CHUNK_SIZE); }}>Adicionar existente</Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={courseModalOpen} onClose={() => setCourseModalOpen(false)} title="Criar Novo Curso para esta Turma">
          <form onSubmit={courseForm.handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="course-title">Título do Curso</Label>
              <Input
                id="course-title"
                placeholder="Ex: Matemática Financeira"
                value={courseForm.values.title}
                onChange={(e) => courseForm.handleChange('title', e.target.value)}
                onBlur={() => courseForm.handleBlur('title')}
                error={!!courseForm.errors.title}
              />
              <ErrorMessage message={courseForm.errors.title} />
            </div>
            <div className="mb-4">
              <Label htmlFor="course-description">Descrição</Label>
              <Textarea
                id="course-description"
                rows={3}
                value={courseForm.values.description}
                onChange={(e) => courseForm.handleChange('description', e.target.value)}
                onBlur={() => courseForm.handleBlur('description')}
                error={!!courseForm.errors.description}
              />
              <ErrorMessage message={courseForm.errors.description} />
            </div>
            <Button type="submit" disabled={!courseForm.isFormValid || courseForm.isSubmitting} className="disabled:cursor-not-allowed disabled:opacity-50">
              Criar Curso
            </Button>
          </form>
        </Modal>

        <Modal isOpen={attachModalOpen} onClose={() => setAttachModalOpen(false)} title="Adicionar Cursos Existentes">
          <div className="space-y-4">
            <div>
              <Label htmlFor="attach-search">Pesquisar</Label>
              <Input id="attach-search" placeholder="Buscar por título ou descrição" value={attachSearch} onChange={(e) => setAttachSearch(e.target.value)} />
            </div>
            <div className="max-h-[360px] overflow-auto border rounded-md divide-y">
              {(visibleCourses ?? []).map((c) => (
                <label key={c.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer">
                  <input type="checkbox" checked={selectedCourseIds.has(c.id)} onChange={() => toggleSelect(c.id)} />
                  <div>
                    <div className="font-medium text-gray-800">{c.title}</div>
                    <div className="text-sm text-gray-600">{c.description || '—'}</div>
                  </div>
                </label>
              ))}
              {canLoadMore && (
                <div className="p-3">
                  <Button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={loadMore}>Carregar mais</Button>
                </div>
              )}
              {!allCoursesQuery.isLoading && (visibleCourses ?? []).length === 0 && (
                <div className="p-6 text-center text-gray-500">Nenhum curso encontrado.</div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button className="w-auto bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setAttachModalOpen(false)}>Cancelar</Button>
              <Button className="w-auto bg-blue-600 hover:bg-blue-700" disabled={selectedCourseIds.size === 0 || attachCoursesMutation.isPending} onClick={confirmAttach}>{attachCoursesMutation.isPending ? 'Vinculando...' : 'Vincular Selecionados'}</Button>
            </div>
          </div>
        </Modal>
        </div>
      </div>

      <Modal isOpen={renameOpen} onClose={() => setRenameOpen(false)} title="Alterar Nome da Turma" showCloseButton={false}>
        <form onSubmit={handleRenameSubmit} className="space-y-4">
          <div>
            <Label htmlFor={`class-rename-${classroomId}`} required>Nome da turma</Label>
            <Input
              id={`class-rename-${classroomId}`}
              placeholder="Ex.: Turma 5º Ano - Matemática"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              error={nameTouched && !isNameValid}
            />
            {nameTouched && !isNameValid && <ErrorMessage message="Campo inválido" />}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" className="w-auto bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => setRenameOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="w-auto" disabled={!isNameValid || updateClassroom.isPending}>
              {updateClassroom.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de envio de convite */}
      <Modal isOpen={inviteModal.isOpen} onClose={inviteModal.closeModal} title="Enviar Convite" showCloseButton={false}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="invite-email">E-mail do aluno</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="aluno@exemplo.com"
              value={inviteModal.email}
              onChange={(e) => inviteModal.handleEmailChange(e.target.value)}
              className={inviteModal.emailError ? 'border-red-500' : ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inviteModal.isEmailValid()) {
                  inviteModal.handleSendInvite();
                }
              }}
            />
            {inviteModal.emailError && <ErrorMessage message={inviteModal.emailError} />}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={inviteModal.closeModal} className="w-auto bg-gray-100 text-gray-700 hover:bg-gray-200">
              Cancelar
            </Button>
            <Button onClick={inviteModal.handleSendInvite} disabled={!inviteModal.isEmailValid() || inviteModal.isLoading || isInactive} className="w-auto bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {inviteModal.isLoading ? 'Enviando...' : 'Enviar Convite'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        isOpen={renameConfirmOpen}
        onClose={() => setRenameConfirmOpen(false)}
        onConfirm={confirmRename}
        title="Confirmar alteração de nome"
        message={`Deseja alterar o nome da turma para "${newName.trim()}"?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        variant="info"
        actionType="custom"
        isLoading={updateClassroom.isPending}
      />

      <ConfirmationDialog
        isOpen={toggleActiveConfirmOpen}
        onClose={() => setToggleActiveConfirmOpen(false)}
        onConfirm={confirmToggleActive}
        title={classroom.active ? 'Inativar turma' : 'Reativar turma'}
        message={classroom.active ? 'Tem certeza que deseja inativar esta turma?' : 'Tem certeza que deseja reativar esta turma?'}
        confirmText={classroom.active ? 'Inativar' : 'Reativar'}
        cancelText="Cancelar"
        variant="warning"
        actionType="custom"
        isLoading={updateClassroom.isPending}
      />

      <ConfirmationDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir turma"
        message="Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
        actionType="delete"
        isLoading={deleteClassroom.isPending}
      />
    </AppLayout>
  );
};

export default ClassroomDetailPage;
