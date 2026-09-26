import React from 'react';
import { GitCompare, AlertTriangle, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export const AnalysisPage = () => {
  return (
    <div className="space-y-4">
      {/* Title & Metadata Banner */}
      <div className="bg-white border border-[#cccccc] p-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#222222] uppercase tracking-wide flex items-center gap-1.5">
              <GitCompare className="w-4 h-4 text-[#0b3861]" />
              Schedule RC: Cross-Document Inter-Ledger Reconciliation
            </h2>
            <p className="text-xs text-[#555555]">
              Automated reconciliation of Bank Statements vs. GSTR-3B Taxable Turnover vs. Uploaded Invoices
            </p>
          </div>
          <div className="text-xs text-[#555555] font-mono">
            Status: <span className="text-warning">1 VARIANCE FLAGGED</span>
          </div>
        </div>
      </div>

      {/* Primary Reconciliation Table */}
      <div className="bg-white border border-[#cccccc]">
        <div className="bg-[#f2f4f7] px-3 py-2 border-b border-[#cccccc] flex items-center justify-between">
          <span className="text-xs font-bold text-[#222222] uppercase tracking-wide">
            Table 1: Turnover & Revenue Reconciliation Summary (AY 2026-27)
          </span>
          <span className="text-[11px] text-[#555555]">All figures in INR (₹)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="itr-grid">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Sr.</th>
                <th>Reconciliation Stream / Heads</th>
                <th>Source Primary Document</th>
                <th>Declared / Computed Amount (₹)</th>
                <th>Benchmark / Control Figure (₹)</th>
                <th>Variance (₹)</th>
                <th>Assessment & Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center font-mono">1</td>
                <td className="font-semibold text-[#111111]">Bank Inflows vs. Reported GST Turnover</td>
                <td>HDFC Bank Statement (Annual Credits) vs. GSTR-3B</td>
                <td className="text-right font-mono">18,70,000.00</td>
                <td className="text-right font-mono">14,80,000.00</td>
                <td className="text-right font-mono text-warning font-bold">+3,90,000.00 (26.3%)</td>
                <td>
                  <span className="text-warning font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 inline text-[#b45309]" />
                    Variance Flagged: Bank credits exceed GST turnover by ₹3.90L. Verify non-taxable receipts / capital inflows.
                  </span>
                </td>
              </tr>
              <tr>
                <td className="text-center font-mono">2</td>
                <td className="font-semibold text-[#111111]">GSTR-3B Turnover vs. Issued Invoices Total</td>
                <td>GSTR-3B Monthly Filings vs. Verified Invoice Set</td>
                <td className="text-right font-mono">14,80,000.00</td>
                <td className="text-right font-mono">16,20,000.00</td>
                <td className="text-right font-mono text-positive">-1,40,000.00 (8.6%)</td>
                <td>
                  <span className="text-positive font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 inline text-[#15803d]" />
                    Consistent Match within statutory 10% variance tolerance threshold.
                  </span>
                </td>
              </tr>
              <tr>
                <td className="text-center font-mono">3</td>
                <td className="font-semibold text-[#111111]">TDS 26AS Deductions vs. Bank Receipts</td>
                <td>Form 26AS Tax Deducted at Source vs. Bank Inward RTGS</td>
                <td className="text-right font-mono">1,87,000.00</td>
                <td className="text-right font-mono">1,87,000.00</td>
                <td className="text-right font-mono text-positive">0.00 (0.0%)</td>
                <td>
                  <span className="text-positive font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 inline text-[#15803d]" />
                    Fully Reconciled with TRACES 26AS central tax ledger.
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory Auditor Note / Notice Box */}
      <div className="bg-white border border-[#cccccc] p-3 text-xs space-y-2">
        <div className="font-bold text-[#0b3861] uppercase flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          Auditor Verification Guidance & Action Item (Under Rule 114E / Section 142(1)):
        </div>
        <p className="text-[#333333] leading-relaxed">
          Where bank deposits/credits exceed declared GST taxable sales by more than 15%, the taxpayer should maintain a reconciliation statement distinguishing between taxable turnover, exempt supplies, capital contributions, and loan receipts to prevent automated notice generation under Section 148A.
        </p>
      </div>
    </div>
  );
};

