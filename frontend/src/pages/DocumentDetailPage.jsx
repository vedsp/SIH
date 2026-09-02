import React, { useEffect, useState } from 'react';
import { documentApi } from '../services/api';
import { ArrowLeft, FileText, CheckCircle2, ShieldAlert, AlertTriangle, Database, Hash, Tag, Layers } from 'lucide-react';

export const DocumentDetailPage = ({ documentId, onBack }) => {
  const [docDetail, setDocDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await documentApi.getDetail(documentId);
        setDocDetail(data);
      } catch (err) {
        console.error("Failed to load document detail:", err);
      } finally {
        setLoading(false);
      }
    };
    if (documentId) fetchDetail();
  }, [documentId]);

  if (loading) {
    return (
      <div className="glass-card p-12 rounded-2xl text-center">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-400 mt-3">Extracting document details & entity values...</p>
      </div>
    );
  }

  if (!docDetail) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center space-y-4">
        <p className="text-sm text-slate-400">Document not found or inaccessible.</p>
        <button onClick={onBack} className="text-xs text-sky-400 underline">Return to list</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{docDetail.original_name}</h2>
          <p className="text-xs text-slate-400 font-mono">ID #{docDetail.id} • {docDetail.file_type.toUpperCase()} • {docDetail.page_count} Page(s)</p>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metadata & Classification Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Classification</div>
              <div className="text-base font-bold text-sky-400">{docDetail.document_category.replace('_', ' ')}</div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Status</span>
              <span className="text-emerald-400 font-mono font-semibold">{docDetail.status}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">File Size</span>
              <span className="text-slate-200 font-mono">{(docDetail.file_size / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Bank Transactions Extracted</span>
              <span className="text-slate-200 font-mono">{docDetail.bank_transactions_count}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Invoices Linked</span>
              <span className="text-slate-200 font-mono">{docDetail.invoices_count}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Detected Issues / Anomalies</span>
              <span className={docDetail.anomalies_count > 0 ? "text-amber-400 font-bold" : "text-emerald-400 font-mono"}>
                {docDetail.anomalies_count} issue(s)
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span>Storage Metadata</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono truncate">
              {docDetail.storage_path}
            </p>
          </div>
        </div>

        {/* Right Column: Extracted Entities Table */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-sky-400" />
              Extracted Financial Key-Value Entities
            </h3>
            <span className="text-xs bg-sky-500/10 text-sky-400 px-2.5 py-1 rounded-full border border-sky-500/20 font-mono">
              Rule + OCR Engine
            </span>
          </div>

          {docDetail.extracted_fields.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No structured fields extracted yet. Click "Load Demo Scenario" to view parsed sample entities.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {docDetail.extracted_fields.map((ef) => (
                <div key={ef.id} className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-3 rounded-lg transition">
                  <span className="text-xs font-medium text-slate-400">{ef.field_name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-100 font-mono">{ef.field_value}</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono">
                      {(ef.confidence * 100).toFixed(0)}% conf
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
