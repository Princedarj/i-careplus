import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Calendar, Stethoscope, Award, DollarSign, Clock, User, CheckCircle2 } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const DoctorsPage = () => {
  const [searchParams] = useSearchParams();
  const initialDept = searchParams.get('department') || 'all';

  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState(initialDept);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    departmentService.getAllDepartments().then((res) => {
      if (res.departments) setDepartments(res.departments);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    doctorService.getAllDoctors({
      search: searchTerm,
      departmentId: selectedDept !== 'all' ? selectedDept : undefined
    })
      .then((res) => {
        if (res.doctors) setDoctors(res.doctors);
      })
      .finally(() => setLoading(false));
  }, [searchTerm, selectedDept]);

  return (
    <div className="space-y-12 pb-20">
      {/* Header Banner */}
      <section className="bg-primary text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
            Clinical Faculty Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Find Our Certified Physicians</h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Browse our faculty of board-certified specialists, review credentials and schedule outpatient consultations.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full sm:w-64 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-white"
            >
              <option value="all">All Medical Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSpinner text="Searching physician directory..." />
        ) : doctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No doctors matched your criteria</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting the department filter or searching a different term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 bg-slate-100">
                    <img
                      src={doc.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80"}
                      alt={doc.user?.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-secondary shadow-sm">
                      {doc.department?.name}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-slate-800">{doc.user?.name}</h3>
                    <p className="text-xs text-secondary font-semibold">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{doc.qualification}</p>

                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Experience</span>
                        <span className="font-bold text-slate-700">{doc.experience} Years</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Consultation Fee</span>
                        <span className="font-mono font-bold text-primary">${Number(doc.consultationFee).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-2">
                  <button
                    onClick={() => setSelectedDoctor(doc)}
                    className="w-full py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 font-semibold text-xs transition-colors"
                  >
                    View Doctor Profile
                  </button>
                  <Link
                    to={`/patient/book-appointment?doctor=${doc.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Book Consultation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Doctor Profile Modal */}
      {selectedDoctor && (
        <Modal
          isOpen={!!selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          title="Physician Profile Details"
          maxWidth="max-w-xl"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <img
                src={selectedDoctor.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80"}
                alt={selectedDoctor.user?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md bg-white"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-800">{selectedDoctor.user?.name}</h3>
                <p className="text-xs text-secondary font-bold">{selectedDoctor.specialization}</p>
                <p className="text-[11px] text-slate-500">{selectedDoctor.department?.name} Department</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Qualifications</span>
                <span className="font-bold text-slate-700">{selectedDoctor.qualification}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Clinical Experience</span>
                <span className="font-bold text-slate-700">{selectedDoctor.experience} Years of Practice</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">OPD Consultation Fee</span>
                <span className="font-mono font-bold text-primary text-sm">${Number(selectedDoctor.consultationFee).toFixed(2)} USD</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">OPD Location</span>
                <span className="font-bold text-slate-700">{selectedDoctor.roomNumber || 'Consultation Suite 1'}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Clinical Biography & Scope</p>
              <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                {selectedDoctor.bio || 'Board-certified medical practitioner committed to clinical excellence, evidence-based therapies, and compassionate patient care at i_CarePlus Medical Center.'}
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Hours: <strong className="text-slate-700">{selectedDoctor.workingHours}</strong>
              </span>
              <Link
                to={`/patient/book-appointment?doctor=${selectedDoctor.id}`}
                className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-xs shadow-md transition-all"
              >
                Proceed to Booking
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DoctorsPage;
