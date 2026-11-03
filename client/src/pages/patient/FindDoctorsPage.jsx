import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, Stethoscope, Clock, DollarSign, Award } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const FindDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Hospital Medical Faculty</h2>
        <p className="text-xs text-slate-400 mt-0.5">Explore certified consultants and book an outpatient appointment</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by doctor or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full sm:w-56 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-secondary/40 bg-white"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <LoadingSpinner text="Searching clinical specialists..." />
      ) : doctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-2">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-700">No doctors found matching filters</p>
          <p className="text-xs text-slate-400">Try adjusting your department filter or search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={doc.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"}
                    alt={doc.user?.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md bg-white shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{doc.user?.name}</h3>
                    <p className="text-xs text-secondary font-bold">{doc.specialization}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800">
                      {doc.department?.name}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/80 text-xs space-y-1 text-slate-600">
                  <p className="truncate"><strong>Qualification:</strong> {doc.qualification}</p>
                  <p><strong>Experience:</strong> {doc.experience} Years of Practice</p>
                  <p><strong>Hours:</strong> {doc.workingHours}</p>
                  <p><strong>Room:</strong> {doc.roomNumber || 'OPD Suite'}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">OPD Fee</span>
                  <span className="font-mono font-bold text-primary text-base">${Number(doc.consultationFee).toFixed(0)}</span>
                </div>

                <Link
                  to={`/patient/book-appointment?doctor=${doc.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-xs shadow-md shadow-secondary/20 transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Consultation
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindDoctorsPage;
