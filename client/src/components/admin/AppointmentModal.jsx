import React, { useState } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { appointmentService } from '../../services/appointmentService';
import { Loader2, AlertCircle, Calendar, Clock, User, Stethoscope } from 'lucide-react';

const AppointmentModal = ({ isOpen, onClose, appointment, onSuccess }) => {
  const [status, setStatus] = useState(appointment?.status || 'PENDING');
  const [notes, setNotes] = useState(appointment?.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!appointment) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await appointmentService.updateStatus(appointment.id, {
        status,
        notes
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update appointment status.');
    } finally {
      setLoading(false);
    }
  };

  const patient = appointment.patient || {};
  const patientUser = patient.user || {};
  const doctor = appointment.doctor || {};
  const doctorUser = doctor.user || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Appointment: ${appointment.appointmentNumber}`} maxWidth="max-w-xl">
      <form onSubmit={handleUpdate} className="space-y-5">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Summary card */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-secondary" />
              <span className="font-bold text-slate-800 text-sm">{patientUser.name || 'Patient'}</span>
            </div>
            <Badge status={appointment.status} />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-semibold">Doctor & Specialty</p>
              <p className="font-bold text-slate-700">{doctorUser.name || 'Doctor'}</p>
              <p className="text-slate-500 text-[11px]">{appointment.department?.name}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-semibold">Scheduled Time</p>
              <p className="font-bold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-secondary" />
                {new Date(appointment.appointmentDate).toLocaleDateString()}
              </p>
              <p className="text-slate-500 text-[11px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                {appointment.timeSlot}
              </p>
            </div>
          </div>

          {appointment.reason && (
            <div className="pt-2 border-t border-slate-200/60">
              <p className="text-slate-400 text-[10px] uppercase font-semibold">Reason for Visit</p>
              <p className="text-slate-700 mt-0.5">{appointment.reason}</p>
            </div>
          )}
        </div>

        {/* Status Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Update Status
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatus(st)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  status === st
                    ? st === 'CONFIRMED'
                      ? 'bg-teal-50 border-teal-500 text-teal-700 ring-2 ring-teal-500/20'
                      : st === 'COMPLETED'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500/20'
                      : st === 'CANCELLED'
                      ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20'
                      : 'bg-amber-50 border-amber-500 text-amber-700 ring-2 ring-amber-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Clinical / Administrative Notes
          </label>
          <textarea
            rows="3"
            placeholder="Add internal remarks, patient updates, or cancellation reasons..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-sm"
          ></textarea>
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
            <span>Save Status</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentModal;
