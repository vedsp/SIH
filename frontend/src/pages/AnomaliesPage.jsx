import React from 'react';
import { AlertTriangle, Copy, Info } from 'lucide-react';

export const AnomaliesPage = () => {
  return (
    <div className="space-y-3">
      <div className="bg-white border border-slate-300 p-3 rounded-[2px] flex items-center justify-between">
        <div>
          <div className="audit-kicker">OUTLIER & DUPLICATE DETECTION ENGINE</div>
          <h2 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
            Transaction Exceptions & Invoice Duplication Register
          </h2>
          <p className="text-[11px] text-slate-500">Algorithmic isolation forest outlier detection & vendor matching</p>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 border border-rose-300 px-2 py-0.5">
            2 AUDIT EXCEPTIONS
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {/* Anomaly 1 */}
        <div className="bg-white border border-slate-300 border-l-3 border-l-rose-600 p-3 rounded-[2px] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300 px-1.5 py-0.2 uppercase">
                HIGH SEVERITY
              </span>
              <h3 className="text-xs font-bold text-slate-900">Unusual High-Value Debit Payment</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">2025-07-12</span>
          </div>
          <p className="text-xs text-slate-700">
            Single outflow of <span className="font-mono font-bold text-slate-900">₹9,99,999</span> to <span className="font-semibold text-slate-900">XYZ Traders</span> via RTGS.
          </p>
          <div className="p-2 bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span>
              <strong>Audit Observation:</strong> Transaction is <strong>4.8x higher</strong> than the vendor's historical average payment (₹2,10,000). Flagged for vouching against purchase order and delivery challan.
            </span>
          </div>
        </div>

        {/* Anomaly 2: Duplicate Invoice */}
        <div className="bg-white border border-slate-300 border-l-3 border-l-amber-600 p-3 rounded-[2px] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 uppercase">
                MEDIUM SEVERITY
              </span>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <Copy className="w-3 h-3 text-amber-700" />
                <span>Suspected Duplicate Vendor Invoice</span>
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">2025-07-12</span>
          </div>
          <p className="text-xs text-slate-700">
            Invoice <span className="font-mono font-bold text-slate-900">INV-1032-DUP</span> matches original invoice <span className="font-mono font-bold text-slate-900">INV-1032</span>.
          </p>
          <div className="p-2 bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span>
              <strong>Audit Observation:</strong> Both records share identical Vendor ('XYZ Traders'), Date ('2025-07-12'), Taxable Amount ('₹8,20,000'), and Total ('₹9,67,600'). Requires input tax credit reconciliation.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
