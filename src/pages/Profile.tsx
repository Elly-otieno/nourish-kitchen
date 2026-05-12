import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, Mail, Shield, Bell, Settings, LogOut, Camera, Save, CheckCircle2, X, MapPin, ChefHat, Globe, Loader2, AlertCircle } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { KitchenStats, User as UserType } from '../types';

export function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    specialization: 'Home Chef',
    bio: user?.bio || 'Family cook and creator of Nourish Kitchen. Passionate about sharing wholesome recipes and the joy of seasonal flavors.',
    location: 'Nairobi, Kenya',
    website: 'nourishkitchen.com/eli'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [stats, setStats] = useState<KitchenStats | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const statsData = await api.getStats();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load profile stats:', error);
      }
    }
    loadData();
  }, []);

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center p-20 text-center bg-stone-50 min-h-screen">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
           <UserIcon size={64} className="mx-auto text-stone-200 mb-6" />
           <p className="text-secondary font-serif text-xl italic mb-8">Please sign in to view your kitchen profile.</p>
           <button onClick={() => window.location.href = '/login'} className="bg-primary text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">Sign In</button>
        </motion.div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatePayload = {
        name: formData.name,
        bio: formData.bio,
      };

      let updatedUser: UserType;
      if (avatarFile) {
        const formDataUpload = new FormData();
        Object.entries(updatePayload).forEach(([key, value]) => {
          formDataUpload.append(key, value);
        });
        formDataUpload.append('avatar', avatarFile);
        updatedUser = await api.updateUser(user.id, formDataUpload);
      } else {
        updatedUser = await api.updateUser(user.id, {
          ...updatePayload,
          avatar: avatar
        });
      }
      
      updateUser(updatedUser);
      setNotification({ type: 'success', message: 'Kitchen profile updated successfully!' });
    } catch (error: any) {
      console.error('Profile update failed:', error);
      setNotification({ type: 'error', message: error.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you ready to sign out of the kitchen?')) {
      logout();
    }
  };

  return (
    <div className="flex-1 min-w-0 bg-background relative">
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%" }}
            className={`fixed top-24 left-1/2 z-50 px-8 py-4 rounded-[2rem] shadow-2xl font-bold text-sm flex items-center gap-4 ${
              notification.type === 'success' ? 'bg-[#1a382d] text-white border border-white/10' : 'bg-red-500 text-white'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {notification.message}
            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70 transition-opacity">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto px-4 md:px-12 py-10 md:py-20">
        <header className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-stone-100 flex-1" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">Profile Details</span>
            <div className="h-px bg-stone-100 flex-1" />
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight">Your Kitchen Profile</h1>
          <p className="text-secondary text-lg md:text-xl font-serif italic max-w-2xl leading-relaxed">
            Manage how you appear to others in our home kitchen community. 
          </p>
        </header>

        <div className="space-y-12">
          {/* Hero Section */}
          <section className="bg-white rounded-[3rem] border border-stone-100 shadow-xl shadow-stone-200/40 p-8 md:p-14 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32 -z-10" />
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
                <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] overflow-hidden border-8 border-stone-50 bg-stone-100 shadow-2xl relative rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <img 
                    src={avatar || "https://images.unsplash.com/photo-1577214714282-3626f284e3a4?auto=format&fit=crop&q=80&w=400"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#1a382d]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <Camera size={32} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Update Photo</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-primary border border-emerald-100 mb-6 font-black text-[10px] uppercase tracking-widest">
                  <Shield size={12} />
                  Verified Member Status
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 mb-4">{formData.name}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                  <div className="flex items-center gap-2 text-stone-400 font-sans font-bold text-xs uppercase tracking-widest">
                    <ChefHat size={14} className="text-primary" />
                    {formData.specialization}
                  </div>
                  <div className="flex items-center gap-2 text-stone-400 font-sans font-bold text-xs uppercase tracking-widest">
                    <MapPin size={14} className="text-primary" />
                    {formData.location}
                  </div>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 rounded-2xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-lg shadow-primary/10 active:scale-95"
                  >
                    Change Profile Photo
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="px-8 py-4 rounded-2xl border border-stone-200 text-stone-600 font-bold text-xs uppercase tracking-widest hover:bg-stone-50 transition-all active:scale-95"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Form & Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Form Details */}
            <section className="lg:col-span-8 space-y-12">
              <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-sm p-10 space-y-10">
                <h3 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-50 pb-6 mb-10 inline-block">Personal Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b58e3e]">Full Name</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-transparent border-b border-stone-100 py-4 pl-10 text-stone-700 font-sans font-bold focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b58e3e]">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-transparent border-b border-stone-100 py-4 pl-10 text-stone-700 font-sans font-bold focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b58e3e]">Specialization</label>
                    <div className="relative group">
                      <ChefHat className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="text" 
                        value={formData.specialization}
                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                        className="w-full bg-transparent border-b border-stone-100 py-4 pl-10 text-stone-700 font-sans font-bold focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b58e3e]">Kitchen Website</label>
                    <div className="relative group">
                      <Globe className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="text" 
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="w-full bg-transparent border-b border-stone-100 py-4 pl-10 text-stone-700 font-sans font-bold focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b58e3e]">Culinary Bio</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl p-6 text-stone-600 font-sans font-medium text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all resize-none italic leading-relaxed"
                  />
                </div>
              </div>
            </section>

            {/* Right Column: Mini Settings & Action */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="bg-[#1a382d] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-full blur-3xl -mr-16 -mt-16 opacity-30" />
                
                <h3 className="font-serif text-2xl font-bold mb-8">Account Settings</h3>
                <div className="space-y-4 mb-10">
                  {[
                    { icon: Shield, label: 'Security Key', active: true },
                    { icon: Bell, label: 'Kitchen Updates', active: true },
                    { icon: Globe, label: 'Public Profile', active: false },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <item.icon size={16} className={item.active ? 'text-emerald-400' : 'text-white/20'} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                      </div>
                      <div className={`w-8 h-4 rounded-full relative transition-colors ${item.active ? 'bg-emerald-500' : 'bg-white/10'}`}>
                         <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${item.active ? 'left-4.5' : 'left-0.5'}`} />
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                   onClick={handleSave}
                   disabled={isSaving}
                   className="w-full bg-emerald-500 text-[#1a382d] py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                   {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                   {isSaving ? 'Saving...' : 'Update Profile'}
                 </button>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-stone-100 p-10">
                <h4 className="font-serif text-lg font-bold text-stone-900 mb-6">Kitchen Activity</h4>
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-stone-50 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Recipes Shared</span>
                    <span className="font-serif font-bold text-xl text-primary">{stats?.totalRecipes || 0}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-stone-50 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Kitchen Friends</span>
                    <span className="font-serif font-bold text-xl text-primary">{stats?.totalSubscribers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Total Views</span>
                    <span className="font-serif font-bold text-xl text-primary">
                      {stats ? (stats.totalViews > 1000 ? (stats.totalViews / 1000).toFixed(1) + 'k' : stats.totalViews.toString()) : '0'}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
