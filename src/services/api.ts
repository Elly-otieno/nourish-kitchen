import { Recipe, BlogPost, User, KitchenStats, Comment, UserRole } from '../types';

const API_BASE = '/api';

export const api = {
  // Recipes
  async getRecipes(params?: { q?: string; cat?: string }): Promise<Recipe[]> {
    const url = new URL(`${window.location.origin}${API_BASE}/recipes`);
    if (params?.q) url.searchParams.append('q', params.q);
    if (params?.cat) url.searchParams.append('cat', params.cat);
    
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch recipes');
    return res.json();
  },

  async getRecipe(id: string): Promise<Recipe> {
    const res = await fetch(`${API_BASE}/recipes/${id}`);
    if (!res.ok) throw new Error('Failed to fetch recipe');
    return res.json();
  },

  async createRecipe(recipe: Partial<Recipe> | FormData): Promise<Recipe> {
    const isFormData = recipe instanceof FormData;
    const res = await fetch(`${API_BASE}/recipes`, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? recipe : JSON.stringify(recipe),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Recipe creation failed:', errorData);
      throw new Error(errorData.error || 'Failed to create recipe');
    }
    return res.json();
  },

  async updateRecipe(id: string, recipe: Partial<Recipe> | FormData): Promise<Recipe> {
    const isFormData = recipe instanceof FormData;
    const res = await fetch(`${API_BASE}/recipes/${id}`, {
      method: 'PUT',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? recipe : JSON.stringify(recipe),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Recipe update failed:', errorData);
      throw new Error(errorData.error || 'Failed to update recipe');
    }
    return res.json();
  },

  async deleteRecipe(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/recipes/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete recipe');
  },

  async restoreRecipe(id: string): Promise<Recipe> {
    const res = await fetch(`${API_BASE}/recipes/${id}/restore`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to restore recipe');
    return res.json();
  },

  async permanentDeleteRecipe(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/recipes/${id}/permanent`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to permanently delete recipe');
  },
  
  async toggleLikeRecipe(id: string, userId: string): Promise<Recipe> {
    const res = await fetch(`${API_BASE}/recipes/${id}/toggle-like`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to toggle like');
    return res.json();
  },

  // Blogs
  async getBlogs(): Promise<BlogPost[]> {
    const res = await fetch(`${API_BASE}/blogs`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  },

  async getBlog(id: string): Promise<BlogPost> {
    const res = await fetch(`${API_BASE}/blogs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch blog');
    return res.json();
  },

  async createBlog(blog: Partial<BlogPost> | FormData): Promise<BlogPost> {
    const isFormData = blog instanceof FormData;
    const res = await fetch(`${API_BASE}/blogs`, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? blog : JSON.stringify(blog),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Blog creation failed:', errorData);
      throw new Error(errorData.error || 'Failed to create blog');
    }
    return res.json();
  },

  async updateBlog(id: string, blog: Partial<BlogPost> | FormData): Promise<BlogPost> {
    const isFormData = blog instanceof FormData;
    const res = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'PUT',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? blog : JSON.stringify(blog),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Blog update failed:', errorData);
      throw new Error(errorData.error || 'Failed to update blog');
    }
    return res.json();
  },

  async deleteBlog(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/blogs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete blog');
  },

  async restoreBlog(id: string): Promise<BlogPost> {
    const res = await fetch(`${API_BASE}/blogs/${id}/restore`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to restore blog');
    return res.json();
  },

  async permanentDeleteBlog(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/blogs/${id}/permanent`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to permanently delete blog');
  },

  async toggleBookmarkBlog(id: string, userId: string): Promise<BlogPost> {
    const res = await fetch(`${API_BASE}/blogs/${id}/toggle-bookmark`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    return res.json();
  },

  // Users
  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  async createUser(data: { name: string; email: string; role: UserRole }): Promise<User> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create user');
    }
    return res.json();
  },

  async deleteUser(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete user');
    }
  },

  async verifyInviteToken(token: string): Promise<{ email: string; name: string }> {
    const res = await fetch(`${API_BASE}/invite/verify/${token}`);
    if (!res.ok) throw new Error('Invalid token');
    return res.json();
  },

  async setupInvitedAccount(data: any): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/invite/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to setup account');
    }
    return res.json();
  },

  async updateUser(id: string, data: Partial<User> | FormData): Promise<User> {
    const isFormData = data instanceof FormData;
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PATCH',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('User update failed:', errorData);
      throw new Error(errorData.error || 'Failed to update user');
    }
    return res.json();
  },

  // Comments
  async getComments(): Promise<Comment[]> {
    const res = await fetch(`${API_BASE}/comments`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return res.json();
  },

  async createComment(comment: Partial<Comment>): Promise<Comment> {
    const res = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    if (!res.ok) throw new Error('Failed to create comment');
    return res.json();
  },

  async approveComment(id: string): Promise<Comment> {
    const res = await fetch(`${API_BASE}/comments/${id}/approve`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed to approve comment');
    return res.json();
  },

  async deleteComment(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/comments/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete comment');
  },

  // Auth
  async register(data: any): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Registration failed');
    }
    return res.json();
  },

  async login(email: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Failed to request password reset');
    return res.json();
  },

  async resetPassword(data: { token: string; password: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to reset password');
    return res.json();
  },

  // Stats
  async getStats(): Promise<KitchenStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async subscribeToNewsletter(email: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Subscription failed');
    return res.json();
  },

  async getNewsletterSubscribers(): Promise<{ email: string; date: string }[]> {
    const res = await fetch(`${API_BASE}/newsletter/subscribers`);
    if (!res.ok) throw new Error('Failed to fetch subscribers');
    return res.json();
  },

  async getArchives(): Promise<{ recipes: Recipe[]; blogs: BlogPost[] }> {
    const res = await fetch(`${API_BASE}/archives`);
    if (!res.ok) throw new Error('Failed to fetch archives');
    return res.json();
  },

  async sendNewsletter(subject: string, content: string): Promise<{ success: boolean; count: number }> {
    const res = await fetch(`${API_BASE}/newsletter/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, content }),
    });
    if (!res.ok) throw new Error('Failed to send newsletter');
    return res.json();
  }
};
