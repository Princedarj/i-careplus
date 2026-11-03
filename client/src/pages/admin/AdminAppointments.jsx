import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Check, 
  Trash2, 
  User, 
  Stethoscope, 
  Building2 
} from 'lucide-react';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AppointmentModal from '../../components/admin/AppointmentModal';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected appointment for modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = () => {
    setLoading(true);
    appointmentService.getAllAppointments({
      status: statusFilter,
      doctorId: doctorFilter,
      departmentId: departmentFilter,
      date: dateFilter,
      search: searchTerm
    })
      .then((res) => {
        if (res.appointments) setAppointments(res.appointments);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    doctorService.getAllDoctors().then((res) => {
      if (res.doctors) setDoctors(res.doctors);
    });
    departmentService.getAllDepartments().then((res) => {
      if (res.departments) setDepartments(res.departments);
    });
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, doctorFilter, departmentFilter, dateFilter, searchTerm]);

  const handleQuickStatus = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, { status });
      fetchAppointments();
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment record from MySQL?')) return;
    try {
      await appointmentService.deleteAppointment(id);
      fetchAppointments();
    } catch (err) {
      alert(err.message || 'Failed to delete record.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Appointment Central</h2>
          <p className="text-xs text-slate-400 mt-0.5">Filter, verify, confirm, and supervise outpatient consultation schedules</p>
        </div>
        <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-teal-400 text-xs font-mono font-bold">
          {appointments.length} Total Appointments
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Term */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient, doc or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-xs"
            />
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-white text-xs"
          >
            <option value="ALL">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Doctor Filter */}
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-white text-xs"
          >
            <option value="ALL">All Doctors</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.user?.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-white text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-white text-xs"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="absolute right-7 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Appointments Master Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving appointment records from MySQL..." />
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 p-6 space-y-2">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">No Appointments Matched</h4>
            <p className="text-xs text-slate-400">Try broadening your search query or reset date/status filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Appt Number</th>
                  <th className="py-3.5 px-4">Patient Name</th>
                  <th className="py-3.5 px-4">Assigned Doctor</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-secondary">
                      {appt.appointmentNumber}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {appt.patient?.user?.name}
                      <span className="text-[10px] text-slate-400 block font-normal">{appt.patient?.user?.phone || 'No phone'}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {appt.doctor?.user?.name}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {appt.department?.name}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-semibold block">{new Date(appt.appointmentDate).toLocaleDateString()}</span>
                      <span className="font-mono text-[10px] text-slate-400">{appt.timeSlot}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Badge status={appt.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      {appt.status !== 'CONFIRMED' && appt.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleQuickStatus(appt.id, 'CONFIRMED')}
                          className="px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 text-[10px] font-bold transition-colors"
                          title="Confirm"
                        >
                          Confirm
                        </button>
                      )}

                      {appt.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleQuickStatus(appt.id, 'COMPLETED')}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold transition-colors"
                          title="Mark Completed"
                        >
                          Complete
                        </button>
                      )}

                      {appt.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleQuickStatus(appt.id, 'CANCELLED')}
                          className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold transition-colors"
                          title="Cancel"
                        >
                          Cancel
                        </button>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => setSelectedAppointment(appt)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-secondary hover:bg-slate-100"
                        title="Edit & Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(appt.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointment Edit Modal */}
      {selectedAppointment && (
        <AppointmentModal
          isOpen={!!selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          appointment={selectedAppointment}
          onSuccess={() => fetchAppointments()}
        />
      )}
    </div>
  );
};

export default AdminAppointments;
