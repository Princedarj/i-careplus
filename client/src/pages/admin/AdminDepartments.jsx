import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  Heart, 
  CheckCircle2, 
  Search 
} from 'lucide-react';
import { departmentService } from '../../services/departmentService';
import Badge from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DepartmentModal from '../../components/admin/DepartmentModal';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const fetchDepartments = () => {
    setLoading(true);
    departmentService.getAllDepartments()
      .then((res) => {
        if (res.departments) setDepartments(res.departments);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleEdit = (dept) => {
    setSelectedDept(dept);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedDept(null);
    setShowModal(true);
  };

  const handleDelete = async (dept) => {
    if (!window.confirm(`Are you sure you want to remove or deactivate department: ${dept.name}?`)) return;
    try {
      await departmentService.deleteDepartment(dept.id);
      fetchDepartments();
    } catch (err) {
      alert(err.message || 'Operation failed.');
    }
  };

  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.headOfDepartment && d.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Clinical Departments</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage hospital wings, department codes, heads of department, and doctor allocations</p>
        </div>

        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-xs shadow-md shadow-secondary/20 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft flex items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search department name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-xs"
          />
        </div>
        <span className="text-slate-400 text-xs hidden sm:inline">{filteredDepts.length} Clinical Units Active</span>
      </div>

      {/* Departments Grid */}
      {loading ? (
        <LoadingSpinner text="Retrieving clinical departments..." />
      ) : filteredDepts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-2">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-700">No Departments Found</h4>
          <p className="text-xs text-slate-400">Add a new medical department to start assigning physicians.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepts.map((dept) => {
            const docCount = dept.doctors?.length || dept._count?.doctors || 0;
            const apptCount = dept._count?.appointments || 0;

            return (
              <div
                key={dept.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-secondary flex items-center justify-center font-bold text-sm">
                      {dept.code}
                    </div>
                    <Badge status={dept.status} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{dept.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {dept.description || 'Specialized clinical care and diagnostic facilities.'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/80 text-xs space-y-1.5">
                    <p className="text-slate-700">
                      <strong>Department Head:</strong> {dept.headOfDepartment || 'Unassigned'}
                    </p>
                    <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200/60 text-[11px]">
                      <span>{docCount} Active Doctors</span>
                      <span>{apptCount} Total Consultations</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEdit(dept)}
                    className="p-2 rounded-xl text-slate-500 hover:text-secondary hover:bg-slate-100 transition-colors"
                    title="Edit Department"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(dept)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Deactivate / Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Department Modal */}
      {showModal && (
        <DepartmentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          department={selectedDept}
          onSuccess={() => fetchDepartments()}
        />
      )}
    </div>
  );
};

export default AdminDepartments;
