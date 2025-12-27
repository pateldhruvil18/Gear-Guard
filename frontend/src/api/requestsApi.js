import api from './axios';

export const requestsApi = {
  getAll: async (filters = {}) => {
    const response = await api.get('/requests', { params: filters });
    return { data: response.data.data || response.data };
  },

  getById: async (id) => {
    const response = await api.get(`/requests/${id}`);
    return { data: response.data.data || response.data };
  },

  create: async (data) => {
    const response = await api.post('/requests', data);
    return { data: response.data.data || response.data };
  },

  update: async (id, data, requiresApproval = false) => {
    const response = await api.put(`/requests/${id}`, { ...data, requiresApproval });
    return { 
      data: response.data.data || response.data,
      requiresApproval: response.data.requiresApproval || false
    };
  },

  approveEdit: async (id, approve = true) => {
    const response = await api.patch(`/requests/${id}/approve-edit`, { approve });
    return { data: response.data.data || response.data };
  },

  delete: async (id) => {
    const response = await api.delete(`/requests/${id}`);
    return response;
  },

  approveRequest: async (id, maintenanceTeam) => {
    const response = await api.patch(`/requests/${id}/approve`, { maintenanceTeam });
    return { data: response.data.data || response.data };
  },

  acceptTask: async (id) => {
    const response = await api.patch(`/requests/${id}/accept`);
    return { data: response.data.data || response.data };
  },

  updateStatus: async (id, status, additionalData = {}) => {
    const response = await api.patch(`/requests/${id}/status`, { status, ...additionalData });
    return { data: response.data.data || response.data };
  },

  addFeedback: async (id, feedback, rating) => {
    const response = await api.patch(`/requests/${id}/feedback`, { feedback, rating });
    return { data: response.data.data || response.data };
  },
};

