import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { departmentService } from '../../services/departmentService';
import { Loader2, AlertCircle } from 'lucide-react';

const DepartmentModal = ({ isOpen, onClose, department, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    headOfDepartment: '',
    icon: 'Heart',
    status: 'ACTIVE'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        code: department.code || '',
        description: department.description || '',
        headOfDepartment: department.headOfDepartment || '',
        icon: department.icon || 'Heart',
        status: department.status || 'ACTIVE'
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
        headOfDepartment: '',
        icon: 'Heart',
        status: 'ACTIVE'
      });
    }
    setError('');
  }, [department, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (department) {
        await departmentService.updateDepartment(department.id, formData);
      } else {
        await departmentService.createDepartment(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save department.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={department ? 'Edit Department' : 'Add Clinical Department'} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Department Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Cardiology"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Department Code * (Unique)</label>
            <input
              type="text"
              required
              placeholder="e.g. CARD"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Head of Department (Physician Name)</label>
            <input
              type="text"
              placeholder="e.g. Dr. Sarah Mitchell"
              value={formData.headOfDepartment}
              onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description & Clinical Scope</label>
            <textarea
              rows="3"
              placeholder="Overview of medical services and treatments offered..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm bg-white"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
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
            <span>{department ? 'Update Department' : 'Create Department'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DepartmentModal;
