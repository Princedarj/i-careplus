import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Brain, 
  Bone, 
  Baby, 
  Sparkles, 
  Stethoscope, 
  Smile, 
  Activity, 
  Users, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { departmentService } from '../../services/departmentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const iconMap = {
  Heart,
  Brain,
  Bone,
  Baby,
  Sparkles,
  Stethoscope,
  Smile,
  Activity
};

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    departmentService.getAllDepartments()
      .then((res) => {
        if (res.departments) setDepartments(res.departments);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
            Clinical Specialization
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Our Medical Departments</h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Multi-disciplinary excellence equipped with advanced diagnostics, dedicated operating suites, and renowned medical consultants.
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSpinner text="Loading hospital clinical departments..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => {
              const Icon = iconMap[dept.icon] || Activity;
              const docCount = dept.doctors?.length || dept._count?.doctors || 0;

              return (
                <div
                  key={dept.id}
                  className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 rounded-2xl bg-teal-50 text-secondary flex items-center justify-center">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
                        {dept.code}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800">{dept.name}</h3>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {dept.description || 'Specialized diagnostic investigations, patient treatment regimens, and outpatient therapeutic consultations.'}
                    </p>

                    <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                      <p className="text-slate-600">
                        Head: <strong className="text-slate-800">{dept.headOfDepartment || 'Chief Medical Specialist'}</strong>
                      </p>
                      <p className="text-slate-400">
                        Active Specialists: <span className="font-semibold text-secondary">{docCount} Physicians</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/doctors?department=${dept.id}`}
                      className="text-xs font-bold text-slate-600 hover:text-secondary flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" /> View Faculty
                    </Link>
                    <Link
                      to={`/patient/book-appointment`}
                      className="text-xs font-bold text-secondary hover:text-secondary-600 flex items-center gap-1"
                    >
                      <span>Book Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default DepartmentsPage;
