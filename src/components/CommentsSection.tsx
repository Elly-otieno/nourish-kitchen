import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, User, CheckCircle, Trash2, Reply, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface CommentsSectionProps {
  entityId: string;
}

export function CommentsSection({ entityId }: CommentsSectionProps) {
  const { user, isAdmin, isChef } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  const loadComments = async () => {
    try {
      const allComments = await api.getComments();
      const relevant = allComments.filter(c => c.entityId === entityId);
      setComments(relevant);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [entityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const commentData: Partial<Comment> = {
        entityId,
        content: newComment,
        parentId: replyTo?.id,
        isAnonymous,
        userId: isAnonymous ? 'anonymous' : (user?.id || 'guest'),
        userName: isAnonymous ? 'Anonymous Explorer' : (user?.name || 'Guest User'),
        userAvatar: isAnonymous ? 'https://api.dicebear.com/7.x/shapes/svg?seed=anon' : (user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'guest'}`),
      };

      await api.createComment(commentData);
      setNewComment('');
      setReplyTo(null);
      loadComments();
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.approveComment(id);
      loadComments();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteComment(id);
      loadComments();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const rootComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-serif text-3xl font-bold text-primary">Community Voice</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
          {comments.length} Thoughts Shared
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-stone-50 p-8 rounded-[2rem] border border-stone-100">
        <div className="flex items-center gap-4 mb-6">
           <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-stone-200">
              <img 
                src={isAnonymous ? 'https://api.dicebear.com/7.x/shapes/svg?seed=anon' : (user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'guest'}`)} 
                alt="avatar" 
              />
           </div>
           <div className="flex-1">
             <p className="text-xs font-bold text-stone-900">
               {replyTo ? `Replying to ${replyTo.userName}` : (isAnonymous ? 'Sharing Anonymously' : (user?.name || 'Joining the conversation'))}
             </p>
             {replyTo && (
               <button onClick={() => setReplyTo(null)} className="text-[10px] text-primary hover:underline uppercase tracking-widest font-black">Cancel Reply</button>
             )}
           </div>
           <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Go Anonymous?</span>
             <button 
               type="button"
               onClick={() => setIsAnonymous(!isAnonymous)}
               className={`w-10 h-5 rounded-full transition-all relative ${isAnonymous ? 'bg-primary' : 'bg-stone-200'}`}
             >
               <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isAnonymous ? 'left-6' : 'left-1'}`} />
             </button>
           </div>
        </div>

        <textarea 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your experience, a variation you tried, or a word of gratitude..."
          className="w-full bg-white border border-stone-100 rounded-2xl p-6 font-sans text-sm md:text-base focus:ring-2 focus:ring-primary/10 transition-all min-h-[120px] mb-6 outline-none"
        />

        <div className="flex justify-end">
          <button 
            type="submit"
            className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
          >
            <Send size={16} />
            Post Comment
          </button>
        </div>
      </form>

      {/* List */}
      <div className="space-y-8">
        {rootComments.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            replies={getReplies(comment.id)}
            onReply={(c: Comment) => setReplyTo(c)}
            onApprove={handleApprove}
            onDelete={handleDelete}
            isStaff={Boolean(isAdmin || isChef)}
            isAdmin={Boolean(isAdmin)}
          />
        ))}
        {rootComments.length === 0 && !loading && (
          <div className="text-center py-12">
            <MessageSquare size={40} className="mx-auto text-stone-100 mb-4" />
            <p className="text-stone-400 font-serif italic text-lg">No thoughts shared yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  onReply: (c: Comment) => void;
  onApprove: (id: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  isStaff: boolean;
  isAdmin: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, replies, onReply, onApprove, onDelete, isStaff, isAdmin }) => {
  return (
    <div className="group">
      <div className={`p-8 rounded-[2rem] border transition-all ${comment.isApproved ? 'bg-white border-stone-100' : 'bg-amber-50/50 border-amber-100'}`}>
        {!comment.isApproved && (
           <div className="flex items-center gap-2 mb-4 text-amber-600">
             <ShieldAlert size={14} />
             <span className="text-[10px] font-black uppercase tracking-widest">Pending Review</span>
           </div>
        )}
        <div className="flex gap-6">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-stone-100 shrink-0">
            <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-serif text-lg font-bold text-stone-900">{comment.userName}</h4>
              <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">{comment.createdAt}</span>
            </div>
            <p className="font-sans text-stone-600 leading-relaxed mb-6 italic">"{comment.content}"</p>
            
            <div className="flex flex-wrap gap-4">
               <button 
                 onClick={() => onReply(comment)}
                 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
               >
                 <Reply size={14} /> Reply
               </button>
               {isStaff && !comment.isApproved && (
                 <button 
                    onClick={() => onApprove(comment.id)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:scale-105 transition-transform"
                 >
                    <CheckCircle size={14} /> Approve
                 </button>
               )}
               {isAdmin && (
                 <button 
                    onClick={() => onDelete(comment.id)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:scale-105 transition-transform"
                 >
                    <Trash2 size={14} /> Delete
                 </button>
               )}
            </div>
          </div>
        </div>
      </div>

      {replies.length > 0 && (
        <div className="ml-12 mt-4 space-y-4 border-l-2 border-stone-100 pl-8">
          {replies.map(reply => (
            <div key={reply.id} className="p-6 bg-stone-50 rounded-2xl flex gap-4">
              <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                <img src={reply.userAvatar} alt={reply.userName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h5 className="text-sm font-bold text-stone-900">{reply.userName}</h5>
                  <span className="text-[9px] font-bold text-stone-300 tracking-widest">{reply.createdAt}</span>
                </div>
                <p className="text-sm text-stone-600 font-sans italic">"{reply.content}"</p>
                {isAdmin && (
                   <button 
                     onClick={() => onDelete(reply.id)}
                     className="mt-2 text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600"
                   >
                     Delete
                   </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
