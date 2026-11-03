import React, { useState } from 'react';
import { Settings, Bell, Shield, Lock, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const PatientSettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    appointmentReminders: true,
    prescriptionUpdates: true,
    billingAlerts: true,
    newsletter: false
  });
  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Account Preferences & Settings</h2>
        <p className="text-xs text-slate-400 mt-0.5">Manage notifications, communication channels, and session security</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      {/* Notification Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Bell className="w-5 h-5 text-secondary" />
          <h3 className="text-base font-bold text-slate-800">Hospital Notification Preferences</h3>
        </div>

        <div className="space-y-4 text-xs">
          {[
            {
              id: 'appointmentReminders',
              title: 'Appointment Confirmations & Reminders',
              desc: 'Receive alerts 24 hours prior to scheduled consultations.'
            },
            {
              id: 'prescriptionUpdates',
              title: 'Digital Prescription Alerts',
              desc: 'Get notified when your attending physician uploads an electronic prescription.'
            },
            {
              id: 'billingAlerts',
              title: 'Invoicing & Receipt Notices',
              desc: 'Receive digital invoice summaries and payment receipts.'
            },
            {
              id: 'newsletter',
              title: 'Hospital Health & Wellness Bulletin',
              desc: 'Quarterly health guidelines and wellness articles from our physicians.'
            }
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80">
              <div>
                <p className="font-bold text-slate-800">{item.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(item.id)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                  notifications[item.id] ? 'bg-secondary' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    notifications[item.id] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Access */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Shield className="w-5 h-5 text-secondary" />
          <h3 className="text-base font-bold text-slate-800">Security & Sign Out</h3>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div>
            <p className="font-bold text-slate-800">Password Management</p>
            <p className="text-slate-500 text-[11px]">Update your account secret from your profile tab.</p>
          </div>
          <Link
            to="/patient/profile"
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:border-secondary hover:text-secondary font-bold text-xs transition-colors"
          >
            Change Password
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div>
            <p className="font-bold text-slate-800">Terminate Active Session</p>
            <p className="text-slate-500 text-[11px]">Sign out from this device securely.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 font-bold text-xs transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out of Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientSettingsPage;
