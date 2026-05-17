import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  Clock,
  ChefHat,
  Heart,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Coffee,
  Flame,
  Utensils,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Recipe, BlogPost } from "../types";
import { RecipeCard } from "../components/RecipeCard";
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function Landing() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Standard UI States
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ==========================================
  // DATA QUERIES (Replaces useEffect fetching)
  // ==========================================
  const { 
    data: recipes = [], 
    isLoading: isRecipesLoading 
  } = useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: async () => {
      console.log("LOG: React Query fetching recipes...");
      return await api.getRecipes();
    },
  });

  const { 
    data: blogs = [], 
    isLoading: isBlogsLoading 
  } = useQuery<BlogPost[]>({
    queryKey: ['blogs'],
    queryFn: async () => {
      console.log("LOG: React Query fetching blogs...");
      return await api.getBlogs();
    },
  });

  // Combine loading states for layout loader fallback
  const loading = isRecipesLoading || isBlogsLoading;

  // ==========================================
  // MUTATIONS (Replaces async handlers)
  // ==========================================
  
  // Soft Delete Recipe Mutation
  const deleteRecipeMutation = useMutation({
    mutationFn: (recipeId: number) => api.deleteRecipe(String(recipeId)),
    onSuccess: () => {
      console.log("LOG: Recipe successfully archived. Invalidating cache...");
      // Tells React Query to instantly refresh recipes list from backend
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      setDeleteConfirm(null);
    },
    onError: (error) => {
      console.error("ERROR: Failed to archive recipe:", error);
    }
  });

  // Soft Delete Blog Mutation
  const deleteBlogMutation = useMutation({
    mutationFn: (blogId: number) => {
      if (api.deleteBlog) return api.deleteBlog(String(blogId));
      return Promise.reject(new Error("deleteBlog method not found on api object"));
    },
    onSuccess: () => {
      console.log("LOG: Blog successfully archived. Invalidating cache...");
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error) => {
      console.error("ERROR: Failed to archive blog entry:", error);
    }
  });

  // Newsletter Subscription Mutation
  const subscribeMutation = useMutation({
    mutationFn: (emailString: string) => api.subscribeToNewsletter(emailString),
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    },
    onError: (error) => {
      console.error("ERROR: Subscription failed:", error);
      alert(`Subscription error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  });

  // ==========================================
  // COMPUTED LAYOUT VALUES
  // ==========================================
  const featuredRecipes = recipes.slice(0, 3);
  const latestFinds = recipes.slice(3, 3 + visibleCount);
  const hasMoreRecipes = 3 + visibleCount < recipes.length;

  // ==========================================
  // CLEAN DISPATCH WRAPPERS (For JSX buttons)
  // ==========================================
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate(email);
  };

  const handleSoftDelete = () => {
    if (deleteConfirm === null) return;
    deleteRecipeMutation.mutate(deleteConfirm);
  };

  const handlesBlogDelete = (id: number) => {
    if (window.confirm("Move this journal entry to archives?")) {
      deleteBlogMutation.mutate(id);
    }
  };
  return (
    <>
      <section className="relative h-screen min-h-175 flex items-center justify-center overflow-hidden">
        {/* Full-width refined background */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            src="/src/assets/backgroung.jpeg"
            alt="Artisanal Kitchen"
            className="w-full h-full object-cover"
          />
          {/* Multi-layered overlay for depth and legibility */}
          <div className="absolute inset-0 bg-stone-900/40 backdrop-brightness-75 z-10" />
          <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-transparent to-stone-950/20 z-20" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-30 w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-8 bg-white/40" />
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.5em] text-white/80">
                Est. 2025 · From our kitchen to yours
              </span>
              <div className="h-px w-8 bg-white/40" />
            </div>

            <h1 className="font-serif text-6xl md:text-8xl lg:text-[110px] text-white leading-[0.95] tracking-tight mb-8">
              Savor the <br />
              <span className="italic font-light opacity-90 block mt-2">
                moment.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 font-sans max-w-xl mx-auto mb-12 leading-relaxed font-light tracking-wide">
              Welcome to our home kitchen. Discover wholesome, seasonal recipes
              and the simple joy of cooking for the people you love.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/recipes"
                className="group relative bg-white text-stone-950 px-14 py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] overflow-hidden transition-all hover:pr-16 active:scale-95"
              >
                <span className="relative z-10">See What's Cooking</span>
                <ArrowRight
                  className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2"
                  size={16}
                />
              </Link>

              <Link
                to="/blog/all"
                className="text-white/70 hover:text-white font-bold text-[10px] uppercase tracking-[0.3em] py-3 hover:translate-x-1 transition-all"
              >
                Read Journal
              </Link>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 rotate-0">
              Scroll
            </span>
            <div className="w-px h-12 bg-white/20 relative overflow-hidden">
              <motion.div
                animate={{ y: [0, 48, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 left-0 w-full h-1/3 bg-white/60"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-32 bg-[#faf9f6]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-800/40 mb-4">
                The Selection
              </h2>
              <h3 className="font-serif text-5xl md:text-6xl text-emerald-950 leading-[1.1] tracking-tight">
                Curated <span className="italic font-light">Heritage</span>{" "}
                <br /> Recipes for the Modern Table
              </h3>
            </div>
            <Link
              to="/recipes"
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-900 border-b border-emerald-900/10 pb-2 hover:border-emerald-900 transition-all"
            >
              Explore All{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe, idx) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link to={`/recipes/${recipe.id}`} className="block">
                  <div className="aspect-4/5 overflow-hidden rounded-3xl mb-8 relative">
                    <img
                      src={recipe.hero_image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80'}
                      alt={recipe.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute top-6 right-6 flex flex-col gap-3">
                      <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-xl border border-white/20">
                        <Star
                          size={12}
                          className="fill-emerald-600 text-emerald-600"
                        />
                        <span className="text-[9px] font-black tracking-widest text-emerald-950">
                          {recipe.rating}
                        </span>
                      </div>
                      {(user?.role === "ADMIN" ||
                        user?.role === "CHEF" ||
                        user?.id === String(recipe.author)) && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDeleteConfirm(recipe.id);
                          }}
                          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-300 hover:text-red-500 shadow-xl border border-white/20 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-3 block">
                      {recipe.categories[0]}
                    </span>
                    <h4 className="font-serif text-2xl text-emerald-950 group-hover:text-emerald-800 transition-colors mb-4">
                      {recipe.title}
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-stone-300" />
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                          {recipe.prep_time}
                        </span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-stone-200" />
                      <div className="flex items-center gap-2">
                        <Utensils size={12} className="text-stone-300" />
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                          {recipe.cuisine}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              {
                label: "Morning",
                icon: Coffee,
                image:
                  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400",
                path: "/recipes?cat=breakfast",
              },
              {
                label: "Mindful",
                icon: Utensils,
                image:
                  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
                path: "/recipes?cat=vegetarian",
              },
              {
                label: "Gather",
                icon: Utensils,
                image:
                  "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400",
                path: "/recipes?cat=dinner",
              },
              {
                label: "Sweet",
                icon: Flame,
                image:
                  "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400",
                path: "/recipes?cat=desserts",
              },
              {
                label: "Quick",
                icon: Clock,
                image:
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
                path: "/recipes?cat=quick",
              },
            ].map((cat, idx) => (
              <Link
                key={cat.label}
                to={cat.path}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0">
                  <img
                    src={cat.image}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt={cat.label}
                  />
                  <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-emerald-950/40 transition-colors duration-500" />
                </div>
                <div className="absolute inset-x-0 bottom-8 px-6 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                    <cat.icon size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase">
                    {cat.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-32 bg-[#faf9f6]"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-800/40 mb-6 block">
              Our Latest Creations
            </span>
            <h2 className="font-serif text-5xl md:text-6xl text-emerald-950 mb-8 leading-tight">
              Fresh from the Kitchen
            </h2>
            <div className="w-12 h-px bg-emerald-900/20 mx-auto mb-8" />
            <p className="text-stone-500 text-lg leading-relaxed font-light italic">
              "Stories of flavor, family, and the simple joy of a well-cooked
              meal."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {latestFinds.map((item, idx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.8,
                    delay: idx * 0.1,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  viewport={{ once: true }}
                  className={`group relative cursor-pointer overflow-hidden rounded-3xl bg-stone-100 ${
                    idx % 3 === 0
                      ? "lg:row-span-2 aspect-3/4"
                      : "aspect-square"
                  }`}
                >
                  <Link to={`/recipes/${item.id}`} className="block h-full">
                    <img
                      src={item.hero_image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {(user?.role === "ADMIN" ||
                      user?.role === "CHEF" ||
                      user?.id === String(item.author)) && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteConfirm(item.id);
                        }}
                        className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-300 hover:text-red-500 shadow-2xl border border-white/20 transition-all opacity-0 group-hover:opacity-100 z-20"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/20">
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2 block">
                          {item.categories[0]}
                        </span>
                        <h4 className="text-emerald-950 font-serif text-lg font-bold leading-tight">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hasMoreRecipes && (
            <div className="mt-20 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="group inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-950 px-14 py-6 bg-white rounded-full shadow-lg hover:shadow-xl transition-all border border-stone-100"
              >
                Expand the Collection{" "}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          )}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-32 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
            <div className="max-w-xl">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-900/40 mb-6 block">
                Our Stories
              </span>
              <h2 className="font-serif text-5xl md:text-6xl text-emerald-950 leading-tight">
                Letters from <br />
                <span className="italic font-light">the Heart of the Home</span>
              </h2>
            </div>
            <Link
              to="/blog/all"
              className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-900 border-b border-emerald-900/10 pb-3 hover:border-emerald-900 transition-all"
            >
              Read More Stories{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {blogs.slice(0, 3).map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: idx * 0.1,
                  ease: [0.19, 1, 0.22, 1],
                }}
                viewport={{ once: true }}
                className="group"
              >
                <Link to={`/blog/all/${post.id}`} className="block">
                  <div className="aspect-4/5 overflow-hidden rounded-3xl mb-10 relative shadow-2xl shadow-stone-200">
                    <img
                      src={post.hero_image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute top-6 left-6 flex items-center gap-3">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest text-emerald-950 border border-white/20 shadow-lg">
                        {post.category}
                      </span>
                      {(user?.role === "ADMIN" ||
                        user?.role === "CHEF" ||
                        user?.id === String(post.author)) && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handlesBlogDelete(post.id);
                          }}
                          className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-stone-300 hover:text-red-500 shadow-xl border border-white/20 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="px-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-stone-300 mb-3 block">
                      {post.date}
                    </span>
                    <h3 className="font-serif text-3xl text-emerald-950 mb-6 group-hover:text-emerald-800 transition-colors leading-[1.2]">
                      {post.title}
                    </h3>
                    <p className="text-stone-500 text-base leading-relaxed line-clamp-2 font-light italic">
                      "{post.excerpt}"
                    </p>
                    <div className="mt-8 flex items-center gap-3">
                      <div className="w-8 h-px bg-emerald-900/10 group-hover:w-12 group-hover:bg-emerald-900/40 transition-all duration-500" />
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-900/40 group-hover:text-emerald-900 transition-colors">
                        Read Memoir
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="pb-32 px-6 md:px-12 bg-white mt-20"
      >
        <div className="max-w-7xl mx-auto bg-emerald-50 rounded-4xl p-12 md:p-24 overflow-hidden relative">
          <div className="relative z-10 max-w-2xl ">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-950 mb-8 leading-tight">
              Get Kitchen Updates <br />
              <span className="italic font-normal serif-font">
                Straight to your Inbox.
              </span>
            </h2>
            <p className="text-lg text-stone-600 mb-10 leading-relaxed font-medium">
              Join several home chefs receiving weekly dinner inspiration,
              stories from the garden, and kitchen tips.
            </p>

            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-600 text-white p-8 rounded-3xl flex items-center gap-6 shadow-xl"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Welcome Aboard!</h4>
                  <p className="text-emerald-50 text-sm font-medium">
                    Check your inbox for your first kitchen update.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-4"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="flex-1 bg-white px-8 py-5 rounded-lg font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all border border-stone-200"
                />
                <button
                  type="submit"
                  className="bg-emerald-950 text-white px-10 py-5 rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-900 transition-colors shadow-lg"
                  id="subscribe-button"
                >
                  Join Now
                </button>
              </form>
            )}

            <p className="mt-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              No spam. Only heritage. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </motion.section>

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
              <h3 className="font-serif text-3xl text-primary text-center mb-4 leading-tight">
                Move to archives?
              </h3>
              <p className="font-sans text-stone-500 text-center mb-10 leading-relaxed">
                This recipe will be removed from the public list but preserved
                in the archives. You can restore it later if needed.
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
                  {isDeleting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  ARCHIVE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
