import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight, PlusCircle, ExternalLink, Calendar, User, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BlogPost } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function Blog() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
  async function loadBlogs() {
    console.log('LOG: Fetching blogs for listing...');
    try {
      const data = await api.getBlogs();
      console.log('LOG: Blogs loaded successfully. Count:', data.length);
      setBlogs(data);
    } catch (error) {
      console.error('ERROR: Failed to load blogs:', error);
    } finally {
      setLoading(false);
      console.log('LOG: Blog loading sequence complete.');
    }
  }
  loadBlogs();
}, []);

const handleSoftDelete = async () => {
  // Prevent duplicate requests if already deleting
  if (!deleteConfirm || isDeleting) return;

  console.log('LOG: Starting soft-delete for blog ID:', deleteConfirm);
  setIsDeleting(true);

  try {
    await api.deleteBlog(deleteConfirm);
    console.log('LOG: Blog archived on server.');

    // Update local state to hide the deleted item
    setBlogs(prev => {
      const updated = prev.filter(b => String(b.id) !== deleteConfirm);
      console.log('LOG: Local state updated. Blogs remaining:', updated.length);
      return updated;
    });

    // Clear the confirmation state
    setDeleteConfirm(null);
  } catch (error) {
    console.error('ERROR: Failed to archive blog:', error);
    alert('Failed to archive blog. It may have already been removed.');
  } finally {
    setIsDeleting(false);
    console.log('LOG: Delete process finished.');
  }
};

  return (
    <div className="flex-1 min-w-0 bg-background">
      <main className="max-w-7xl mx-auto px-4 md:px-12 py-10 md:py-16">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 md:mb-16">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Nourish Kitchen Blog</h1>
            <p className="text-secondary text-lg max-w-2xl leading-relaxed">
              Sharing the stories, tips, and traditions behind our heritage recipes.
            </p>
          </div>
          {user && (user.role === 'ADMIN' || user.role === 'CHEF') && (
            <Link 
              to="/blog/new"
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all uppercase tracking-widest"
            >
              <PlusCircle size={18} />
              Add New Blog
            </Link>
          )}
        </header>

        <section className="mb-20">
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-zinc-900 px-4 border-l-4 border-primary">Latest Journal Entries</h2>
            <Link to="/blog/all" className="text-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="aspect-video bg-stone-100 rounded-4xl animate-pulse" />
              ))
            ) : (
              <AnimatePresence mode="popLayout">
                {blogs.slice(0, 2).map((blog, idx) => (
                  <motion.article 
                    key={blog.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group flex flex-col bg-white rounded-4xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 relative"
                  >
                    <Link to={`/blog/all/${blog.id}`} className="flex-1 flex flex-col">
                      <div className="aspect-video overflow-hidden relative">
                        <img src={blog.hero_image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-md text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            Latest
                          </span>
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex items-center gap-4 text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-4">
                          <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary/50" /> {blog.date}</span>
                          <span className="flex items-center gap-1.5"><User size={12} className="text-primary/50" /> {blog.author_name}</span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-stone-900 mb-4 group-hover:text-primary transition-colors leading-tight">
                          {blog.title}
                        </h3>
                        <p className="text-stone-500 text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>
                    </Link>

                    {user && (user.role === 'ADMIN' || user.id === String(blog.author)) && (
                      <button 
                        onClick={() => setDeleteConfirm(String(blog.id))}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 z-10"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    
                    <div className="p-8 pt-0">
                      <div className="pt-6 border-t border-stone-50">
                        <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-3">Read On</p>
                        <div className="flex flex-wrap gap-3">
                          {blog.syndication_links.map(link => (
                            <a 
                              key={link.site}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-50 text-stone-600 font-bold text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                              {link.site} <ExternalLink size={12} />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            )}
          </div>
        </section>

        {/* Global Distribution Section */}
        <section className="bg-stone-900 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="max-w-xl mx-auto relative z-10">
            <Newspaper className="w-12 h-12 text-primary mx-auto mb-6 opacity-80" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Our words travel far.</h2>
            <p className="text-stone-400 text-lg mb-10 leading-relaxed">
              Every story we share is syndicated across the world's finest culinary and lifestyle platforms.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-40">
              <span className="font-serif font-bold text-xl italic">Medium</span>
              <span className="font-serif font-bold text-xl italic">Substack</span>
              <span className="font-serif font-bold text-xl italic">WordPress</span>
              <span className="font-serif font-bold text-xl italic">Ghost</span>
            </div>
          </div>
        </section>
      </main>

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
                This blog post will be removed from the public list but preserved in the archives. You can restore it later if needed.
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
    </div>
  );
}

