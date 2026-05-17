import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Calendar,
  Share2,
  Bookmark,
  ExternalLink,
  Clock,
  User,
  Trash2,
  AlertCircle,
  Loader2,
  X,
  Pencil,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "../services/api";
import { BlogPost } from "../types";
import { useAuth } from "../contexts/AuthContext";
import {
  NewsletterSection,
  CommentsAndReviewsSection,
  RecommendedSection,
  FindMoreRecipesSection,
  BackToTopButton,
} from "../components/RecipeFooterSections";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAdmin, isChef } = useAuth();

  // Local UI-only states stay right here
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const blogId = id ? Number(id) : NaN;

  // ==========================================
  // DATA QUERY
  // ==========================================
  const { 
    data: post = null, 
    isLoading: loading 
  } = useQuery<BlogPost | null>({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      console.log(`LOG: Fetching individual blog data for ID: ${blogId}`);
      try {
        return await api.getBlog(blogId);
      } catch (error) {
        console.error("ERROR: Failed to load blog post:", error);
        navigate("/blog/all");
        return null;
      }
    },
    enabled: !isNaN(blogId), // Only run query if a valid numeric ID exists in URL
    // Pull summary data out of the landing page list cache for instant rendering
    initialData: () => {
      const cachedList = queryClient.getQueryData<BlogPost[]>(["blogs"]);
      return cachedList?.find((b) => b.id === blogId) || undefined;
    },
  });

  // ==========================================
  // MUTATIONS (Bookmark & Delete Operations)
  // ==========================================

  // Toggle Bookmark Mutation
  const toggleBookmarkMutation = useMutation({
    mutationFn: async () => {
      if (!post || !user) return null;
      return await api.toggleBookmarkBlog(post.id, user.id);
    },
    onSuccess: (updatedPost) => {
      if (!updatedPost || !user) return;

      // Update the cache for this specific blog detail instantly
      queryClient.setQueryData(["blog", blogId], updatedPost);

      // Explicitly check bookmarked_by (snake_case from backend interface)
      const isNowBookmarked = updatedPost.bookmarked_by?.includes(user.id) || false;
      setIsBookmarked(isNowBookmarked);
      console.log("LOG: Bookmark status updated in cache to:", isNowBookmarked);

      // Silently refresh the parent lists in the background
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (error) => {
      console.error("ERROR: Bookmark toggle failed:", error);
    },
  });

  // Soft Delete Blog Mutation
  const deleteBlogMutation = useMutation({
    mutationFn: (idToDelete: number) => api.deleteBlog(idToDelete),
    onSuccess: () => {
      console.log("LOG: Archive successful. Triggering notification and redirect.");
      setNotification({
        type: "success",
        message: "Journal entry moved to archives.",
      });

      // Clear the primary blogs cache list to remove it from selection tables
      queryClient.invalidateQueries({ queryKey: ["blogs"] });

      // Redirect after a 2-second delay
      setTimeout(() => {
        setNotification(null);
        navigate("/blog/all");
      }, 2000);
    },
    onError: (error) => {
      console.error("ERROR: Failed to archive entry:", error);
      setNotification({ type: "error", message: "Failed to archive entry." });
    },
    onSettled: () => {
      setShowDeleteConfirm(false);
    },
  });

  // Syncing UI's local bookmarked flag state whenever data loads
  useEffect(() => {
    if (post && user) {
      setIsBookmarked(post.bookmarked_by?.includes(user.id) || false);
    }
  }, [post, user]);

  // ==========================================
  // ACTION AND NAVIGATION UTILITIES
  // ==========================================
  const toggleBookmark = () => {
    if (!user) {
      console.log("LOG: Unauthenticated user attempted bookmark. Redirecting to login.");
      navigate("/login");
      return;
    }
    toggleBookmarkMutation.mutate();
  };

  const shareBlog = () => {
    if (!post) return;

    console.log("LOG: Share action triggered for:", post.title);
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.excerpt || "",
          url: window.location.href,
        })
        .then(() => console.log("LOG: Successful share"))
        .catch((err) => console.error("ERROR: Share failed", err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      console.log("LOG: Navigator.share unavailable. Link copied to clipboard.");
      alert("Link copied to clipboard!");
    }
  };

  const handleSoftDelete = () => {
    if (isNaN(blogId)) return;
    deleteBlogMutation.mutate(blogId);
  };

  // Provide simple boolean properties back to your layout renderers
  const isDeleting = deleteBlogMutation.isPending;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
          <p className="font-serif italic text-emerald-950">
            Opening the archives...
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-32 text-center bg-stone-50 min-h-screen flex flex-col items-center justify-center">
        <h2 className="font-serif text-3xl font-bold text-emerald-950 mb-4">
          Article Not Found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-xs cursor-pointer hover:text-emerald-800 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Journal
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen selection:bg-primary/20 relative">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-primary text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {notification.message}
            <button
              onClick={() => setNotification(null)}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Archive Confirmation Modal */}
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
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                Move to archives?
              </h3>
              <p className="text-stone-500 text-sm mb-8 leading-relaxed">
                This journal entry will be removed from the public library but
                preserved in the kitchen vaults. You can restore it at any time.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 rounded-xl border border-stone-100 font-bold text-xs uppercase tracking-widest text-stone-400 hover:bg-stone-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSoftDelete}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  Archive
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="relative h-[70vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={post.hero_image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-20">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-300 mb-6 block">
                Kitchen Journal
              </span>
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-10 leading-[1.1] tracking-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 text-white/80 border-t border-white/10 pt-10 mt-4 font-sans">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-black shadow-inner">
                    {post.author_name[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/40 uppercase tracking-widest mb-0.5">
                      Author
                    </span>
                    <span className="text-sm font-bold tracking-wide text-white">
                      {post.author_name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={18} className="text-emerald-400" />
                  <span className="font-bold">{post.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock size={18} className="text-emerald-400" />
                  <span className="font-bold">{post.readingTime}</span>
                </div>
                <div className="flex items-center gap-6 ml-auto print:hidden">
                  <button
                    onClick={shareBlog}
                    className="hover:text-emerald-400 transition-all hover:scale-110 cursor-pointer"
                  >
                    <Share2 size={24} />
                  </button>
                  <button
                    onClick={toggleBookmark}
                    className={`transition-all hover:scale-110 cursor-pointer ${isBookmarked ? "text-emerald-400 fill-emerald-400" : "hover:text-emerald-400 text-white"}`}
                  >
                    <Bookmark
                      size={24}
                      className={isBookmarked ? "fill-current" : ""}
                    />
                  </button>
                  {(isChef || user?.id === post.author_id || isAdmin) && (
                    <button
                      onClick={() => navigate(`/blog/all/${post.id}/edit`)}
                      className="hover:text-emerald-300 transition-all hover:scale-110 cursor-pointer text-white/80"
                      title="Edit Entry"
                    >
                      <Pencil size={24} />
                    </button>
                  )}
                  {(isChef || user?.id === post.author_id || isAdmin) && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="hover:text-red-400 transition-all hover:scale-110 cursor-pointer text-white/60"
                      title="Archive Entry"
                    >
                      <Trash2 size={24} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="py-20 px-6 md:px-12 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />

        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-16 print:hidden">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />{" "}
              Back to Journal
            </button>
          </div>

          <div className="prose prose-emerald lg:prose-xl max-w-none">
            <div className="whitespace-pre-line">
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => (
                    <p
                      className="text-stone-600 text-xl font-serif leading-[1.8] mt-3 mb-3"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="font-serif text-3xl font-bold text-primary mt-12 mb-6"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="font-serif text-2xl font-bold text-primary mt-8 mb-4"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc pl-6 space-y-4 my-8 text-stone-600"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-lg" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold text-stone-900" {...props} />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          {post.syndication_links && post.syndication_links.length > 0 && (
            <div className="mt-12 pt-8 border-t border-stone-100 print:hidden">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b58e3e] mb-8">
                External Features
              </h4>
              <div className="flex flex-wrap gap-4">
                {post.syndication_links.map((link) => (
                  <a
                    key={link.site}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-8 py-5 bg-white rounded-4xl text-stone-900 font-bold text-sm hover:bg-emerald-50 hover:text-emerald-800 transition-all border border-stone-100 shadow-sm hover:shadow-md group"
                  >
                    <span>Read on {link.site}</span>
                    <ExternalLink
                      size={16}
                      className="text-stone-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Social Footer */}
          <div className="mt-24 pt-0 border-t border-stone-100 flex flex-col md:flex-row items-center justify-between gap-8 print:hidden">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
                <User size={20} className="text-stone-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  Story By
                </p>
                <p className="font-serif text-lg font-bold text-primary">
                  {post.author_name}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={shareBlog}
                className="px-6 py-3 rounded-full bg-stone-50 text-stone-600 text-xs font-bold uppercase tracking-widest hover:bg-stone-100 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Share2 size={14} /> Share Story
              </button>
              <button
                onClick={toggleBookmark}
                className={`px-6 py-3 rounded-full border-2 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${
                  isBookmarked
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "border-primary text-primary hover:bg-primary hover:text-white"
                }`}
              >
                <Bookmark
                  size={14}
                  className={isBookmarked ? "fill-white" : ""}
                />
                {isBookmarked ? "Saved" : "Save to Collection"}
              </button>
            </div>
          </div>

          <section className="mt-24 pt-0 border-t border-stone-100 max-w-4xl mx-auto print:hidden">
            {/* <NewsletterSection /> */}
            <CommentsAndReviewsSection entityId={post.id} />
            <RecommendedSection type="blog" />
          </section>
        </div>
      </article>

      {/* <FindMoreRecipesSection /> */}
      <BackToTopButton />
    </div>
  );
}
