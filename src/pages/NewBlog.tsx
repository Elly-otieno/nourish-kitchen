import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Newspaper, ArrowLeft, UploadCloud, Globe, X, CheckCircle2, ChevronDown, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { BlogPost } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface DistributionLink {
  id: string;
  site: string;
  url: string;
}

export function NewBlog() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewContent, setPreviewContent] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const [links, setLinks] = useState<DistributionLink[]>([
    { id: '1', site: 'Medium', url: '' },
    { id: '2', site: 'Substack', url: '' }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addLink = () => {
    setLinks([...links, { id: Math.random().toString(), site: 'Other', url: '' }]);
  };

  const updateLink = (id: string, field: 'site' | 'url', value: string) => {
    setLinks(links.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const publishBlog = async () => {
    if (!title || !content) {
      setNotification({ type: 'error', message: 'Please provide a title and content for your dispatch.' });
      return;
    }

    setIsPublishing(true);
    try {
      const blogData = {
        title,
        excerpt,
        content,
        category: 'Heritage',
        authorId: user?.id || '1',
        authorName: user?.username || 'Chef Eli',
        readingTime: `${Math.ceil(content.split(' ').length / 200)} min read`,
        syndicationLinks: JSON.stringify(links.filter(l => l.url.trim() !== '').map(l => ({ site: l.site, url: l.url }))),
        isPublished: 'true'
      };

      let result;
      if (heroImageFile) {
        const formData = new FormData();
        Object.entries(blogData).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append('heroImage', heroImageFile);
        result = await api.createBlog(formData);
      } else {
        result = await api.createBlog({
          ...blogData,
          syndicationLinks: JSON.parse(blogData.syndicationLinks),
          isPublished: true,
          heroImage: heroImage || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          bookmarkedBy: []
        } as any);
      }

      setNotification({ type: 'success', message: 'Journal entry published successfully!' });
      setTimeout(() => {
        navigate(`/blog/all/${result.id}`);
      }, 1500);
    } catch (error: any) {
      console.error('Failed to publish blog post:', error);
      setNotification({ type: 'error', message: error.message || 'Failed to publish entry.' });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex-1 min-w-0 bg-background selection:bg-primary/20">
      {/* Header */}
      <div className="h-16 md:h-20 flex justify-between items-center px-4 md:px-12 border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 md:top-20 z-20">
        <div className="flex flex-col min-w-0 mr-4">
          <h2 className="font-serif text-lg md:text-xl font-medium text-primary opacity-90 truncate">New Story Entry</h2>
          <p className="text-[10px] text-stone-400 font-sans uppercase tracking-widest hidden sm:block">Writing Mode</p>
        </div>
        
        <div className="flex items-center gap-2 md:gap-8 shrink-0">
          <button 
            onClick={publishBlog}
            disabled={isPublishing}
            className="rounded-xl bg-primary px-5 md:px-10 py-2.5 text-xs md:text-sm font-bold text-white transition-all hover:bg-emerald-900 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? 'Publishing...' : 'Publish Entry'}
          </button>
        </div>
      </div>

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
            <CheckCircle2 size={16} />
            {notification.message}
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70 transition-opacity">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-4xl py-10 md:py-16 px-6 md:px-12 space-y-12 md:space-y-20 mb-20 md:mb-0">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-stone-400 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Blog
        </button>

        {/* Identity Section */}
        <section className="space-y-8 md:space-y-10">
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Story Title</label>
            <input 
              type="text" 
              placeholder="Give your story a title..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b border-[#b58e3e]/40 bg-transparent py-4 font-serif text-3xl md:text-5xl font-bold text-on-background placeholder:text-stone-100 focus:border-[#b58e3e] focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Brief Excerpt</label>
            <textarea 
              rows={2}
              placeholder="Capture the reader's attention with a single, evocative paragraph..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full resize-none border-b border-stone-100 bg-transparent py-2 font-serif text-lg md:text-xl italic text-on-background placeholder:text-stone-200 focus:border-[#b58e3e] focus:outline-none transition-colors leading-relaxed"
            />
          </div>
        </section>

        {/* Media Section */}
        <section className="space-y-12">
          <div className="space-y-6">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Atmospheric Imagery</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex min-h-60 md:h-80 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-[#b58e3e]/30 bg-stone-50/50 hover:bg-emerald-50 transition-colors p-8"
            >
              {heroImage ? (
                <img src={heroImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-stone-300 group-hover:text-[#b58e3e] group-hover:scale-110 transition-all shadow-sm mb-4">
                    <UploadCloud size={32} />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-on-background text-center">Click to upload cover photo</h3>
                  <p className="mt-2 text-center text-xs text-stone-400 font-medium font-serif italic">
                    Editorial photography strongly preferred.
                  </p>
                </>
              )}
              
              {heroImage && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-primary px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest">Change Photo</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="space-y-8">
          <div className="flex justify-between items-center">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Body Content</label>
            <button 
              type="button"
              onClick={() => setPreviewContent(!previewContent)}
              className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-[#b58e3e] transition-colors"
            >
              {previewContent ? 'Edit Content' : 'Preview Content'}
            </button>
          </div>
          
          {!previewContent ? (
            <textarea 
              rows={12}
              placeholder="Share your culinary journey, traditions, and inspirations... Use # for headings and * for lists."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full resize-none border-0 bg-transparent p-0 font-serif text-lg md:text-xl text-stone-700 placeholder:text-stone-200 focus:outline-none leading-[1.8]"
            />
          ) : (
            <div className="min-h-75 prose prose-emerald lg:prose-lg max-w-none pb-10 border-b border-stone-50">
              <div className="whitespace-pre-line">
                <ReactMarkdown>{content || "Your article content will appear here..."}</ReactMarkdown>
              </div>
            </div>
          )}
        </section>

        {/* Sharing Section */}
        <section className="space-y-10 pt-16 border-t border-stone-100 pb-20">
          <header className="flex justify-between items-end">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e] mb-2">Also shared on</label>
              <p className="text-xs text-stone-400 font-serif italic">Let friends know where else they can read this story.</p>
            </div>
            <button 
              onClick={addLink}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-[#e7f0e4] px-4 py-2 rounded-full transition-colors"
            >
              <Plus size={14} /> Add Platform
            </button>
          </header>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {links.map((link) => (
                <motion.div 
                  key={link.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:gap-8 items-end"
                >
                  <div className="w-full sm:col-span-3 space-y-1 relative">
                    <label className="sm:hidden text-[10px] text-stone-400 font-bold uppercase tracking-widest">Platform</label>
                    <select 
                      value={link.site}
                      onChange={(e) => updateLink(link.id, 'site', e.target.value)}
                      className="w-full appearance-none border-b border-stone-100 bg-transparent py-3 pr-8 font-sans text-sm font-bold text-primary focus:outline-none transition-colors cursor-pointer"
                    >
                      <option>Medium</option>
                      <option>Substack</option>
                      <option>WordPress</option>
                      <option>Ghost</option>
                      <option>LinkedIn</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 bottom-4 text-primary opacity-40 pointer-events-none" />
                  </div>
                  <div className="w-full sm:col-span-8 space-y-1">
                    <label className="sm:hidden text-[10px] text-stone-400 font-bold uppercase tracking-widest">Public URL</label>
                    <div className="relative">
                      <input 
                        type="url" 
                        placeholder="https://..." 
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        className="w-full border-b border-stone-100 bg-transparent py-3 text-sm focus:border-primary focus:outline-none transition-colors pr-10"
                      />
                      <Globe size={14} className="absolute right-2 bottom-4 text-stone-200" />
                    </div>
                  </div>
                  <div className="w-full sm:col-span-1 flex justify-end pb-3">
                    <button 
                      onClick={() => removeLink(link.id)}
                      className="p-1 text-stone-300 hover:text-red-400 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}
