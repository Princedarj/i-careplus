import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  CalendarCheck, 
  UserRoundCheck, 
  FileText, 
  Pill, 
  CreditCard, 
  User, 
  Settings, 
  LogOut,
  Activity,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PatientSidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Book Appointment', path: '/patient/book-appointment', icon: CalendarPlus },
    { name: 'My Appointments', path: '/patient/appointments', icon: CalendarCheck },
    { name: 'Find Doctors', path: '/patient/doctors', icon: UserRoundCheck },
    { name: 'Medical Records', path: '/patient/records', icon: FileText },
    { name: 'Prescriptions', path: '/patient/prescriptions', icon: Pill },
    { name: 'Billing & Payments', path: '/patient/billing', icon: CreditCard },
    { name: 'My Profile', path: '/patient/profile', icon: User },
    { name: 'Settings', path: '/patient/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-100 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-secondary/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-primary tracking-tight">
                i_<span className="text-secondary">CarePlus</span>
              </span>
              <p className="text-[10px] uppercase font-bold tracking-wider text-secondary">
                Patient Portal
              </p>
            </div>
          </NavLink>
        </div>

        {/* Patient Profile Card summary */}
        <div className="p-4 mx-3 my-3 bg-gradient-to-br from-slate-50 to-teal-50/40 rounded-2xl border border-slate-100/80 flex items-center gap-3">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Patient'}`}
            alt={user?.name}
            className="w-11 h-11 rounded-full border-2 border-white shadow-sm bg-white object-cover"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Valued Patient'}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 text-teal-800">
              Patient ID: #{user?.patient?.id ? `PAT-${user.patient.id}` : 'PAT-001'}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-secondary text-white font-semibold shadow-sm shadow-secondary/30'
                      : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Emergency quick help card in sidebar */}
        <div className="p-3 mx-3 my-2 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs">
          <div className="flex items-center gap-2 font-bold mb-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Need Immediate Care?
          </div>
          <p className="text-rose-600 text-[11px] leading-tight">Emergency OPD Hotline: <strong>+1 (800) 911-CARE</strong></p>
        </div>

        {/* Logout bottom */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default PatientSidebar;
