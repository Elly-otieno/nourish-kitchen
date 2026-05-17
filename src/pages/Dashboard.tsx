import { Pencil, BookOpen, Eye, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from '../components/StatsCard';
import { RecipeCard } from '../components/RecipeCard';
import { api } from '../services/api';
import { KitchenStats, Recipe, Comment } from '../types';

export function Dashboard() {
  // Kitchen Metrics Query
  const { data: stats, isLoading: isStatsLoading } = useQuery<KitchenStats, Error>({
    queryKey: ['kitchen-stats'],
    queryFn: () => api.getStats(),
    refetchInterval: 30000, // Automatic background syncing every 30s
  });

  // Latest Recipes Query (Slices top 2 via select data transformer)
  const { data: latestRecipes = [], isLoading: isRecipesLoading } = useQuery<Recipe[], Error, Recipe[]>({
    queryKey: ['recipes', 'latest'],
    queryFn: () => api.getRecipes(),
    select: (recipes) => (Array.isArray(recipes) ? recipes.slice(0, 2) : []),
    refetchInterval: 30000,
  });

  // Global Feedback Pipeline (Slices top 3 via select data transformer)
  const { data: latestComments = [], isLoading: isCommentsLoading } = useQuery<Comment[], Error, Comment[]>({
    queryKey: ['comments', 'latest'],
    queryFn: () => api.getAllComments(),
    select: (comments) => {
      if (Array.isArray(comments)) return comments.slice(0, 3);
      if (comments && typeof comments === 'object' && Array.isArray((comments as any).results)) {
        return (comments as any).results.slice(0, 3);
      }
      return [];
    },
    refetchInterval: 30000,
  });

  // Combined tracking state matching your initial implementation
  const loading = isStatsLoading || isRecipesLoading || isCommentsLoading;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-12 py-20">
        <div className="animate-pulse space-y-12">
          <div className="h-16 w-1/3 bg-stone-100 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
          value={`${stats?.total_blogs ?? 0}`} 
          trend={`In your cookbook`} 
          delay={0.1}
        />
        <StatsCard 
          icon={Eye} 
          label="Hearty Readers" 
          value={
  stats?.total_views 
    ? (stats.total_views > 1000 
        ? (stats.total_views / 1000).toFixed(1) + 'k' 
        : String(stats.total_views)) 
    : '0'
}
          trend="Joining the table" 
          delay={0.2}
        />
        <StatsCard 
          icon={MessageSquare} 
          label="Warm Feedback" 
          value={`${stats?.total_comments ?? 0}`} 
          subtext={`${stats?.total_subscribers || 0} Friends at the table`} 
          delay={0.3}
        />
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8 md:gap-10">
        {/* Gallery Section */}
        <section className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] soft-shadow border border-surface-container">
          <div className="flex justify-between items-center mb-8 md:mb-10">
            <h3 className="font-serif text-2xl md:text-4xl text-primary font-medium tracking-tight">Your Latest Creations</h3>
            <Link to="/recipes" className="text-primary font-bold text-xs md:text-sm hover:underline tracking-wider uppercase">View All</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
            {latestRecipes.map((recipe: Recipe) => (
              <RecipeCard 
                key={recipe.id}
                id={String(recipe.id)}
                image={recipe.hero_image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80'}
                category={recipe.categories?.[0] || 'Uncategorized'}
                title={recipe.title}
                time={recipe.prep_time}
                rating={recipe.rating}
                likedBy={recipe.liked_by?.map(id => String(id)) || []}
              />
            ))}
          </div>
          {latestRecipes.length === 0 && (
            <p className="text-stone-400 font-serif italic text-center py-12">No culinary recipes shared yet.</p>
          )}
        </section>

        {/* Side Column */}
        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-8 md:gap-10">
          {/* Kitchen Tips */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-primary-container p-8 md:p-10 rounded-3xl md:rounded-4xl text-on-primary-container soft-shadow shadow-[#334f2b15]"
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
          <div className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl md:rounded-4xl soft-shadow border border-surface-container flex-1">
            <h3 className="font-serif text-2xl md:text-3xl text-primary mb-6 md:mb-8 leading-tight">Community Love</h3>
            
            <div className="space-y-6 md:space-y-8">
              {latestComments.map((comment: Comment) => (
                <CommentItem 
                  key={comment.id}
                  name={comment.user_name}
                  comment={comment.content}
                  time={comment.created_at}
                  avatar={comment.user_avatar}
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

interface CommentItemProps {
  name: string;
  comment: string;
  time: string;
  avatar: string;
}

function CommentItem({ name, comment, time, avatar }: CommentItemProps) {
  return (
    <div className="flex gap-4 group">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full shrink-0 overflow-hidden ring-2 ring-stone-50">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full bg-stone-100 flex items-center justify-center font-bold text-stone-500 text-xs">
            {name.charAt(0)}
          </div>
        )}
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