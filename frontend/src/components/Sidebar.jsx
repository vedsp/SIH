import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileCheck2, 
  GitCompare, 
  AlertTriangle, 
  ShieldCheck, 
  MessageSquareCode, 
  FileSpreadsheet,
  Upload,
  Lock,
  ChevronDown
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, onOpenUpload, onSelectCategory }) => {
  const [openSections, setOpenSections] = useState({
    'Document management': activeTab === 'documents',
    'Audit & verification': ['verification', 'anomalies', 'risk'].includes(activeTab),
  });

  const navSections = [
    {
      label: 'Overview',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Document management',
      items: [
        { id: 'documents', label: 'Financial Evidence Repository', icon: FileCheck2 },
        { id: 'documents', label: 'Bank Statements', icon: FileCheck2, category: 'BANK_STATEMENT' },
        { id: 'documents', label: 'GST Returns', icon: FileCheck2, category: 'GST_RETURN' },
        { id: 'documents', label: 'Invoices', icon: FileCheck2, category: 'INVOICE' },
        { id: 'documents', label: 'ITR Documents', icon: FileCheck2, category: 'ITR' },
      ],
    },
    {
      label: 'Audit & verification',
      items: [
        { id: 'verification', label: 'Cross Verification', icon: GitCompare, demo: true },
        { id: 'anomalies', label: 'Transaction & Anomaly Analysis', icon: AlertTriangle, demo: true },
        { id: 'risk', label: 'Explainable Risk Score', icon: ShieldCheck },
      ],
    },
    {
      label: 'Intelligence',
      items: [
        { id: 'assistant', label: 'FinDoc Assistant', icon: MessageSquareCode, demo: true },
        { id: 'reports', label: 'Financial Reports', icon: FileSpreadsheet, demo: true },
      ],
    },
  ];

  return (
    <aside className="portal-chrome w-64 bg-[#252925] border-r border-[#414840] flex flex-col justify-between shrink-0 min-h-[calc(100vh-61px)]">
      <div className="p-4 space-y-6">
        <button
          onClick={onOpenUpload}
            className="portal-action w-full flex items-center justify-center gap-2 bg-[#343a35] hover:bg-[#465149] text-white font-medium py-2.5 px-4 rounded-lg shadow-lg shadow-slate-900/10 transition active:scale-[0.98]"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>

        <nav className="space-y-4">
          {navSections.map((section) => (
            <div key={section.label}>
              {['Document management', 'Audit & verification'].includes(section.label) ? (
                <button
                  className="portal-section-toggle portal-muted"
                  onClick={() => setOpenSections((current) => ({ ...current, [section.label]: !current[section.label] }))}
                  aria-expanded={Boolean(openSections[section.label])}
                >
                  <span>{section.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSections[section.label] ? '' : '-rotate-90'}`} />
                </button>
              ) : (
                <div className="portal-muted px-3 pb-1.5 text-[10px] font-semibold tracking-wider uppercase">
                  {section.label}
                </div>
              )}
              {(!['Document management', 'Audit & verification'].includes(section.label) || openSections[section.label]) && <div className="space-y-0.5">
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id && (item.id !== 'documents' || index === 0);
                  return (
                    <button
                      key={`${section.label}-${item.label}`}
                      onClick={() => {
                        if (onSelectCategory) onSelectCategory(item.category || '');
                        setActiveTab(item.id);
                      }}
                      className={`portal-nav-item ${isActive ? 'portal-nav-active' : ''}`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.label}</span>
                      {item.demo && <span className="portal-demo-tag">DEMO</span>}
                    </button>
                  );
                })}
              </div>}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800/80">
          <div className="bg-slate-900/60 border border-slate-700 p-3 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5 text-teal-400" />
            <span>Evidence handling</span>
          </div>
          <p className="portal-muted text-[11px] leading-relaxed">
            Local processing enabled. Evidence remains in the isolated workspace for controlled review.
          </p>
        </div>
      </div>
    </aside>
  );
};
