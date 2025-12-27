import api from './axios';

export const usersApi = {
  getAll: async (filters = {}) => {
    const response = await api.get('/users', { params: filters });
    return { data: response.data.data || response.data };
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return { data: response.data.data || response.data };
  },

  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return { data: response.data.data || response.data };
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response;
  },
};

