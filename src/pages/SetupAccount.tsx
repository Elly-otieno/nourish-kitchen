import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefHat, Lock, User, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';

export function SetupAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  // Local Form state (removed loading, success, and global error states)
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  // React Query: Token Verification on Mount
  const { 
    data: userData, 
    isLoading: loading, 
    error: verificationError 
  } = useQuery({
    queryKey: ['verifyInviteToken', token],
    queryFn: () => {
      if (!token) throw new Error('Missing invite token');
      return api.verifyInviteToken(token);
    },
    enabled: !!token, // Only run if token exists
    retry: false,
    staleTime: Infinity, // Invitation data doesn't change during session
  });

  // React Query: Account Creation Mutation
  const { 
    mutate: executeAccountSetup, 
    isPending: isSubmitting, 
    isSuccess: success, 
    error: mutationError 
  } = useMutation({
    mutationFn: (payload: { token: string; password: string; name: string }) => 
      api.setupInvitedAccount(payload),
    onSuccess: () => {
      setTimeout(() => navigate('/login'), 3000);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!token) {
      setValidationError('Invalid setup link. Invitation token is missing.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }

    executeAccountSetup({
      token,
      password: formData.password,
      name: formData.name
    });
  };

  // Consolidate API/Validation Error Messaging
  const displayError = 
    validationError || 
    (mutationError as any)?.message || 
    (verificationError as any)?.message || 
    null;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Handle dead tokens or structural link parameters errors early
  if ((!token || verificationError) && !userData) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-sm border border-stone-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-2">Invitation Error</h1>
          <p className="text-stone-500 mb-8">{displayError || 'This link has expired or is invalid.'}</p>
          <button 
            onClick={() => navigate('/login')} 
            className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-12 text-center shadow-sm border border-stone-100">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
            <CheckCircle size={32} />
          </div>
          <h1 className="text-3xl font-black text-stone-900 mb-2">Account Ready!</h1>
          <p className="text-stone-500 mb-8">Your credentials have been created. You're being redirected to the login page.</p>
          <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: '100%' }} 
              transition={{ duration: 3 }} 
              className="h-full bg-emerald-600" 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-full -mr-16 -mt-16" />
          
          <div className="relative mb-12 text-center">
            <div className="w-16 h-16 bg-stone-950 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6 shadow-xl">
              <ChefHat className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-stone-900 leading-tight mb-2">Join the Kitchen</h1>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Complete your setup</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {displayError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-red-50 rounded-2xl border border-red-100 mb-6"
                >
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">{displayError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-6">Display Name</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-stone-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:ring-2 focus:ring-stone-900 transition-all outline-none" 
                  placeholder="Chef Name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-6">Email Address</label>
              <div className="bg-stone-50 rounded-2xl py-4 px-6 text-sm font-medium text-stone-400 select-none">
                {userData?.email}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-6">Create Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-stone-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:ring-2 focus:ring-stone-900 transition-all outline-none" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-6">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full bg-stone-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:ring-2 focus:ring-stone-900 transition-all outline-none" 
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-stone-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Finalizing Setup...
                </>
              ) : (
                'Complete Account Setup'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}