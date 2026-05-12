import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Star, Search, Trash2, CheckCircle, ShieldAlert, Reply, Send, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function Comments() {
  const { isChef, isAdmin, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      const data = await api.getComments();
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.approveComment(id);
      loadData();
    } catch (error) {
      console.error('Approve failed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteComment(id);
      loadData();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleReplySubmit = async (comment: Comment) => {
    if (!replyText.trim() || !user) return;
    setIsSubmitting(true);
    try {
      await api.createComment({
        entityId: comment.entityId,
        userName: user.name,
        userAvatar: user.avatar || 'https://images.unsplash.com/photo-1577214190547-73bed629161a?auto=format&fit=crop&q=80&w=100',
        content: replyText,
        parentId: comment.id
      });
      setReplyText('');
      setReplyToId(null);
      loadData();
    } catch (error) {
      console.error('Reply failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredComments = comments.filter(c => 
    c.content.toLowerCase().includes(search.toLowerCase()) ||
    c.userName.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = comments.filter(c => !c.isApproved).length;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="max-w-6xl mx-auto px-4 md:px-12 py-8 md:py-10"
    >
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4 flex items-center gap-4">
            Community Voices
            {pendingCount > 0 && (
              <div className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold font-sans">
                {pendingCount} PENDING
              </div>
            )}
          </h2>
          <p className="font-sans text-secondary text-lg italic">Comments, Reviews, and Technical Culinary Questions.</p>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] soft-shadow border border-stone-100 overflow-hidden">
        <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter comments..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all font-sans outline-none"
            />
          </div>
        </div>

        <div className="divide-y divide-stone-50">
          {filteredComments.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`p-8 md:p-10 flex flex-col md:flex-row gap-8 transition-colors group ${!item.isApproved ? 'bg-amber-50/20' : 'hover:bg-stone-50/30'}`}
            >
              <div className="flex-shrink-0 flex md:flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-sm shrink-0">
                  <img src={item.userAvatar} alt={item.userName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                {!item.isApproved && (
                   <ShieldAlert className="text-amber-500" size={20} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                  <div>
                    <h4 className="font-sans font-bold text-lg text-on-background flex items-center gap-3">
                      {item.userName}
                      {item.type === 'question' && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-black tracking-widest uppercase">Question</span>
                      )}
                      {item.rating && (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} fill={s <= item.rating! ? "#b51b1b" : "none"} className={s <= item.rating! ? "text-[#b51b1b]" : "text-stone-200"} />
                          ))}
                        </div>
                      )}
                    </h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mt-1">
                        {item.type === 'question' ? 'Asked on' : 'Commented on'} <span className="text-primary hover:underline cursor-pointer">{item.entityId}</span>
                      </p>
                      {item.userEmail && (
                        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                          Email: <span className="text-stone-500">{item.userEmail}</span>
                        </p>
                      )}
                      {item.userWebsite && (
                        <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                          Web: <span className="text-stone-500">{item.userWebsite}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-stone-400 text-xs font-medium md:mt-0 mt-2">{item.createdAt}</span>
                </div>
                <p className="font-sans text-stone-600 leading-relaxed text-lg mb-6 italic">
                  "{item.content}"
                </p>
                <div className="flex flex-wrap gap-2 md:gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!item.isApproved && (isChef || isAdmin) && (
                    <button 
                      onClick={() => handleApprove(item.id)}
                      className="flex items-center gap-2 px-3 md:px-4 py-2 border border-emerald-200 text-emerald-600 rounded-lg text-[10px] md:text-xs font-bold hover:bg-emerald-600 hover:text-white transition-colors shrink-0"
                    >
                      <CheckCircle size={14} /> APPROVE
                    </button>
                  )}
                  {(isChef || isAdmin) && (
                    <button 
                      onClick={() => setReplyToId(item.id === replyToId ? null : item.id)}
                      className={`flex items-center gap-2 px-3 md:px-4 py-2 border rounded-lg text-[10px] md:text-xs font-bold transition-colors shrink-0 ${
                        replyToId === item.id 
                          ? 'bg-stone-900 border-stone-900 text-white' 
                          : 'border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900'
                      }`}
                    >
                      <Reply size={14} /> REPLY
                    </button>
                  )}
                  {isAdmin && (
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center gap-2 px-3 md:px-4 py-2 border border-red-200 text-red-500 rounded-lg text-[10px] md:text-xs font-bold hover:bg-red-600 hover:text-white transition-colors shrink-0"
                    >
                      <Trash2 size={14} /> DELETE
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {replyToId === item.id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-stone-100 overflow-hidden"
                    >
                      <div className="bg-stone-50 rounded-2xl p-4">
                        <textarea 
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to ${item.userName}...`}
                          className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm font-sans focus:ring-2 focus:ring-primary/10 transition-all outline-none resize-none mb-3"
                        />
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => {
                              setReplyToId(null);
                              setReplyText('');
                            }}
                            className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-600"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleReplySubmit(item)}
                            disabled={!replyText.trim() || isSubmitting}
                            className="bg-primary text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                          >
                            {isSubmitting ? (
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <><Send size={12} /> Post Reply</>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
          {filteredComments.length === 0 && !loading && (
            <div className="py-20 text-center">
               <MessageSquare size={48} className="mx-auto text-stone-100 mb-6" />
               <p className="text-stone-400 font-serif italic text-xl">No comments found matching your query.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

