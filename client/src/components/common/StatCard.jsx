import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'teal', trend }) => {
  const colorSchemes = {
    teal: {
      bg: 'bg-teal-50',
      text: 'text-secondary-600',
      border: 'border-teal-100',
      iconBg: 'bg-teal-500 text-white'
    },
    navy: {
      bg: 'bg-slate-50',
      text: 'text-primary-600',
      border: 'border-slate-100',
      iconBg: 'bg-primary-600 text-white'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-500 text-white'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      iconBg: 'bg-amber-500 text-white'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      iconBg: 'bg-rose-500 text-white'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-500 text-white'
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.teal;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft hover:shadow-card transition-all duration-200 flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <p className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 flex items-center gap-1">
            {subtitle}
          </p>
        )}
      </div>
      {Icon && (
        <div className={`p-3 rounded-xl ${scheme.iconBg} shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
