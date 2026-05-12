import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, RotateCcw, Search, Filter, Archive, Loader2, AlertCircle, X, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { Recipe, BlogPost } from '../types';

export function Archives() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recipes' | 'blogs'>('recipes');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, type: 'recipe' | 'blog' } | null>(null);

  useEffect(() => {
    loadArchives();
  }, []);

  const loadArchives = async () => {
    setLoading(true);
    try {
      const data = await api.getArchives();
      setRecipes(data.recipes);
      setBlogs(data.blogs);
    } catch (error) {
      console.error('Failed to load archives:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string, type: 'recipe' | 'blog') => {
    setActionLoading(id);
    try {
      if (type === 'recipe') {
        await api.restoreRecipe(id);
        setRecipes(prev => prev.filter(r => r.id !== id));
      } else {
        await api.restoreBlog(id);
        setBlogs(prev => prev.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Failed to restore item:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!confirmDelete) return;
    const { id, type } = confirmDelete;
    setActionLoading(id);
    try {
      if (type === 'recipe') {
        await api.permanentDeleteRecipe(id);
        setRecipes(prev => prev.filter(r => r.id !== id));
      } else {
        await api.permanentDeleteBlog(id);
        setBlogs(prev => prev.filter(b => b.id !== id));
      }
      setConfirmDelete(null);
    } catch (error) {
      console.error('Failed to permanently delete item:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 bg-stone-50">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-serif italic text-stone-500">Unearthing the kitchen vaults...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 min-h-screen bg-stone-50/30 px-6 md:px-12 py-12"
    >
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-stone-400 mb-6 font-sans text-xs font-bold tracking-[0.2em] uppercase">
            <Archive size={14} />
            <span>Kitchen Archives</span>
            <ChevronRight size={14} />
            <span className="text-primary">Management</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-primary font-medium tracking-tight mb-4">The Faults</h1>
          <p className="font-sans text-stone-500 max-w-2xl text-lg">
            Manage your archived recipes and journal entries. Restore them to the main library or permanently purge them from the kitchen.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-10">
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'recipes' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-stone-500 hover:text-primary'
              }`}
            >
              RECIPES ({recipes.length})
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'blogs' 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-stone-500 hover:text-primary'
              }`}
            >
              JOURNALS ({blogs.length})
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Search archives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-stone-100 rounded-2xl py-3.5 pl-12 pr-4 font-sans text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-primary/20 soft-shadow transition-all"
            />
          </div>
        </div>

        <section>
          {activeTab === 'recipes' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredRecipes.length > 0 ? (
                  filteredRecipes.map(recipe => (
                    <ArchiveCard 
                      key={recipe.id}
                      item={recipe}
                      type="recipe"
                      onRestore={() => handleRestore(recipe.id, 'recipe')}
                      onDelete={() => setConfirmDelete({ id: recipe.id, type: 'recipe' })}
                      isProcessing={actionLoading === recipe.id}
                    />
                  ))
                ) : (
                  <EmptyState message="No archived recipes found." />
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredBlogs.length > 0 ? (
                  filteredBlogs.map(blog => (
                    <ArchiveCard 
                      key={blog.id}
                      item={blog}
                      type="blog"
                      onRestore={() => handleRestore(blog.id, 'blog')}
                      onDelete={() => setConfirmDelete({ id: blog.id, type: 'blog' })}
                      isProcessing={actionLoading === blog.id}
                    />
                  ))
                ) : (
                  <EmptyState message="No archived journal entries found." />
                )}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setConfirmDelete(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md p-10 rounded-[2rem] soft-shadow"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-8 mx-auto">
                <AlertCircle className="text-red-500" size={32} />
              </div>
              <h3 className="font-serif text-3xl text-primary text-center mb-4 leading-tight">Permanent Deletion</h3>
              <p className="font-sans text-stone-500 text-center mb-10 leading-relaxed">
                This action is irreversible. Are you absolutely certain you wish to purge this item from the kitchen vaults forever?
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-sm tracking-wide text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handlePermanentDelete}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-sm tracking-wide bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                  PURGE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ArchiveCard({ item, type, onRestore, onDelete, isProcessing }: { 
  item: Recipe | BlogPost, 
  type: 'recipe' | 'blog',
  onRestore: () => void,
  onDelete: () => void,
  isProcessing: boolean
}) {
  const isRecipe = type === 'recipe';
  const imgUrl = item.heroImage;
  const title = item.title;
  const deletedAt = (item as any).deletedAt;
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-[2rem] overflow-hidden border border-stone-100 soft-shadow group"
    >
      <div className="flex flex-col sm:flex-row h-full">
        <div className="w-full sm:w-40 h-40 sm:h-auto overflow-hidden bg-stone-100 shrink-0">
          <img 
            src={imgUrl} 
            alt={title} 
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#b58e3e] px-2 py-1 bg-[#b58e3e]/5 rounded-md">
                Archived
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                {deletedAt ? new Date(deletedAt).toLocaleDateString() : 'Date Unknown'}
              </span>
            </div>
            <h4 className="font-serif text-xl md:text-2xl text-primary font-medium line-clamp-1 mb-2">
              {title}
            </h4>
            <p className="font-sans text-xs text-stone-400">
              {isRecipe ? 'Heritage Recipe' : 'Journal Entry'} • By {item.authorName}
            </p>
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={onRestore}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs tracking-wide border border-stone-100 text-stone-600 hover:bg-stone-50 transition-all"
            >
              {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
              RESTORE
            </button>
            <button 
              onClick={onDelete}
              disabled={isProcessing}
              className="flex items-center justify-center w-12 h-10 md:h-12 rounded-xl text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full py-24 text-center">
      <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Archive size={32} className="text-stone-300" />
      </div>
      <p className="font-serif italic text-xl text-stone-400">{message}</p>
    </div>
  );
}
