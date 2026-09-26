import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, Shield } from 'lucide-react';

export const LoginPage = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('analyst@findoc.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8]">
      {/* Official Top Government Bar */}
      <header className="portal-header py-2.5 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[2px] bg-white text-[#0b3861] font-bold flex items-center justify-center text-sm">
            IT
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wide uppercase">Income Tax Department · Statutory Audit Portal</h1>
            <p className="text-[11px] text-[#cfd9df]">FinDocAI Central Assessment & Evidence Processing Engine</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] text-[#cfd9df]">
          <span>CBDT Schema v2026.1</span>
          <span>|</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-[#f2a900]" /> Secure Portal</span>
        </div>
      </header>

      {/* Main Login Body */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-3">
          <div className="bg-white border border-[#cccccc]">
            <div className="bg-[#f2f4f7] px-4 py-2.5 border-b border-[#cccccc]">
              <h2 className="text-xs font-bold text-[#222222] uppercase tracking-wide">
                Tax Assessee / Auditor Login
              </h2>
              <p className="text-[11px] text-[#555555]">
                Enter registered user ID (Email) and password to access ITR dossiers
              </p>
            </div>

            <div className="p-5 space-y-4">
              {error && (
                <div className="p-2.5 bg-white border border-[#b91c1c] text-negative text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#333333] mb-1">
                    User ID / Registered Email ID:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@findoc.ai"
                    className="w-full itr-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#333333] mb-1">
                    Password:
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full itr-input"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-2 text-xs"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    {loading ? 'Authenticating User...' : 'Continue to Portal'}
                  </button>
                </div>
              </form>

              <div className="pt-2 border-t border-[#e0e0e0] text-center text-xs text-[#555555]">
                New user?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-[#0b3861] font-semibold underline hover:text-[#082845]"
                >
                  Register User Account
                </button>
              </div>
            </div>
          </div>

          {/* Demonstration Notice */}
          <div className="bg-[#e9edf2] border border-[#cccccc] p-2.5 text-center text-[11px] text-[#444444]">
            <strong>Hackathon Assessment Mode:</strong> Pre-filled default auditor account enabled.
          </div>
        </div>
      </div>
    </div>
  );
};

