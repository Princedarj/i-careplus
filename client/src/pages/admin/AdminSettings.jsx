import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Lock, 
  Shield, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  User 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const AdminSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Hospital settings
  const [hospitalInfo, setHospitalInfo] = useState({
    hospitalName: 'i_CarePlus Medical Center',
    tagline: 'Your Health, Our Priority.',
    email: 'contact@icareplus.com',
    phone: '+1 (800) 422-7375',
    emergencyPhone: '+1 (800) 911-CARE',
    address: '742 Evergreen Healthcare Ave, Medical District, NY 10001',
    workingHours: '24/7 Trauma Emergency | OPD: Mon - Sat 8:00 AM - 8:00 PM'
  });
  const [hospitalSaved, setHospitalSaved] = useState(false);

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  const handleHospitalSubmit = (e) => {
    e.preventDefault();
    setHospitalSaved(true);
    setTimeout(() => setHospitalSaved(false), 3000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwdError('New password and confirmation do not match.');
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }

    setPwdLoading(true);

    try {
      const res = await authService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });

      if (res.success) {
        setPwdSuccess('Administrator password updated successfully.');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPwdSuccess(''), 4000);
      }
    } catch (err) {
      setPwdError(err.message || 'Current password was incorrect.');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Hospital System Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">Supervise hospital organization profile, administrative credentials, and dispatch lines</p>
      </div>

      {/* Hospital Identity Settings */}
      <form onSubmit={handleHospitalSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft space-y-5 text-xs">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Building2 className="w-5 h-5 text-secondary" />
          <h3 className="text-base font-bold text-slate-800">Hospital Organization Profile</h3>
        </div>

        {hospitalSaved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Hospital metadata updated!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Hospital Organization Name</label>
            <input
              type="text"
              value={hospitalInfo.hospitalName}
              onChange={(e) => setHospitalInfo({ ...hospitalInfo, hospitalName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Brand Tagline</label>
            <input
              type="text"
              value={hospitalInfo.tagline}
              onChange={(e) => setHospitalInfo({ ...hospitalInfo, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Central Helpdesk Line</label>
            <input
              type="text"
              value={hospitalInfo.phone}
              onChange={(e) => setHospitalInfo({ ...hospitalInfo, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Emergency Dispatch Line</label>
            <input
              type="text"
              value={hospitalInfo.emergencyPhone}
              onChange={(e) => setHospitalInfo({ ...hospitalInfo, emergencyPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40 font-mono font-bold text-rose-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Hospital Inquiries Email</label>
            <input
              type="email"
              value={hospitalInfo.email}
              onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Operating Hours Schedule</label>
            <input
              type="text"
              value={hospitalInfo.workingHours}
              onChange={(e) => setHospitalInfo({ ...hospitalInfo, workingHours: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Physical Campus Address</label>
            <input
              type="text"
              value={hospitalInfo.address}
              onChange={(e) => setHospitalInfo({ ...hospitalInfo, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white font-bold text-xs shadow-md transition-all"
          >
            Save Hospital Information
          </button>
        </div>
      </form>

      {/* Admin Password Change Form */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft space-y-5 text-xs">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Lock className="w-5 h-5 text-secondary" />
          <h3 className="text-base font-bold text-slate-800">Administrator Password & Security</h3>
        </div>

        {pwdSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{pwdSuccess}</span>
          </div>
        )}

        {pwdError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pwdError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Current Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">New Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            disabled={pwdLoading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            {pwdLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Update Admin Password</span>
          </button>
        </div>
      </form>

      {/* Admin Sign Out */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
        <div>
          <h4 className="font-bold text-slate-800">Close Administrator Session</h4>
          <p className="text-slate-400 text-[11px]">Sign out of the supervisory workspace portal.</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 font-bold text-xs transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out Administrator
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
