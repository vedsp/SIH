import React from 'react';
import { AlertTriangle, Copy, ShieldAlert, CheckCircle, Info } from 'lucide-react';

export const AnomaliesPage = () => {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Transaction Anomaly & Duplicate Detection</h2>
            <p className="text-xs text-slate-400">Scikit-learn Isolation Forest anomaly scoring and invoice similarity detection</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Anomaly 1 */}
        <div className="glass-card p-6 rounded-2xl border border-rose-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full uppercase">
                HIGH SEVERITY
              </span>
              <h3 className="text-sm font-semibold text-white">Unusual High-Value Debit Payment</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">2025-07-12</span>
          </div>
          <p className="text-xs text-slate-300">
            Single payment of <span className="font-mono text-white font-bold">₹9,99,999</span> to <span className="text-sky-400">XYZ Traders</span> via RTGS.
          </p>
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>
              <strong>Explanation:</strong> This transaction is approximately <strong>4.8 times higher</strong> than the historical average payment (₹2,10,000) to vendor 'XYZ Traders'. (Not fraud — flagged for verification).
            </span>
          </div>
        </div>

        {/* Anomaly 2: Duplicate Invoice */}
        <div className="glass-card p-6 rounded-2xl border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full uppercase">
                MEDIUM SEVERITY
              </span>
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Copy className="w-4 h-4 text-amber-400" />
                Possible Duplicate Invoice
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">2025-07-12</span>
          </div>
          <p className="text-xs text-slate-300">
            Invoice <span className="font-mono text-white font-bold">INV-1032-DUP</span> matches original invoice <span className="font-mono text-sky-400">INV-1032</span>.
          </p>
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Explanation:</strong> Both invoices share identical Vendor ('XYZ Traders'), Date ('2025-07-12'), Taxable Amount ('₹8,20,000'), and Total ('₹9,67,600').
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
