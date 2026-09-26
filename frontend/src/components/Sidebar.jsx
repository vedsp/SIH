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
      label: 'Main Portal',
      items: [
        { id: 'dashboard', label: 'Audit Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Evidence Management',
      items: [
        { id: 'documents', label: 'All Document Records', icon: FileCheck2 },
        { id: 'documents', label: 'Bank Statements', icon: FileCheck2, category: 'BANK_STATEMENT' },
        { id: 'documents', label: 'GST Filings (GSTR-3B)', icon: FileCheck2, category: 'GST_RETURN' },
        { id: 'documents', label: 'Invoices & Vouchers', icon: FileCheck2, category: 'INVOICE' },
        { id: 'documents', label: 'Income Tax Returns (ITR)', icon: FileCheck2, category: 'ITR' },
      ],
    },
    {
      label: 'Verification & Scrutiny',
      items: [
        { id: 'verification', label: 'Cross-Verification Register', icon: GitCompare },
        { id: 'anomalies', label: 'Audit Exceptions & Outliers', icon: AlertTriangle },
        { id: 'risk', label: 'Tax Compliance & Risk Index', icon: ShieldCheck },
      ],
    },
    {
      label: 'Audit Reports',
      items: [
        { id: 'assistant', label: 'Scrutiny Copilot', icon: MessageSquareCode },
        { id: 'reports', label: 'Audit Working Papers', icon: FileSpreadsheet },
      ],
    },
  ];

  return (
    <aside className="w-56 bg-[#0b3861] border-r border-[#072540] flex flex-col justify-between shrink-0 min-h-[calc(100vh-80px)]">
      <div className="py-2 space-y-2">
        <div className="px-3 pb-2 border-b border-[#0f4b80]">
          <button
            onClick={onOpenUpload}
            className="w-full bg-[#f2a900] hover:bg-[#d99700] text-[#0b3861] font-bold text-xs py-1.5 px-2 rounded-none border border-[#c48900] cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Upload Document</span>
          </button>
        </div>

        <nav className="space-y-2">
          {navSections.map((section) => (
            <div key={section.label}>
              {['Evidence Management', 'Verification & Scrutiny'].includes(section.label) ? (
                <button
                  className="flex items-center justify-between w-full px-3 py-1 text-[11px] font-bold tracking-normal text-slate-300 hover:text-white uppercase transition"
                  onClick={() => setOpenSections((current) => ({ ...current, [section.label]: !current[section.label] }))}
                  aria-expanded={Boolean(openSections[section.label])}
                >
                  <span>{section.label}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-100 ${openSections[section.label] ? '' : '-rotate-90'}`} />
                </button>
              ) : (
                <div className="px-3 py-1 text-[11px] font-bold text-slate-300 uppercase">
                  {section.label}
                </div>
              )}
              {(!['Evidence Management', 'Verification & Scrutiny'].includes(section.label) || openSections[section.label]) && (
                <div className="mt-0.5">
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
                        <Icon className="w-3.5 h-3.5 shrink-0 text-slate-300" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-3 border-t border-[#0f4b80] text-[11px] text-slate-300 space-y-1 bg-[#072846]">
        <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
          <Lock className="w-3 h-3 text-[#f2a900]" />
          <span>Statutory Audit Security</span>
        </div>
        <p className="text-[10px] text-slate-300 leading-tight">
          Protected working papers. Assessee evidence is stored in isolated tenant boundaries.
        </p>
      </div>
    </aside>
  );
};
