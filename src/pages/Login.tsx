import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userData = await login(email);
      
      // Get the intended destination from location state
      const from = (location.state as any)?.from?.pathname || 
                   (userData.role === 'ADMIN' || userData.role === 'CHEF' ? '/dashboard' : '/profile');
      
      navigate(from, { replace: true });
    } catch (err: any) {
      setError('Invalid credentials. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#faf9f6] flex items-center justify-center py-12 md:py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col lg:flex-row border border-stone-100"
      >
        {/* Left Side: Visual Inspiration - Now cojoined */}
        <div className="lg:w-1/2 relative h-[300px] lg:h-auto overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="absolute inset-0 h-full w-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=2000" 
              alt="Steaming homemade nourish" 
              className="w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
          </motion.div>
          
          <div className="absolute bottom-10 left-10 right-10 z-10 text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-400">Home Cooked Love</span>
              </div>
              <h2 className="font-serif text-3xl lg:text-5xl font-bold mb-6 leading-tight">
                Savor the warmth <br />
                <span className="italic font-light opacity-90 text-emerald-100">of our kitchen.</span>
              </h2>
              <p className="text-white/70 text-sm font-light italic max-w-sm leading-relaxed">
                "A kitchen is the heart of the home, where memories are simmered and stories are shared over a warm plate."
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Side: Warm Welcome Form */}
        <div className="lg:w-1/2 p-8 md:p-12 lg:p-20 relative bg-[#faf9f6]/30">
          <div className="max-w-md mx-auto relative z-10">
            <div className="mb-10 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-6"
              >
                <img src="/src/assets/logo.png" alt="Nourish Kitchen" className="h-14 md:h-16 w-auto mx-auto lg:ml-0" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-3 tracking-tight">Pull up a Chair</h1>
                <p className="text-stone-500 font-medium italic text-base">Your home kitchen is ready for you.</p>
              </motion.div>
            </div>

            <div className="space-y-8">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest"
                  >
                    <AlertCircle size={14} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-6 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-700 transition-colors" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@nourishkitchen.com"
                      className="w-full pl-16 pr-8 py-4 bg-white border border-stone-100 rounded-[2rem] text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all font-medium placeholder:text-stone-300"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <div className="flex justify-between items-center px-6">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Password</label>
                    <Link to="/forgot-password" className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-900 transition-colors">Forgotten?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-700 transition-colors" size={18} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-16 pr-8 py-4 bg-white border border-stone-100 rounded-[2rem] text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all font-medium placeholder:text-stone-300"
                    />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01, backgroundColor: '#132c23' }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1a382d] text-white rounded-[2rem] py-4 font-bold text-[11px] uppercase tracking-[0.4em] shadow-xl shadow-emerald-950/10 transition-all flex items-center justify-center gap-4 disabled:opacity-70 group overflow-hidden relative"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Enter the Kitchen <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="text-center pt-8 border-t border-stone-100">
                <p className="text-sm font-medium text-stone-500">
                  New to our Kitchen? <Link to="/register" className="text-emerald-700 font-bold hover:underline decoration-emerald-200 decoration-2 underline-offset-8 transition-all">Start your Journey</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
