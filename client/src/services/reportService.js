import api from './api';

export const reportService = {
  getAppointmentReport: async (params) => {
    const response = await api.get('/reports/appointments', { params });
    return response.data;
  },

  getRevenueReport: async () => {
    const response = await api.get('/reports/revenue');
    return response.data;
  },

  getPatientReport: async () => {
    const response = await api.get('/reports/patients');
    return response.data;
  }
};
