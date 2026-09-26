import React, { useEffect, useState } from 'react';
import { documentApi } from '../services/api';
import { ArrowLeft, Tag, FileText, CheckCircle2 } from 'lucide-react';

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
    return (
      <div className="bg-white border border-[#cccccc] p-8 text-center">
        <p className="text-xs text-[#555555]">Loading schedule details and extracted ledger records...</p>
      </div>
    );
  }

  if (!docDetail) {
    return (
      <div className="bg-white border border-[#cccccc] p-8 text-center space-y-3">
        <p className="text-xs text-[#555555]">Document record not found or inaccessible.</p>
        <button onClick={onBack} className="btn-primary">Return to Schedule List</button>
      </div>
    );
  }

  const verificationStatus = docDetail.status === 'COMPLETED' ? 'VERIFIED' : docDetail.status === 'FAILED' ? 'FAILED' : 'PENDING VERIFICATION';
  const statusClass = docDetail.status === 'COMPLETED' ? 'text-positive' : docDetail.status === 'FAILED' ? 'text-negative' : 'text-neutral';

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-white border border-[#cccccc] p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="btn-secondary" title="Return to list">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <div>
            <h2 className="text-sm font-bold text-[#222222] uppercase tracking-wide">
              Document Audit Record: {docDetail.original_name}
            </h2>
            <p className="text-xs text-[#555555] font-mono">
              DOC-{String(docDetail.id).padStart(5, '0')} · {docDetail.file_type.toUpperCase()} · {(docDetail.file_size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <div>
          <span className={`text-xs font-bold ${statusClass}`}>
            STATUS: {verificationStatus}
          </span>
        </div>
      </div>

      {/* 2-Column Schedule Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Left Column: Metadata Table */}
        <div className="bg-white border border-[#cccccc] md:col-span-1">
          <div className="bg-[#f2f4f7] px-3 py-2 border-b border-[#cccccc] font-bold text-xs text-[#222222] uppercase">
            Schedule Meta & Classification
          </div>
          <table className="itr-grid border-0">
            <tbody>
              <tr>
                <td className="font-semibold text-[#555555]" style={{ width: '45%' }}>Schedule Ref</td>
                <td className="font-mono">DOC-{String(docDetail.id).padStart(5, '0')}</td>
              </tr>
              <tr>
                <td className="font-semibold text-[#555555]">Category</td>
                <td className="font-bold">{docDetail.document_category.replaceAll('_', ' ')}</td>
              </tr>
              <tr>
                <td className="font-semibold text-[#555555]">Assessment Year</td>
                <td>AY 2026-27</td>
              </tr>
              <tr>
                <td className="font-semibold text-[#555555]">Financial Year</td>
                <td>FY 2025-26</td>
              </tr>
              <tr>
                <td className="font-semibold text-[#555555]">Page Count</td>
                <td className="font-mono text-right">{docDetail.page_count}</td>
              </tr>
              <tr>
                <td className="font-semibold text-[#555555]">Linked Bank Txns</td>
                <td className="font-mono text-right">{docDetail.bank_transactions_count}</td>
              </tr>
              <tr>
                <td className="font-semibold text-[#555555]">Linked Invoices</td>
                <td className="font-mono text-right">{docDetail.invoices_count}</td>
              </tr>
              <tr>
                <td className="font-semibold text-[#555555]">Flagged Exceptions</td>
                <td className={`font-mono text-right font-bold ${docDetail.anomalies_count > 0 ? 'text-negative' : 'text-positive'}`}>
                  {docDetail.anomalies_count}
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-[#555555]">Uploaded Timestamp</td>
                <td>{new Date(docDetail.created_at).toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Column: Parsed Financial Fields Table */}
        <div className="bg-white border border-[#cccccc] md:col-span-2">
          <div className="bg-[#f2f4f7] px-3 py-2 border-b border-[#cccccc] flex items-center justify-between">
            <span className="font-bold text-xs text-[#222222] uppercase">
              Schedule Part B: Extracted Financial Entities & Values
            </span>
            <span className="text-[11px] text-[#555555]">OCR & Rule Engine</span>
          </div>

          {docDetail.extracted_fields.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#666666]">
              No structured entities parsed yet. Ensure document contains readable ledger text or re-process.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="itr-grid border-0">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>Sr.</th>
                    <th>Entity / Field Description</th>
                    <th>Extracted Value</th>
                    <th>Confidence Score</th>
                  </tr>
                </thead>
                <tbody>
                  {docDetail.extracted_fields.map((field, idx) => (
                    <tr key={field.id || idx}>
                      <td className="text-center font-mono">{idx + 1}</td>
                      <td className="font-semibold text-[#222222]">{field.field_name}</td>
                      <td className="font-mono font-bold text-[#111111]">{field.field_value}</td>
                      <td className="text-right font-mono text-positive">{(field.confidence * 100).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-2.5 border-t border-[#cccccc] bg-[#fafafa] text-[11px] text-[#777777] font-mono break-all">
            Storage Location: {docDetail.storage_path}
          </div>
        </div>
      </div>
    </div>
  );
};

