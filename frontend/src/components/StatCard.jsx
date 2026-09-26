import React from 'react';

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'neutral', 
  subtext, 
  trend,
  isUrgent = false,
  badgeText = null
}) => {
  // Strict Semantic Palette Mapping
  const themeMap = {
    // Neutral Brand (Documents Processed / General metrics)
    neutral: {
      card: 'bg-white border-slate-200 text-slate-900',
      iconBox: 'bg-slate-100 text-slate-700 border-slate-200',
      valueText: 'text-slate-900',
      label: 'text-slate-600',
      subtext: 'text-slate-500'
    },
    // Positive Semantic (Total Revenue / Credits / Good Cash Flow)
    emerald: {
      card: 'bg-emerald-50/40 border-emerald-200 text-emerald-950',
      iconBox: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      valueText: 'text-emerald-900',
      label: 'text-emerald-800',
      subtext: 'text-emerald-700'
    },
    // Negative Semantic (Total Expenses / Debits / Deficit)
    rose: {
      card: 'bg-rose-50/40 border-rose-200 text-rose-950',
      iconBox: 'bg-rose-100 text-rose-700 border-rose-200',
      valueText: 'text-rose-900',
      label: 'text-rose-800',
      subtext: 'text-rose-700'
    },
    // Warning Semantic (Moderate Risk / Verification flags)
    amber: {
      card: 'bg-amber-50/60 border-amber-300 text-amber-950',
      iconBox: 'bg-amber-100 text-amber-700 border-amber-300',
      valueText: 'text-amber-900',
      label: 'text-amber-800',
      subtext: 'text-amber-700'
    },
    // High Urgency / High Risk Alert
    danger: {
      card: 'bg-gradient-to-br from-rose-50 to-amber-50/70 border-2 border-rose-400 text-rose-950 shadow-sm shadow-rose-500/10 ring-2 ring-rose-400/20',
      iconBox: 'bg-rose-500 text-white border-rose-600 animate-pulse',
      valueText: 'text-rose-950 font-black',
      label: 'text-rose-900 font-bold',
      subtext: 'text-rose-800 font-medium'
    }
  };

  const theme = themeMap[color] || themeMap.neutral;

  return (
    <div className={`p-4 md:p-5 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between ${theme.card}`}>
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={`text-[11px] font-bold tracking-wider uppercase ${theme.label}`}>
            {title}
          </span>
          {badgeText && (
            <span className="text-[9px] font-mono font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-2xs uppercase">
              {badgeText}
            </span>
          )}
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg border shrink-0 ${theme.iconBox}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="mt-3">
        <div className={`text-2xl font-extrabold tracking-tight font-mono ${theme.valueText}`}>
          {value}
        </div>
        {subtext && (
          <p className={`text-xs mt-1 font-medium ${theme.subtext}`}>
            {subtext}
          </p>
        )}
      </div>

      {/* Optional Trend Bar */}
      {trend && (
        <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-xs">
          <span className={trend.isPositive ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-slate-500">{trend.label}</span>
        </div>
      )}
    </div>
  );
};
