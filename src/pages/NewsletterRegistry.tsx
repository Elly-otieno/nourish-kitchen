import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Users, Send, Search, CheckCircle, ExternalLink, Shield, X } from 'lucide-react';
import { api } from '../services/api';
import { useQuery, useMutation } from '@tanstack/react-query';

export function NewsletterRegistry() {
  const [search, setSearch] = useState('');
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch Subscriber Directory List
  const { 
    data: subscribers = [], 
    isLoading: loading, 
    error: loadError 
  } = useQuery({
    queryKey: ['newsletterSubscribers'],
    queryFn: api.getNewsletterSubscribers,
    staleTime: 30000, // Keeps the subscriber count cached for 30 seconds
  });

  // Handle Newsletter Broadcast Campaign Mutation
  const { 
    mutate: executeSendCampaign, 
    isPending: isSending 
  } = useMutation({
    mutationFn: (payload: { subject: string; content: string }) => 
      api.sendNewsletter(payload.subject, payload.content),
    onSuccess: (result) => {
      setSuccessMessage(`Successfully sent to ${result?.count || 0} subscribers!`);
      setSubject('');
      setContent('');
      
      // Auto-dismiss notification overlay
      setTimeout(() => {
        setSuccessMessage('');
        setShowCampaignForm(false);
      }, 3000);
    },
    onError: (error) => {
      console.error('Send failed:', error);
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) return;
    
    executeSendCampaign({ subject, content });
  };

  // Perform client-side data matching filters seamlessly over cached queries
  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 md:p-10"
    >
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4 flex items-center gap-4">
            Dispatch Registry
            <div className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full font-bold font-sans">
              {subscribers.length} VERIFIED
            </div>
          </h2>
          <p className="font-sans text-secondary text-lg italic tracking-tight">The sacred covenant of our digital community.</p>
        </div>
        
        <button 
          onClick={() => setShowCampaignForm(true)}
          className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 flex items-center gap-3"
        >
          <Send size={16} />
          Create Dispatch
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-4xl border border-stone-100 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 font-serif">
            <Users size={24} />
          </div>
          <h3 className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Reach</h3>
          <p className="text-4xl font-serif font-bold text-stone-900">{subscribers.length}</p>
        </div>
        <div className="bg-white p-8 rounded-4xl border border-stone-100 shadow-sm">
          <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 mb-6 font-serif">
            <Mail size={24} />
          </div>
          <h3 className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">Campaigns Sent</h3>
          <p className="text-4xl font-serif font-bold text-stone-900">12</p>
        </div>
        <div className="bg-white p-8 rounded-4xl border border-stone-100 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 font-serif">
            <Shield size={24} />
          </div>
          <h3 className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">Privacy Health</h3>
          <p className="text-4xl font-serif font-bold text-stone-900">100%</p>
        </div>
      </div>

      <div className="bg-white border border-stone-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-stone-50 bg-stone-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
            <input 
              type="text" 
              placeholder="Search subscribers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all font-sans outline-none"
            />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
            {filteredSubscribers.length} results
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 font-black text-[10px] tracking-widest text-stone-400 uppercase">
                <th className="px-8 py-5">Verified Email</th>
                <th className="px-8 py-5">Subscribed Date</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredSubscribers.map((sub, i) => (
                <tr key={i} className="hover:bg-stone-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-xs font-bold font-serif italic shadow-inner">
                        {sub.email[0].toUpperCase()}
                      </div>
                      <span className="font-sans font-medium text-stone-900">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-sans text-stone-400 text-sm">{sub.date}</td>
                  <td className="px-8 py-6 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest uppercase">
                      <CheckCircle size={10} /> Active
                    </span>
                  </td>
                </tr>
              ))}
              {filteredSubscribers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-stone-400 font-serif italic text-lg">
                    No explorers found in the registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Modal */}
      <AnimatePresence>
        {showCampaignForm && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-stone-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl p-12 relative shadow-2xl overflow-hidden"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
              
              <button 
                onClick={() => setShowCampaignForm(false)}
                className="absolute top-8 right-8 text-stone-400 hover:text-stone-900 transition-colors p-2"
              >
                <X size={24} />
              </button>

              <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                  <Send size={32} />
                </div>
                <h3 className="font-serif text-4xl font-bold text-stone-900 mb-2 italic">New Heritage Dispatch</h3>
                <p className="text-secondary text-sm font-sans">Craft your message to the community.</p>
              </div>

              {successMessage ? (
                <div className="text-center py-12">
                   <CheckCircle className="mx-auto text-emerald-500 mb-4" size={48} />
                   <p className="font-serif text-2xl font-bold text-emerald-900">{successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSend} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2 block">Covenant Subject</label>
                    <input 
                      type="text" 
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Sourdough Alchemy: The Science of Oven Spring"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-stone-900 font-serif text-lg focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2 block">Deep Voice Dispatch</label>
                    <textarea 
                      required
                      rows={6}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Share your kitchen laboratory updates..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 text-stone-900 font-sans focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-primary/30"
                  >
                    {isSending ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} /> Seal & Send Dispatch
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
