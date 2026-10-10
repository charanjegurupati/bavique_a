import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both your administrator email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background aesthetics with floating ambient glowing orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-20 right-1/4 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-blush-200/50 to-champagne-300/40 blur-[130px] animate-orb-1" />
        <div className="absolute -bottom-20 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-gold-300/35 to-rosegold-300/30 blur-[140px] animate-orb-2" />
      </div>

      {/* Return to website link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-btn-light text-chocolate-800 text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Boutique Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Branding */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-tr from-champagne-300 to-gold-400 mx-auto shadow-md mb-3 flex items-center justify-center">
            <img
              src="/logo-nav.webp"
              alt="BAVIQUE"
              className="w-full h-full object-cover rounded-xl bg-white"
            />
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-chocolate-950">
            BAVIQUE Owner Portal
          </h2>
          <p className="text-xs sm:text-sm text-chocolate-600 mt-1">
            Catalogue Management & Product Administration
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-white/90">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 leading-relaxed font-medium">
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-chocolate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bavique.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-chocolate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-chocolate-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-chocolate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl glass-input text-sm text-chocolate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-chocolate-600 hover:text-chocolate-900"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-chocolate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Protected with rate limiting & encrypted session tokens</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl glass-btn-dark text-champagne-100 text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-champagne-200 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Log In to Dashboard</span>
              )}
            </button>
          </form>

          {/* Quick Info Box */}
          <div className="mt-8 pt-6 border-t border-champagne-300/60 text-center">
            <p className="text-[11px] text-chocolate-600">
              Store Owner Portal is strictly reserved for authorized boutique management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
