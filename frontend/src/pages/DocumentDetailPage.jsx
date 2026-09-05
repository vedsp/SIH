import React, { useEffect, useState } from 'react';
import { documentApi } from '../services/api';
import { ArrowLeft, Tag } from 'lucide-react';

export const DocumentDetailPage = ({ documentId, onBack }) => {
  const [docDetail, setDocDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        setDocDetail(await documentApi.getDetail(documentId));
      } catch (err) {
        console.error('Failed to load document detail:', err);
        setDocDetail(null);
      } finally {
        setLoading(false);
      }
    };
    if (documentId) fetchDetail();
  }, [documentId]);

  if (loading) {
    return <div className="register-empty"><div className="w-8 h-8 border-2 border-[#2d6f91] border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-sm text-[#687887] mt-3">Loading document evidence...</p></div>;
  }

  if (!docDetail) {
    return <div className="register-empty space-y-4"><p className="text-sm text-[#687887]">Document not found or inaccessible.</p><button onClick={onBack} className="text-xs text-[#2d6f91] underline">Return to repository</button></div>;
  }

  const verificationLabel = docDetail.status === 'COMPLETED' ? 'VERIFIED' : docDetail.status === 'FAILED' ? 'FLAGGED' : 'UNDER REVIEW';
  const riskLabel = docDetail.status === 'FAILED' ? 'HIGH' : docDetail.anomalies_count > 0 ? 'MEDIUM' : 'LOW';
  const taxCategory = docDetail.document_category === 'GST_RETURN' ? 'GST Compliance' : docDetail.document_category === 'ITR' ? 'Direct Tax' : docDetail.document_category === 'INVOICE' ? 'Business Transaction' : 'Financial Evidence';
  const infoRows = [
    ['Document ID', `DOC-${String(docDetail.id).padStart(5, '0')}`],
    ['File name', docDetail.original_name],
    ['File type', docDetail.file_type.toUpperCase()],
    ['File size', `${(docDetail.file_size / 1024).toFixed(1)} KB`],
    ['Upload date', new Date(docDetail.created_at).toLocaleDateString('en-GB')],
  ];
  const scoreClass = riskLabel === 'HIGH' ? 'text-[#a34d42]' : riskLabel === 'MEDIUM' ? 'text-[#87621b]' : 'text-[#2f6f5e]';
  const score = riskLabel === 'HIGH' ? '78' : riskLabel === 'MEDIUM' ? '52' : '18';

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 border-b border-[#cfd9df] pb-4">
        <button onClick={onBack} className="p-2 rounded-md bg-white border border-[#cfd9df] text-[#526676] hover:text-[#183247] transition" aria-label="Back to repository"><ArrowLeft className="w-4 h-4" /></button>
        <div className="min-w-0"><div className="audit-kicker">Evidence review / document detail</div><h2 className="text-xl font-bold text-[#183247] truncate">{docDetail.original_name}</h2><p className="text-xs text-[#687887] font-mono">DOC-{String(docDetail.id).padStart(5, '0')} · {docDetail.file_type.toUpperCase()} · {docDetail.page_count} page(s)</p></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-4 items-start">
        <aside className="detail-panel">
          <div className="detail-section"><div className="section-label">Document information</div>{infoRows.map(([label, value]) => <div key={label} className="detail-row"><span>{label}</span><strong className={label.includes('ID') || label.includes('size') || label.includes('type') ? 'font-mono' : ''}>{value}</strong></div>)}</div>
          <div className="detail-section"><div className="section-label">Tax classification</div><div className="detail-row"><span>Assessment year</span><strong>AY 2026-27</strong></div><div className="detail-row"><span>Financial year</span><strong>FY 2025-26</strong></div><div className="detail-row"><span>Document category</span><strong>{docDetail.document_category.replaceAll('_', ' ')}</strong></div><div className="detail-row"><span>Tax category</span><strong>{taxCategory}</strong></div></div>
          <div className="detail-section"><div className="section-label">Verification</div><div className="detail-row"><span>Verification status</span><strong className="text-[#2d6f91]">{verificationLabel}</strong></div><div className="detail-row"><span>Bank transactions</span><strong className="font-mono">{docDetail.bank_transactions_count}</strong></div><div className="detail-row"><span>Invoices linked</span><strong className="font-mono">{docDetail.invoices_count}</strong></div><div className="detail-row"><span>GST records</span><strong className="font-mono">{docDetail.gst_records_count}</strong></div></div>
          <div className="detail-section"><div className="section-label">Risk assessment</div><div className="flex items-center justify-between py-2"><span className="text-xs text-[#687887]">Risk score</span><strong className={`text-lg ${scoreClass}`}>{score}/100</strong></div><div className="detail-row"><span>Risk level</span><strong>{riskLabel}</strong></div><div className="detail-row"><span>Detected anomalies</span><strong className="font-mono">{docDetail.anomalies_count}</strong></div></div>
          <div className="detail-section"><div className="section-label">Audit trail</div><div className="detail-row"><span>Uploaded by</span><strong>Current user</strong></div><div className="detail-row"><span>Processed date</span><strong>{new Date(docDetail.updated_at).toLocaleDateString('en-GB')}</strong></div><div className="detail-row"><span>Last reviewed by</span><strong>Pending review</strong></div></div>
        </aside>

        <section className="detail-panel">
          <div className="flex items-center justify-between border-b border-[#d5dfe4] pb-3"><div><div className="section-label">Verification results</div><h3 className="text-base font-semibold text-[#183247] flex items-center gap-2"><Tag className="w-4 h-4 text-[#2d6f91]" /> Extracted financial entities</h3></div><span className="status-label status-info">RULE + OCR ENGINE</span></div>
          {docDetail.extracted_fields.length === 0 ? <div className="py-12 text-center text-xs text-[#7b8a96]">No structured fields extracted yet. Load the demo scenario to view parsed sample entities.</div> : <div className="divide-y divide-[#e1e7eb]">{docDetail.extracted_fields.map((field) => <div key={field.id} className="py-3 flex items-center justify-between gap-4"><span className="text-xs font-medium text-[#526676]">{field.field_name}</span><div className="flex items-center gap-3"><span className="text-sm font-semibold text-[#183247] font-mono">{field.field_value}</span><span className="status-label status-success">{(field.confidence * 100).toFixed(0)}% CONF.</span></div></div>)}</div>}
          <div className="mt-5 border-t border-[#d5dfe4] pt-4"><div className="section-label">Storage metadata</div><p className="text-[11px] text-[#7b8a96] font-mono break-all">{docDetail.storage_path}</p></div>
        </section>
      </div>
    </div>
  );
};
