import { Bell, Menu, User, Settings, LogOut, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, login, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <header className="h-16 md:h-20 flex justify-between items-center px-4 md:px-12 sticky top-0 bg-background/80 backdrop-blur-md z-30 border-b border-stone-100/50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu size={20} className="text-stone-600" />
        </button>
        <Link to="/" className="hidden md:block">
           <img src="/assets/logo.png" alt="Nourish" className="h-10 w-auto" />
        </Link>
        <span className="text-stone-400 font-serif text-[10px] md:text-sm truncate">Today is {today}</span>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative cursor-pointer group p-2">
          <Bell size={20} className="text-stone-500 group-hover:text-primary transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-background"></span>
        </div>
        
        <div 
          className="relative flex items-center gap-3 pl-2 md:pl-4 border-l border-stone-200 py-4"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button 
            className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-stone-200 bg-stone-100 hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer"
          >
            {user ? (
              <img 
                src={user.avatar || ''} 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400">
                <User size={20} />
              </div>
            )}
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-0 w-56 bg-white rounded-2xl shadow-2xl border border-stone-100 z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-stone-50 bg-stone-50/50">
                  <p className="text-[10px] text-stone-400 truncate">{user ? user.email : 'Sign in'}</p>
                </div>
                
                <div className="p-2">
                  {user ? (
                    <>
                      <Link 
                        to="/profile" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-stone-600 hover:bg-stone-50 hover:text-primary transition-all font-medium"
                      >
                        <User size={16} /> View Profile
                      </Link>
                      {(user.role === 'ADMIN' || user.role === 'CHEF') ? (
                        <Link 
                          to="/dashboard" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-stone-600 hover:bg-stone-50 hover:text-primary transition-all font-medium"
                        >
                          <Settings size={16} /> Dashboard
                        </Link>
                      ) : (
                        <Link 
                          to="/" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-stone-600 hover:bg-stone-50 hover:text-primary transition-all font-medium"
                        >
                          <Settings size={16} /> Go to Home
                        </Link>
                      )}
                      <button 
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                          window.location.href = '/';
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all font-medium"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/login"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-primary hover:bg-[#e7f0e4] transition-all font-bold"
                    >
                      <LogIn size={16} /> Sign In
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
