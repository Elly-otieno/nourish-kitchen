import React, { useState } from 'react';
import { LayoutDashboard, FilePlus, BookOpen, MessageSquare, UserCircle, X, Newspaper, LogOut, Users, ChevronRight, ChefHat, Mail, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { logout, isAdmin, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Kitchen Overview', path: '/dashboard' },
    { icon: FilePlus, label: 'Add a Recipe', path: '/new' },
    { icon: BookOpen, label: 'My Kitchen Notes', path: '/creations' },
    { icon: Newspaper, label: 'Stories & Tips', path: '/blog' },
    { icon: ChefHat, label: 'The Pantry', path: '/ingredients' },
    { icon: MessageSquare, label: 'Kitchen Chat', path: '/comments' },
    { icon: Mail, label: 'Community Letters', path: '/newsletter' },
    { icon: Archive, label: 'Kitchen Archives', path: '/archives' },
  ];

  if (isAdmin) {
    navItems.push({ icon: Users, label: 'Kitchen Team', path: '/users' });
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className={`fixed lg:sticky inset-y-0 left-0 z-50 bg-stone-50 border-r border-stone-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <img src="/src/assets/logo.png" alt="Nourish" className={`${isCollapsed ? 'h-8' : 'h-12'} w-auto`} />
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="hidden lg:flex p-1.5 text-stone-300 hover:text-stone-600 transition-colors"
          >
            <ChevronRight className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} size={20} />
          </button>
          <button onClick={onClose} className="lg:hidden p-2 text-stone-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-10 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group relative ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700 font-bold' 
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900 font-medium'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} className="shrink-0" />
                {!isCollapsed && <span className="font-serif text-sm">{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-100">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-100 space-y-2">
          {!isCollapsed && user && (
            <div className="px-4 py-3 bg-stone-50 rounded-2xl mb-4 text-left">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
              <p className="text-xs font-bold text-stone-900 truncate">{user.username}</p>
            </div>
          )}
          <NavLink
            to="/profile"
            onClick={() => onClose()}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-stone-500 hover:bg-stone-50 hover:text-stone-900 transition-all font-bold group relative"
          >
            <UserCircle size={20} strokeWidth={1.5} className="shrink-0" />
            {!isCollapsed && <span className="font-serif text-sm">Profile Settings</span>}
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold group relative"
          >
            <LogOut size={20} strokeWidth={1.5} className="shrink-0" />
            {!isCollapsed && <span className="font-serif text-sm">Sign Out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
