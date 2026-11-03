import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { doctorService } from '../../services/doctorService';
import { Loader2, AlertCircle } from 'lucide-react';

const DoctorModal = ({ isOpen, onClose, doctor, departments, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    departmentId: '',
    qualification: '',
    specialization: '',
    experience: '5',
    consultationFee: '80',
    workingDays: 'Mon,Tue,Wed,Thu,Fri',
    workingHours: '09:00 AM - 05:00 PM',
    roomNumber: '',
    bio: '',
    status: 'ACTIVE'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.user?.name || '',
        email: doctor.user?.email || '',
        phone: doctor.user?.phone || '',
        departmentId: doctor.departmentId ? String(doctor.departmentId) : '',
        qualification: doctor.qualification || '',
        specialization: doctor.specialization || '',
        experience: String(doctor.experience || 1),
        consultationFee: String(doctor.consultationFee || 50),
        workingDays: doctor.workingDays || 'Mon,Tue,Wed,Thu,Fri',
        workingHours: doctor.workingHours || '09:00 AM - 05:00 PM',
        roomNumber: doctor.roomNumber || '',
        bio: doctor.bio || '',
        status: doctor.status || 'ACTIVE'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        departmentId: departments[0]?.id ? String(departments[0].id) : '',
        qualification: '',
        specialization: '',
        experience: '5',
        consultationFee: '80',
        workingDays: 'Mon,Tue,Wed,Thu,Fri',
        workingHours: '09:00 AM - 05:00 PM',
        roomNumber: '',
        bio: '',
        status: 'ACTIVE'
      });
    }
    setError('');
  }, [doctor, departments, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (doctor) {
        await doctorService.updateDoctor(doctor.id, formData);
      } else {
        await doctorService.createDoctor(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed. Please review inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={doctor ? 'Edit Doctor Profile' : 'Add New Physician / Specialist'} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="Dr. Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Email *</label>
            <input
              type="email"
              required
              disabled={!!doctor}
              placeholder="doctor@icareplus.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Department *</label>
            <select
              required
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm bg-white"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Qualification *</label>
            <input
              type="text"
              required
              placeholder="e.g. MD, FACC - Harvard Medicine"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Specialization *</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Interventional Cardiologist"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Experience (Years)</label>
            <input
              type="number"
              min="0"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Consultation Fee ($ USD)</label>
            <input
              type="number"
              min="0"
              step="5"
              value={formData.consultationFee}
              onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Working Days</label>
            <input
              type="text"
              placeholder="Mon,Tue,Wed,Thu,Fri"
              value={formData.workingDays}
              onChange={(e) => setFormData({ ...formData, workingDays: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Working Hours</label>
            <input
              type="text"
              placeholder="09:00 AM - 05:00 PM"
              value={formData.workingHours}
              onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Room / Suite Number</label>
            <input
              type="text"
              placeholder="Room 304, East Wing"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
            />
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

        <div>
          <label className="block font-bold text-slate-700 mb-1 text-xs">Physician Bio & Background</label>
          <textarea
            rows="3"
            placeholder="Brief profile, clinical expertise and research background..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
            <span>{doctor ? 'Save Changes' : 'Create Doctor Account'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DoctorModal;
