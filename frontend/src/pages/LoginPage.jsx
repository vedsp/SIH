import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';

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
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f4f1eb] relative overflow-hidden">
      {/* Background Glow Highlights */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#d9e0e6 1px, transparent 1px), linear-gradient(90deg, #d9e0e6 1px, transparent 1px)', backgroundSize: '42px 42px' }}></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-1 rounded-lg bg-[#102A43] shadow-xl shadow-slate-900/10 mb-2">
            <img src="/findocai-mark.svg" alt="FinDocAI logo" className="w-20 h-20 rounded" />
          </div>
          <h2 className="text-3xl font-bold text-[#183247] tracking-tight">FinDocAI Audit Workspace</h2>
          <p className="text-sm text-slate-400">Controlled evidence review for financial assurance teams</p>
        </div>

        {/* Login Box */}
        <div className="glass-card p-8 rounded-lg border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[#183247]">Sign in to the engagement</h3>
            <p className="text-xs text-slate-400">Enter your analyst or business user credentials</p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@findoc.ai"
                  className="w-full bg-white border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#17212b] focus:outline-none focus:border-[#b16d18] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#17212b] focus:outline-none focus:border-[#b16d18] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#183247] hover:bg-[#24465e] text-white font-semibold py-3 px-4 rounded-lg transition shadow-lg shadow-slate-900/10 active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {loading ? 'Authenticating...' : 'Access FinDocAI'}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-sky-400 font-semibold hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* SIH Hackathon Quick Demo Credentials Note */}
        <div className="bg-sky-500/5 border border-sky-500/10 p-3.5 rounded-2xl text-center text-xs text-slate-400">
          <span className="font-semibold text-sky-400">SIH Hackathon Quick Access:</span> Use pre-filled credentials or register any new user account.
        </div>
      </div>
    </div>
  );
};
