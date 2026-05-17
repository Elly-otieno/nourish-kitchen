import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RecipeCard } from '../components/RecipeCard';
import { Search, Filter, X, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export function Recipes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryFilter = searchParams.get('cat');
  const searchQuery = searchParams.get('q') || '';
  
  // Controlled input value state stays local to allow typing fluidity
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Sync internal input box text if the URL search param changes globally
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const { 
    data: recipes = [], 
    isLoading: loading,
    isPlaceholderData 
  } = useQuery({
    queryKey: ['recipes', { q: searchQuery, cat: categoryFilter }],
    queryFn: () => api.getRecipes({ q: searchQuery, cat: categoryFilter || undefined }),
    placeholderData: (previousData) => previousData, // Keeps UI smooth/stable during fresh filter re-fetches
  });

  // Handle backend soft-delete/archiving process safely
  const { 
    mutate: executeSoftDelete, 
    isPending: isDeleting 
  } = useMutation({
    mutationFn: (recipeId: string) => api.deleteRecipe(recipeId),
    onSuccess: () => {
      // Invalidate target cache lines so the main viewport updates immediately
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      setDeleteConfirm(null);
    },
    onError: (error) => {
      console.error('Failed to archive recipe:', error);
    }
  });

  // Derived pagination boundaries computed from cached query payloads
  const displayRecipes = recipes.slice(0, visibleCount);
  const hasMore = visibleCount < recipes.length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setVisibleCount(6); // Reset pagination index on dynamic type search operations

    if (val) {
      setSearchParams({ q: val, ...(categoryFilter ? { cat: categoryFilter } : {}) });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('q');
      setSearchParams(newParams);
    }
  };

  const handleSoftDelete = () => {
    if (!deleteConfirm) return;
    executeSoftDelete(deleteConfirm);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchTerm('');
    setVisibleCount(6);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto px-4 md:px-12 py-12 md:py-20"
    >
      <header className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-emerald-950 mb-4 tracking-tight">
              {categoryFilter ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Collection` : 'The Collection'}
            </h2>
            <p className="font-serif italic text-stone-400 text-lg md:text-xl max-w-xl">Every recipe ever crafted in our kitchen, shared with love.</p>
          </div>
          
          {(categoryFilter || searchTerm) && (
            <button 
              onClick={clearFilters}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#b58e3e] hover:text-emerald-700 transition-colors cursor-pointer"
            >
              Clear All Filters <X size={14} />
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search recipes, ingredients, techniques..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-white border border-stone-100 rounded-4xl py-5 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-sans text-sm shadow-sm"
          />
        </div>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center justify-center gap-3 px-10 py-5 rounded-4xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all border shadow-sm cursor-pointer ${
            isFilterOpen ? 'bg-emerald-950 text-white border-emerald-950' : 'bg-white text-stone-600 border-stone-100 hover:bg-stone-50'
          }`}
        >
          <Filter size={18} className={isFilterOpen ? 'text-emerald-400' : 'text-stone-300'} />
          Filter
        </button>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="bg-stone-50 rounded-[3rem] p-8 border border-stone-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6">Browse by Category</p>
              <div className="flex flex-wrap gap-3">
                {['Breakfast', 'Dinner', 'Dessert', 'Heritage', 'Vegan', 'Vegetarian', 'Vibrant'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setVisibleCount(6); // Reset window limit when moving options
                      setSearchParams({ ...Object.fromEntries(searchParams), cat: cat.toLowerCase() });
                    }}
                    className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all border cursor-pointer ${
                      categoryFilter?.toLowerCase() === cat.toLowerCase()
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-stone-500 border-stone-200 hover:border-emerald-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid displays structural skeleton items when data finishes querying initially */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 ${isPlaceholderData ? 'opacity-70 transition-opacity' : ''}`}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-4/5 bg-stone-100 rounded-[40px] animate-pulse" />
          ))
        ) : (
          displayRecipes.map((recipe, idx) => (
            <motion.div 
              key={recipe.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: (idx % 3) * 0.1 }}
            >
              <RecipeCard 
                id={String(recipe.id)}
                image={recipe.hero_image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80'}
                category={recipe.categories[0]}
                title={recipe.title}
                time={recipe.prep_time}
                rating={recipe.rating}
                likedBy={recipe.liked_by?.map(id => String(id)) || []}
                showAdminActions={user?.role === 'ADMIN' || user?.role === 'CHEF' || user?.id === String(recipe.author)}
                onDelete={() => setDeleteConfirm(String(recipe.id))}
              />
            </motion.div>
          ))
        )}
      </div>

      {!loading && recipes.length === 0 && (
        <div className="py-32 text-center bg-stone-50 rounded-[4rem] border border-stone-100 border-dashed">
          <p className="text-stone-300 font-serif text-2xl italic">No recipes found in your current view.</p>
          <button 
            onClick={clearFilters}
            className="mt-6 text-emerald-600 font-bold uppercase text-[10px] tracking-widest hover:underline cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {hasMore && (
        <div className="mt-24 text-center">
          <button 
            onClick={() => setVisibleCount(visibleCount + 6)}
            className="px-16 py-6 bg-white border-2 border-emerald-950 text-emerald-950 rounded-4xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-950 hover:text-white transition-all shadow-xl active:scale-[0.98] cursor-pointer"
          >
            Load More Recipes
          </button>
        </div>
      )}

      {/* Confirmation Drawer/Modal Overlay */}
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
                <AlertCircle className="text-emerald-950" size={32} />
              </div>
              <h3 className="font-serif text-3xl text-emerald-950 text-center mb-4 leading-tight">Move to archives?</h3>
              <p className="font-sans text-stone-500 text-center mb-10 leading-relaxed">
                This recipe will be removed from the public list but preserved in the archives. You can restore it later if needed.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isDeleting}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-sm tracking-wide text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleSoftDelete}
                  disabled={isDeleting}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold text-sm tracking-wide bg-emerald-950 text-white hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                  ARCHIVE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}