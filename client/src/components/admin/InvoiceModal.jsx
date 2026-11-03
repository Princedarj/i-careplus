import React, { useState } from 'react';
import Modal from '../common/Modal';
import { billingService } from '../../services/billingService';
import { Loader2, AlertCircle } from 'lucide-react';

const InvoiceModal = ({ isOpen, onClose, patients, onSuccess }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    description: '',
    totalAmount: '',
    dueDate: '',
    status: 'PENDING',
    paymentMethod: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId) {
      setError('Please select a patient.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await billingService.createInvoice(formData);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create invoice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Patient Medical Invoice" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Patient *</label>
            <select
              required
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm bg-white"
            >
              <option value="">-- Choose Patient File --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.user?.name} ({p.user?.email}) - #{p.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Invoice Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Specialist Consultation & Clinical Care"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Total Fee ($ USD) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="100.00"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm bg-white"
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm bg-white"
              >
                <option value="">Unpaid / Pending</option>
                <option value="ONLINE">Online Portal</option>
                <option value="CARD">Credit / Debit Card</option>
                <option value="INSURANCE">Insurance Settlement</option>
                <option value="CASH">Hospital Cash Counter</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Item Description & Notes</label>
            <textarea
              rows="3"
              placeholder="Clinical itemization details, tests administered, medication, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-sm shadow-md shadow-secondary/20 transition-all disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Issue Invoice</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default InvoiceModal;
