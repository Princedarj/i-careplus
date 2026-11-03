import api from './api';

export const medicalRecordService = {
  getAllRecords: async (params) => {
    const response = await api.get('/medical-records', { params });
    return response.data;
  },

  getRecordById: async (id) => {
    const response = await api.get(`/medical-records/${id}`);
    return response.data;
  },

  createRecord: async (recordData) => {
    const response = await api.post('/medical-records', recordData);
    return response.data;
  },

  updateRecord: async (id, recordData) => {
    const response = await api.put(`/medical-records/${id}`, recordData);
    return response.data;
  }
};
