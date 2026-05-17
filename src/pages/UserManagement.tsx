import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, Shield, UserPlus, Search, Trash2, Mail, BadgeCheck, X } from 'lucide-react';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { User, UserRole } from '../types';

export function UserManagement() {
  const { user, isAdmin: isAuthAdmin } = useAuth();
  const queryClient = useQueryClient();
  
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', role: 'CHEF' as UserRole });
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch Users Query
  const { data: users = [], isLoading } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const data = await api.getUsers();
      // Handle potential pagination payload wrappers safely
      if (Array.isArray(data)) return data;
      if (data && typeof data === 'object' && Array.isArray((data as any).results)) {
        return (data as any).results;
      }
      return [];
    },
    enabled: !!isAuthAdmin, // Only run if the user is verified as an admin
  });

  // Create User Mutation
  const createUserMutation = useMutation({
    mutationFn: (newMember: { name: string; email: string; role: UserRole }) => api.createUser(newMember),
    onSuccess: (newUser) => {
      // Optimistically update or invalidate cache
      queryClient.setQueryData(['users'], (oldUsers: User[] | undefined) => {
        return oldUsers ? [newUser, ...oldUsers] : [newUser];
      });
      
      setSuccessMsg(`Invitation sent to ${newUserData.email}!`);
      setTimeout(() => {
        setSuccessMsg('');
        setShowAddModal(false);
        setNewUserData({ name: '', email: '', role: 'CHEF' });
      }, 3000);
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to add member');
    }
  });

  // 3. Delete User Mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['users'], (oldUsers: User[] | undefined) => {
        return oldUsers ? oldUsers.filter(u => u.id !== deletedId) : [];
      });
    },
    onError: (error: any) => {
      console.error('User deletion failed:', error);
      alert(error.message || 'The server encountered an error while trying to remove this member.');
    }
  });

  // Authorization Shield guard clause
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

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(newUserData);
  };

  const removeUser = (id: string) => {
    if (id === user?.id) {
      alert("You cannot remove your own administrative access while logged in.");
      return;
    }

    if (confirm('Are you sure you want to remove this member from the kitchen?')) {
      deleteUserMutation.mutate(id);
    }
  };

  // Safe case-insensitive string parsing
  const filteredUsers = users.filter(u => 
    (u.username || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase())
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
            <div className="h-10 w-px bg-stone-200" />
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Active Now</p>
              <p className="font-serif text-2xl font-bold text-emerald-600">1</p>
            </div>
          </div>
        </div>

        {/* Users Table Container */}
        <div className="bg-white rounded-[2.5rem] border border-stone-100 overflow-hidden shadow-sm">
          {isLoading ? (
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
                  {filteredUsers.map((item: User) => (
                    <tr key={item.id} className="group hover:bg-stone-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-primary font-bold text-xs border border-stone-200 shadow-sm overflow-hidden">
                            {item.avatar ? (
                              <img src={item.avatar} alt={item.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              (item.username || item.username || 'U').charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-serif font-bold text-stone-900">{item.username}</p>
                            <p className="text-xs text-stone-400">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          item.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {item.role === 'ADMIN' && <BadgeCheck size={12} />}
                          {item.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`flex items-center gap-2 text-xs font-medium ${
                          item.status === 'active' ? 'text-emerald-600' : 'text-amber-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                          {item.status === 'active' ? 'Verified' : 'Invited'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-xs text-stone-400 italic">
                        {item.last_seen || 'Never'}
                      </td>
                      <td className="px-8 py-6">
                        {item.id !== '1' && (
                          <button 
                            onClick={() => removeUser(item.id)}
                            disabled={deleteUserMutation.isPending && deleteUserMutation.variables === item.id}
                            className="p-2 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 disabled:text-stone-200 transition-all"
                          >
                            {deleteUserMutation.isPending && deleteUserMutation.variables === item.id ? (
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

                {successMsg && (
                  <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold text-center">
                    {successMsg}
                  </div>
                )}

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
                    disabled={createUserMutation.isPending}
                    className="w-full bg-primary disabled:bg-stone-300 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-900 transition-all mt-4 shadow-lg shadow-primary/20"
                  >
                    {createUserMutation.isPending ? 'Adding...' : 'Add to Kitchen'}
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