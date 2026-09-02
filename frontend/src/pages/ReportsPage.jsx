import React, { useState } from 'react';
import { FileSpreadsheet, Download, FileCheck, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export const ReportsPage = () => {
  const [generating, setGenerating] = useState(false);
  const [generatedMsg, setGeneratedMsg] = useState(null);

  const handleGenerateReport = () => {
    setGenerating(true);
    setGeneratedMsg(null);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedMsg("Financial Analysis Report generated successfully for ABC Manufacturing Pvt Ltd!");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Financial Intelligence Report Generator</h2>
            <p className="text-xs text-slate-400">Synthesize executive summary, cross-verification findings, anomalies & risk assessment</p>
          </div>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-sky-600/25 disabled:opacity-50"
        >
          {generating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {generating ? 'Generating PDF...' : 'Generate Financial Report'}
        </button>
      </div>

      {generatedMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{generatedMsg}</span>
        </div>
      )}

      {/* Report PDF Mock Preview Container */}
      <div className="glass-card p-8 rounded-2xl border border-slate-800 space-y-6 bg-[#0E1526]">
        <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400">FINDOCAI OFFICIAL EVALUATION REPORT</span>
            <h3 className="text-2xl font-bold text-white mt-1">Financial Intelligence & Risk Assessment Report</h3>
            <p className="text-xs text-slate-400">Entity: ABC Manufacturing Pvt Ltd • Assessment Date: August 2026</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full border border-sky-500/20">
              CONFIDENTIAL ANALYTICAL DOSSIER
            </span>
          </div>
        </div>

        {/* Report Sections Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <h4 className="font-semibold text-sky-400">1. Executive Summary</h4>
            <p className="text-slate-300 leading-relaxed">
              Automated financial document intelligence processing evaluated 4 uploaded primary sources (Bank Statement, GSTR-3B, Invoice collection). Total annual credit volume recorded at ₹18.70 Lakhs.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <h4 className="font-semibold text-amber-400">2. Cross-Verification Findings</h4>
            <p className="text-slate-300 leading-relaxed">
              Potential turnover discrepancy detected. Annual bank credits (₹18.70L) exceed reported GST turnover (₹14.80L) by ₹3.90 Lakh (26.3% variance).
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <h4 className="font-semibold text-rose-400">3. Anomaly Summary</h4>
            <p className="text-slate-300 leading-relaxed">
              Identified 1 high-severity RTGS debit anomaly of ₹9,99,999 (4.8x historical vendor average) and 1 duplicate invoice match (INV-1032-DUP).
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
            <h4 className="font-semibold text-teal-400">4. Prototype Risk Rating</h4>
            <p className="text-slate-300 leading-relaxed">
              Financial Risk Rating scored at <strong>72 / 100 (MODERATE)</strong>. Positive liquidity profile offset by cross-document turnover variance.
            </p>
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 italic leading-relaxed">
          <strong>Mandatory Disclaimer:</strong> This report is an automated analytical assessment generated by FinDocAI and does not constitute financial, tax, legal, investment, or official bank lending advice.
        </div>
      </div>
    </div>
  );
};
