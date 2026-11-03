import React from 'react';

const Badge = ({ status, className = '' }) => {
  const norm = (status || '').toUpperCase();

  const styles = {
    // Appointment / Generic statuses
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    CONFIRMED: 'bg-teal-50 text-teal-700 border-teal-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    INACTIVE: 'bg-slate-100 text-slate-600 border-slate-200',

    // Billing statuses
    PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    UNPAID: 'bg-rose-50 text-rose-700 border-rose-200',
    PARTIAL: 'bg-blue-50 text-blue-700 border-blue-200',

    // Roles
    ADMIN: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    PATIENT: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    DOCTOR: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const currentStyle = styles[norm] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        norm === 'COMPLETED' || norm === 'PAID' || norm === 'ACTIVE' ? 'bg-emerald-500' :
        norm === 'CONFIRMED' ? 'bg-teal-500' :
        norm === 'PENDING' ? 'bg-amber-500' :
        norm === 'CANCELLED' ? 'bg-rose-500' : 'bg-slate-400'
      }`} />
      {status}
    </span>
  );
};

export default Badge;
