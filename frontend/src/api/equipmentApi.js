import api from './axios';

export const equipmentApi = {
  getAll: async () => {
    const response = await api.get('/equipment');
    return { data: response.data.data || response.data };
  },

  getById: async (id) => {
    const response = await api.get(`/equipment/${id}`);
    return { data: response.data.data || response.data };
  },

  create: async (data) => {
    const response = await api.post('/equipment', data);
    return { data: response.data.data || response.data };
  },

  update: async (id, data) => {
    const response = await api.put(`/equipment/${id}`, data);
    return { data: response.data.data || response.data };
  },

  delete: async (id) => {
    const response = await api.delete(`/equipment/${id}`);
    return response;
  },

  getRequestsCount: async (equipmentId) => {
    const response = await api.get(`/equipment/${equipmentId}/requests/count`);
    return { data: response.data.data || response.data };
  },
};

