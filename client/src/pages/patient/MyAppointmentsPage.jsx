import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  AlertCircle, 
  CalendarPlus, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  FileText,
  User,
  Stethoscope
} from 'lucide-react';
import { appointmentService } from '../../services/appointmentService';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = () => {
    setLoading(true);
    appointmentService.getAllAppointments({
      status: statusFilter,
      search: searchTerm
    })
      .then((res) => {
        if (res.appointments) setAppointments(res.appointments);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, searchTerm]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentService.deleteAppointment(id);
      fetchAppointments();
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">My Scheduled Appointments</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage your upcoming visits, past consultations, and cancellations</p>
        </div>
        <Link
          to="/patient/book-appointment"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-xs shadow-md shadow-secondary/20 transition-all shrink-0"
        >
          <CalendarPlus className="w-4 h-4" /> Book New Appointment
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, doctor or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving appointment records..." />
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 p-6 space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">No Appointments Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't scheduled any appointments matching this status filter.
            </p>
            <Link
              to="/patient/book-appointment"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 text-secondary font-bold text-xs hover:bg-secondary hover:text-white transition-all"
            >
              Book an Appointment Now →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Appointment ID</th>
                  <th className="py-3.5 px-5">Doctor Name</th>
                  <th className="py-3.5 px-5">Department</th>
                  <th className="py-3.5 px-5">Consultation Date</th>
                  <th className="py-3.5 px-5">Time Slot</th>
                  <th className="py-3.5 px-5">Reason</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-secondary">
                      {appt.appointmentNumber}
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={appt.doctor?.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&auto=format&fit=crop&q=80"}
                          alt={appt.doctor?.user?.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-bold text-slate-800">{appt.doctor?.user?.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5 font-medium text-slate-600">
                      {appt.department?.name}
                    </td>

                    <td className="py-4 px-5 font-semibold text-slate-700">
                      {new Date(appt.appointmentDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-4 px-5 font-mono text-slate-600">
                      {appt.timeSlot}
                    </td>

                    <td className="py-4 px-5 text-slate-500 max-w-[180px] truncate">
                      {appt.reason || 'General Consultation'}
                    </td>

                    <td className="py-4 px-5 text-center">
                      <Badge status={appt.status} />
                    </td>

                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedAppointment(appt)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-secondary hover:bg-slate-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                        <button
                          onClick={() => handleCancel(appt.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Cancel Appointment"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <Modal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          title={`Appointment Details: ${selectedAppointment.appointmentNumber}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                <Badge status={selectedAppointment.status} className="mt-1" />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Ref Number</span>
                <span className="font-mono font-bold text-secondary text-sm">{selectedAppointment.appointmentNumber}</span>
              </div>
            </div>

            <div className="space-y-2 p-3 bg-white border border-slate-100 rounded-xl">
              <p className="font-bold text-slate-400 uppercase text-[10px]">Doctor & Department</p>
              <div className="flex items-center gap-3">
                <img
                  src={selectedAppointment.doctor?.user?.avatar}
                  alt={selectedAppointment.doctor?.user?.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <p className="font-bold text-slate-800 text-sm">{selectedAppointment.doctor?.user?.name}</p>
                  <p className="text-secondary font-semibold">{selectedAppointment.doctor?.specialization}</p>
                  <p className="text-slate-400">{selectedAppointment.department?.name} • Room {selectedAppointment.doctor?.roomNumber || '101'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 text-[10px] block">Scheduled Date</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-secondary" />
                  {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Time Slot</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-secondary" />
                  {selectedAppointment.timeSlot}
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Reason for Visit</span>
              <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed">
                {selectedAppointment.reason || 'General health consultation.'}
              </p>
            </div>

            {selectedAppointment.notes && (
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Clinical Remarks</span>
                <p className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-slate-700 leading-relaxed">
                  {selectedAppointment.notes}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              {(selectedAppointment.status === 'PENDING' || selectedAppointment.status === 'CONFIRMED') ? (
                <button
                  onClick={() => handleCancel(selectedAppointment.id)}
                  className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold transition-colors"
                >
                  Cancel Appointment
                </button>
              ) : <span></span>}

              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyAppointmentsPage;
