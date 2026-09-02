import React, { useEffect, useState } from 'react';
import { documentApi } from '../services/api';
import { DocumentTable } from '../components/DocumentTable';
import { FileCheck2, UploadCloud, Search, Filter } from 'lucide-react';

export const DocumentsPage = ({ onOpenUpload, onViewDetail, refreshTrigger }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await documentApi.list(categoryFilter || null);
      setDocuments(data);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [categoryFilter, refreshTrigger]);

  const filteredDocs = documents.filter(doc => 
    doc.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-sky-400" />
            Financial Document Repository
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage, classify, and inspect uploaded bank statements, GST returns, and invoices
          </p>
        </div>
        <button
          onClick={onOpenUpload}
          className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-sky-600/20"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: '', label: 'All Documents' },
            { id: 'BANK_STATEMENT', label: 'Bank Statements' },
            { id: 'GST_RETURN', label: 'GST Returns' },
            { id: 'INVOICE', label: 'Invoices' },
            { id: 'ITR', label: 'ITR' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-xl border transition whitespace-nowrap ${
                categoryFilter === cat.id
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Table */}
      <DocumentTable
        documents={filteredDocs}
        loading={loading}
        onViewDetail={onViewDetail}
        onDeleteDocument={async (id) => {
          await documentApi.delete(id);
          fetchDocuments();
        }}
      />
    </div>
  );
};
