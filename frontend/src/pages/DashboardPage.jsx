import React, { useEffect, useState } from 'react';
import { documentApi } from '../services/api';
import { StatCard } from '../components/StatCard';
import { DocumentTable } from '../components/DocumentTable';
import { FileText, TrendingUp, TrendingDown, DollarSign, ShieldAlert, AlertTriangle, ArrowRight, RefreshCw, Layers } from 'lucide-react';

export const DashboardPage = ({ onNavigate, onOpenUpload, onViewDetail, refreshTrigger }) => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const data = await documentApi.getDashboardOverview();
      setOverview(data);
    } catch (err) {
      console.error("Failed to load dashboard overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [refreshTrigger]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#111827] to-slate-900">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">Executive Financial Dashboard</h2>
          <p className="text-xs text-slate-400">
            Real-time cross-document intelligence, cash flow summary & potential risk alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOverview}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onOpenUpload}
            className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-sky-600/20"
          >
            + Upload New Document
          </button>
        </div>
      </div>

      {/* Risk Alert Banner if anomalies detected */}
      {overview && overview.active_alerts_count > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="font-semibold text-amber-300 text-sm">Potential Inconsistency & Anomaly Alerts Detected</div>
            <p className="text-slate-300 mt-1 leading-relaxed">
              System identified cross-document discrepancies (e.g. Bank credits vs GST turnover variance) and unusual transaction amounts requiring human review.
            </p>
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => onNavigate('verification')}
                className="text-amber-400 font-semibold hover:underline flex items-center gap-1"
              >
                View Cross-Document Verification <ArrowRight className="w-3 h-3" />
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => onNavigate('anomalies')}
                className="text-amber-400 font-semibold hover:underline flex items-center gap-1"
              >
                Inspect Anomalies <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Documents Processed"
          value={overview ? overview.documents_processed : '0'}
          icon={FileText}
          color="sky"
          subtext="Active entity files"
        />
        <StatCard
          title="Total Revenue (Credits)"
          value={overview ? formatCurrency(overview.total_revenue) : '₹0'}
          icon={TrendingUp}
          color="teal"
          subtext="Extracted turnover"
        />
        <StatCard
          title="Total Expenses (Debits)"
          value={overview ? formatCurrency(overview.total_expenses) : '₹0'}
          icon={TrendingDown}
          color="rose"
          subtext="Operational expenses"
        />
        <StatCard
          title="Net Cash Flow"
          value={overview ? formatCurrency(overview.net_cash_flow) : '₹0'}
          icon={DollarSign}
          color={overview && overview.net_cash_flow >= 0 ? 'teal' : 'rose'}
          subtext="Net liquidity position"
        />
        <StatCard
          title="Financial Risk Score"
          value={overview ? `${overview.risk_score}/100` : '15/100'}
          icon={ShieldAlert}
          color={overview && overview.risk_score > 60 ? 'amber' : 'sky'}
          subtext={`Status: ${overview ? overview.risk_level : 'LOW'}`}
        />
      </div>

      {/* Recent Document Activity Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            Recent Document Feed
          </h3>
          <button
            onClick={() => onNavigate('documents')}
            className="text-xs text-sky-400 font-semibold hover:underline"
          >
            View All Documents →
          </button>
        </div>

        <DocumentTable
          documents={overview ? overview.recent_documents : []}
          loading={loading}
          onViewDetail={onViewDetail}
          onDeleteDocument={async (id) => {
            await documentApi.delete(id);
            fetchOverview();
          }}
        />
      </div>
    </div>
  );
};
