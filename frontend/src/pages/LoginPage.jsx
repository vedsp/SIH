import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowRight, Lock, Mail, Loader2, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0F19] relative overflow-hidden">
      {/* Background Glow Highlights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-400 shadow-xl shadow-sky-500/20 mb-2">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">FinDocAI Platform</h2>
          <p className="text-sm text-slate-400">AI-Powered Financial Intelligence & Risk Assessment</p>
        </div>

        {/* Login Box */}
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Sign In to Dashboard</h3>
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
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 transition"
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
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white font-semibold py-3 px-4 rounded-xl transition shadow-lg shadow-sky-600/25 active:scale-[0.99] disabled:opacity-50 mt-2"
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
