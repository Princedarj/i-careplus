import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  UserCheck, 
  UserX, 
  Calendar, 
  FileText, 
  Phone, 
  Mail, 
  Activity 
} from 'lucide-react';
import { patientService } from '../../services/patientService';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PatientDetailModal from '../../components/admin/PatientDetailModal';

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected patient for modal
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const fetchPatients = () => {
    setLoading(true);
    patientService.getAllPatients({
      search: searchTerm,
      gender: genderFilter || undefined,
      bloodGroup: bloodGroupFilter || undefined,
      status: statusFilter || undefined
    })
      .then((res) => {
        if (res.patients) setPatients(res.patients);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPatients();
  }, [searchTerm, genderFilter, bloodGroupFilter, statusFilter]);

  const handleToggleStatus = async (patient) => {
    const newStatus = patient.user?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await patientService.updatePatient(patient.id, { status: newStatus });
      fetchPatients();
    } catch (err) {
      alert(err.message || 'Failed to update patient status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Patient Registry & Clinical Records</h2>
          <p className="text-xs text-slate-400 mt-0.5">Supervise patient profiles, appointment histories, medical notes, and account activations</p>
        </div>
        <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-teal-400 text-xs font-mono font-bold">
          {patients.length} Registered Patients
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-xs"
            />
          </div>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-white text-xs"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-white text-xs font-mono"
          >
            <option value="">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-white text-xs"
          >
            <option value="">All Account Statuses</option>
            <option value="ACTIVE">ACTIVE Only</option>
            <option value="INACTIVE">INACTIVE Only</option>
          </select>
        </div>
      </div>

      {/* Patient Master Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving patient registry..." />
        ) : patients.length === 0 ? (
          <div className="text-center py-16 p-6 space-y-2">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">No Patients Found</h4>
            <p className="text-xs text-slate-400">No patient files matched the selected search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Patient ID</th>
                  <th className="py-3.5 px-4">Patient Profile</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4 text-center">Consultations</th>
                  <th className="py-3.5 px-4 text-center">EHR History</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((pat) => (
                  <tr key={pat.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-secondary">
                      PAT-{pat.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={pat.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pat.user?.name}`}
                          alt={pat.user?.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-white"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{pat.user?.name}</p>
                          <p className="text-[10px] text-slate-400">{pat.gender || 'Not specified'} • {pat.dob ? `${new Date().getFullYear() - new Date(pat.dob).getFullYear()} yrs` : 'Age N/A'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <p className="truncate">{pat.user?.email}</p>
                      <p className="text-[11px] text-slate-400">{pat.user?.phone || 'No phone'}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-100">
                        {pat.bloodGroup || 'O+'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                      {pat._count?.appointments ?? 0}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-secondary">
                      {pat._count?.medicalRecords ?? 0}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <Badge status={pat.user?.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedPatientId(pat.id)}
                        className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-[11px] transition-colors inline-flex items-center gap-1 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" /> Full Record
                      </button>

                      <button
                        onClick={() => handleToggleStatus(pat)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          pat.user?.status === 'ACTIVE'
                            ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={pat.user?.status === 'ACTIVE' ? 'Deactivate Patient' : 'Activate Patient'}
                      >
                        {pat.user?.status === 'ACTIVE' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatientId && (
        <PatientDetailModal
          isOpen={!!selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
          patientId={selectedPatientId}
          onStatusChange={() => fetchPatients()}
        />
      )}
    </div>
  );
};

export default AdminPatients;
