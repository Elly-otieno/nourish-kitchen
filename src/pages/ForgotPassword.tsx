import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  try {
    await api.resetPassword({ email: email.trim() });
    setSuccess(true);
  } catch (err: any) {
    console.error('Password reset failed:', err);
    setError(err.message || 'Something went wrong. Please try again later.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#faf9f6]">
      <div className="max-w-md mx-auto">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-stone-100">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="request-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-8 mx-auto">
                  <Mail className="text-primary" size={32} strokeWidth={1.5} />
                </div>

                <h1 className="font-serif text-4xl text-emerald-950 text-center mb-4">Forgot Password?</h1>
                <p className="text-stone-500 text-center mb-10 leading-relaxed font-light">
                  No worries! Enter your email and we'll send you a link to get back into your kitchen.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/40 px-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="chef@nourish.com"
                        className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-sans text-sm"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex items-center gap-2 text-red-500 bg-red-50 p-4 rounded-xl text-xs font-bold"
                    >
                      <AlertCircle size={16} />
                      {error}
                    </motion.div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-emerald-950 text-white py-6 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-950/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Sending Link...
                      </>
                    ) : (
                      'Request Reset Link'
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 mx-auto">
                  <CheckCircle2 className="text-emerald-600" size={48} strokeWidth={1.5} />
                </div>

                <h2 className="font-serif text-4xl text-emerald-950 mb-6 font-bold leading-tight">Check your Inbox</h2>
                <p className="text-stone-500 mb-10 leading-relaxed font-light italic">
                  "If an account is associated with <span className="text-emerald-700 font-bold">{email}</span>, we've sent instructions to reset your password."
                </p>

                <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 mb-10">
                  <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest leading-loose">
                    Didn't receive an email? <br />
                    Check your spam or <button onClick={() => setSuccess(false)} className="underline hover:text-emerald-600 transition-colors">try again</button>
                  </p>
                </div>

                <Link 
                  to="/login"
                  className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-emerald-950 border-b-2 border-emerald-950/10 pb-2 hover:border-emerald-950 transition-all"
                >
                  Return to Dashboard
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
