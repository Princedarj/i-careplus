import api from './api';

export const prescriptionService = {
  getAllPrescriptions: async (params) => {
    const response = await api.get('/prescriptions', { params });
    return response.data;
  },

  getPrescriptionById: async (id) => {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  },

  createPrescription: async (data) => {
    const response = await api.post('/prescriptions', data);
    return response.data;
  }
};
