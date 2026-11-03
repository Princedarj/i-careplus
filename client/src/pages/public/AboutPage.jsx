import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Award, Users, Target, Clock, Activity, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* Header Banner */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase tracking-wider">
            Excellence in Healthcare
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">About i_CarePlus Medical Center</h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Delivering visionary healthcare, clinical innovation, and compassionate service to thousands of families since 2010.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-secondary flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Our Mission</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To provide patient-centered, technologically progressive healthcare that elevates health outcomes, reduces clinical disparities, and restores quality of life with empathy, integrity, and clinical precision.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Our Vision</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To be the benchmark tertiary health provider and medical research institution renowned for zero-waiting hospital workflows, compassionate patient partnerships, and revolutionary digital medical solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">Guiding Principles</span>
          <h2 className="text-3xl font-extrabold text-primary">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Compassion First",
              desc: "Treating every patient and family member with human warmth, dignity, and active listening.",
              icon: Heart
            },
            {
              title: "Clinical Integrity",
              desc: "Unwavering commitment to medical ethics, transparent billing, and evidence-based medicine.",
              icon: ShieldCheck
            },
            {
              title: "Modern Innovation",
              desc: "Investing in state-of-the-art diagnostics, automated EHR systems, and robotic surgical suites.",
              icon: Activity
            },
            {
              title: "Universal Access",
              desc: "Providing equitable, timely healthcare consultations without bureaucratic roadblocks.",
              icon: Users
            }
          ].map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-soft space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-secondary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-800">{val.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leadership summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center gap-8">
          <img
            src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80"
            alt="Dr. Alexander Wright, Chief Medical Director"
            className="w-32 h-32 rounded-2xl object-cover border-2 border-teal-400 shadow-lg"
          />
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Hospital Administration</span>
            <h3 className="text-2xl font-bold">Dr. Alexander Wright, MD, FACS</h3>
            <p className="text-xs text-slate-400">Chief Medical Director & Hospital Superintendent</p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl pt-2">
              "At i_CarePlus, our philosophy is anchored in one promise: no patient should face medical uncertainty alone. By combining the finest clinical minds with intuitive digital health technology, we ensure your healing journey is smooth, transparent, and dignified."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
