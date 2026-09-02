import React, { useState } from 'react';
import { FileText, Trash2, Eye, Calendar, FileCheck, AlertCircle, FileCode } from 'lucide-react';

export const DocumentTable = ({ documents, onViewDetail, onDeleteDocument, loading }) => {
  const [deleteId, setDeleteId] = useState(null);

  const getCategoryBadge = (category) => {
    const badges = {
      BANK_STATEMENT: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      GST_RETURN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      INVOICE: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      ITR: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      BALANCE_SHEET: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      PROFIT_LOSS: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
      OTHER: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };
    return (
      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${badges[category] || badges.OTHER}`}>
        {category ? category.replace('_', ' ') : 'OTHER'}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statuses = {
      COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      EXTRACTED: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      PROCESSING: 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse',
      UPLOADED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      FAILED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };
    return (
      <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border uppercase ${statuses[status] || statuses.UPLOADED}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="glass-card p-12 rounded-2xl text-center">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-400 mt-3">Loading document repository...</p>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="glass-card p-12 rounded-2xl text-center border-dashed border-slate-800">
        <FileCode className="w-12 h-12 text-slate-600 mx-auto" />
        <h4 className="text-base font-semibold text-slate-300 mt-3">No Documents Uploaded</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Upload your financial documents (Bank Statements, GST Returns, Invoices) or click "Load Demo Scenario" at the top right for an instant test run.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Document Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Size</th>
              <th className="px-6 py-4">Uploaded</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-sky-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-100 truncate max-w-xs">{doc.original_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{doc.file_type.toUpperCase()} • {doc.page_count} page(s)</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {getCategoryBadge(doc.document_category)}
                </td>

                <td className="px-6 py-4">
                  {getStatusBadge(doc.status)}
                </td>

                <td className="px-6 py-4 text-xs font-mono text-slate-400">
                  {(doc.file_size / 1024).toFixed(1)} KB
                </td>

                <td className="px-6 py-4 text-xs text-slate-400">
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewDetail(doc.id)}
                      className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/20 transition"
                      title="View Details & Extracted Data"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(doc.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-semibold text-white">Delete Document</h4>
            </div>
            <p className="text-xs text-slate-400">
              Are you sure you want to delete this document? This will permanently remove the storage file and all extracted financial entities.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteDocument(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
