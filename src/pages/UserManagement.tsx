import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, Shield, UserPlus, Search, Trash2, Mail, BadgeCheck, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { User, UserRole } from '../types';

export function UserManagement() {
  const { user, isAdmin: isAuthAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', role: 'CHEF' as UserRole });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await api.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    }
    if (isAuthAdmin) loadUsers();
  }, [isAuthAdmin]);

  if (!isAuthAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-center">
        <div className="max-w-md">
          <Shield size={48} className="mx-auto text-red-500 mb-6 opacity-20" />
          <h2 className="font-serif text-3xl font-bold text-stone-900 mb-4">Forbidden Entry</h2>
          <p className="text-stone-500">Only administrators can access the staff registry. Please consult with leadership if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newUser = await api.createUser(newUserData);
      setUsers([newUser, ...users]);
      setSuccessMsg(`Invitation sent to ${newUserData.email}!`);
      setTimeout(() => {
        setSuccessMsg('');
        setShowAddModal(false);
        setNewUserData({ name: '', email: '', role: 'CHEF' });
      }, 3000);
    } catch (error: any) {
      alert(error.message || 'Failed to add member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const removeUser = async (id: string) => {
    if (id === user?.id) {
      alert("You cannot remove your own administrative access while logged in.");
      return;
    }

    if (confirm('Are you sure you want to remove this member from the kitchen?')) {
      setDeletingId(id);
      try {
        await api.deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
        // Add a small success notification if we had one, but we'll just rely on the list update for now
      } catch (error: any) {
        console.error('User deletion failed:', error);
        alert(error.message || 'The server encountered an error while trying to remove this member. Please try again.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 min-w-0 bg-background">
      <main className="max-w-6xl mx-auto px-4 md:px-12 py-10 md:py-16">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">Staff Registry</h1>
            <p className="text-secondary text-lg">Manage the culinary minds behind Nourish Kitchen.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-lg active:scale-95"
          >
            <UserPlus size={16} /> Add Member
          </button>
        </header>

        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
          <div className="md:col-span-8 relative">
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-stone-100 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={20} />
          </div>
          <div className="md:col-span-4 flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Staff</p>
              <p className="font-serif text-2xl font-bold text-primary">{users.length}</p>
            </div>
            <div className="h-10 w-[1px] bg-stone-200" />
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Active Now</p>
              <p className="font-serif text-2xl font-bold text-emerald-600">1</p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2.5rem] border border-stone-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-10 h-10 border-4 border-stone-100 border-t-stone-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-stone-400 font-serif italic">Loading registry...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50/50">
                    <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Member</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Role</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Last Access</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-stone-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-primary font-bold text-xs border border-stone-200 shadow-sm overflow-hidden">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              user.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-serif font-bold text-stone-900">{user.name}</p>
                            <p className="text-xs text-stone-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {user.role === 'ADMIN' && <BadgeCheck size={12} />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`flex items-center gap-2 text-xs font-medium ${
                          user.status === 'active' ? 'text-emerald-600' : 'text-amber-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                          {user.status === 'active' ? 'Verified' : 'Invited'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-xs text-stone-400 italic">
                        {user.lastSeen}
                      </td>
                      <td className="px-8 py-6">
                        {user.id !== '1' && (
                          <button 
                            onClick={() => removeUser(user.id)}
                            disabled={deletingId === user.id}
                            className={`p-2 rounded-lg transition-all ${
                              deletingId === user.id 
                                ? 'text-stone-300' 
                                : 'text-stone-300 hover:text-red-500 hover:bg-red-50'
                            }`}
                          >
                            {deletingId === user.id ? (
                              <div className="w-4 h-4 border-2 border-stone-200 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add User Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-serif text-2xl font-bold text-stone-900">New Member</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-stone-300 hover:text-stone-900"><X size={20} /></button>
                </div>

                <form onSubmit={handleAddUser} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-stone-400">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={newUserData.name}
                      onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                      placeholder="Chef Name"
                      className="w-full border-b border-stone-100 py-2 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-stone-400">Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-0 bottom-3 text-stone-300" />
                      <input 
                        required
                        type="email" 
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                        placeholder="chef@nourish.lab"
                        className="w-full border-b border-stone-100 py-2 pl-6 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-stone-400">Kitchen Role</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => setNewUserData({...newUserData, role: 'CHEF'})}
                        className={`p-4 rounded-2xl border text-center transition-all ${
                          newUserData.role === 'CHEF' ? 'border-primary bg-[#e7f0e4] text-primary' : 'border-stone-100 text-stone-400'
                        }`}
                      >
                        <UserIcon size={20} className="mx-auto mb-2" />
                        <span className="block text-[10px] font-bold uppercase">Heritage Chef</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNewUserData({...newUserData, role: 'ADMIN'})}
                        className={`p-4 rounded-2xl border text-center transition-all ${
                          newUserData.role === 'ADMIN' ? 'border-primary bg-[#e7f0e4] text-primary' : 'border-stone-100 text-stone-400'
                        }`}
                      >
                        <Shield size={20} className="mx-auto mb-2" />
                        <span className="block text-[10px] font-bold uppercase">Administrator</span>
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-900 transition-all mt-4 shadow-lg shadow-primary/20"
                  >
                    Add to Kitchen
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
