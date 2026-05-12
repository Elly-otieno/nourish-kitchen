import { Pencil, BookOpen, Eye, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { StatsCard } from '../components/StatsCard';
import { RecipeCard } from '../components/RecipeCard';
import { api } from '../services/api';
import { KitchenStats, Recipe, Comment } from '../types';

export function Dashboard() {
  const [stats, setStats] = useState<KitchenStats | null>(null);
  const [latestRecipes, setLatestRecipes] = useState<Recipe[]>([]);
  const [latestComments, setLatestComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsData, recipesData, commentsData] = await Promise.all([
          api.getStats(),
          api.getRecipes(),
          api.getComments()
        ]);
        setStats(statsData);
        setLatestRecipes(recipesData.slice(0, 2));
        setLatestComments(commentsData.slice(0, 3));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadDashboardData();
    
    // Refresh data every 30 seconds for "real-time" feel
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-12 py-20">
        <div className="animate-pulse space-y-12">
          <div className="h-16 w-1/3 bg-stone-100 rounded-2xl" />
          <div className="grid grid-cols-3 gap-8">
            <div className="h-40 bg-stone-100 rounded-3xl" />
            <div className="h-40 bg-stone-100 rounded-3xl" />
            <div className="h-40 bg-stone-100 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 md:px-12 py-8 md:py-10"
    >
      {/* Welcome Section */}
      <section className="mb-10 md:mb-14 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-primary mb-3 leading-tight">Nourish Kitchen</h2>
          <p className="font-sans text-base md:text-lg text-secondary">Pull up a chair. Your kitchen is ready for some home-cooked magic.</p>
        </motion.div>

        <Link to="/new" className="w-full sm:w-auto">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 bg-primary text-on-primary px-6 md:px-8 py-4 md:py-5 rounded-2xl font-bold text-sm tracking-wide hover:shadow-xl transition-all soft-shadow shrink-0"
          >
            <Pencil size={18} />
            CREATE NEW RECIPE
          </motion.button>
        </Link>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
        <StatsCard 
          icon={BookOpen} 
          label="Shared Recipes" 
          value={stats?.totalBlogs.toString() || '0'} 
          trend={`In your cookbook`} 
          delay={0.1}
        />
        <StatsCard 
          icon={Eye} 
          label="Hearty Readers" 
          value={stats ? (stats.totalViews > 1000 ? (stats.totalViews / 1000).toFixed(1) + 'k' : stats.totalViews.toString()) : '0'} 
          trend="Joining the table" 
          delay={0.2}
        />
        <StatsCard 
          icon={MessageSquare} 
          label="Warm Feedback" 
          value={stats?.totalComments.toString() || '0'} 
          subtext={`${stats?.totalSubscribers || 0} Friends at the table`} 
          delay={0.3}
        />
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8 md:gap-10">
        {/* Gallery Section */}
        <section className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] soft-shadow border border-surface-container">
          <div className="flex justify-between items-center mb-8 md:mb-10">
            <h3 className="font-serif text-2xl md:text-4xl text-primary font-medium tracking-tight">Your Latest Creations</h3>
            <Link to="/recipes" className="text-primary font-bold text-xs md:text-sm hover:underline tracking-wider uppercase">View All</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
            {latestRecipes.map(recipe => (
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
        </section>

        {/* Side Column */}
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-8 md:gap-10">
          {/* Kitchen Tips */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-primary-container p-8 md:p-10 rounded-[1.5rem] md:rounded-[2rem] text-on-primary-container soft-shadow shadow-[#334f2b15]"
          >
            <h3 className="font-serif text-2xl md:text-3xl mb-4 md:mb-6 leading-tight">Kitchen Tips</h3>
            <p className="font-sans text-sm md:text-base mb-6 md:mb-8 leading-relaxed opacity-90">
              Seasonal lavender is in bloom. Consider adding it to your next pastry collection for an artisanal floral note.
            </p>
            <Link to="/recipes" className="block w-full text-center bg-[#fdf2e9] text-primary-container py-3 md:py-4 rounded-xl font-bold text-sm hover:bg-white transition-colors tracking-wide uppercase">
              EXPLORE INGREDIENTS
            </Link>
          </motion.div>

          {/* Community Love */}
          <div className="bg-surface-container-lowest p-8 md:p-10 rounded-[1.5rem] md:rounded-[2rem] soft-shadow border border-surface-container flex-1">
            <h3 className="font-serif text-2xl md:text-3xl text-primary mb-6 md:mb-8 leading-tight">Community Love</h3>
            
            <div className="space-y-6 md:space-y-8">
              {latestComments.map(comment => (
                <CommentItem 
                  key={comment.id}
                  name={comment.userName}
                  comment={comment.content}
                  time={comment.createdAt}
                  avatar={comment.userAvatar}
                />
              ))}
              {latestComments.length === 0 && (
                <p className="text-stone-400 font-serif italic text-center py-4">No recent comments.</p>
              )}
            </div>
            
            <Link to="/comments" className="block mt-8 text-center text-primary font-bold text-xs tracking-widest uppercase hover:underline">
              Read all comments
            </Link>
          </div>
        </aside>
      </div>

      <footer className="mt-16 md:mt-20 py-10 md:py-12 border-t border-stone-200 text-center">
        <p className="font-serif italic text-stone-400 text-xl md:text-2xl">Nourish Kitchen</p>
        <p className="font-sans text-[10px] md:text-xs text-stone-400 mt-3 md:mt-4 tracking-[0.2em] uppercase font-bold">
          © {new Date().getFullYear()} · Home Cooking for the Soul
        </p>
      </footer>
    </motion.div>
  );
}

function CommentItem({ name, comment, time, avatar }: { name: string, comment: string, time: string, avatar: string, key?: any }) {
  return (
    <div className="flex gap-4 group">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0 overflow-hidden ring-2 ring-stone-50">
        <img src={avatar} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
      <div className="min-w-0 flex-1">
        <h5 className="font-sans text-sm font-bold text-on-background truncate">{name}</h5>
        <p className="text-stone-500 text-xs md:text-sm font-sans mt-1.5 leading-relaxed italic line-clamp-3 md:line-clamp-none">
          "{comment}"
        </p>
        <span className="text-[9px] md:text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-2 md:mt-3 block">
          {time}
        </span>
      </div>
    </div>
  );
}
