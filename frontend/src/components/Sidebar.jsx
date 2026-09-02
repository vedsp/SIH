import React from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  GitCompare, 
  AlertTriangle, 
  ShieldCheck, 
  MessageSquareCode, 
  FileSpreadsheet,
  Upload,
  Lock
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, onOpenUpload }) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'documents', label: 'Document Repository', icon: FileCheck2 },
    { id: 'verification', label: 'Cross-Verification', icon: GitCompare, badge: 'Phase 5' },
    { id: 'anomalies', label: 'Anomaly Detection', icon: AlertTriangle, badge: 'Phase 6' },
    { id: 'risk', label: 'Explainable Risk Score', icon: ShieldCheck },
    { id: 'assistant', label: 'FinDoc Assistant (RAG)', icon: MessageSquareCode, badge: 'Local AI' },
    { id: 'reports', label: 'Financial Reports', icon: FileSpreadsheet, badge: 'PDF' },
  ];

  return (
    <aside className="w-64 bg-[#0B0F19] border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-61px)]">
      <div className="p-4 space-y-6">
        <button
          onClick={onOpenUpload}
          className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-sky-600/25 transition active:scale-[0.98]"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>

        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
            Platform Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800/80">
        <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Lock className="w-3.5 h-3.5 text-teal-400" />
            <span>Zero-Cost Privacy Safeguard</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Local open-source processing enabled. Files stored in isolated database without third-party cloud data exposure.
          </p>
        </div>
      </div>
    </aside>
  );
};
