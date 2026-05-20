export const API_ENDPOINTS = {
  auth: {
    login: 'auth/login',
    logout: 'auth/logout',
    refresh: 'auth/refresh',
    profile: 'auth/profile',
  },
  users: {
    list: 'users',
    detail: (id: number | string) => `users/${id}`,
    create: 'users',
    update: (id: number | string) => `users/${id}`,
    delete: (id: number | string) => `users/${id}`,
  },
} as const;
