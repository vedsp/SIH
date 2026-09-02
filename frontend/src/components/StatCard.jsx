import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'sky', subtext, trend }) => {
  const colorMap = {
    sky: 'from-sky-500/20 to-blue-600/10 border-sky-500/30 text-sky-400',
    teal: 'from-teal-500/20 to-emerald-600/10 border-teal-500/30 text-teal-400',
    rose: 'from-rose-500/20 to-pink-600/10 border-rose-500/30 text-rose-400',
    amber: 'from-amber-500/20 to-orange-600/10 border-amber-500/30 text-amber-400',
    purple: 'from-purple-500/20 to-indigo-600/10 border-purple-500/30 text-purple-400',
  };

  const currentTheme = colorMap[color] || colorMap.sky;

  return (
    <div className={`glass-card p-5 rounded-2xl border bg-gradient-to-br ${currentTheme} relative overflow-hidden transition-all duration-200 hover:scale-[1.01]`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{title}</span>
        {Icon && (
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-white">{value}</div>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>

      {trend && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center gap-1.5 text-xs">
          <span className={trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-slate-500">{trend.label}</span>
        </div>
      )}
    </div>
  );
};
