import React from 'react';
import { GitCompare, CheckCircle2, AlertTriangle, ArrowRight, Layers } from 'lucide-react';

export const AnalysisPage = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
            <GitCompare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Cross-Document Verification Engine</h2>
            <p className="text-xs text-slate-400">Inter-document consistency matching between Bank Statements, GST filings, and Invoices</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bank vs GST Matching Card */}
        <div className="glass-card p-6 rounded-2xl border border-amber-500/30 space-y-4 bg-gradient-to-b from-slate-900 to-amber-950/10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Bank Statement vs GST Turnover Mismatch
            </h3>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
              26.3% Discrepancy
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Annual Bank Statement Credits:</span>
              <span className="text-slate-100 font-mono font-bold">₹18,70,000</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Reported GST Annual Turnover:</span>
              <span className="text-slate-100 font-mono font-bold">₹14,80,000</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Unexplained Variance:</span>
              <span className="text-amber-400 font-mono font-bold">+₹3,90,000</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-amber-300">Responsible AI Context:</span> Potential inconsistency identified. Bank credits exceed GST turnover by ₹3.90 Lakh. Requires human review (e.g. check for non-taxable receipts, loans, or under-reporting).
          </div>
        </div>

        {/* GST vs Invoices Matching Card */}
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 space-y-4 bg-gradient-to-b from-slate-900 to-emerald-950/10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              GST Return vs Issued Invoices
            </h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
              Consistent Match
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Declared Taxable Amount:</span>
              <span className="text-slate-100 font-mono font-bold">₹14,80,000</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Verified Invoice Totals:</span>
              <span className="text-slate-100 font-mono font-bold">₹16,20,000</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Match Status:</span>
              <span className="text-emerald-400 font-mono font-bold">Verified within 10% tolerance</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
            Invoice totals match GSTR-3B monthly filings closely across Q1-Q4.
          </div>
        </div>
      </div>
    </div>
  );
};
