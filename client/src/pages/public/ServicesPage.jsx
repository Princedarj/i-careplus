import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  Stethoscope, 
  Activity, 
  Pill, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  PhoneCall 
} from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      title: "24/7 Emergency & Trauma Care",
      desc: "Level-1 emergency facilities equipped with advanced life support ambulances, cardiac defibrillation, and dedicated trauma resuscitation suites.",
      icon: HeartPulse,
      badge: "24/7 Available"
    },
    {
      title: "Outpatient Multi-Specialty Clinics",
      desc: "Scheduled day consultations with senior consultants across 8 medical faculties. Modern OPD chambers with digital appointment tracking.",
      icon: Stethoscope,
      badge: "OPD Mon-Sat"
    },
    {
      title: "Advanced Diagnostic Radiology & Lab",
      desc: "Comprehensive diagnostic imaging including 128-slice CT scans, 3T MRI, 4D Ultrasonography, digital X-rays, and automated biochemistry lab panels.",
      icon: Activity,
      badge: "Instant Digital Reports"
    },
    {
      title: "Cardiovascular Catheterization & Stenting",
      desc: "Dedicated interventional cardiology suite for emergency angiograms, coronary angioplasties, pacemaker implants, and structural heart procedures.",
      icon: HeartPulse,
      badge: "Specialized Cardiac"
    },
    {
      title: "In-House Digital Pharmacy",
      desc: "Automated prescription fulfillment linked directly to doctor e-prescriptions. Verified genuine medications and pharmacist consultation.",
      icon: Pill,
      badge: "Full Stock"
    },
    {
      title: "Comprehensive Health Check Packages",
      desc: "Preventive health screenings, executive cardiac profiles, diabetes monitoring panels, and well-woman annual health checkup packages.",
      icon: ShieldCheck,
      badge: "Preventive Care"
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
            Clinical Services
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Our Comprehensive Healthcare Services</h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From routine preventive checkups to complex tertiary surgical interventions, i_CarePlus delivers seamless, end-to-end medical care.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-secondary flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                      {srv.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{srv.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{srv.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Standard Protocols</span>
                  <Link
                    to="/patient/book-appointment"
                    className="font-bold text-secondary hover:text-secondary-600"
                  >
                    Schedule Service →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Emergency Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-teal-500 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-teal-500/20">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold">Need Assistance Choosing a Clinical Service?</h3>
            <p className="text-xs sm:text-sm text-teal-100">
              Our front desk patient counseling team is available to assist you with physician matching and triage.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-2xl bg-white text-secondary font-bold text-sm hover:bg-slate-50 transition-colors shadow-md shrink-0"
          >
            Contact Hospital Triage
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
