import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Shield } from 'lucide-react';

export const RegisterPage = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ANALYST');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(fullName, email, password, role);
    } catch (err) {
      setError(err.message || 'Registration failed.');
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
            <p className="text-[11px] text-[#cfd9df]">Assessee / Auditor Profile Registration</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] text-[#cfd9df]">
          <span>CBDT Schema v2026.1</span>
          <span>|</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-[#f2a900]" /> Secure Portal</span>
        </div>
      </header>

      {/* Main Registration Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-3">
          <div className="bg-white border border-[#cccccc]">
            <div className="bg-[#f2f4f7] px-4 py-2.5 border-b border-[#cccccc]">
              <h2 className="text-xs font-bold text-[#222222] uppercase tracking-wide">
                New User Registration (Form 1)
              </h2>
              <p className="text-[11px] text-[#555555]">
                Register chartered accountant or corporate assessee credentials
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
                    Assessee / Auditor Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="CA Rahul Sharma"
                    className="w-full itr-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#333333] mb-1">
                    Registered Email ID:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@ca-associates.in"
                    className="w-full itr-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#333333] mb-1">
                    Designated Portal Role:
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full itr-select"
                  >
                    <option value="ANALYST">Statutory Auditor / CA</option>
                    <option value="BUSINESS_USER">Corporate Assessee / MSME</option>
                    <option value="ADMIN">Portal Officer / Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#333333] mb-1">
                    Set Portal Password:
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
                    {loading ? 'Submitting Registration...' : 'Complete User Registration'}
                  </button>
                </div>
              </form>

              <div className="pt-2 border-t border-[#e0e0e0] text-center text-xs text-[#555555]">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-[#0b3861] font-semibold underline hover:text-[#082845]"
                >
                  Sign in here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

