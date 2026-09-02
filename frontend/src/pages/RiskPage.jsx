import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, Award, Info, Scale } from 'lucide-react';

export const RiskPage = () => {
  const breakdown = [
    { label: 'Cash-Flow Stability', weight: '20%', score: 80, status: 'Stable' },
    { label: 'Debt Burden & Liabilities', weight: '20%', score: 70, status: 'Moderate' },
    { label: 'Revenue Consistency', weight: '15%', score: 75, status: 'Consistent' },
    { label: 'Cross-Document Consistency', weight: '20%', score: 55, status: 'Mismatch Detected' },
    { label: 'Transaction Anomalies', weight: '15%', score: 60, status: 'Anomalies Flagged' },
    { label: 'Document Completeness', weight: '10%', score: 90, status: 'Complete' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Prototype Financial Risk Score Engine</h2>
            <p className="text-xs text-slate-400">Explainable weighted multi-factor assessment (Not a credit score)</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold text-amber-400 font-mono">72 / 100</div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-300">Moderate Risk Profile</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Factor Breakdown List */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Scale className="w-4 h-4 text-sky-400" />
            Weighted Factor Breakdown
          </h3>

          <div className="space-y-3">
            {breakdown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">{item.label} <span className="text-slate-500">({item.weight})</span></span>
                  <span className="font-mono text-sky-400 font-semibold">{item.score}/100</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${item.score < 60 ? 'bg-amber-500' : 'bg-sky-500'}`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explainability Positive vs Risk Factors */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 space-y-3 bg-gradient-to-b from-slate-900 to-emerald-950/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Positive Financial Factors
            </h4>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                Strong overall bank credit volume (₹18.70 Lakhs annual credits)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                Active customer transaction inflow pipeline across Q1-Q4
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                Consistent GST filing compliance record
              </li>
            </ul>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-amber-500/30 space-y-3 bg-gradient-to-b from-slate-900 to-amber-950/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Identified Risk Drivers
            </h4>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                Bank credits vs GST reported turnover variance (₹3.90 Lakh mismatch)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                Unusual high-value payment (₹9.99 Lakhs - 4.8x vendor average)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                Possible duplicate vendor invoice detected (INV-1032-DUP)
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed flex items-start gap-2">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <span>
          <strong>Disclaimer:</strong> This Financial Risk Assessment is an automated prototype score for decision assistance only and does not constitute a bank lending decision or professional tax advice.
        </span>
      </div>
    </div>
  );
};
