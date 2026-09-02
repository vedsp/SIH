import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { demoApi } from '../services/api';
import { ShieldAlert, FileText, Database, User, LogOut, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';

export const Navbar = ({ onDemoLoaded }) => {
  const { user, logout } = useAuth();
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [demoMessage, setDemoMessage] = useState(null);

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

  return (
    <header className="sticky top-0 z-30 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-tr from-sky-600 to-teal-400 p-2.5 rounded-xl shadow-lg shadow-sky-500/20">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-sky-400">
              FinDocAI
            </h1>
            <span className="text-[10px] font-semibold tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full uppercase">
              SIH MVP 1.0
            </span>
          </div>
          <p className="text-xs text-slate-400">Financial Document Intelligence & Risk Analysis</p>
        </div>
      </div>

      {demoMessage && (
        <div className="hidden md:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs animate-pulse">
          <CheckCircle className="w-4 h-4" />
          {demoMessage}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={handleSeedDemo}
          disabled={loadingDemo}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow-md shadow-emerald-900/20 disabled:opacity-50"
          title="Load synthetic ABC Manufacturing Pvt Ltd sample dataset for SIH evaluation"
        >
          {loadingDemo ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {loadingDemo ? "Loading Demo..." : "Load Demo Scenario"}
        </button>

        {user && (
          <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-slate-200">{user.full_name}</div>
              <div className="text-[11px] text-sky-400 font-mono tracking-wide">{user.role}</div>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
