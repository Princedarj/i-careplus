import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-secondary to-teal-400 flex items-center justify-center text-white shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                i_<span className="text-secondary-400">CarePlus</span>
              </span>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your Health, Our Priority. Providing world-class medical excellence, compassionate patient care, and cutting-edge healthcare technology.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-teal-300 border border-slate-700">
                <ShieldCheck className="w-4 h-4" /> NABH & JCI Accredited Hospital
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-teal-300 transition-colors">About i_CarePlus</Link></li>
              <li><Link to="/services" className="hover:text-teal-300 transition-colors">Specialized Services</Link></li>
              <li><Link to="/departments" className="hover:text-teal-300 transition-colors">Clinical Departments</Link></li>
              <li><Link to="/doctors" className="hover:text-teal-300 transition-colors">Find a Doctor</Link></li>
              <li><Link to="/login" className="hover:text-teal-300 transition-colors">Patient Portal Sign In</Link></li>
              <li><Link to="/admin/login" className="hover:text-teal-300 transition-colors">Hospital Admin Portal</Link></li>
            </ul>
          </div>

          {/* Col 3: Medical Departments */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide uppercase">Specialties</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/departments" className="hover:text-teal-300 transition-colors">Cardiovascular Sciences</Link></li>
              <li><Link to="/departments" className="hover:text-teal-300 transition-colors">Neurology & Spine Care</Link></li>
              <li><Link to="/departments" className="hover:text-teal-300 transition-colors">Orthopedics & Joint Surgery</Link></li>
              <li><Link to="/departments" className="hover:text-teal-300 transition-colors">Pediatrics & Child Wellness</Link></li>
              <li><Link to="/departments" className="hover:text-teal-300 transition-colors">Dermatology & Cosmetology</Link></li>
              <li><Link to="/departments" className="hover:text-teal-300 transition-colors">Obstetrics & Gynecology</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Emergency */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide uppercase">Emergency & Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary-400 shrink-0 mt-0.5" />
                <span>742 Evergreen Healthcare Ave, Medical District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary-400 shrink-0" />
                <span className="font-semibold text-white">+1 (800) 422-7375</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary-400 shrink-0" />
                <span>contact@icareplus.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary-400 shrink-0 mt-0.5" />
                <span>24/7 Trauma Emergency | OPD: 8:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* System info strip */}
        <div className="my-8 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col md:flex-row items-center justify-between text-xs text-slate-300 gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold uppercase tracking-wider">
              Accredited Medical System
            </span>
            <span className="text-slate-300">NABH & JCI Certified Tertiary Healthcare Infrastructure</span>
          </div>
          <span className="text-slate-400 font-mono">React • Node.js • Express • MySQL</span>
        </div>

        {/* Bottom bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} i_CarePlus Medical Center. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Healthcare Excellence
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
