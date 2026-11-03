import api from './api';

export const appointmentService = {
  getAllAppointments: async (params) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  updateStatus: async (id, statusData) => {
    const response = await api.patch(`/appointments/${id}/status`, statusData);
    return response.data;
  },

  deleteAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  }
};
