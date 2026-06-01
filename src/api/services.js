import client from './client';

export const authAPI = {
  login: (data) => client.post('/login', data),
  register: (data) => client.post('/register', data),
  logout: () => client.post('/logout'),
  me: () => client.get('/user'),
};

export const buildingsAPI = {
  list: (params = {}) => client.get('/buildings', { params }),
  get: (id) => client.get(`/buildings/${id}`),
  create: (data) => client.post('/buildings', data),
  update: (id, data) => client.put(`/buildings/${id}`, data),
  delete: (id) => client.delete(`/buildings/${id}`),
};

export const categoriesAPI = {
  list: (params = {}) => client.get('/categories', { params }),
  get: (id) => client.get(`/categories/${id}`),
  create: (data) => client.post('/categories', data),
  update: (id, data) => client.put(`/categories/${id}`, data),
  delete: (id) => client.delete(`/categories/${id}`),
};

export const facilitiesAPI = {
  list: (params = {}) => client.get('/facilities', { params }),
  get: (id) => client.get(`/facilities/${id}`),
  create: (data) => client.post('/facilities', data),
  update: (id, data) => client.put(`/facilities/${id}`, data),
  delete: (id) => client.delete(`/facilities/${id}`),
};

export const reportsAPI = {
  list: (params = {}) => client.get('/reports', { params }),
  get: (id) => client.get(`/reports/${id}`),
  create: (formData) => client.post('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateStatus: (id, status) => client.put(`/reports/${id}`, { status }),
  delete: (id) => client.delete(`/reports/${id}`),
};

export const usersAPI = {
  list: (params = {}) => client.get('/users', { params }),
  get: (id) => client.get(`/users/${id}`),
  create: (data) => client.post('/users', data),
  update: (id, data) => client.put(`/users/${id}`, data),
  delete: (id) => client.delete(`/users/${id}`),
  search: (q) => client.get('/users/search', { params: { q } }),
};
