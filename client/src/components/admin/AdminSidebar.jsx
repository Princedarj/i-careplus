import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarClock, 
  Users, 
  UserPlus, 
  Building2, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const workspaceLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/admin/appointments', icon: CalendarClock },
    { name: 'Patients', path: '/admin/patients', icon: Users },
    { name: 'Doctors', path: '/admin/doctors', icon: UserPlus },
    { name: 'Departments', path: '/admin/departments', icon: Building2 },
    { name: 'Billing', path: '/admin/billing', icon: CreditCard },
  ];

  const preferenceLinks = [
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-950/40">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-secondary to-teal-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                i_<span className="text-secondary-400">CarePlus</span>
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-teal-400">
                Admin Workspace
              </p>
            </div>
          </NavLink>
        </div>

        {/* Admin profile pill */}
        <div className="p-4 mx-3 my-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 flex items-center gap-3">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"}
            alt={user?.name}
            className="w-10 h-10 rounded-xl border border-slate-600 object-cover"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.name || 'Administrator'}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              System Admin
            </span>
          </div>
        </div>

        {/* Scrollable nav items */}
        <div className="flex-1 px-3 py-2 space-y-6 overflow-y-auto">
          {/* Section: WORKSPACE */}
          <div className="space-y-1">
            <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </p>
            {workspaceLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-secondary text-white font-semibold shadow-md shadow-secondary/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Section: PREFERENCES */}
          <div className="space-y-1">
            <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Preferences
            </p>
            {preferenceLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-secondary text-white font-semibold shadow-md shadow-secondary/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* System live pill */}
        <div className="px-4 py-2 mx-3 my-2 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            MySQL Connected
          </span>
          <span className="font-mono text-[10px] text-slate-400">v1.0.0</span>
        </div>

        {/* Logout bottom */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
