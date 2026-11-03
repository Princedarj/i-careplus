import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Calendar, User, Search, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PatientHeader = ({ setMobileOpen, title = 'Patient Workspace' }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
          <p className="text-xs text-slate-400 hidden sm:block">Welcome back, {user?.name} – manage your health records & appointments</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Book appointment quick CTA */}
        <Link
          to="/patient/book-appointment"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-secondary hover:bg-secondary-600 transition-colors shadow-sm shadow-secondary/20"
        >
          <Calendar className="w-3.5 h-3.5" /> Book Appointment
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-800">Notifications</p>
                <span className="text-[11px] font-semibold text-secondary">3 Recent</span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-100/60">
                  <p className="font-bold text-slate-800">Appointment Confirmed</p>
                  <p className="text-slate-500 text-[11px]">Your consultation with Dr. Sarah Mitchell is scheduled for this week.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-bold text-slate-800">Prescription Issued</p>
                  <p className="text-slate-500 text-[11px]">Dr. Linda Gomez has uploaded your digital prescription.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <Link
          to="/patient/profile"
          className="flex items-center gap-2.5 pl-2 border-l border-slate-100 group"
        >
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Patient'}`}
            alt={user?.name}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 group-hover:ring-2 ring-secondary/30 transition-all"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 group-hover:text-secondary transition-colors">{user?.name}</p>
            <p className="text-[10px] text-slate-400 capitalize">{user?.role?.toLowerCase() || 'Patient'}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default PatientHeader;
