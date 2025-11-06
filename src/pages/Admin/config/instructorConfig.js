export const INSTRUCTOR_TABS = [
  { id: 'active', label: 'Instrutores Ativos' },
  { id: 'inactive', label: 'Instrutores Inativos' },
  { id: 'invites', label: 'Convites Pendentes' },
];

export const getInstructorColumns = (activeTab) => {
  if (activeTab === 'invites') {
    return [
      { key: 'email', label: 'E-mail', align: 'left', sortable: true },
      { key: 'status', label: 'Status', align: 'center', sortable: false },
      { key: 'expiresAt', label: 'Expira em', align: 'center', sortable: true },
      { key: 'actions', label: 'Ações', align: 'center', sortable: false },
    ];
  }
  return [
    { key: 'name', label: 'Nome', align: 'left', sortable: true },
    { key: 'email', label: 'E-mail', align: 'left', sortable: true },
    { key: 'actions', label: 'Ações', align: 'center', sortable: false },
  ];
};
