import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Plus, 
  Trash2, 
  X, 
  UploadCloud, 
  ChevronDown,
  Image as ImageIcon,
  ArrowLeft,
  Save
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Ingredient, Step, Recipe } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [proTip, setProTip] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [calories, setCalories] = useState('');
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Hot' | 'Extra Hot'>('Mild');
  const [categories, setCategories] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [customCuisine, setCustomCuisine] = useState('');
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewStory, setPreviewStory] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);

  const PRESET_CATEGORIES = [
    'Heritage Recipe',
    'Family Secret',
    'Essential',
    'Advanced Technique',
    'Quick Meal',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Dessert',
    'Vegan',
    'Gluten-Free'
  ];

  useEffect(() => {
    async function fetchRecipe() {
      if (!id) return;
      try {
        const data = await api.getRecipe(id);
        
        // Permission check: Only author or staff (ADMIN/CHEF) can edit
        if (user && data.authorId !== user.id && user.role === 'USER') {
          navigate(`/recipes/${id}`);
          return;
        }

        setTitle(data.title);
        setStory(data.story || '');
        setProTip(data.proTip || '');
        setYoutubeLink(data.youtubeLink || '');
        setPrepTime(data.prepTime);
        setCalories(data.calories || '');
        setSpiceLevel(data.spiceLevel || 'Mild');
        setCategories(data.categories || []);
        setCuisine(data.cuisine);
        setHeroImage(data.heroImage);
        setIngredients(data.ingredients || []);
        setSteps(data.steps || []);
        
        // Handle custom cuisine
        const knownCuisines = ['Swahili Coast', 'East African Cuisine', 'Global Heritage', 'Artisan Baking', 'Mediterranean', 'Asian Fusion'];
        if (!knownCuisines.includes(data.cuisine)) {
          setCuisine('Other');
          setCustomCuisine(data.cuisine);
        }
      } catch (error) {
        console.error('Failed to fetch recipe:', error);
        setNotification({ type: 'error', message: 'Failed to load recipe data.' });
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [id]);

  const toggleCategory = (cat: string) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter(c => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { id: Math.random().toString(), qty: '', unit: 'Grams', category: 'Main', name: '' }]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, [field]: value } : ing));
  };

  const addStep = () => {
    setSteps([...steps, { id: Math.random().toString(), title: '', description: '' }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const updateStep = (id: string, field: keyof Step, value: string) => {
    setSteps(steps.map(step => step.id === id ? { ...step, [field]: value } : step));
  };

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

  const handleSave = async () => {
    if (!id || !title) return;

    if (youtubeLink && !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(youtubeLink)) {
      setNotification({ type: 'error', message: 'Please provide a valid YouTube URL.' });
      return;
    }

    setIsSaving(true);
    try {
      const recipeData = {
        title,
        story,
        prepTime,
        calories,
        spiceLevel,
        cuisine: cuisine === 'Other' ? customCuisine : cuisine,
        categories: JSON.stringify(categories),
        ingredients: JSON.stringify(ingredients),
        steps: JSON.stringify(steps),
        proTip,
        youtubeLink
      };

      if (heroImageFile) {
        const formData = new FormData();
        Object.entries(recipeData).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append('heroImage', heroImageFile);
        await api.updateRecipe(id, formData);
      } else {
        await api.updateRecipe(id, {
          ...recipeData,
          categories,
          ingredients,
          steps,
          heroImage: heroImage!
        } as any);
      }

      setNotification({ type: 'success', message: 'Recipe updated successfully!' });
      setTimeout(() => {
        navigate(`/recipes/${id}`);
      }, 1500);
    } catch (error: any) {
      console.error('Failed to update recipe:', error);
      setNotification({ type: 'error', message: error.message || 'Failed to update recipe.' });
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
          <h2 className="font-serif text-lg md:text-xl font-medium text-primary opacity-90 truncate">Edit Creation: {title}</h2>
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

      <div className="mx-auto max-w-4xl py-10 md:py-16 px-6 md:px-12 space-y-12 md:space-y-20 mb-20 md:mb-0">
        <section className="space-y-8 md:space-y-10">
          <div className="space-y-4">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Recipe Title</label>
            <input 
              type="text" 
              placeholder="What are we cooking today?" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b border-[#b58e3e]/40 bg-transparent py-4 font-serif text-4xl md:text-6xl font-bold text-on-background placeholder:text-stone-100 focus:border-[#b58e3e] focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">YouTube Tutorial Link (Optional)</label>
            <div className="relative">
              <input 
                type="url" 
                placeholder="https://www.youtube.com/watch?v=..." 
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="w-full border-b border-stone-100 bg-transparent py-4 font-sans text-lg text-stone-600 focus:border-[#b58e3e] focus:outline-none transition-colors"
              />
              {youtubeLink && !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(youtubeLink) && (
                <p className="absolute -bottom-6 left-0 text-[10px] text-red-500 font-bold uppercase tracking-wider">Please enter a valid YouTube URL</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Same grid fields as NewRecipe */}
            <div className="space-y-4">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Prep Time</label>
              <input 
                type="text" 
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full border-b border-stone-100 bg-transparent py-3 font-sans text-base text-stone-600 focus:border-[#b58e3e] focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Calories</label>
              <input 
                type="text" 
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full border-b border-stone-100 bg-transparent py-3 font-sans text-base text-stone-600 focus:border-[#b58e3e] focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Spice Level</label>
              <select 
                value={spiceLevel}
                onChange={(e) => setSpiceLevel(e.target.value as any)}
                className="w-full appearance-none border-b border-stone-100 bg-transparent py-3 pr-8 font-sans text-base text-stone-600 focus:border-[#b58e3e] focus:outline-none transition-colors cursor-pointer"
              >
                <option>Mild</option>
                <option>Medium</option>
                <option>Hot</option>
                <option>Extra Hot</option>
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Flavors from</label>
              <select 
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full appearance-none border-b border-stone-100 bg-transparent py-3 pr-8 font-sans text-base text-stone-600 focus:border-[#b58e3e] focus:outline-none transition-colors cursor-pointer"
              >
                <option>Swahili Coast</option>
                <option>East African Cuisine</option>
                <option>Global Heritage</option>
                <option>Artisan Baking</option>
                <option>Mediterranean</option>
                <option>Asian Fusion</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Recipe Categories</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    categories.includes(cat)
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                      : 'bg-stone-50 text-stone-500 border-stone-100 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">The Story Behind the Recipe</label>
              <button 
                type="button"
                onClick={() => setPreviewStory(!previewStory)}
                className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-[#b58e3e] transition-colors"
              >
                {previewStory ? 'Edit Story' : 'Preview Story'}
              </button>
            </div>
            
            {!previewStory ? (
              <textarea 
                rows={8}
                placeholder="Tell the story behind this culinary masterpiece..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="w-full resize-none border-b border-stone-100 bg-transparent py-4 font-sans text-lg leading-relaxed text-stone-600 placeholder:text-stone-300 focus:border-[#b58e3e] focus:outline-none transition-colors"
              />
            ) : (
              <div className="min-h-[200px] py-4 prose prose-stone max-w-none">
                <div className="font-sans text-stone-600 leading-relaxed text-lg italic whitespace-pre-line">
                  <ReactMarkdown>{story || "Your story will appear here..."}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Media Section */}
        <section className="space-y-12">
          <div className="space-y-6">
            <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Hero Imagery</label>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex min-h-[280px] md:h-96 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#b58e3e]/30 bg-stone-50/50 hover:bg-emerald-50 transition-colors p-8"
            >
              {heroImage ? (
                <img src={heroImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <div className="text-center">
                  <UploadCloud size={32} className="mx-auto text-stone-300 mb-4" />
                  <p>Click to change image</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Ingredients Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">Ingredients</label>
            <button 
              onClick={addIngredient}
              className="flex items-center gap-2 text-xs font-bold text-primary hover:text-[#b58e3e] transition-colors py-2"
            >
              <Plus size={14} /> Add Row
            </button>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {ingredients.map((ing) => (
                <motion.div 
                  key={ing.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:gap-6 items-end pb-6 sm:pb-0 border-b border-stone-50 sm:border-none"
                >
                  <div className="w-full sm:col-span-1 space-y-1">
                    <label className="sm:hidden text-[10px] text-stone-400 font-bold uppercase tracking-widest">Qty</label>
                    <input 
                      type="text" 
                      placeholder="250"
                      value={ing.qty}
                      onChange={(e) => updateIngredient(ing.id, 'qty', e.target.value)}
                      className="w-full border-b border-stone-100 bg-transparent py-2 font-sans text-stone-600 focus:border-[#b58e3e] focus:outline-none"
                    />
                  </div>
                  <div className="w-full sm:col-span-2 space-y-1">
                    <label className="sm:hidden text-[10px] text-stone-400 font-bold uppercase tracking-widest">Unit</label>
                    <input 
                      type="text" 
                      placeholder="Grams"
                      value={ing.unit}
                      onChange={(e) => updateIngredient(ing.id, 'unit', e.target.value)}
                      className="w-full border-b border-stone-100 bg-transparent py-2 font-sans text-stone-600 focus:border-[#b58e3e] focus:outline-none"
                    />
                  </div>
                  <div className="w-full sm:col-span-8 space-y-1">
                    <label className="sm:hidden text-[10px] text-stone-400 font-bold uppercase tracking-widest">Ingredient Name</label>
                    <input 
                      type="text" 
                      placeholder="Organic All-Purpose Flour"
                      value={ing.name}
                      onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
                      className="w-full border-b border-stone-100 bg-transparent py-2 font-serif text-lg md:text-xl text-primary focus:border-[#b58e3e] focus:outline-none"
                    />
                  </div>
                  <div className="w-full sm:col-span-1 flex justify-end">
                    <button 
                      onClick={() => removeIngredient(ing.id)}
                      className="text-stone-200 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Steps Section */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e]">The Process</label>
            <button 
              onClick={addStep}
              className="flex items-center gap-2 text-xs font-bold text-primary hover:text-[#b58e3e] transition-colors py-2"
            >
              <Plus size={14} /> Add Step
            </button>
          </div>

          <div className="space-y-16 md:space-y-24">
            <AnimatePresence mode="popLayout">
              {steps.map((step, idx) => (
                <motion.div 
                  key={step.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex flex-col md:flex-row gap-6 md:gap-8 items-start relative"
                >
                  <span className="font-serif text-4xl md:text-5xl font-bold text-stone-100 shrink-0 select-none pt-2">
                    {(idx + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="flex-1 w-full space-y-6">
                    <div className="space-y-4">
                      <input 
                        type="text"
                        placeholder="Step Title (e.g. Master the Spice Bloom)"
                        value={step.title}
                        onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                        className="w-full border-b border-stone-100 bg-transparent py-2 font-serif text-xl md:text-2xl font-semibold text-primary focus:border-[#b58e3e] focus:outline-none transition-colors"
                      />
                      <textarea 
                        rows={3}
                        placeholder={idx === 0 ? "Describe the first step of the process in detail..." : "Describe the next step..."}
                        value={step.description}
                        onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                        className="w-full resize-none border-b border-stone-50 bg-transparent py-2 font-sans text-base md:text-lg text-stone-600 focus:border-[#b58e3e] focus:outline-none transition-colors leading-relaxed"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-primary py-2">
                        <ImageIcon size={12} /> Add Detail Photo
                      </button>
                      <button 
                        onClick={() => removeStep(step.id)}
                        className="md:hidden text-red-300 px-4 py-2 text-xs font-bold uppercase tracking-widest"
                      >
                        Delete Step
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeStep(step.id)}
                    className="hidden md:block text-stone-100 hover:text-red-500 transition-colors p-px mt-4"
                  >
                    <X size={24} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Chef's Secret Section */}
        <section className="rounded-[2.5rem] bg-emerald-50/40 p-8 md:p-12 border-l-4 border-[#b58e3e]/40 italic shadow-sm">
          <label className="not-italic block text-[11px] font-bold uppercase tracking-[0.2em] text-[#b58e3e] mb-6">Chef's Secret / Pro Tip</label>
          <textarea 
            rows={3}
            placeholder="Add a catchy secret or a serving suggestion..."
            value={proTip}
            onChange={(e) => setProTip(e.target.value)}
            className="w-full resize-none bg-transparent font-serif text-xl md:text-2xl font-semibold text-primary/70 placeholder:text-stone-300 focus:outline-none leading-normal"
          />
        </section>
      </div>
    </motion.div>
  );
}
