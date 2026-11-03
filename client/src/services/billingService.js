import api from './api';

export const billingService = {
  getAllInvoices: async (params) => {
    const response = await api.get('/invoices', { params });
    return response.data;
  },

  getInvoiceById: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (data) => {
    const response = await api.post('/invoices', data);
    return response.data;
  },

  updateStatus: async (id, data) => {
    const response = await api.patch(`/invoices/${id}/status`, data);
    return response.data;
  },

  payInvoice: async (id, paymentData) => {
    const response = await api.post(`/invoices/${id}/pay`, paymentData);
    return response.data;
  }
};
