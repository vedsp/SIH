import React, { useEffect, useState } from 'react';
import { documentApi } from '../services/api';
import { DocumentTable } from '../components/DocumentTable';
import { FileCheck2, UploadCloud, Search, Filter, RotateCcw } from 'lucide-react';

export const DocumentsPage = ({ onOpenUpload, onViewDetail, refreshTrigger, initialCategory = '' }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
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

  useEffect(() => {
    setCategoryFilter(initialCategory);
  }, [initialCategory]);

  const filteredDocs = documents.filter(doc => 
    doc.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const verifiedCount = documents.filter((doc) => doc.status === 'COMPLETED').length;
  const reviewCount = documents.filter((doc) => ['UPLOADED', 'PROCESSING', 'EXTRACTED'].includes(doc.status)).length;
  const flaggedCount = documents.filter((doc) => doc.status === 'FAILED' || doc.original_name.toLowerCase().includes('duplicate')).length;

  const clearFilters = () => {
    setCategoryFilter('');
    setSearchTerm('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#cfd9df] pb-4">
        <div>
          <div className="audit-kicker">Document management / evidence register</div>
          <h2 className="text-2xl font-bold text-[#183247] tracking-tight flex items-center gap-2 mt-1">
            <FileCheck2 className="w-5 h-5 text-[#2d6f91]" />
            Financial Evidence Repository
          </h2>
          <p className="text-xs text-[#687887] mt-1">
            Centralized review, classification, and verification of taxpayer financial documents.
          </p>
        </div>
        <button
          onClick={onOpenUpload}
          className="flex items-center justify-center gap-2 bg-[#183247] hover:bg-[#24465e] text-white text-xs font-semibold px-4 py-2.5 rounded-md transition"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 border border-[#d5dfe4] bg-white">
        {[
          ['Total documents', documents.length, 'text-[#183247]'],
          ['Verified', verifiedCount, 'text-[#2f6f5e]'],
          ['Under review', reviewCount, 'text-[#87621b]'],
          ['Risk flags', flaggedCount, 'text-[#a34d42]'],
          ['Assessment year', 'AY 2026-27', 'text-[#183247]'],
        ].map(([label, value, color], index) => (
          <div key={label} className={`px-4 py-3 ${index > 0 ? 'border-l border-[#d5dfe4]' : ''}`}>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-[#718290]">{label}</div>
            <div className={`mt-1 text-lg font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="border border-[#d5dfe4] bg-white p-3">
        <div className="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-wider font-semibold text-[#526676]">
          <Filter className="w-3.5 h-3.5 text-[#2d6f91]" />
          Register filters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
          <select className="portal-filter" defaultValue="AY 2026-27" aria-label="Assessment year">
            <option>AY 2026-27</option>
            <option>AY 2025-26</option>
          </select>
          <select className="portal-filter" defaultValue="FY 2025-26" aria-label="Financial year">
            <option>FY 2025-26</option>
            <option>FY 2024-25</option>
          </select>
          <select className="portal-filter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} aria-label="Document type">
            <option value="">All document types</option>
            <option value="BANK_STATEMENT">Bank statements</option>
            <option value="GST_RETURN">GST returns</option>
            <option value="INVOICE">Invoices</option>
            <option value="ITR">ITR documents</option>
          </select>
          <select className="portal-filter" defaultValue="" aria-label="Verification status">
            <option value="">Verification status</option>
            <option>Verified</option>
            <option>Under review</option>
            <option>Flagged</option>
          </select>
          <select className="portal-filter" defaultValue="" aria-label="Risk level">
            <option value="">Risk level</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <div className="relative lg:col-span-1">
            <Search className="w-3.5 h-3.5 text-[#718290] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search name, PAN, reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="portal-filter w-full pl-8"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-3">
          <button onClick={clearFilters} className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-[#526676] hover:text-[#183247] uppercase">
            <RotateCcw className="w-3 h-3" /> Clear filters
          </button>
          <span className="text-[11px] text-[#8a99a4]">Showing {filteredDocs.length} of {documents.length} records</span>
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
