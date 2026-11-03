import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Calendar, 
  UserRoundCheck, 
  ShieldCheck, 
  HeartPulse, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Stethoscope, 
  Sparkles, 
  Building2, 
  Users, 
  Heart
} from 'lucide-react';
import { departmentService } from '../../services/departmentService';
import { doctorService } from '../../services/doctorService';

const HomePage = () => {
  const [departments, setDepartments] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      departmentService.getAllDepartments().catch(() => ({ departments: [] })),
      doctorService.getAllDoctors().catch(() => ({ doctors: [] }))
    ]).then(([deptRes, docRes]) => {
      if (deptRes.departments) setDepartments(deptRes.departments.slice(0, 6));
      if (docRes.doctors) setFeaturedDoctors(docRes.doctors.slice(0, 4));
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-[#F5F8FC] pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200/80 text-secondary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-secondary" />
                Next-Gen Healthcare SaaS Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight leading-[1.15]">
                Your Health, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-teal-500">
                  Our Priority.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Experience world-class clinical care with seamless digital access. Consult with board-certified physicians, schedule instant appointments, and manage prescriptions and electronic records from a unified medical portal.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/patient/book-appointment"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-secondary hover:bg-secondary-600 text-white font-bold text-base shadow-lg shadow-secondary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Appointment</span>
                </Link>

                <Link
                  to="/doctors"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-primary border border-slate-200 font-bold text-base shadow-sm hover:shadow transition-all"
                >
                  <UserRoundCheck className="w-5 h-5 text-secondary" />
                  <span>Find a Doctor</span>
                </Link>
              </div>

              {/* Quick Trust badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> JCI & NABH Accredited
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Verified Specialists
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 24/7 Emergency Response
                </span>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow backdrop */}
                <div className="absolute -inset-4 bg-gradient-to-r from-teal-400 to-primary opacity-20 blur-2xl rounded-3xl"></div>

                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80"
                    alt="i_CarePlus Medical Team"
                    className="w-full h-96 object-cover object-center"
                  />

                  {/* Floating Doctor stats card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-500/30">
                        <HeartPulse className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase">Live Hospital Status</p>
                        <p className="text-sm font-bold text-slate-800">Trauma Unit Active</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      OPD Open
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Hospital Statistics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-primary/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-700/60">
            <div className="pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary-400 tracking-tight font-mono">15k+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Patients Treated Yearly</p>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-teal-300 tracking-tight font-mono">50+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Senior Medical Specialists</p>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-secondary-400 tracking-tight font-mono">99.4%</p>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Patient Satisfaction Rate</p>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-teal-300 tracking-tight font-mono">24/7</p>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">Trauma & ICU Availability</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Clinical Departments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Centers of Clinical Excellence</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mt-1">
              Explore Our Medical Departments
            </h2>
          </div>
          <Link
            to="/departments"
            className="flex items-center gap-1.5 text-sm font-bold text-secondary hover:text-secondary-600 transition-colors"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-secondary flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-white transition-colors">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-secondary transition-colors">
                  {dept.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600">
                  {dept.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {dept.description || 'Specialized diagnostic and therapeutic clinical support by leading medical consultants.'}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Head: {dept.headOfDepartment || 'Chief Medical Officer'}</span>
                <Link
                  to={`/doctors?department=${dept.id}`}
                  className="font-bold text-secondary hover:underline"
                >
                  Consult Doctor →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Doctors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Meet Our Specialists</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mt-1">
              Top Ranked Medical Practitioners
            </h2>
          </div>
          <Link
            to="/doctors"
            className="flex items-center gap-1.5 text-sm font-bold text-secondary hover:text-secondary-600 transition-colors"
          >
            <span>All Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={doc.user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80"}
                    alt={doc.user?.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-sm text-secondary shadow-sm">
                      {doc.department?.name}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-slate-800">{doc.user?.name}</h3>
                  <p className="text-xs text-secondary font-semibold">{doc.specialization}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{doc.qualification}</p>
                  
                  <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                    <span>Experience: <strong>{doc.experience} Years</strong></span>
                    <span className="font-mono font-bold text-primary">${Number(doc.consultationFee).toFixed(0)} fee</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to="/patient/book-appointment"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-50 hover:bg-secondary hover:text-white text-secondary font-bold text-xs transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Consultation
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Why Choose i_CarePlus? */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">The i_CarePlus Advantage</span>
            <h2 className="text-3xl font-extrabold text-primary tracking-tight">Why Choose Our Hospital System?</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              We combine compassionate healthcare delivery with modern medical software architecture to deliver zero waiting times, accurate digital diagnostic tracking, and patient-first care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Zero-Wait Priority Scheduling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart real-time slot allocation ensures patients never wait in long hospital lines. Receive confirmed time slots directly synced with your physician's schedule.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">100% Relational Medical Records</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prescriptions, laboratory tests, vitals, and physician notes are permanently preserved in our secure relational database, accessible anywhere from your patient portal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center shadow-md shadow-secondary/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Transparent Simulated Billing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Itemized hospital invoices, electronic receipts, and seamless demo checkout for academic demonstration without unexpected charges or opaque fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">Verified Feedback</span>
          <h2 className="text-3xl font-extrabold text-primary tracking-tight">What Our Patients Say</h2>
          <p className="text-xs text-slate-400 italic">Demo patient testimonials for university academic presentation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Marcus Miller",
              role: "Cardiology Patient",
              quote: "The patient dashboard made booking with Dr. Mitchell seamless. I could view my stress ECG report and download my prescription within minutes of the consultation.",
              rating: 5
            },
            {
              name: "Olivia Sterling",
              role: "General OPD Patient",
              quote: "Hospital staff was exceptionally welcoming. Having my medical records and invoices in one secure portal gave me complete confidence in my family's ongoing care.",
              rating: 5
            },
            {
              name: "Ethan Cooper",
              role: "Diabetes Care Patient",
              quote: "Prescription reminders and lab report updates are instant. The doctor was very patient and explained every medicine and dietary change in detail.",
              rating: 5
            }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-soft space-y-4">
              <div className="flex text-amber-400 text-sm">
                {"★".repeat(item.rating)}
              </div>
              <p className="text-xs text-slate-600 italic leading-relaxed">"{item.quote}"</p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-bold text-xs">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{item.name}</p>
                  <p className="text-[10px] text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Emergency Consultation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-slate-900 text-white p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Immediate Assistance
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Need Urgent Emergency Care?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Our 24-hour trauma center and emergency triage staff are on call around the clock. Call our dedicated emergency dispatch unit immediately.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <a
              href="tel:18009112273"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call +1 (800) 911-CARE</span>
            </a>
            <Link
              to="/patient/book-appointment"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Book OPD Slot
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
