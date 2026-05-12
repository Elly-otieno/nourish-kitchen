import { Clock, Star, Heart, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface RecipeCardProps {
  id: string;
  image: string;
  category: string;
  title: string;
  time: string;
  rating: number;
  likedBy?: string[];
  showAdminActions?: boolean;
  onDelete?: () => void;
  key?: any;
}

export function RecipeCard({ id, image, category, title, time, rating, likedBy = [], showAdminActions = false, onDelete }: RecipeCardProps) {
  const { user } = useAuth();
  const [internalLikedBy, setInternalLikedBy] = useState<string[]>(likedBy);
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = user ? internalLikedBy.includes(user.id) : false;

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (isLiking) return;

    setIsLiking(true);
    try {
      const updated = await api.toggleLikeRecipe(id, user.id);
      setInternalLikedBy(updated.likedBy || []);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <Link to={`/recipes/${id}`} className="block">
      <motion.div 
        className="group cursor-pointer"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        whileHover={{ y: -8 }}
      >
        <div className="relative aspect-[1.4/1] rounded-2xl overflow-hidden mb-5">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-emerald-50/90 text-[#2d4626] px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-sm">
              {category}
            </span>
          </div>

          <button 
            onClick={toggleLike}
            className={`absolute top-4 right-4 p-3.5 rounded-full backdrop-blur-md transition-all shadow-lg select-none active:scale-90 ${
              isLiked 
                ? 'bg-red-500 text-white border-transparent' 
                : 'bg-white/90 text-stone-400 border border-stone-100 hover:text-red-500'
            }`}
            aria-label={isLiked ? "Unlike recipe" : "Like recipe"}
          >
            <Heart size={20} className={isLiked ? 'fill-white' : ''} />
          </button>

          {showAdminActions && (
            <button 
              onClick={handleDelete}
              className="absolute top-4 right-20 p-3.5 rounded-full bg-white/90 backdrop-blur-md text-stone-400 border border-stone-100 hover:text-red-500 transition-all shadow-lg select-none active:scale-90"
              aria-label="Archive recipe"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
        
        <h4 className="font-serif text-2xl text-on-background group-hover:text-primary transition-colors leading-snug">
          {title}
        </h4>
        
        <div className="flex items-center gap-5 mt-3 text-stone-500 text-sm font-medium">
          <span className="flex items-center gap-1.5">
            <Clock size={16} className="text-stone-300" /> 
            {time}
          </span>
          <span className="flex items-center gap-1.5">
            <Star size={16} className="text-stone-300 fill-stone-300" /> 
            {rating}
          </span>
          {internalLikedBy.length > 0 && (
            <span className="flex items-center gap-1.5 ml-auto text-[10px] uppercase tracking-widest text-[#b58e3e]">
              <Heart size={12} className="fill-[#b58e3e]" />
              {internalLikedBy.length} {internalLikedBy.length === 1 ? 'Chef' : 'Chefs'} loved this
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
