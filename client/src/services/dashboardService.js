import api from './api';

export const dashboardService = {
  getPatientDashboard: async () => {
    const response = await api.get('/dashboard/patient');
    return response.data;
  },

  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  }
};
