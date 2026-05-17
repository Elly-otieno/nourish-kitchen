import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Star, MessageSquare, Search, ArrowUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Comment } from '../types';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

// --- Newsletter Section ---
export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      await api.subscribeToNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  return (
    <section className="py-16 border-t border-stone-100 mt-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl font-bold text-stone-900 mb-4 uppercase tracking-tight">Want a second helping?</h2>
        <p className="text-stone-600 mb-8 text-lg">
          Sign up for our newsletter to get recipes, easy dinner ideas, tasty treats and more delivered straight to your inbox.
        </p>
        <p className="text-[10px] text-stone-400 mb-6 leading-relaxed">
          By entering your email address, you agree to our <Link to="/terms" className="underline font-bold">Terms Of Use</Link> and acknowledge the <Link to="/privacy" className="underline font-bold">Privacy Policy</Link>. Nourish & Co may use your email address to provide updates, ads, and offers.
        </p>
        
        {subscribed ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 p-6 rounded-2xl text-emerald-800 font-bold text-center border border-emerald-100"
          >
            Thank you for subscribing! Check your inbox soon.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-stretch">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com" 
              required
              className="flex-1 bg-white border border-stone-200 rounded-lg px-6 py-4 focus:ring-2 focus:ring-[#f2cc41]/20 outline-none transition-all"
            />
            <button 
              type="submit" 
              className="bg-[#f2cc41] text-stone-900 font-black px-10 py-4 rounded-lg uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#e0bb36] transition-colors"
            >
              <Send size={16} /> Sign Up
            </button>
          </form>
        )}
        <p className="mt-4 text-[10px] text-stone-400">
          To withdraw your consent or to learn more about your rights, see the <Link to="/privacy" className="underline font-bold">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
};

// --- Tasting Notes & Reflections (Comments & Reviews) ---
interface CommentFormProps {
  entityId: string;
  onSuccess: () => void;
  type?: 'comment' | 'question';
}

export const CommentsAndReviewsSection = ({ entityId }: { entityId: string }) => {
  const { user } = useAuth();
  const [showAll, setShowAll] = useState(false);

  // Use standard TanStack Query caching for optimized fetch execution
  const { data: allComments = [], isLoading } = useQuery<any, Error, Comment[]>({
  queryKey: ['comments', entityId],
  queryFn: () => api.getComments(entityId),
  select: (rawResponse: any) => {
    // If it's already a clean array, use it
    if (Array.isArray(rawResponse)) return rawResponse;
    
    // If it's a Django REST Framework paginated object wrapper, grab the results array
    if (rawResponse && typeof rawResponse === 'object' && Array.isArray(rawResponse.results)) {
      return rawResponse.results;
    }
    
    // If it's a single object fallback wrapper, put it inside an array
    if (rawResponse && typeof rawResponse === 'object' && Object.keys(rawResponse).length > 0) {
      return [rawResponse] as Comment[];
    }
    
    return [];
  }
});

  const guestThread: number[] = JSON.parse(localStorage.getItem(`pending_comments_${entityId}`) || '[]');

  const filteredComments = allComments.filter(c => 
    String(c.recipe || c.blog_post) === entityId && 
    (c.type === 'comment' || !c.type) && 
    (c.is_approved || (user && c.user === user.id) || guestThread.includes(c.id))
  );

  const displayedComments = showAll ? filteredComments : filteredComments.slice(0, 4);
  const hasHiddenComments = filteredComments.length > 4;

  return (
    <section className="py-0 mt-16 bg-white border-t border-stone-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-center mb-5 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-800/40 mb-6 block">Around the Table</span>
          <h2 className="font-serif italic text-4xl md:text-5xl text-stone-950 mb-6 leading-tight">Shared Reflections</h2>
          <p className="text-stone-500 font-medium italic">"A collection of kitchen memories and seasonal inspirations."</p>
        </div>

        {hasHiddenComments && !showAll && (
          <div className="flex justify-center mb-20">
            <button 
              onClick={() => setShowAll(true)}
              className="group flex flex-col items-center gap-3"
            >
              <span className="font-black text-stone-400 uppercase tracking-[0.4em] text-[9px] group-hover:text-stone-900 transition-colors">Recall earlier dispatches</span>
              <div className="w-px h-12 bg-stone-100 group-hover:h-16 group-hover:bg-emerald-700 transition-all duration-700" />
            </button>
          </div>
        )}

        <div className="space-y-24 mb-32">
          {displayedComments.map((comment: Comment, idx: number) => (
            <motion.div 
              key={comment.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`group relative ${!comment.is_approved ? 'opacity-60' : ''}`}
            >
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                <div className="md:w-1/4 flex flex-col items-center text-center">
                   <div className="w-20 h-20 rounded-full overflow-hidden bg-stone-50 border border-stone-100 p-1 mb-4">
                      <img src={comment.user_avatar || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${comment.user_name}`} alt={comment.user_name} className="w-full h-full rounded-full object-cover grayscale transition-all group-hover:grayscale-0 duration-700" />
                   </div>
                   <h4 className="font-serif text-lg text-emerald-950 font-bold mb-1">{comment.user_name}</h4>
                   <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">
                     {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : 'Just now'}
                   </p>
                </div>
                
                <div className="flex-1 relative">
                  <div className="absolute -top-4 -left-8 text-stone-50 font-serif text-8xl pointer-events-none select-none">“</div>
                  
                  {comment.rating && (
                    <div className="flex items-center gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          size={10} 
                          fill={s <= (comment.rating || 0) ? "#b58e3e" : "none"} 
                          className={s <= (comment.rating || 0) ? "text-[#b58e3e]" : "text-stone-200"} 
                        />
                      ))}
                    </div>
                  )}
                  
                  <p className="text-stone-700 leading-relaxed text-xl font-serif italic mb-6">
                    {comment.content}
                  </p>
                  
                  {!comment.is_approved && (
                    <span className="inline-block text-[8px] bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full font-black tracking-widest uppercase">Pending curation</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredComments.length === 0 && !isLoading && (
            <div className="text-center py-20 border-2 border-dashed border-stone-50 rounded-[3rem]">
              <div className="w-16 h-16 bg-stone-50 text-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare size={24} />
              </div>
              <p className="text-stone-400 font-serif italic text-xl">The table is set. Be the first to share your reflections.</p>
            </div>
          )}
        </div>

        <div className="relative pt-0 border-t border-stone-100">
           <div className="flex flex-col items-center mb-16 text-center">
             <h3 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4 leading-tight">Share a Kitchen Note</h3>
             <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.4em]">We'd love to hear how it tasted at your table</p>
           </div>
           <CommentForm entityId={entityId} onSuccess={() => setShowAll(true)} type="comment" />
        </div>
      </div>
    </section>
  );
};

// --- Combined Adaptive Form Component ---
const CommentForm = ({ entityId, onSuccess, type = 'comment' }: CommentFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [hoverRating, setHoverRating] = useState(0);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    content: '',
    rating: 0,
    isAnonymous: false
  });

  const commentMutation = useMutation({
    mutationFn: (payload: Record<string, any>) => api.createComment(payload),
    onSuccess: (result) => {
      if (!user) {
        const guestThread = JSON.parse(localStorage.getItem(`pending_comments_${entityId}`) || '[]');
        guestThread.push(result.id);
        localStorage.setItem(`pending_comments_${entityId}`, JSON.stringify(guestThread));
      }

      setSuccess(true);
      setFormData({ name: '', email: '', website: '', content: '', rating: 0, isAnonymous: false });
      
      // Auto refresh data queries
      queryClient.invalidateQueries({ queryKey: ['comments', entityId] });
      
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
      }, 2500);
    },
    onError: (err) => {
      console.error("Posting comment context error:", err);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    // Direct dynamic type evaluation structure
    const isRecipe = !isNaN(Number(entityId));

    const payload: Record<string, any> = {
      content: formData.content,
      type,
      is_anonymous: formData.isAnonymous,
      recipe: isRecipe ? Number(entityId) : null,
      blog_post: !isRecipe ? Number(entityId) : null,
      rating: type === 'comment' && formData.rating > 0 ? formData.rating : null
    };

    if (!user) {
      if (formData.isAnonymous) {
        payload.user_name = "Anonymous Foodie";
      } else {
        payload.user_name = formData.name.trim() || 'Guest Chef';
        payload.user_email = formData.email.trim() || null;
        payload.user_website = formData.website.trim() || null;
      }
    }

    commentMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className={`grid grid-cols-1 ${user ? 'md:grid-cols-[1fr_2fr]' : 'md:grid-cols-2'} gap-12 mb-0.5 pl-0.5`}>
        <div className="space-y-8">
          
          {/* Render Guest inputs ONLY if logged out AND not checked anonymous */}
          {!user && !formData.isAnonymous && (
            <div className="space-y-6">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full bg-transparent border-b border-stone-200 py-3 outline-none focus:border-stone-900 font-serif italic text-stone-900 placeholder:text-stone-300 transition-colors"
                />
              </div>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full bg-transparent border-b border-stone-200 py-3 outline-none focus:border-stone-900 font-serif italic text-stone-900 placeholder:text-stone-300 transition-colors"
                />
              </div>
              <div className="relative group">
                <input 
                  type="url" 
                  placeholder="Website (Optional)" 
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full bg-transparent border-b border-stone-200 py-3 outline-none focus:border-stone-900 font-serif italic text-stone-900 placeholder:text-stone-300 transition-colors"
                />
              </div>
            </div>
          )}

          {user && (
            <div className="flex flex-col items-center text-center p-8 bg-stone-50 rounded-2xl border border-stone-100">
              <img src={user.avatar || "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Nourish"} alt={user.username} className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-4" />
              <div>
                <p className="font-serif italic text-stone-900 text-xl font-bold">{user.username}</p>
                <p className="font-black uppercase tracking-[0.2em] text-[9px] text-stone-400 mt-1">Logged In Cook</p>
              </div>
            </div>
          )}

          {type === 'comment' && (
            <div className="pt-4 text-center md:text-left">
              <p className="font-black uppercase tracking-[0.2em] text-[10px] text-stone-400 mb-4">Rate the creation</p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setFormData({...formData, rating: s})}
                    className="transition-transform active:scale-95 duration-200"
                  >
                    <Star 
                      size={28} 
                      strokeWidth={1}
                      fill={(hoverRating || formData.rating) >= s ? "#b51b1b" : "none"} 
                      className={(hoverRating || formData.rating) >= s ? "text-[#b51b1b]" : "text-stone-200"} 
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 pt-4 border-t border-stone-50">
             <div className="relative inline-flex items-center group">
               <input 
                 type="checkbox" 
                 id={`anon-toggle-${type}`}
                 checked={formData.isAnonymous}
                 onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                 className="sr-only peer" 
               />
               <label 
                 htmlFor={`anon-toggle-${type}`}
                 className="relative w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full cursor-pointer transition-colors peer-checked:bg-stone-900 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white group-hover:ring-4 group-hover:ring-stone-50"
               ></label>
               <label htmlFor={`anon-toggle-${type}`} className="ml-3 font-serif italic text-stone-600 select-none cursor-pointer text-sm">Post anonymously</label>
             </div>
          </div>
        </div>

        <div className="flex flex-col pt-0">
          <textarea 
            placeholder={type === 'question' ? "What's on your mind? Ask a question..." : "Tell us what you thought of the recipe..."}
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
            className="w-full flex-1 min-h-62.5 bg-stone-50/50 border border-stone-100 p-8 outline-none focus:border-stone-900 font-serif italic text-xl text-stone-900 placeholder:text-stone-200 resize-none transition-colors rounded-xl"
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-8">
        <div className="text-sm font-serif italic text-stone-500">
          {success && (
            <span className="text-emerald-600 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Manifested successfully! {user ? '' : '(Review in progress)'}
            </span>
          )}
        </div>
        <button 
          type="submit" 
          disabled={commentMutation.isPending}
          className="relative group px-16 py-4 bg-stone-900 text-white font-black uppercase tracking-[0.3em] text-[10px] overflow-hidden rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          <span className="relative z-10">{commentMutation.isPending ? 'Dispatching...' : 'Publish'}</span>
          <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full bg-white/20 transition-all duration-300" />
        </button>
      </div>
    </form>
  );
};

// --- The Kitchen Counter (Questions & Answers) ---
export const QuestionsSection = ({ entityId }: { entityId: string }) => {
  const { user } = useAuth();

  const { data: allComments = [], isLoading } = useQuery<any, Error, Comment[]>({
  queryKey: ['comments', entityId],
  queryFn: () => api.getComments(entityId),
  select: (rawResponse: any) => {
    if (Array.isArray(rawResponse)) return rawResponse;
    if (rawResponse && typeof rawResponse === 'object' && Array.isArray(rawResponse.results)) {
      return rawResponse.results;
    }
    if (rawResponse && typeof rawResponse === 'object' && Object.keys(rawResponse).length > 0) {
      return [rawResponse] as Comment[];
    }
    return [];
  }
});

  const guestThread: number[] = JSON.parse(localStorage.getItem(`pending_comments_${entityId}`) || '[]');
  
  const questions = allComments.filter(c => 
    String(c.recipe || c.blog_post) === entityId && 
    c.type === 'question' && 
    !c.parent && // Check that it is a root question level item, not a reply link node
    (c.is_approved || (user && c.user === user.id) || guestThread.includes(c.id))
  );
  
  const replies = allComments.filter(c => 
    String(c.recipe || c.blog_post) === entityId && 
    c.parent !== null && 
    c.is_approved
  );

  return (
    <section className="py-0 border-t border-stone-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-center mb-10 pl-px text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-800/40 mb-6 block">Kitchen Chat</span>
          <h2 className="font-serif italic text-4xl md:text-5xl text-stone-950 mb-6 leading-tight">Questions & Answers</h2>
          <p className="text-stone-500 font-medium italic">"Need a hand with a recipe? Just ask."</p>
        </div>
        
        <div className="space-y-24 mb-32">
          {questions.map((q: Comment) => (
            <div key={q.id} className="group border-l-4 border-emerald-50 pl-8 md:pl-12 py-4">
              <div className="flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600">Question from {q.user_name}</span>
                    <div className="h-px flex-1 bg-stone-50" />
                    <span className="text-[9px] text-stone-300 font-bold uppercase tracking-widest">
                      {q.created_at ? new Date(q.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                  <p className="font-serif text-2xl md:text-3xl text-stone-900 leading-snug mb-8">
                    {q.content}
                  </p>
                  {!q.is_approved && <span className="inline-block text-[8px] bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full font-black tracking-widest uppercase mb-4">Awaiting response</span>}
                </div>
                
                {/* Replies panel filtering tracking query */}
                <div className="space-y-8">
                  {replies.filter(r => r.parent === q.id).map(reply => (
                    <div 
                      key={reply.id} 
                      className="bg-emerald-950 text-white p-10 rounded-[2.5rem] relative shadow-2xl"
                    >
                      <div className="absolute top-6 right-8 text-emerald-800 font-serif text-6xl opacity-20">”</div>
                      <div className="flex items-center gap-4 mb-6">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 font-black text-[10px] tracking-widest uppercase">
                            Chef
                          </div>
                          <div>
                            <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] text-emerald-400">Our Kitchen Response</h4>
                            <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">{reply.user_name}</p>
                          </div>
                      </div>
                      <p className="text-emerald-50 font-serif italic text-lg md:text-xl leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {questions.length === 0 && !isLoading && (
            <div className="text-center py-20 bg-stone-50/50 rounded-[3rem] border border-stone-100">
              <p className="font-serif italic text-2xl text-stone-400">No inquiries yet. Our chefs are standing by.</p>
            </div>
          )}
        </div>

        <div className="relative pt-0 border-t border-stone-100">
           <div className="flex flex-col items-center mb-16 text-center">
             <h3 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4 leading-tight">Pose a Question</h3>
             <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.4em]">Direct access to our culinary artisans</p>
           </div>
           <CommentForm entityId={entityId} onSuccess={() => {}} type="question" />
        </div>
      </div>
    </section>
  );
};

// --- Recommended Heritage Grid ---
export const RecommendedSection = ({ type = 'recipe' }: { type?: 'recipe' | 'blog' }) => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (type === 'recipe') {
      api.getRecipes().then(data => setItems(data.slice(0, 4)));
    } else {
      api.getBlogs().then(data => setItems(data.slice(0, 4)));
    }
  }, [type]);

  const viewAllLink = type === 'recipe' ? '/recipes' : '/blog/all';

  return (
    <section className="py-0 border-t border-stone-100 mt-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-20 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-800/40 mb-6 block">Continue the Voyage</span>
          <h2 className="font-serif italic text-4xl md:text-5xl text-stone-950 mb-6 leading-tight">Savor More Heritage</h2>
          <Link to={viewAllLink} className="group flex flex-col items-center gap-3">
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600 group-hover:text-stone-900 transition-colors">Explore the full Archives</span>
             <div className="w-px h-12 bg-emerald-100 group-hover:h-16 group-hover:bg-emerald-700 transition-all duration-700" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 sm:gap-8">
          {items.map((item, idx) => (
            <div key={item.id} className="opacity-100 transform-none">
              <Link to={`${type === 'recipe' ? '/recipes' : '/blog/all'}/${item.id}`} className="group block">
                <div className="aspect-3/4 overflow-hidden rounded-3xl mb-6 relative">
                  <img 
                    src={item.hero_image || item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-stone-400 mb-3 block">{type === 'recipe' ? (item.cuisine || 'Gourmet') : 'Culinary Journal'}</span>
                <h3 className="font-serif text-xl text-stone-950 group-hover:text-emerald-800 transition-colors leading-snug">
                  {item.title}
                </h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Related Pages Section ---
export const RelatedPagesSection = () => {
  const pages = [
    ["Quick Soft Breadsticks", "Deep Fried Mozzarella Cheese Sticks", "Gluten-Free Fried Mozzarella Sticks"],
    ["Fried Mozzarella Sticks", "Baked Mozzarella Sticks", "Fried Mozzarella Cheese Sticks"],
    ["The Best Belgian Waffles", "Olive Garden Fried Mozzarella", "Panko Mozzarella Sticks"]
  ];

  return (
    <section className="py-20 border-t border-stone-100 bg-stone-50/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center font-serif italic text-3xl text-stone-900 tracking-tight mb-16">Related Pages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {pages.map((col, i) => (
            <ul key={i} className="space-y-6 text-center md:text-left">
              {col.map((page) => (
                <li key={page}>
                  <Link to="#" className="text-stone-900 font-serif italic text-lg hover:text-emerald-700 transition-colors hover:underline">
                    {page}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Find More Recipes Section ---
export const FindMoreRecipesSection = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/recipes?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="py-24 bg-stone-50 border-t border-stone-100 mt-10">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="font-serif text-3xl font-bold text-stone-900 uppercase tracking-tight mb-12">Find More Recipes</h2>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400" size={24} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="I'm craving..." 
            className="w-full bg-white border border-stone-200 rounded-full px-16 py-6 outline-none focus:ring-4 focus:ring-emerald-700/10 transition-all font-medium text-lg text-stone-600 shadow-sm"
          />
        </div>
      </div>
    </section>
  );
};

// --- Scroll Back To Top Button ---
export const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 1000);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
      className={`fixed bottom-10 right-10 z-50 bg-emerald-800 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-700 transition-all active:scale-90 ${!visible && 'pointer-events-none'}`}
    >
      <ArrowUp size={24} />
    </button>
  );
};