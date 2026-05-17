import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  ChefHat, 
  Printer, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  PlayCircle,
  Play,
  Star as StarIcon,
  Heart,
  Trash2,
  Pencil,
  AlertCircle,
  Loader2,
  X,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Recipe } from '../types';
import { 
  CommentsAndReviewsSection,
  QuestionsSection,
  RecommendedSection, 
  FindMoreRecipesSection,
  BackToTopButton
} from '../components/RecipeFooterSections';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, user } = useAuth();
  
  // Local UI-only states stay right here
  const [servingsMultiplier, setServingsMultiplier] = useState(4);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const recipeSectionRef = useRef<HTMLDivElement>(null);

  const recipeId = id ? Number(id) : NaN;

  // ==========================================
  // INDIVIDUAL DATA QUERY
  // ==========================================
  const { 
    data: recipe = null, 
    isLoading: loading 
  } = useQuery<Recipe | null>({
    queryKey: ['recipe', recipeId],
    queryFn: async () => {
      console.log(`LOG: Fetching individual recipe data for ID: ${recipeId}`);
      try {
        // Change api.getRecipe(id) to match whatever your api layout utilizes
        return await api.getRecipe(recipeId); 
      } catch (error) {
        console.error('Failed to load recipe inside hook:', error);
        navigate('/recipes');
        return null;
      }
    },
    enabled: !isNaN(recipeId), // Only run query if a valid numeric ID exists in URL
    // Look into landing page list cache to instantly render data with 0 spinner delay!
    initialData: () => {
      const cachedList = queryClient.getQueryData<Recipe[]>(['recipes']);
      return cachedList?.find((r) => r.id === recipeId) || undefined;
    }
  });

  // ==========================================
  // MUTATIONS (Delete & Like Operations)
  // ==========================================

  // Delete Recipe Mutation
  const deleteRecipeMutation = useMutation({
    mutationFn: (idToDelete: number) => api.deleteRecipe(idToDelete),
    onSuccess: () => {
      setNotification({ type: 'success', message: 'Recipe removed from your collection.' });
      // Invalidate the primary list query cache so it auto-refreshes when we go back
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      
      setTimeout(() => {
        setNotification(null);
        navigate('/recipes');
      }, 2000);
    },
    onError: (error) => {
      console.error('Failed to delete recipe:', error);
      setNotification({ type: 'error', message: 'Failed to remove recipe.' });
    },
    onSettled: () => {
      setShowDeleteConfirm(false);
    }
  });

  // Toggle Like Mutation
  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      if (!recipe || !user) return null;
      return await api.toggleLikeRecipe(recipe.id, user.id);
    },
    onSuccess: (updatedRecipe) => {
      if (!updatedRecipe || !user) return;
      
      // Update this individual recipe cache instantly across the UI
      queryClient.setQueryData(['recipe', recipeId], updatedRecipe);
      
      // Force sync backend liked_by array
      setIsLiked(updatedRecipe.liked_by?.includes(user.id) || false);
      
      // Sync list query cache silently
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
    onError: (error) => {
      console.error('Failed to toggle like structure:', error);
    }
  });

  // Syncing initial local like state flag when data fetches or loads
  useEffect(() => {
    if (recipe && user) {
      setIsLiked(recipe.liked_by?.includes(user.id) || false);
    }
  }, [recipe, user]);

  // ==========================================
  // ACTIONS AND CLEAN DISPATCH METHODS
  // ==========================================
  const toggleIngredient = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatAmount = (qty: string) => {
    const num = parseFloat(qty);
    if (isNaN(num)) return qty;
    const finalAmount = (num * servingsMultiplier) / 4;
    return Number(finalAmount.toFixed(2)).toString();
  };

  const jumpToRecipe = () => {
    recipeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = () => {
    if (isNaN(recipeId)) return;
    deleteRecipeMutation.mutate(recipeId);
  };

  const toggleLike = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    toggleLikeMutation.mutate();
  };

  // Provide a clean boolean back templates
  const isDeleting = deleteRecipeMutation.isPending;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <p className="font-serif italic text-emerald-950">Prepping the ingredients...</p>
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="flex-1 min-w-0 bg-background selection:bg-primary/20 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-12 pt-8">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 hover:text-emerald-800 transition-colors mb-4 group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Recipes
        </button>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-primary text-white' : 'bg-red-500 text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {notification.message}
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70 transition-opacity">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-stone-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">Move to archives?</h3>
              <p className="text-stone-500 text-sm mb-8 leading-relaxed">This recipe will be removed from the public library but preserved in the kitchen vaults. You can restore it at any time.</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 rounded-xl border border-stone-100 font-bold text-xs uppercase tracking-widest text-stone-400 hover:bg-stone-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Archive
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 md:px-12 pt-8 pb-24">
        {/* Header Section: Title & Meta */}
        <header className="mb-12 text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6 print:hidden">
            <span className="bg-[#e7f0e4] text-primary px-4 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wider uppercase">
              {recipe.categories[0]}
            </span>
            <span className="text-secondary text-xs md:text-sm font-medium">
              {recipe.cuisine}
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold text-zinc-900 leading-[1.1] tracking-tight mb-8">
            {recipe.title}
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10 pb-10 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-stone-200">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipe.author_name}`} alt={recipe.authorName} className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Created By</p>
                <Link to={`/users/${recipe.author}`} className="font-serif text-base font-bold text-primary hover:text-emerald-700 transition-colors">
                  {recipe.author_name}
                </Link>
              </div>
            </div>

            <div className="hidden md:block w-px h-8 bg-stone-100" />

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-zinc-900 font-bold tracking-tight">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm">{recipe.prep_time}</span>
                </div>
                {recipe.calories && (
                   <div className="flex items-center gap-2 text-zinc-900 font-bold tracking-tight">
                    <span className="text-sm opacity-40">•</span>
                    <span className="text-sm">{recipe.calories}</span>
                  </div>
                )}
                {recipe.spice_level && (
                   <div className="flex items-center gap-2 text-zinc-900 font-bold tracking-tight">
                    <span className="text-sm opacity-40">•</span>
                    <span className="text-sm">{recipe.spice_level} Heat</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-zinc-900 font-bold tracking-tight">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm">Serves {servingsMultiplier}</span>
                </div>
                 <div className="flex items-center gap-1">
                <StarIcon size={16} className="text-[#b58e3e] fill-[#b58e3e]" />
                <span className="text-sm font-bold text-stone-900">{recipe.rating}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 print:hidden">
            <button 
              onClick={jumpToRecipe}
              className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-xs flex items-center gap-2.5 hover:shadow-xl hover:shadow-primary/20 transition-all uppercase tracking-widest cursor-pointer"
            >
              <ChefHat className="w-4 h-4" />
              Jump to Recipe
            </button>
            <button 
              onClick={handlePrint}
              className="bg-white border border-stone-200 text-secondary px-8 py-4 rounded-xl font-bold text-xs flex items-center gap-2.5 hover:bg-stone-50 transition-colors uppercase tracking-widest cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print Recipe
            </button>
            <button 
              onClick={toggleLike}
              className={`px-8 py-4 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all uppercase tracking-widest cursor-pointer border ${
                isLiked ? 'bg-red-50 border-red-100 text-red-500 shadow-inner' : 'bg-white border-stone-200 text-stone-400 hover:bg-stone-50'
              }`}
            >
              <Heart size={16} className={isLiked ? 'fill-red-500' : ''} />
              {isLiked ? 'Saved to Collection' : 'Save Recipe'}
            </button>

            {(isAdmin || user?.role === 'CHEF' || user?.id === recipe.author) && (
              <>
                <button 
                  onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                  className="bg-white border border-stone-200 text-primary px-8 py-4 rounded-xl font-bold text-xs flex items-center gap-2.5 hover:bg-stone-50 transition-all uppercase tracking-widest cursor-pointer shadow-sm"
                >
                  <Pencil size={16} />
                  Edit Recipe
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-white border border-red-100 text-stone-400 px-8 py-4 rounded-xl font-bold text-xs flex items-center gap-2.5 hover:bg-red-50 hover:text-red-500 transition-all uppercase tracking-widest cursor-pointer shadow-sm"
                >
                  <Trash2 size={16} />
                  Archive Recipe
                </button>
              </>
            )}
          </div>
        </header>

        {/* Hero Image */}
        <section className="mb-20 max-w-5xl mx-auto px-0 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-video md:aspect-21/9 rounded-none md:rounded-[3rem] overflow-hidden shadow-2xl relative border border-stone-100"
          >
            <img 
              alt={recipe.title} 
              className="w-full h-full object-cover" 
              src={recipe.hero_image} 
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </section>

        {/* Story Section */}
        <section className="max-w-3xl mx-auto mb-24 md:mb-32">
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className="h-px w-12 bg-stone-200" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#b58e3e]">The Story</p>
            <span className="h-px w-12 bg-stone-200" />
          </div>
          
          <div className="prose prose-stone prose-lg max-w-none">
            <div className="font-sans text-stone-700 leading-[1.8] space-y-8 text-xl whitespace-pre-line">
              <ReactMarkdown 
                components={{
                  h3: ({node, ...props}) => <h3 className="font-serif text-3xl md:text-4xl font-bold text-emerald-950 mt-0 mb-0" {...props} />,
                  p: ({node, ...props}) => <p className="mt-0 mb-0" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-stone-900 border-b-2 border-primary/20 pb-0.5" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-4 my-8" {...props} />,
                  li: ({node, ...props}) => <li className="text-lg text-stone-600" {...props} />
                }}
              >
                {recipe.story}
              </ReactMarkdown>
            </div>
          </div>
        </section>

        {/* Recipe Card Section */}
        <div className="bg-[#fcfbf9] rounded-[3rem] p-8 md:p-16 border border-stone-100 shadow-sm scroll-mt-24" id="recipe-card" ref={recipeSectionRef}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 pb-12 border-b border-stone-100">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-2">{recipe.title}</h2>
              <div className="flex items-center gap-4 text-stone-400 font-serif italic text-lg">
                <span>{recipe.cuisine}</span>
                <span>•</span>
                <span>{recipe.rating} Stars</span>
              </div>
            </div>
            <button 
              onClick={handlePrint}
              className="bg-primary text-white p-6 rounded-2xl font-bold text-xs flex items-center gap-3 hover:shadow-xl hover:shadow-primary/30 transition-all uppercase tracking-widest cursor-pointer shadow-lg"
            >
              <Printer className="w-5 h-5" />
              Print Recipe Card
            </button>
          </div>
          
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
            {/* Ingredients Column */}
            <aside className="lg:col-span-5">
              <div className="flex justify-between items-end mb-10">
                <h3 className="font-serif text-3xl font-semibold text-primary">Ingredients</h3>
                <div className="flex flex-col items-end print:hidden">
                  <span className="text-[10px] font-bold text-stone-400 mb-2 uppercase tracking-widest">Servings</span>
                  <div className="flex bg-stone-100/50 rounded-xl p-1 gap-1">
                    {[2, 4, 8].map((size) => (
                      <button
                        key={size}
                        onClick={() => setServingsMultiplier(size)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          servingsMultiplier === size 
                            ? "bg-white text-primary shadow-sm" 
                            : "text-stone-400 hover:text-stone-600"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                {Array.from(new Set(recipe.ingredients.map(i => i.category))).map((cat, idx) => (
                  <motion.div 
                    key={cat} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4">
                       <h4 className="text-[10px] font-black text-[#b58e3e] uppercase tracking-[0.2em] bg-[#b58e3e]/5 px-3 py-1 rounded">
                        {cat}
                      </h4>
                      <div className="h-px flex-1 bg-stone-100" />
                    </div>
                    <ul className="space-y-4">
                      {recipe.ingredients.filter(i => i.category === cat).map((item) => (
                        <li key={item.id} className="flex items-start gap-4 group cursor-pointer" onClick={() => toggleIngredient(item.id)}>
                          <div className={`mt-1.5 h-4 w-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                            checkedItems[item.id] ? "bg-primary border-primary" : "border-stone-300"
                          }`}>
                            {checkedItems[item.id] && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className={`text-base md:text-lg font-sans ${checkedItems[item.id] ? "text-stone-400 line-through" : "text-stone-700 font-medium"}`}>
                            {formatAmount(item.qty)} {item.unit} {item.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}

                <motion.div 
                  className="mt-12 p-8 bg-emerald-50/50 border-l-4 border-primary rounded-r-3xl relative"
                >
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[9px] font-black uppercase tracking-widest">The Secret</span>
                  </div>
                  <p className="text-stone-700 italic leading-relaxed font-serif text-lg">
                    "{recipe.pro_tip}"
                  </p>
                </motion.div>
              </div>
            </aside>

            {/* Preparation Column */}
            <article className="lg:col-span-7">
              <h3 className="font-serif text-3xl font-semibold mb-10 text-primary">Instructions</h3>
              
              <div className="space-y-12">
                {recipe.steps.map((step, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-6 group"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center font-serif text-lg text-stone-400 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-serif text-2xl font-bold mb-3 text-zinc-900 group-hover:text-primary transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-lg text-stone-600 leading-relaxed font-sans">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </article>
          </section>

          {recipe.youtube_link && /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(recipe.youtube_link) && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="mt-20 group relative overflow-hidden rounded-[2.5rem]"
            >
              <div className="absolute inset-0 bg-emerald-950/95" />
              <div className="absolute inset-0 opacity-20">
                <img 
                  src={recipe.hero_image} 
                  alt="" 
                  className="w-full h-full object-cover grayscale scale-110 group-hover:scale-100 transition-transform duration-[3s]" 
                />
              </div>
              
              <div className="relative z-10 px-8 md:px-16 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12 border border-white/10 rounded-[2.5rem]">
                <div className="max-w-xl text-center md:text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-400/80 mb-6 block">Master the Technique</span>
                  <h3 className="font-serif text-3xl md:text-4xl text-white mb-6 leading-tight">
                    Witness the <span className="italic font-light">Heritage</span> in motion.
                  </h3>
                  <p className="text-emerald-50/50 text-base md:text-lg leading-relaxed font-light italic">
                    "Observe the traditional methods, the rhythm of the blade, and the transformation of ingredients into a legacy of flavor."
                  </p>
                </div>
                
                <a 
                  href={recipe.youtube_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group/btn relative inline-flex items-center gap-6 px-12 py-6 bg-white text-emerald-950 rounded-full font-black text-[10px] uppercase tracking-[0.4em] overflow-hidden hover:bg-emerald-50 transition-all active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                >
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-950 text-white flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                      <Play size={12} fill="currentColor" />
                    </div>
                    Watch the Memoir
                  </div>
                </a>
              </div>
            </motion.div>
          )}
        </div>

        <section className="mt-24 border-t border-stone-100 max-w-4xl mx-auto print:hidden">
          <QuestionsSection entityId={recipe.id} />
          <CommentsAndReviewsSection entityId={recipe.id} />
          <RecommendedSection type="recipe" />
        </section>
      </main>

      {/* <FindMoreRecipesSection /> */}
      <BackToTopButton />

      {/* Footer */}
    {/*<footer className="bg-stone-50 border-t border-stone-100 py-16 mt-20 print:hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="font-serif italic text-2xl text-primary">Nourish Kitchen</div>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-10 font-serif text-stone-400">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>

            <div className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">
              © 2024 · Nourish your kitchen
            </div>
          </div>
        </div>
      </footer>*/}
    </div>
  );
}
