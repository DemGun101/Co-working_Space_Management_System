export const adminKeys = {
  getFilters: ['admin', 'filters'] as const,
  getStats: ['admin', 'stats'] as const,
  getActivity: ['admin', 'activity'] as const,
  getUsers: ['admin', 'users'] as const,
  getUser: (id: string) => ['admin', 'users', id] as const,
  createUser: ['admin', 'users', 'create'] as const,
  updateUser: ['admin', 'users', 'update'] as const,
  deleteUser: ['admin', 'users', 'delete'] as const,
};
