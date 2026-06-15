export const API_ENDPOINTS = {
  auth: {
    inquiryCustomerProfile: 'v1/auth/inquiryCustomerProfile',
    login: 'auth/login',
    logout: 'auth/logout',
    refresh: 'auth/refresh',
    profile: 'auth/profile',
  },
  reg: {
    fetchDistricts: 'v1/reg/fetchDistricts',
    getListDocument: 'v1/reg/getListDocument',
    fetchOffices: 'v1/reg/fetchOffices',
    fetchProvinces: 'v1/reg/fetchProvinces',
  },
  captcha: {
    generate: 'captcha/generate',
    verify: 'captcha/verify',
  },
  users: {
    list: 'users',
    detail: (id: number | string) => `users/${id}`,
    create: 'users',
    update: (id: number | string) => `users/${id}`,
    delete: (id: number | string) => `users/${id}`,
  },
} as const;
