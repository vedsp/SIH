import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'sky', subtext, trend }) => {
  const colorMap = {
    sky: 'border-[#c5d8e1] text-[#24536b]',
    teal: 'border-[#bfd9d1] text-[#276b5b]',
    rose: 'border-[#e4c9c4] text-[#a04e42]',
    amber: 'border-[#e6d3b2] text-[#a56316]',
    purple: 'border-[#d3cde0] text-[#625079]',
  };

  const currentTheme = colorMap[color] || colorMap.sky;

  return (
    <div className={`glass-card p-5 rounded-lg border ${currentTheme} relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-[#f3f6f7] border border-slate-800">
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
