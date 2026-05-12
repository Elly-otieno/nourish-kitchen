import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  X, 
  UploadCloud, 
  ArrowLeft,
  Save,
  Plus,
  Trash2
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { BlogPost } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function EditBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [syndicationLinks, setSyndicationLinks] = useState<{ site: string; url: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [previewContent, setPreviewContent] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchBlog() {
      if (!id) return;
      try {
        const data = await api.getBlog(id);
        
        // Permission check: Only author or staff (ADMIN/CHEF) can edit
        if (user && data.authorId !== user.id && user.role === 'USER') {
          navigate(`/blog/all/${id}`);
          return;
        }

        setTitle(data.title);
        setExcerpt(data.excerpt);
        setContent(data.content);
        setReadingTime(data.readingTime);
        setHeroImage(data.heroImage);
        setSyndicationLinks(data.syndicationLinks || []);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
        setNotification({ type: 'error', message: 'Failed to load journal entry.' });
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

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
    setSyndicationLinks([...syndicationLinks, { site: '', url: '' }]);
  };

  const updateLink = (index: number, field: 'site' | 'url', value: string) => {
    const newLinks = [...syndicationLinks];
    newLinks[index][field] = value;
    setSyndicationLinks(newLinks);
  };

  const removeLink = (index: number) => {
    setSyndicationLinks(syndicationLinks.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!id || !title || !content) return;

    setIsSaving(true);
    try {
      const blogData = {
        title,
        excerpt,
        content,
        readingTime,
        syndicationLinks: JSON.stringify(syndicationLinks)
      };

      if (heroImageFile) {
        const formData = new FormData();
        Object.entries(blogData).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append('heroImage', heroImageFile);
        await api.updateBlog(id, formData);
      } else {
        await api.updateBlog(id, {
          ...blogData,
          syndicationLinks,
          heroImage: heroImage!
        } as any);
      }

      setNotification({ type: 'success', message: 'Journal entry updated!' });
      setTimeout(() => {
        navigate(`/blog/all/${id}`);
      }, 1500);
    } catch (error: any) {
      console.error('Failed to update blog:', error);
      setNotification({ type: 'error', message: error.message || 'Failed to update entry.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-stone-100 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex-1 min-w-0"
    >
      <div className="h-16 md:h-20 flex justify-between items-center px-4 md:px-12 border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 md:top-20 z-20">
        <div className="flex items-center gap-4 min-w-0">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-serif text-lg md:text-xl font-medium text-primary opacity-90 truncate">Edit Journal: {title}</h2>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl bg-primary px-5 md:px-8 py-2.5 text-xs md:text-sm font-bold text-white transition-all hover:bg-emerald-900 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {isSaving ? 'Saving...' : 'Save Changes'}
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
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            {notification.message}
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70 transition-opacity">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-4xl py-10 md:py-16 px-6 md:px-12 space-y-12">
        <section className="space-y-8">
          <div className="space-y-4">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Article Title</label>
            <input 
              type="text" 
              placeholder="What is this story about?" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b border-[#b58e3e]/40 bg-transparent py-4 font-serif text-4xl md:text-5xl font-bold text-on-background focus:border-[#b58e3e] focus:outline-none"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Excerpt</label>
            <textarea 
              rows={2}
              placeholder="A brief summary for the feed..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full resize-none border-b border-stone-100 bg-transparent py-2 font-sans text-lg text-stone-600 focus:border-[#b58e3e] focus:outline-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Content (Markdown supported)</label>
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
                rows={15}
                placeholder="Write your story here... Use # for headings and * for lists."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full resize-none border-b border-stone-100 bg-transparent py-4 font-sans text-lg leading-relaxed text-stone-600 focus:border-[#b58e3e] focus:outline-none"
              />
            ) : (
              <div className="min-h-[300px] py-4 prose prose-emerald lg:prose-lg max-w-none">
                <div className="whitespace-pre-line">
                  <ReactMarkdown>{content || "Your article content will appear here..."}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-8">
          <div className="space-y-6">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Hero Image</label>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex h-64 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#b58e3e]/30 bg-stone-50/50 hover:bg-emerald-50 transition-colors"
            >
              {heroImage ? (
                <img src={heroImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <UploadCloud size={32} className="mx-auto text-stone-300 mb-4" />
                  <p>Change hero image</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Reading Time</label>
              <input 
                type="text" 
                placeholder="e.g. 5 min read" 
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                className="w-full border-b border-stone-100 bg-transparent py-3 font-sans text-stone-600 focus:border-[#b58e3e] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Syndication Links</label>
              <button 
                type="button" 
                onClick={addLink}
                className="text-[10px] font-bold uppercase tracking-widest text-[#b58e3e] hover:text-primary transition-colors flex items-center gap-2"
              >
                <Plus size={14} /> Add Link
              </button>
            </div>
            <div className="space-y-4">
              {syndicationLinks.map((link, idx) => (
                <div key={idx} className="flex gap-4">
                  <input 
                    placeholder="Site name" 
                    value={link.site} 
                    onChange={e => updateLink(idx, 'site', e.target.value)}
                    className="flex-1 border-b border-stone-100 bg-transparent py-2 font-sans text-sm focus:border-primary focus:outline-none"
                  />
                  <input 
                    placeholder="URL" 
                    value={link.url} 
                    onChange={e => updateLink(idx, 'url', e.target.value)}
                    className="flex-[2] border-b border-stone-100 bg-transparent py-2 font-sans text-sm focus:border-primary focus:outline-none"
                  />
                  <button onClick={() => removeLink(idx)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
