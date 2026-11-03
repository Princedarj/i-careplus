import React from 'react';
import { Menu, Bell, Shield, Calendar, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ setMobileOpen, title = 'Admin Workspace' }) => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

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
          <p className="text-xs text-slate-400 hidden sm:block">Hospital Operations, Resource Allocation & Analytics</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Date display */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-secondary" />
          <span>{currentDate}</span>
        </div>

        {/* Admin profile pill */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"}
            alt={user?.name}
            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-sm"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800">{user?.name || 'Dr. Administrator'}</p>
            <p className="text-[10px] text-teal-600 font-semibold">Super Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
