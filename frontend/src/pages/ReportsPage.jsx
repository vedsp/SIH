import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { FileSpreadsheet, Download, FileCheck, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export const ReportsPage = () => {
  const [generating, setGenerating] = useState(false);
  const [generatedMsg, setGeneratedMsg] = useState(null);

  const handleGenerateReport = () => {
    setGenerating(true);
    setGeneratedMsg(null);
    setTimeout(() => {
      const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const navy = [24, 59, 91];
      const teal = [47, 111, 94];
      const muted = [104, 120, 135];
      let y = 24;

      const footer = () => {
        pdf.setDrawColor(217, 224, 230);
        pdf.line(18, pageHeight - 18, pageWidth - 18, pageHeight - 18);
        pdf.setFontSize(8);
        pdf.setTextColor(...muted);
        pdf.text('FinDocAI | Confidential analytical dossier', 18, pageHeight - 11);
        pdf.text(`Page ${pdf.getNumberOfPages()}`, pageWidth - 36, pageHeight - 11);
      };

      const section = (number, title, text, color = teal) => {
        const lines = pdf.splitTextToSize(text, pageWidth - 48);
        const boxHeight = 17 + lines.length * 5.2;
        if (y + boxHeight > pageHeight - 28) {
          footer();
          pdf.addPage();
          y = 22;
        }
        pdf.setFillColor(248, 250, 251);
        pdf.setDrawColor(217, 224, 230);
        pdf.roundedRect(18, y, pageWidth - 36, boxHeight, 3, 3, 'FD');
        pdf.setFillColor(...color);
        pdf.rect(18, y, 2, boxHeight, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(...color);
        pdf.text(`${number}. ${title}`, 25, y + 10);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9.5);
        pdf.setTextColor(55, 70, 82);
        pdf.text(lines, 25, y + 17, { lineHeightFactor: 1.45 });
        y += boxHeight + 8;
      };

      pdf.setFillColor(...navy);
      pdf.rect(0, 0, pageWidth, 48, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(170, 220, 215);
      pdf.text('FINDOCAI OFFICIAL EVALUATION REPORT', 18, 16);
      pdf.setFontSize(22);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Financial Intelligence &', 18, 28);
      pdf.text('Risk Assessment Report', 18, 38);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(225, 235, 240);
      pdf.text('CONFIDENTIAL ANALYTICAL DOSSIER', pageWidth - 74, 16);

      y = 61;
      pdf.setFontSize(9);
      pdf.setTextColor(...muted);
      pdf.text('ENTITY', 18, y);
      pdf.text('ASSESSMENT DATE', 112, y);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(23, 33, 43);
      pdf.text('ABC Manufacturing Pvt Ltd', 18, y + 7);
      pdf.text('August 2026', 112, y + 7);
      y += 24;
      section(1, 'Executive Summary', 'Automated financial document intelligence processing evaluated 4 uploaded primary sources covering bank activity, GST returns, and invoices. Total annual bank credits were INR 18.70 Lakhs against reported GST turnover of INR 14.80 Lakhs. The engagement is rated MODERATE risk and requires targeted reviewer follow-up.', teal);
      section(2, 'Cross-Verification Findings', 'Bank credits of INR 18.70L exceed GST turnover of INR 14.80L by INR 3.90L, a 26.3% variance. The mismatch may reflect exempt income, loans, inter-account transfers, timing differences, or unreported taxable receipts. Reconcile the bank ledger to the GST sales register before closure.', [135, 98, 27]);
      section(3, 'Transaction & Invoice Anomalies', 'A RTGS debit of INR 9,99,999 to XYZ Traders is approximately 4.8x the historical vendor average of INR 2,10,000. Invoice INV-1032-DUP also matches INV-1032 on vendor, date, and amount. Obtain payment support and confirm whether the duplicate is a reversal, resubmission, or duplicate booking.', [163, 77, 66]);
      section(4, 'Risk Assessment', 'Overall score: 72 / 100 (MODERATE). Positive factors include strong credit volume, active customer inflows, and consistent GST filing history. Risk drivers are the turnover variance, high-value vendor payment, and possible duplicate invoice.', teal);
      section(5, 'Evidence Coverage', 'Bank statement: 4 pages and 5 transactions reviewed. GST return: annual taxable turnover of INR 14.80L and tax paid of INR 2.66L. Invoice evidence: two records totaling INR 19.35L, including one possible duplicate.', [45, 92, 120]);
      section(6, 'Recommended Reviewer Actions', '1) Reconcile bank credits to the GST sales register. 2) Request the RTGS invoice, purchase order, and delivery proof. 3) Validate INV-1032 and INV-1032-DUP against the accounts payable ledger. 4) Document the conclusion and retain supporting evidence.', [24, 59, 91]);
      if (y + 22 > pageHeight - 28) { footer(); pdf.addPage(); y = 24; }
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(...muted);
      pdf.text('MANDATORY DISCLAIMER', 18, y + 5);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.text(pdf.splitTextToSize('This report is an automated analytical assessment generated by FinDocAI and does not constitute financial, tax, legal, investment, or official bank lending advice.', pageWidth - 36), 18, y + 11);
      footer();
      pdf.save('findocai-financial-intelligence-report.pdf');
      setGenerating(false);
      setGeneratedMsg("Professional PDF report downloaded successfully for ABC Manufacturing Pvt Ltd!");
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
          className="report-generate-button flex items-center gap-2 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-50"
        >
          {generating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {generating ? 'Generating Report...' : 'Generate Financial Report'}
        </button>
      </div>

      {generatedMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{generatedMsg}</span>
        </div>
      )}

      <div className="report-preview glass-card p-8 rounded-2xl space-y-6">
        <div className="report-preview-header pb-4 flex justify-between items-start">
          <div>
            <span className="report-eyebrow">FINDOCAI OFFICIAL EVALUATION REPORT</span>
            <h3 className="report-title mt-1">Financial Intelligence & Risk Assessment Report</h3>
            <p className="report-meta">Entity: ABC Manufacturing Pvt Ltd <span>•</span> Assessment Date: August 2026</p>
          </div>
          <div className="text-right">
            <span className="report-confidential">
              CONFIDENTIAL ANALYTICAL DOSSIER
            </span>
          </div>
        </div>

        {/* Report Sections Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="report-section report-section-teal">
            <h4>1. Executive Summary</h4>
            <p>
              Automated financial document intelligence processing evaluated 4 uploaded primary sources (Bank Statement, GSTR-3B, Invoice collection). Total annual credit volume recorded at ₹18.70 Lakhs.
            </p>
          </div>

          <div className="report-section report-section-amber">
            <h4>2. Cross-Verification Findings</h4>
            <p>
              Potential turnover discrepancy detected. Annual bank credits (₹18.70L) exceed reported GST turnover (₹14.80L) by ₹3.90 Lakh (26.3% variance).
            </p>
          </div>

          <div className="report-section report-section-red">
            <h4>3. Anomaly Summary</h4>
            <p>
              Identified 1 high-severity RTGS debit anomaly of ₹9,99,999 (4.8x historical vendor average) and 1 duplicate invoice match (INV-1032-DUP).
            </p>
          </div>

          <div className="report-section report-section-teal">
            <h4>4. Prototype Risk Rating</h4>
            <p>
              Financial Risk Rating scored at <strong>72 / 100 (MODERATE)</strong>. Positive liquidity profile offset by cross-document turnover variance.
            </p>
          </div>
        </div>

        <div className="report-metrics">
          <div><span>DOCUMENTS REVIEWED</span><strong>04</strong><small>Bank, GST & invoice sources</small></div>
          <div><span>TURNOVER VARIANCE</span><strong>26.3%</strong><small>INR 3.90L difference</small></div>
          <div><span>RISK SCORE</span><strong>72 / 100</strong><small>Moderate reviewer attention</small></div>
          <div><span>ACTIVE FLAGS</span><strong>03</strong><small>2 transaction / 1 invoice</small></div>
        </div>

        <div className="report-detail-grid">
          <div className="report-detail-block">
            <div className="report-detail-heading"><FileCheck className="w-4 h-4" /> Evidence coverage</div>
            <div className="report-table"><div><span>Bank statement</span><strong>4 pages / 5 transactions</strong></div><div><span>GST return</span><strong>INR 14.80L turnover</strong></div><div><span>Invoice set</span><strong>2 records / 1 duplicate flag</strong></div></div>
          </div>
          <div className="report-detail-block">
            <div className="report-detail-heading report-heading-warning"><ShieldAlert className="w-4 h-4" /> Reviewer actions</div>
            <ol className="report-actions"><li>Reconcile bank credits to the GST sales register.</li><li>Obtain support for the INR 9,99,999 RTGS payment.</li><li>Validate INV-1032 against the payable ledger.</li></ol>
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="report-disclaimer pt-4">
          <strong>Mandatory Disclaimer:</strong> This report is an automated analytical assessment generated by FinDocAI and does not constitute financial, tax, legal, investment, or official bank lending advice.
        </div>
      </div>
    </div>
  );
};
