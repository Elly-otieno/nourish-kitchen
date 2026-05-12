import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Facebook, Instagram, Twitter, Youtube, User, LogIn, LogOut, Settings, Menu, X, ChevronRight, Mail, Heart, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [footerEmail, setFooterEmail] = useState('');
  const [footerSuccess, setFooterSuccess] = useState(false);
  
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();

  const showSolidHeader = isScrolled || !['/', '/about', '/privacy', '/terms'].includes(location.pathname);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
    
    if (latest > lastScrollY && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(latest);
  });

  const handleFooterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (footerEmail) {
      setFooterSuccess(true);
      setFooterEmail('');
      setTimeout(() => setFooterSuccess(false), 3000);
    }
  };

  const categories = [
    { label: 'Breakfast', path: '/recipes?cat=breakfast' },
    { label: 'Dinner', path: '/recipes?cat=dinner' },
    { label: 'Desserts', path: '/recipes?cat=desserts' },
    { label: 'Family Favorites', path: '/recipes?cat=heritage' },
    { label: 'Kitchen Tips', path: '/recipes?cat=techniques' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-emerald-100">
      <AnimatePresence>
        {isBannerVisible && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-emerald-900 text-white py-2 px-6 flex items-center justify-center relative overflow-hidden"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
              Subscribe to our Newsletter for exclusive heritage recipes
            </p>
            <button 
              onClick={() => setIsBannerVisible(false)}
              className="absolute right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header 
        variants={{
          visible: { y: 0 },
          hidden: { y: -120 }
        }}
        animate={isVisible ? "visible" : "hidden"}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 transition-all duration-500 print:hidden ${
          showSolidHeader ? 'px-4 md:px-8 pt-4' : 'px-0 pt-0'
        }`}
      >
        <div className={`max-w-7xl mx-auto transition-all duration-500 flex items-center justify-between ${
          showSolidHeader 
            ? 'bg-white/70 backdrop-blur-xl border border-stone-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-6 md:px-10 h-16 md:h-20' 
            : 'bg-transparent px-6 md:px-12 h-20 md:h-28'
        }`}>
          <button 
            className="lg:hidden p-2 -ml-2 text-stone-900"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img src="/src/assets/logo.png" alt="Nourish Kitchen" className="h-12 md:h-16 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
            <Link 
              to="/"
              className={`text-[10px] xl:text-[11px] font-bold uppercase tracking-widest transition-all hover:text-emerald-600 ${
                location.pathname === '/' 
                  ? 'text-emerald-600' 
                  : (showSolidHeader ? 'text-stone-900' : 'text-white/80')
              }`}
            >
              Home
            </Link>

            <div 
              className="relative py-4"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <Link 
                to="/recipes"
                className={`text-[10px] xl:text-[11px] font-bold uppercase tracking-widest transition-all hover:text-emerald-600 flex items-center gap-1 ${
                  location.pathname.startsWith('/recipes') 
                    ? 'text-emerald-600' 
                    : (showSolidHeader ? 'text-stone-900' : 'text-white/80')
                }`}
              >
                Recipes
                <ChevronRight size={12} className={`transition-transform duration-300 ${isCategoriesOpen ? 'rotate-90' : ''}`} />
              </Link>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-0 w-48 bg-white shadow-2xl border border-stone-100 rounded-2xl overflow-hidden z-50 p-2"
                  >
                      <Link 
                        to="/recipes" 
                        className="block px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-900 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      >
                        All Recipes
                      </Link>
                      {categories.map((cat) => (
                        <Link 
                          key={cat.label} 
                          to={cat.path} 
                          className="block px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-stone-900 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          {cat.label}
                        </Link>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              to="/blog/all"
              className={`text-[10px] xl:text-[11px] font-bold uppercase tracking-widest transition-all hover:text-emerald-600 ${
                location.pathname.startsWith('/blog') 
                  ? 'text-emerald-600' 
                  : (showSolidHeader ? 'text-stone-900' : 'text-white/80')
              }`}
            >
              Journal
            </Link>

            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`text-[10px] xl:text-[11px] font-bold uppercase tracking-widest transition-all hover:text-emerald-600 flex items-center gap-2 ${
                showSolidHeader ? 'text-stone-900' : 'text-white/80'
              }`}
            >
              <Search size={14} /> Search
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div 
              className="relative py-4"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button 
                className="w-10 h-10 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all overflow-hidden border border-stone-100"
              >
                {user ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={20} strokeWidth={1.5} />
                )}
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-0 w-64 bg-white rounded-3xl shadow-2xl border border-stone-100 z-50 overflow-hidden"
                  >
                    {/*<div className="p-5 border-b border-stone-50 bg-stone-50/50 text-left">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
                        {user ? 'Welcome Back' : 'Join the Archives'}
                      </p>
                      <p className="text-sm font-bold text-stone-900 truncate">
                        {user ? user.name : 'Kitchen Guest'}
                      </p>
                    </div>*/}

                  <button 
                    onClick={() => {
                      setIsSearchOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="flex md:hidden items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all uppercase tracking-widest"
                  >
                    <Search size={14} /> Search
                  </button>
                  {user ? (
                    <div className="p-2 space-y-1">
                      {(user.role === 'ADMIN' || user.role === 'CHEF') ? (
                        <Link 
                          to="/dashboard" 
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all uppercase tracking-widest"
                        >
                          <Settings size={14} /> View Dashboard
                        </Link>
                      ) : (
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all uppercase tracking-widest"
                        >
                          <Settings size={14} /> My Profile
                        </Link>
                      )}
                      <Link 
                        to="/creations" 
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all uppercase tracking-widest"
                      >
                        <BookOpen size={14} /> My Creations
                      </Link>
                      <Link 
                        to="/creations" 
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all uppercase tracking-widest"
                      >
                        <Heart size={14} /> My Collection
                      </Link>
                      <button 
                        onClick={() => {
                          logout();
                          window.location.href = '/';
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest border border-transparent"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="p-2">
                      <Link 
                        to="/login"
                        className="w-full flex items-center justify-center gap-2 p-4 bg-emerald-950 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-lg"
                      >
                        <LogIn size={14} /> Sign In
                      </Link>
                    </div>
                  )}
                </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white p-6 md:p-20"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-12">
                <span className="font-serif text-2xl font-bold text-stone-300">Search Recipes</span>
                <button onClick={() => setIsSearchOpen(false)} className="p-2 text-stone-400 hover:text-emerald-600 transition-colors">
                  <X size={32} />
                </button>
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
                  if (query) {
                    window.location.href = `/recipes?q=${encodeURIComponent(query)}`;
                  }
                }}
                className="relative border-b-2 border-stone-100 focus-within:border-emerald-600 transition-colors py-4"
              >
                <input 
                  autoFocus
                  name="search"
                  type="text" 
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent text-3xl md:text-5xl font-serif focus:outline-none placeholder:text-stone-200"
                />
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-emerald-600">
                  <Search size={32} />
                </button>
              </form>
              <div className="mt-12">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6">Popular Searches</p>
                <div className="flex flex-wrap gap-3">
                  {['Sourdough Starter', 'Heritage Pilau', 'Vegan Stews', 'Spice Blends'].map(term => (
                    <button key={term} className="px-6 py-3 bg-stone-50 rounded-full text-xs font-bold text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all border border-stone-100">{term}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60]" 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-[70] p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                 <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                  <img src="/src/assets/logo.png" alt="Nourish Kitchen" className="h-10 w-auto" />
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-stone-400">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6 text-left">
                <Link 
                  to="/recipes" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-serif font-bold text-stone-900 hover:text-emerald-600 transition-colors"
                >
                  All Recipes
                </Link>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Categories</p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.path}
                      to={cat.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-sm font-bold text-stone-500 hover:text-emerald-600"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
                <Link 
                  to="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-serif font-bold text-stone-900 hover:text-emerald-600 transition-colors"
                >
                  About
                </Link>
              </div>

              <div className="mt-auto pt-8 border-t border-stone-100 flex gap-4">
                <a href="#" className="p-3 bg-stone-50 rounded-xl text-stone-400"><Instagram size={20} /></a>
                <a href="#" className="p-3 bg-stone-50 rounded-xl text-stone-400"><Facebook size={20} /></a>
                <a href="#" className="p-3 bg-stone-50 rounded-xl text-stone-400"><Twitter size={20} /></a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="bg-stone-50 border-t border-stone-100 pt-20 pb-12 px-6 md:px-12 print:hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
            <div className="lg:col-span-5 flex flex-col">
              <Link to="/" className="flex items-center gap-3 mb-8">
                <img src="/src/assets/logo.png" alt="Nourish Kitchen" className="h-12 md:h-16 w-auto" />
              </Link>
              <p className="text-stone-500 text-sm leading-relaxed mb-10 max-w-sm">
                Sharing wholesome recipes and the stories behind them. From our kitchen to yours, with love and seasonal ingredients.
              </p>
              
              {footerSuccess ? (
                <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-xs font-bold uppercase tracking-widest text-center border border-emerald-100">
                  Welcome to the Kitchen!
                </div>
              ) : (
                <form onSubmit={handleFooterSubscribe} className="relative group max-w-sm">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-600 transition-colors" />
                  <input 
                    type="email" 
                    required
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    placeholder="Your email address..." 
                    className="w-full bg-white border border-stone-200 rounded-2xl pl-12 pr-32 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-sans"
                  />
                  <button type="submit" className="absolute right-2 top-2 bottom-2 bg-emerald-950 text-white px-5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-colors">
                    Join
                  </button>
                </form>
              )}
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
              <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Explore</h4>
                <ul className="space-y-4">
                  {['All Recipes', 'New Arrivals', 'Trending Now', 'Hall of Fame', 'About Us', 'Contact'].map(item => (
                    <li key={item}>
                      <Link 
                        to={item === 'About Us' ? '/about' : item === 'Contact' ? '/contact' : '/recipes'} 
                        className="text-sm text-stone-500 hover:text-emerald-600 transition-colors font-medium"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Collections</h4>
                <ul className="space-y-4">
                  {['Heritage Pilau', 'Sourdough Secrets', 'Raw Desserts', 'Master Classes'].map(item => (
                    <li key={item}><Link to="/recipes" className="text-sm text-stone-500 hover:text-emerald-600 transition-colors font-medium">{item}</Link></li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-900/40">Network</h4>
                <div className="flex flex-wrap gap-4">
                  <a href="#" className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 hover:text-emerald-600 hover:shadow-lg transition-all"><Instagram size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 hover:text-emerald-600 hover:shadow-lg transition-all"><Facebook size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 hover:text-emerald-600 hover:shadow-lg transition-all"><Twitter size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 hover:text-[#E60023] hover:shadow-lg transition-all group relative" title="Pinterest">
                    <span className="text-[10px] font-black">P</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 hover:text-[#00ab6c] hover:shadow-lg transition-all group relative" title="Medium">
                    <span className="text-[10px] font-black">M</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 hover:text-[#FF6719] hover:shadow-lg transition-all group relative" title="Substack">
                    <span className="text-[10px] font-black">S</span>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-400 hover:text-emerald-600 hover:shadow-lg transition-all"><Youtube size={18} /></a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-stone-200/60 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">© {new Date().getFullYear()} NOURISH KITCHEN. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8">
              <Link to="/privacy" className="text-[10px] font-black text-stone-300 hover:text-emerald-900 uppercase tracking-[0.2em] transition-colors">Privacy</Link>
              <Link to="/cookies" className="text-[10px] font-black text-stone-300 hover:text-emerald-900 uppercase tracking-[0.2em] transition-colors">Cookies</Link>
              <Link to="/terms" className="text-[10px] font-black text-stone-300 hover:text-emerald-900 uppercase tracking-[0.2em] transition-colors">Terms</Link>
              <Link to="/contact" className="text-[10px] font-black text-stone-300 hover:text-emerald-900 uppercase tracking-[0.2em] transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

