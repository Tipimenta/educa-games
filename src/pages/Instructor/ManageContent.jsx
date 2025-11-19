import { useContext, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { AppLayout, Button, DataTable, PageSizeSelector, PageTitle, SearchInput, Trash2Icon } from '../../components';
import { AuthContext } from '../../context';
import { useAuth, useConfirmDelete, useCourses, useDeleteModule, useModules } from '../../hooks';

const ManageContentPage = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();
  const location = useLocation();

  const selectedCourseId = location.state?.courseId;
  const { data: courses = [], isLoading: isLoadingCourses } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState({ column: 'titulo', direction: 'asc' });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: modulesPage = { content: [], totalElements: 0 }, isLoading: isLoadingModules } = useModules(
    selectedCourseId || null,
    {
      page: currentPage - 1,
      size: pageSize,
      search: searchTerm,
      sortBy: 'createdAt',
      sortDir: sort.direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
    }
  );
  const deleteModuleMutation = useDeleteModule();
  const [openCoursesDropdownId, setOpenCoursesDropdownId] = useState(null);


  const getCourseTitle = (courseId) =>
    courses.find((c) => c.id === courseId)?.title || 'Curso não encontrado';

  const handleDeleteModule = useConfirmDelete({
    onDelete: async (moduleId) => {
      await deleteModuleMutation.mutateAsync(moduleId);
    },
    title: 'Remover Módulo',
    message:
      'Tem a certeza que quer apagar este módulo e todo o seu conteúdo? Esta ação não pode ser desfeita.',
    successMessage: 'Módulo removido com sucesso',
  });

  const getCursosSummary = (cursos = []) => {
    if (!Array.isArray(cursos) || cursos.length === 0) return 'Nenhum curso vinculado';
    if (cursos.length === 1) return cursos[0];
    const shortest = [...cursos].sort((a, b) => (a?.length || 0) - (b?.length || 0))[0] || cursos[0];
    const extra = cursos.length - 1;
    return `${shortest} e +${extra}`;
  };

  const rows = useMemo(() => {
    const base = modulesPage?.content || [];
    return base.map((m) => {
      const course = courses.find((c) => c.id === m.courseId);
      const courseTitle = course?.title || null;
      return {
        id: m.id,
        titulo: m.title || '-',
        aulas: m.lessons?.length || 0,
        curso: courseTitle || 'Curso não encontrado',
        cursos: courseTitle ? [courseTitle] : [],
        _raw: m,
      };
    });
  }, [modulesPage, courses]);

  const totalItems = modulesPage?.totalElements || 0;
  const visibleData = rows;

  const columns = useMemo(() => {
    const cols = [
      { key: 'titulo', label: 'Título' },
      { key: 'aulas', label: 'Aulas', align: 'center', sortable: false },
      { key: 'curso', label: 'Cursos', sortable: false },
      { key: 'acoes', label: 'Ações', sortable: false, align: 'center', className: 'w-28' },
    ];
    return cols;
  }, []);

  if (isLoadingCourses || isLoadingModules) {
    return (
      <AppLayout user={user} onLogout={logout}>
        <PageTitle>Gerir Módulos</PageTitle>
        <div className="text-center">
          <p className="text-gray-600">Carregando módulos...</p>
        </div>
      </AppLayout>
    );
  }


  return (
    <AppLayout user={user} onLogout={logout}>
      <PageTitle>Gerenciar Módulos</PageTitle>

      <div className="mx-auto mb-6 flex max-w-[95%] flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Pesquisar módulos..."
          />
          <div className="flex items-center gap-3">
            <PageSizeSelector
              value={pageSize}
              onChange={(size) => { setPageSize(size); setCurrentPage(1); }}
              className="h-[48px] px-4 !py-0 text-base"
            />
            <Link to="/instructor/module-editor" state={selectedCourseId ? { courseId: selectedCourseId } : undefined}>
              <Button className="px-6 whitespace-nowrap sm:w-auto">+ Novo Módulo</Button>
            </Link>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={visibleData}
        currentSort={sort}
        onSort={(column) => {
          if (column !== 'titulo') return; // apenas título é ordenável no servidor
          setSort((prev) => ({
            column,
            direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
          }));
          setCurrentPage(1);
        }}
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
        hasSearch={!!searchTerm}
        renderRow={(item) => (
          <>
            <td className="px-4 py-3 text-sm text-gray-800">
              <Link to={`/instructor/module-editor/${item.id}`} className="text-blue-600 hover:underline">
                {item.titulo}
              </Link>
            </td>
            <td className="px-4 py-3 text-center text-sm text-gray-800">{item.aulas}</td>
            <td className="px-4 py-3 text-sm text-gray-700">
              <div className="relative inline-block">
                <button
                  type="button"
                  className="flex w-full min-w-[220px] items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-800 hover:bg-gray-50"
                  onClick={() => setOpenCoursesDropdownId(openCoursesDropdownId === item.id ? null : item.id)}
                  title="Cursos vinculados"
                >
                  <span className="truncate max-w-[180px]">{getCursosSummary(item.cursos)}</span>
                  <span className={`ml-2 text-gray-500 transition-transform ${openCoursesDropdownId === item.id ? 'rotate-180' : ''}`}>▾</span>
                </button>
                {openCoursesDropdownId === item.id && (
                  <div className="absolute left-0 top-full mt-2 z-20 w-[260px] rounded-md border bg-white shadow-lg">
                    {item.cursos?.length ? (
                      <ul className="max-h-64 overflow-auto divide-y">
                        {item.cursos.map((title, idx) => (
                          <li key={`${item.id}-curso-${idx}`} className="px-3 py-2 text-gray-700">{title}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-3 py-2 text-gray-500">Nenhum curso vinculado</div>
                    )}
                  </div>
                )}
              </div>
            </td>
            <td className="px-4 py-3 text-center">
              <button
                aria-label="Excluir módulo"
                className="inline-flex items-center justify-center rounded-md p-1 text-red-600 hover:text-red-700"
                onClick={() => handleDeleteModule(item.id)}
                title="Excluir módulo"
              >
                <Trash2Icon className="h-5 w-5" />
              </button>
            </td>
          </>
        )}
      />
    </AppLayout>
  );
};

export default ManageContentPage;
