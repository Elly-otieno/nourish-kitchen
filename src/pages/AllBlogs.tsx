import { motion, AnimatePresence } from "motion/react";
import {
  Newspaper,
  ArrowLeft,
  Calendar,
  Clock,
  Search,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { BlogPost } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function AllBlogs() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      console.log("LOG: Fetching blogs for listing...");
      try {
        const data = await api.getBlogs();
        console.log("LOG: Blogs loaded. Blogs:", data);
        setBlogs(data);
      } catch (error) {
        console.error("ERROR: Failed to load blogs:", error);
      } finally {
        setLoading(false);
        console.log("LOG: Blog loading sequence finished.");
      }
    }
    loadBlogs();
  }, []);

  // Added safety checks for null excerpts/titles
  const filteredBlogs = blogs.filter((blog) => {
    const searchTerm = search.toLowerCase();

    // Using '|| ""' ensures toLowerCase() never hits a null value
    const titleMatch = (blog.title || "").toLowerCase().includes(searchTerm);
    const excerptMatch = (blog.excerpt || "")
      .toLowerCase()
      .includes(searchTerm);

    return titleMatch || excerptMatch;
  });

  const { user } = useAuth();

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Logging the user attempting the action
    console.log(`LOG: User ${user?.username} attempting to archive blog ${id}`);

    if (window.confirm("Archive this journal entry?")) {
      try {
        await api.deleteBlog(id);
        console.log("LOG: Delete successful for ID:", id);

        setBlogs((prev) => {
          const updated = prev.filter((b) => String(b.id) !== id);
          console.log(
            "LOG: Local state updated. Remaining blogs:",
            updated.length,
          );
          return updated;
        });
      } catch (error) {
        console.error("ERROR: Delete operation failed:", error);
        alert(error instanceof Error ? error.message : "Failed to delete blog");
      }
    } else {
      console.log("LOG: Archive action cancelled by user.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 min-w-0 bg-background"
    >
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-10 md:py-16">
        <header className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-stone-400 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors mb-8 cursor-pointer group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Back to Journal
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary mb-4 tracking-tight">
                Journal Archive
              </h1>
              <p className="text-secondary text-lg font-serif italic max-w-xl">
                Every story we've ever shared in our kitchen, preserved for your
                culinary inspiration.
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search journal posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-stone-100 px-6 py-4 rounded-2xl font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all pr-12 shadow-sm"
              />
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none"
                size={18}
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-4/5 bg-stone-100 rounded-2xl animate-pulse"
              />
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredBlogs.map((blog, idx) => (
                <motion.article
                  key={blog.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-100 transition-all hover:shadow-xl hover:shadow-primary/5 group h-full"
                >
                  <Link
                    to={`/blog/all/${blog.id}`}
                    className="flex flex-col h-full"
                  >
                    <div className="aspect-4/3 overflow-hidden relative">
                      <img
                        src={blog.hero_image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors" />
                      {(user?.role === "ADMIN" || user?.role === "CHEF") && (
                        <button
                          onClick={(e) => handleDelete(e, String(blog.id))}
                          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-400 hover:text-red-500 shadow-xl border border-stone-100 transition-all opacity-0 group-hover:opacity-100 z-10"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-[9px] text-[#b58e3e] font-black uppercase tracking-[0.2em] mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={12} /> {blog.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={12} /> {blog.reading_time}
                        </div>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-stone-900 mb-4 leading-tight group-hover:text-emerald-800 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-stone-500 text-sm leading-relaxed mb-8 flex-1 line-clamp-3 italic">
                        {blog.excerpt}
                      </p>

                      <div className="mt-auto pt-6 border-t border-stone-50 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                          Explore Now
                        </span>
                        <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          )}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="py-32 text-center">
            <Newspaper size={48} className="mx-auto text-stone-100 mb-6" />
            <p className="text-stone-400 font-serif text-xl italic">
              No posts found matching your search.
            </p>
          </div>
        )}
      </main>
    </motion.div>
  );
}
