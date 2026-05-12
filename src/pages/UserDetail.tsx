import { motion } from 'motion/react';
import { User, MapPin, ChefHat, Globe, Utensils, Star, Clock } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Recipe, User as UserType } from '../types';
import { RecipeCard } from '../components/RecipeCard';

export function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const [chef, setChef] = useState<UserType | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChef() {
      if (!id) return;
      setLoading(true);
      try {
        const users = await api.getUsers();
        const found = users.find(u => u.id === id);
        if (found) {
          setChef(found);
          const allRecipes = await api.getRecipes();
          setRecipes(allRecipes.filter(r => r.authorId === id));
        }
      } catch (error) {
        console.error('Failed to load chef profile:', error);
      } finally {
        setLoading(false);
      }
    }
    loadChef();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20 min-h-screen">
        <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!chef) {
    return (
      <div className="flex-1 flex items-center justify-center p-20 text-center bg-stone-50 min-h-screen">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
           <User size={64} className="mx-auto text-stone-200 mb-6" />
           <p className="text-secondary font-serif text-xl italic mb-8">Chef profile not found in our records.</p>
           <Link to="/" className="bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">Back to Marketplace</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      <div className="bg-[#1a382d] text-white pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-2xl rotate-3"
            >
              <img 
                src={chef.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chef.name}`} 
                alt={chef.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 mb-6 font-black text-[10px] uppercase tracking-widest">
                {chef.role}
              </span>
              <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 tracking-tight">{chef.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-emerald-100/60 font-sans font-bold text-xs uppercase tracking-widest mb-8">
                <div className="flex items-center gap-2">
                  <ChefHat size={14} className="text-emerald-400" />
                  {chef.role === 'ADMIN' ? 'Heritage Curator' : 'Heritage Chef'}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-400" />
                  Nairobi, Kenya
                </div>
              </div>
              <p className="text-emerald-100/70 text-lg md:text-xl font-serif italic max-w-xl leading-relaxed">
                "{chef.bio || 'Preserving the culinary artifacts of our ancestors through modern molecular retrieval.'}"
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-16">
        <div className="bg-white rounded-[4rem] shadow-2xl p-10 md:p-20">
          <header className="mb-16 flex justify-between items-end">
            <div>
              <h2 className="font-serif text-4xl font-bold text-stone-900 mb-2">Curated Creations</h2>
              <p className="text-stone-400 text-sm font-medium italic">All verified heritage records by this curator</p>
            </div>
            <div className="hidden md:block">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#b58e3e]">Records found: {recipes.length}</span>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12">
            {recipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id}
                id={recipe.id}
                image={recipe.heroImage}
                category={recipe.categories[0]}
                title={recipe.title}
                time={recipe.prepTime}
                rating={recipe.rating}
                likedBy={recipe.likedBy}
              />
            ))}
          </div>

          {recipes.length === 0 && (
            <div className="py-20 text-center">
              <Utensils size={40} className="mx-auto text-stone-200 mb-4" />
              <p className="text-stone-400 font-serif italic text-lg">This chef has no public creations yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
