import api from './axios';

export const teamsApi = {
  getAll: async () => {
    const response = await api.get('/teams');
    return { data: response.data.data || response.data };
  },

  getById: async (id) => {
    const response = await api.get(`/teams/${id}`);
    return { data: response.data.data || response.data };
  },

  create: async (data) => {
    const response = await api.post('/teams', data);
    return { data: response.data.data || response.data };
  },

  update: async (id, data) => {
    const response = await api.put(`/teams/${id}`, data);
    return { data: response.data.data || response.data };
  },

  delete: async (id) => {
    const response = await api.delete(`/teams/${id}`);
    return response;
  },

  addMember: async (teamId, userId) => {
    const response = await api.post(`/teams/${teamId}/members`, { userId });
    return { data: response.data.data || response.data };
  },

  removeMember: async (teamId, userId) => {
    const response = await api.delete(`/teams/${teamId}/members/${userId}`);
    return { data: response.data.data || response.data };
  },
};

