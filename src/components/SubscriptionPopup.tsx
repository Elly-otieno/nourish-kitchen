import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, CheckCircle, ArrowRight, ShieldCheck, ChefHat, Utensils, BookOpen, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export function SubscriptionPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the popup
    const hasSubscribed = localStorage.getItem('has_subscribed');
    const hasDismissed = localStorage.getItem('popup_dismissed');
    
    if (!hasSubscribed && !hasDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('popup_dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !acceptedTerms) return;

    setStatus('loading');
    try {
      await api.subscribeToNewsletter(email);
      setStatus('success');
      localStorage.setItem('has_subscribed', 'true');
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Subscription failed:', error);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-4xl bg-white rounded-[3rem] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.1)] relative flex flex-col md:flex-row min-h-125"
          >
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 text-stone-300 hover:text-stone-900 transition-colors z-20 p-2 hover:bg-stone-50 rounded-full"
            >
              <X size={20} />
            </button>

            {/* Left Side: Visual Inspiration */}
            <div className="md:w-5/12 relative min-h-75 md:min-h-full overflow-hidden">
               <motion.img 
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 10, ease: "linear" }}
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800" 
                  alt="African Spices" 
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.8] contrast-[1.1]"
               />
               <div className="absolute inset-0 bg-linear-to-t from-emerald-950/90 via-emerald-950/20 to-transparent" />
               
               <div className="absolute inset-x-0 bottom-0 p-10 z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-8 bg-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400">The Heritage Table</span>
                  </div>
                  <p className="text-xl font-serif italic text-white/90 leading-relaxed">
                    "Every flavor is a memory, every recipe a story of home."
                  </p>
               </div>
            </div>

            {/* Right Side: Soulful Form */}
            <div className="md:w-7/12 p-8 md:p-14 lg:p-20 flex flex-col justify-center bg-stone-50">
              {status === 'success' ? (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.8 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center"
                 >
                   <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-8 shadow-[0_10px_30px_-5px_rgba(16,185,129,0.1)] border border-emerald-100">
                     <Utensils size={32} />
                   </div>
                   <h3 className="font-serif text-3xl font-bold text-emerald-950 mb-4 italic leading-tight">You've got a seat at our table!</h3>
                   <p className="text-stone-500 text-base font-sans italic">Our first kitchen update will reach you soon. With love.</p>
                 </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="mb-8">
                    <h3 className="font-serif text-3xl md:text-4xl font-bold text-emerald-950 mb-4 leading-tight">
                      Join our <span className="italic font-normal">Kitchen Family.</span>
                    </h3>
                    <p className="text-stone-500 font-medium italic text-base leading-relaxed">Fresh recipes from our home to yours. Discover the secrets of our heritage.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-700 transition-colors" size={18} />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your best email address..."
                        className="w-full bg-white border border-stone-100 rounded-4xl pl-16 pr-8 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all font-medium placeholder:text-stone-300 shadow-sm"
                      />
                    </div>

                    <div className="flex items-start gap-4 px-6">
                      <button 
                        type="button"
                        onClick={() => setAcceptedTerms(!acceptedTerms)}
                        className={`w-6 h-6 rounded-full border transition-all mt-0.5 flex items-center justify-center shrink-0 ${
                          acceptedTerms ? 'bg-emerald-700 border-emerald-700 text-white shadow-lg shadow-emerald-700/20' : 'bg-white border-stone-200'
                        }`}
                      >
                        {acceptedTerms && <CheckCircle size={14} />}
                      </button>
                      <p className="text-[10px] text-stone-400 font-bold leading-relaxed uppercase tracking-widest">
                        I accept the <Link to="/legal" onClick={() => setIsOpen(false)} className="text-emerald-700 hover:underline underline-offset-8 decoration-emerald-200">Privacy Policy</Link> and wish to receive the kitchen family updates.
                      </p>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={!email || !acceptedTerms || status === 'loading'}
                    className={`w-full py-5 rounded-4xl font-bold text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group shadow-xl ${
                      !email || !acceptedTerms || status === 'loading'
                        ? 'bg-stone-100 text-stone-300 cursor-not-allowed shadow-none'
                        : 'bg-emerald-950 text-white hover:bg-[#132c23] hover:shadow-emerald-950/20 active:scale-[0.98]'
                    }`}
                  >
                    {status === 'loading' ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        Join the Family <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  
                  <div className="pt-4 flex justify-center items-center gap-2 text-[9px] text-stone-300 font-black uppercase tracking-[0.3em]">
                     <Utensils size={12} /> From our heart to yours
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

