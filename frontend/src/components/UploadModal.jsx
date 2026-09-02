import React, { useState } from 'react';
import { documentApi } from '../services/api';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    validateAndSetFiles(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    validateAndSetFiles(dropped);
  };

  const validateAndSetFiles = (selectedFiles) => {
    setError(null);
    const validExtensions = ['pdf', 'png', 'jpg', 'jpeg', 'csv', 'xlsx'];
    const validFiles = [];

    for (const f of selectedFiles) {
      const ext = f.name.split('.').pop().toLowerCase();
      if (!validExtensions.includes(ext)) {
        setError(`Unsupported file type '${ext}'. Please upload PDF, Image, CSV, or Excel files.`);
        return;
      }
      if (f.size > 25 * 1024 * 1024) {
        setError(`File '${f.name}' exceeds maximum 25MB limit.`);
        return;
      }
      validFiles.push(f);
    }
    setFiles(validFiles);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please select at least one document to upload.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const uploadedDocs = await documentApi.upload(formData);
      setSuccessMsg(`Successfully uploaded ${uploadedDocs.length} document(s)! Processing initial metadata.`);
      setFiles([]);
      if (onUploadSuccess) onUploadSuccess();
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#111827] border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Upload Financial Documents</h3>
              <p className="text-xs text-slate-400">Upload Bank Statements, GST Returns, Invoices, or ITR PDFs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-700 hover:border-sky-500/50 bg-slate-900/40 rounded-xl p-8 text-center transition cursor-pointer group"
          >
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input" className="cursor-pointer block">
              <UploadCloud className="w-10 h-10 mx-auto text-slate-500 group-hover:text-sky-400 transition" />
              <p className="mt-2 text-sm font-medium text-slate-300">
                Drag & drop files here, or <span className="text-sky-400 underline">browse</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports PDF, PNG, JPG, CSV, XLSX (Up to 25MB each)
              </p>
            </label>
          </div>

          {/* Selected File List */}
          {files.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              <div className="text-xs font-semibold text-slate-400">Selected Files ({files.length}):</div>
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="text-slate-200 truncate">{file.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-slate-500 hover:text-rose-400 transition p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={uploading || files.length === 0}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-lg shadow-sky-600/20 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {uploading ? 'Processing Documents...' : 'Start Extraction'}
          </button>
        </div>
      </div>
    </div>
  );
};
