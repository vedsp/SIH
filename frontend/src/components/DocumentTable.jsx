import React, { useState } from 'react';
import { FileText, Trash2, Eye, AlertCircle, FileCode, ChevronDown, ChevronUp } from 'lucide-react';

export const DocumentTable = ({ documents, onViewDetail, onDeleteDocument, loading }) => {
  const [deleteId, setDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const getCategoryLabel = (category) => {
    const labels = {
      BANK_STATEMENT: 'Bank Statement', GST_RETURN: 'GST Return', INVOICE: 'Invoice', ITR: 'ITR Document',
      BALANCE_SHEET: 'Balance Sheet', PROFIT_LOSS: 'Profit & Loss', OTHER: 'Other',
    };
    return labels[category] || 'Other';
  };

  const getCategoryBadge = (category) => {
    return (
      <span className="status-label status-neutral">
        {getCategoryLabel(category)}
      </span>
    );
  };

  const getVerification = (doc) => {
    if (doc.status === 'COMPLETED') return ['VERIFIED', 'status-success'];
    if (doc.status === 'FAILED') return ['FLAGGED', 'status-critical'];
    if (doc.status === 'EXTRACTED') return ['EXTRACTED', 'status-info'];
    return ['UNDER REVIEW', 'status-warning'];
  };

  const getRisk = (doc) => {
    if (doc.status === 'FAILED' || doc.original_name.toLowerCase().includes('duplicate')) return ['HIGH', 'risk-high'];
    if (doc.status === 'PROCESSING' || doc.status === 'UPLOADED') return ['MEDIUM', 'risk-medium'];
    return ['LOW', 'risk-low'];
  };

  const formatDate = (value) => new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const getTaxCategory = (category) => {
    if (category === 'GST_RETURN') return 'GST Compliance';
    if (category === 'INVOICE') return 'Business Transaction';
    if (category === 'ITR') return 'Direct Tax';
    if (category === 'BANK_STATEMENT') return 'Financial Evidence';
    return 'Financial Record';
  };

  const getStatusBadge = (doc) => {
    const [label, style] = getVerification(doc);
    return (
      <span className={`status-label ${style}`}>
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="register-empty">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-slate-400 mt-3">Loading document repository...</p>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="register-empty border-dashed">
        <FileCode className="w-12 h-12 text-slate-600 mx-auto" />
        <h4 className="text-base font-semibold text-slate-300 mt-3">No Documents Uploaded</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Upload your financial documents (Bank Statements, GST Returns, Invoices) or click "Load Demo Scenario" at the top right for an instant test run.
        </p>
      </div>
    );
  }

  return (
    <div className="register-table-wrap">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left text-xs text-[#435363]">
          <thead className="bg-[#eef3f6] text-[10px] font-semibold text-[#526676] uppercase tracking-wider border-b border-[#cfd9df]">
            <tr>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Financial year</th>
              <th className="px-4 py-3">Document type</th>
              <th className="px-4 py-3">Tax category</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3">Risk level</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Upload date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e1e7eb]">
            {documents.map((doc) => (
              <React.Fragment key={doc.id}>
              <tr className="hover:bg-[#f7fafb] transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-sm bg-[#edf3f5] border border-[#cfd9df] text-[#2d6f91] shrink-0">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#183247] truncate max-w-[260px]">{doc.original_name}</div>
                      <div className="text-[10px] text-[#7b8a96] font-mono">DOC-{String(doc.id).padStart(5, '0')} · {doc.file_type.toUpperCase()} · {doc.page_count} page(s)</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-[#526676]">FY 2025-26</td>
                <td className="px-4 py-3">
                  {getCategoryBadge(doc.document_category)}
                </td>
                <td className="px-4 py-3 text-[#526676]">{getTaxCategory(doc.document_category)}</td>
                <td className="px-4 py-3">{getStatusBadge(doc)}</td>
                <td className="px-4 py-3"><span className={`risk-label ${getRisk(doc)[1]}`}><span>●</span> {getRisk(doc)[0]}</span></td>
                <td className="px-4 py-3 font-mono text-[#687887]">
                  {(doc.file_size / 1024).toFixed(1)} KB
                </td>
                <td className="px-4 py-3 text-[#687887]">
                  {formatDate(doc.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewDetail(doc.id)}
                      className="table-action table-action-view"
                      title="View Details & Extracted Data"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {getRisk(doc)[0] === 'HIGH' && (
                      <button
                        onClick={() => setExpandedId(expandedId === doc.id ? null : doc.id)}
                        className="table-action table-action-view"
                        title="View review note"
                      >
                        {expandedId === doc.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteId(doc.id)}
                      className="table-action table-action-delete"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              {expandedId === doc.id && (
                <tr className="bg-[#fffaf0]">
                  <td colSpan="9" className="px-4 py-2.5 text-[11px] text-[#765a2b] border-t border-[#ead9b8]">
                    <strong>Review note:</strong> Potential duplicate or inconsistent evidence detected. Confirm invoice number, vendor, amount, and related filings before verification.
                  </td>
                </tr>
              )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white border border-[#cfd9df] p-6 rounded-md max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-semibold text-[#183247]">Delete Document</h4>
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
                className="px-4 py-2 bg-[#a34d42] hover:bg-[#873d35] text-white text-xs font-semibold rounded-md transition"
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
