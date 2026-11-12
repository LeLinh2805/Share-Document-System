import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    pro: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold shadow-sm',
    admin: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variantClasses[variant] || variantClasses.default
      } ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

