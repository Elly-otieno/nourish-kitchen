import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Camera,
  MapPin,
  Globe
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { log } from 'console';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: 'Home Chef',
    bio: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(2);
      return;
    }

    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    console.log('Data sent', formData);
    
    try {
      await register({
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'USER', // Default to User
        bio: formData.bio || `Specializing in ${formData.specialization}`
      });
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
        {/* Left Side: Visual Inspiration - Cojoined */}
        <div className="lg:w-1/2 relative h-75 lg:h-auto overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="absolute inset-0 h-full w-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1466633364853-3bb1fbfd29ac?auto=format&fit=crop&q=80&w=2000" 
              alt="Sprinkling Herbs in the Kitchen" 
              className="w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
          </motion.div>
          
          <div className="absolute bottom-10 left-10 right-10 z-10 text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-400">Our Shared Table</span>
              </div>
              <h2 className="font-serif text-3xl lg:text-5xl font-bold mb-6 leading-tight">
                Share your <br />
                <span className="italic font-light opacity-90 text-emerald-100">kitchen stories.</span>
              </h2>
              <p className="text-white/70 text-sm font-light italic max-w-sm leading-relaxed">
                "Join a circle of food lovers and home chefs dedicated to the simple joy of cooking and the stories behind every dish."
              </p>
            </motion.div>

            <div className="mt-10 flex items-center gap-6 border-t border-white/10 pt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-stone-900 bg-[url('https://i.pravatar.cc/100?img=${i+20}')] bg-cover shadow-lg`} />
                ))}
              </div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400/80">
                Joined by <span className="text-white font-black">1,240+</span> fellow cooks
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:w-1/2 p-8 md:p-12 lg:p-20 relative bg-[#faf9f6]/30">
          <div className="max-w-md mx-auto relative z-10">
            <div className="mb-10 text-center lg:text-left">
              <div className="flex items-center gap-2 mb-8 max-w-30 mx-auto lg:mx-0">
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-4 tracking-tight">Begin your Journey</h1>
              <p className="text-stone-500 font-medium italic text-lg leading-relaxed">Share wholesome flavors, one recipe at a time.</p>
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
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div 
                      key="step-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-center mb-8">
                        <div className="relative group cursor-pointer">
                          <div className="w-24 h-24 rounded-4xl bg-white border-2 border-dashed border-stone-200 flex items-center justify-center text-stone-300 group-hover:border-emerald-400 group-hover:text-emerald-500 transition-all overflow-hidden shadow-inner">
                            <Camera size={28} strokeWidth={1.5} />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-white">
                            <Camera size={12} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-6 block">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-700 transition-colors" size={18} />
                          <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Julian Nourish"
                            className="w-full pl-16 pr-8 py-4 bg-white border border-stone-100 rounded-4xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all font-medium placeholder:text-stone-300"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="step-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-6 block">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-700 transition-colors" size={18} />
                          <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="you@nourishkitchen.com"
                            className="w-full pl-16 pr-8 py-4 bg-white border border-stone-100 rounded-4xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all font-medium placeholder:text-stone-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-6 block">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-700 transition-colors" size={18} />
                          <input 
                            type="password" 
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="••••••••"
                            className="w-full pl-16 pr-8 py-4 bg-white border border-stone-100 rounded-4xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all font-medium placeholder:text-stone-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-6 block">Verify Password</label>
                        <div className="relative">
                          <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-700 transition-colors" size={18} />
                          <input 
                            type="password" 
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            placeholder="••••••••"
                            className="w-full pl-16 pr-8 py-4 bg-white border border-stone-100 rounded-4xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all font-medium placeholder:text-stone-300"
                          />
                        </div>
                      </div>

                      <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                        <p className="text-[10px] text-emerald-700/70 leading-relaxed font-sans font-medium italic">
                          By joining our home kitchen, you agree to our <Link to="/privacy" className="font-bold underline decoration-emerald-200">Privacy Policy</Link> and <Link to="/terms" className="font-bold underline decoration-emerald-200">Terms of Service</Link>.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4 pt-4">
                  {step === 2 && (
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-4 bg-stone-100 text-stone-500 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-stone-200 transition-all"
                    >
                      Back
                    </motion.button>
                  )}
                  <motion.button 
                    whileHover={{ scale: 1.01, backgroundColor: '#132c23' }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-[#1a382d] text-white rounded-4xl py-4 font-bold text-[11px] uppercase tracking-[0.4em] shadow-xl shadow-emerald-950/10 transition-all flex items-center justify-center gap-4 disabled:opacity-70 group relative overflow-hidden"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        {step === 1 ? 'Next Step' : 'Join the Kitchen'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              <div className="text-center pt-8 border-t border-stone-100">
                <p className="text-sm font-medium text-stone-500">
                  Already registered? <Link to="/login" className="text-emerald-700 font-bold hover:underline decoration-emerald-200 decoration-2 underline-offset-8 transition-all">Revisit our Kitchen</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
