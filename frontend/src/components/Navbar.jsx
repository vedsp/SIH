import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { demoApi, documentApi } from '../services/api';
import { LogOut, CheckCircle, RefreshCw, Bell, ChevronDown, Trash2 } from 'lucide-react';

const getFinancialYear = (document) => {
  const source = `${document.original_name || ''} ${document.filename || ''}`;
  const range = source.match(/(20\d{2})[_\-/\s](20\d{2})/);
  if (range) return `FY ${range[1]}-${range[2].slice(-2)}`;

  const singleYear = source.match(/20\d{2}/);
  if (singleYear) {
    const year = Number(singleYear[0]);
    return `FY ${year}-${String(year + 1).slice(-2)}`;
  }

  const createdYear = document.created_at ? new Date(document.created_at).getFullYear() : new Date().getFullYear();
  return `FY ${createdYear}-${String(createdYear + 1).slice(-2)}`;
};

const getAssessmentYear = (financialYear) => {
  const match = financialYear.match(/FY (\d{4})-(\d{2})/);
  if (!match) return '';
  return `AY ${Number(match[1]) + 1}-${match[2]}`;
};

export const Navbar = ({ onDemoLoaded, refreshTrigger }) => {
  const { user, logout } = useAuth();
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [loadingUnload, setLoadingUnload] = useState(false);
  const [demoMessage, setDemoMessage] = useState(null);
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState('');

  useEffect(() => {
    let active = true;
    documentApi.list().then((documents) => {
      if (!active) return;
      if (documents.length === 0) {
        setFinancialYears([]);
        setSelectedFinancialYear('');
        return;
      }
      const years = [...new Set(documents.map(getFinancialYear))].sort().reverse();
      setFinancialYears(years);
      setSelectedFinancialYear((current) => years.includes(current) ? current : years[0]);
    }).catch(() => {});
    return () => { active = false; };
  }, [refreshTrigger]);

  const handleSeedDemo = async () => {
    setLoadingDemo(true);
    setDemoMessage(null);
    try {
      const res = await demoApi.seedDemo();
      setDemoMessage("Demo dataset 'ABC Manufacturing Pvt Ltd' seeded successfully!");
      if (onDemoLoaded) onDemoLoaded();
      setTimeout(() => setDemoMessage(null), 4000);
    } catch (err) {
      alert("Failed to seed demo data: " + err.message);
    } finally {
      setLoadingDemo(false);
    }
  };

  const handleUnloadDemo = async () => {
    if (!window.confirm('Remove the ABC Manufacturing demo dataset?')) return;
    setLoadingUnload(true);
    setDemoMessage(null);
    try {
      const res = await demoApi.unloadDemo();
      setDemoMessage(res.message || 'Demo dataset unloaded successfully!');
      if (onDemoLoaded) onDemoLoaded();
      setTimeout(() => setDemoMessage(null), 4000);
    } catch (err) {
      alert("Failed to unload demo data: " + err.message);
    } finally {
      setLoadingUnload(false);
    }
  };

  return (
    <>
    <header className="portal-chrome sticky top-0 z-30 bg-[#252925] border-b border-[#414840] px-4 md:px-6 py-2.5 flex items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <div className="bg-[#343a35] p-0.5 rounded-md border border-[#59645b]">
          <img src="/findocai-mark.svg" alt="FinDocAI logo" className="w-9 h-9 rounded" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white">
              FinDocAI <span className="font-normal portal-muted">/ Financial Intelligence & Tax Assessment</span>
            </h1>
            <span className="portal-badge text-[9px] font-semibold tracking-wider bg-[#343a35] border border-[#59645b] px-2 py-0.5 rounded uppercase">
              SECURE AUDIT WORKSPACE
            </span>
          </div>
          <p className="portal-muted text-[11px]">Digital assessment and financial evidence review</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="portal-muted p-2 rounded-md hover:bg-[#183b5b] hover:text-white transition" title="Notifications" aria-label="Notifications">
          <Bell className="w-4 h-4" />
        </button>

        {user && (
          <div className="flex items-center gap-3 border-l border-[#37627e] pl-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-white">{user.full_name}</div>
              <div className="portal-badge text-[11px] font-mono tracking-wide">{user.role}</div>
            </div>
            <button
              onClick={logout}
              className="portal-muted p-2 rounded-md hover:text-white hover:bg-[#183b5b] transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
    <div className="portal-subnav px-4 md:px-6 py-2">
      <div className="portal-subnav-inner">
        <div className="portal-filter-group">
          <div className="portal-filter-pair">
            <label className="portal-subnav-label">Assessment year</label>
            <div className="portal-select-wrap">
              <select className="portal-select" value={getAssessmentYear(selectedFinancialYear)} aria-label="Assessment year" onChange={() => {}} disabled={!selectedFinancialYear}>
                <option value="">{selectedFinancialYear ? getAssessmentYear(selectedFinancialYear) : 'Not available'}</option>
              </select>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
          <div className="portal-filter-pair">
            <label className="portal-subnav-label">Financial year</label>
            <div className="portal-select-wrap">
              <select className="portal-select" value={selectedFinancialYear} aria-label="Financial year" onChange={(event) => setSelectedFinancialYear(event.target.value)} disabled={financialYears.length === 0}>
                {financialYears.length === 0 && <option value="">Not available</option>}
                {financialYears.map((year) => <option key={year}>{year}</option>)}
              </select>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
        <div className="portal-demo-actions">
          {demoMessage && (
            <div className="hidden md:flex items-center gap-2 status-success px-3 py-1.5 rounded-md text-xs animate-pulse">
              <CheckCircle className="w-4 h-4" />
              {demoMessage}
            </div>
          )}
          <button
            onClick={handleSeedDemo}
            disabled={loadingDemo}
            className="portal-demo-load"
            title="Load synthetic ABC Manufacturing Pvt Ltd sample dataset for SIH evaluation"
          >
            {loadingDemo && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            {loadingDemo ? "Loading Demo..." : "Load Demo Scenario"}
          </button>
          <button
            onClick={handleUnloadDemo}
            disabled={loadingUnload}
            className="portal-demo-unload"
            title="Remove the synthetic ABC Manufacturing demo dataset"
          >
            {loadingUnload && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            {loadingUnload ? "Unloading..." : <><Trash2 className="w-3.5 h-3.5" /> Unload Demo</>}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};
