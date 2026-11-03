import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Stethoscope, 
  DollarSign, 
  Clock, 
  Building2, 
  CheckCircle2, 
  Eye, 
  UserCheck, 
  UserX 
} from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DoctorModal from '../../components/admin/DoctorModal';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Modals
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctorToEdit, setDoctorToEdit] = useState(null);

  const fetchDoctors = () => {
    setLoading(true);
    doctorService.getAllDoctors({
      search: searchTerm,
      departmentId: departmentFilter !== 'all' ? departmentFilter : undefined
    })
      .then((res) => {
        if (res.doctors) setDoctors(res.doctors);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    departmentService.getAllDepartments().then((res) => {
      if (res.departments) setDepartments(res.departments);
    });
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [searchTerm, departmentFilter]);

  const handleToggleStatus = async (doc) => {
    const newStatus = doc.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await doctorService.updateDoctor(doc.id, { status: newStatus });
      fetchDoctors();
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  const handleEdit = (doc) => {
    setDoctorToEdit(doc);
    setShowDoctorModal(true);
  };

  const handleAddNew = () => {
    setDoctorToEdit(null);
    setShowDoctorModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Medical Staff & Specialists</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage physician credentials, consultation fees, departments, and schedules</p>
        </div>

        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-xs shadow-md shadow-secondary/20 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Add New Doctor
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctor by name, qualification or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-white text-xs"
            >
              <option value="all">All Medical Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving medical specialists..." />
        ) : doctors.length === 0 ? (
          <div className="text-center py-16 p-6 space-y-2">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">No Doctors Found</h4>
            <p className="text-xs text-slate-400">Click "Add New Doctor" to onboard a new physician.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Doctor Profile</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Experience & Degree</th>
                  <th className="py-3.5 px-4">Fee ($)</th>
                  <th className="py-3.5 px-4">Working Schedule</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&auto=format&fit=crop&q=80"}
                          alt={doc.user?.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-white"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{doc.user?.name}</p>
                          <p className="text-secondary font-semibold text-[11px]">{doc.specialization}</p>
                          <p className="text-[10px] text-slate-400">{doc.user?.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {doc.department?.name}
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <span className="font-bold text-slate-800 block">{doc.experience} Years Practice</span>
                      <span className="text-[10px] text-slate-500">{doc.qualification}</span>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-primary">
                      ${Number(doc.consultationFee).toFixed(2)}
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <p className="font-medium">{doc.workingDays}</p>
                      <p className="text-[10px] text-slate-400">{doc.workingHours}</p>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <Badge status={doc.status} />
                    </td>

                    <td className="py-4 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleEdit(doc)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-secondary hover:bg-slate-100"
                        title="Edit Doctor Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleToggleStatus(doc)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          doc.status === 'ACTIVE'
                            ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={doc.status === 'ACTIVE' ? 'Deactivate Doctor' : 'Activate Doctor'}
                      >
                        {doc.status === 'ACTIVE' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Doctor Add/Edit Modal */}
      {showDoctorModal && (
        <DoctorModal
          isOpen={showDoctorModal}
          onClose={() => setShowDoctorModal(false)}
          doctor={doctorToEdit}
          departments={departments}
          onSuccess={() => fetchDoctors()}
        />
      )}
    </div>
  );
};

export default AdminDoctors;
