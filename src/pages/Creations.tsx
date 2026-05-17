import { motion, AnimatePresence } from 'motion/react';
import { RecipeCard } from '../components/RecipeCard';
import { Sparkles, Utensils, Clock, Heart, ArrowRight, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Recipe, BlogPost } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export function Creations() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'authored' | 'liked' | 'blogs'>('authored');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, type: 'recipe' | 'blog' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      setLoading(true);
      try {
        const [recipesData, blogsData] = await Promise.all([
          api.getRecipes(),
          api.getBlogs()
        ]);
        
        const authored = recipesData.filter(r => String(r.author) === user.id);
        const liked = recipesData.filter(r => r.liked_by?.includes(Number(user.id)));
        const bookmarked = blogsData.filter(b => b.bookmarked_by?.includes(Number(user.id)));
        
        setRecipes(authored);
        setLikedRecipes(liked);
        setBookmarkedBlogs(bookmarked);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleSoftDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    try {
      if (deleteConfirm.type === 'recipe') {
        await api.deleteRecipe(deleteConfirm.id);
        setRecipes(prev => prev.filter(r => String(r.id) !== deleteConfirm.id));
      } else {
        await api.deleteBlog(deleteConfirm.id);
        setBookmarkedBlogs(prev => prev.filter(b => String(b.id) !== deleteConfirm.id));
      }
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to archive item:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getDisplayedContent = () => {
    switch (activeTab) {
      case 'authored': return recipes;
      case 'liked': return likedRecipes;
      case 'blogs': return bookmarkedBlogs;
      default: return [];
    }
  };

  const displayedItems = getDisplayedContent();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 md:px-12 py-12 md:py-20"
    >
      <header className="mb-12 md:mb-16">
        {/* ... header content ... */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-3 text-primary mb-4"
            >
              <div className="w-10 h-px bg-primary/30" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Institutional Heritage</span>
            </motion.div>
            <h1 className="font-serif text-5xl md:text-7xl text-primary leading-[1.1] mb-6 tracking-tight">
              My <span className="italic">Collection</span>
            </h1>
            <p className="text-secondary text-lg md:text-xl font-serif italic max-w-xl">
              A private archive of your culinary research and verified heritage records.
            </p>
          </div>

          <Link 
            to="/new" 
            className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-stone-800 transition-all shadow-xl shadow-stone-200"
          >
            <Utensils size={16} />
            Draft New Recipe
          </Link>
        </div>

        <div className="flex gap-8 border-b border-stone-100">
          <button 
            onClick={() => setActiveTab('authored')}
            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
              activeTab === 'authored' ? 'text-primary' : 'text-stone-300 hover:text-stone-500'
            }`}
          >
            My Creations ({recipes.length})
            {activeTab === 'authored' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('liked')}
            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
              activeTab === 'liked' ? 'text-primary' : 'text-stone-300 hover:text-stone-500'
            }`}
          >
            Saved Recipes ({likedRecipes.length})
            {activeTab === 'liked' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('blogs')}
            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
              activeTab === 'blogs' ? 'text-primary' : 'text-stone-300 hover:text-stone-500'
            }`}
          >
            Saved Blogs ({bookmarkedBlogs.length})
            {activeTab === 'blogs' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-4/5 bg-stone-100 rounded-[40px] animate-pulse" />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {displayedItems.map((item, idx) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: (idx % 3) * 0.1 }}
              >
                {activeTab === 'blogs' ? (
                  <div className="block group relative">
                    <Link to={`/blog/all/${item.id}`}>
                      <div className="aspect-4/3 rounded-[2.5rem] overflow-hidden mb-6 border border-stone-100 shadow-sm transition-all group-hover:shadow-xl">
                        <img src={(item as BlogPost).hero_image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-stone-900 mb-2 group-hover:text-primary transition-colors">{(item as BlogPost).title}</h3>
                      <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">{(item as BlogPost).category} · {(item as BlogPost).date}</p>
                    </Link>
                    {activeTab === 'blogs' && (
                      <button 
                        onClick={() => setDeleteConfirm({ id: String(item.id), type: 'blog' })}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ) : (
                  <RecipeCard 
                    id={String(item.id)} 
                    image={(item as Recipe).hero_image || ''} 
                    category={(item as Recipe).categories[0]} 
                    title={item.title} 
                    time={(item as Recipe).prep_time} 
                    rating={(item as Recipe).rating} 
                    likedBy={(item as Recipe).liked_by?.map(id => String(id)) || []}
                    showAdminActions={activeTab === 'authored' || user?.role === 'ADMIN'}
                    onDelete={() => setDeleteConfirm({ id: String(item.id), type: 'recipe' })}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md p-10 rounded-[2.5rem] soft-shadow"
            >
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-8 mx-auto">
                <AlertCircle className="text-primary" size={32} />
              </div>
              <h3 className="font-serif text-3xl text-primary text-center mb-4 leading-tight">Move to archives?</h3>
              <p className="font-sans text-stone-500 text-center mb-10 leading-relaxed">
                This item will be removed from your active collection but preserved in the vaults. You can restore it later if needed.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-sm tracking-wide text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleSoftDelete}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-sm tracking-wide bg-primary text-white hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                  ARCHIVE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {!loading && displayedItems.length === 0 && (
        <div className="py-32 text-center bg-stone-50 rounded-[4rem] border border-stone-100 border-dashed">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-stone-200 mx-auto mb-6 shadow-sm border border-stone-50">
            <Utensils size={24} />
          </div>
          <p className="text-stone-400 font-serif text-2xl italic mb-8">
            {activeTab === 'authored' ? "You haven't documented any creations yet." : 
             activeTab === 'liked' ? "Your collection of saved recipes is empty." :
             "You haven't bookmarked any journal entries yet."}
          </p>
          {activeTab === 'authored' && (
            <Link 
              to="/new" 
              className="text-primary font-bold text-xs tracking-widest uppercase hover:underline inline-flex items-center gap-2"
            >
              Start your first record <ArrowRight size={14} />
            </Link>
          )}
        </div>
      )}
    </motion.div>
  );
}
