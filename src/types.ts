export type UserRole = 'ADMIN' | 'CHEF' | 'USER';

export interface User {
  id: number; 
  username: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  bio?: string | null;
  joined_at: string; 
  last_seen?: string | null;
  status: string; 
}

export interface Ingredient {
  id: number;
  qty: string;
  unit: string;
  custom_unit?: string | null;
  category: string;
  name: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  image?: string | null;
}

export interface Recipe {
  id: number;
  title: string;
  story: string;
  author: number; 
  author_name?: string; 
  prep_time: string; 
  cuisine: string;
  categories: string[]; 
  hero_image: string | null; 
  youtube_link?: string | null; 
  calories?: string | null;
  spice_level?: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  ingredients: Ingredient[]; 
  steps: Step[];             
  pro_tip: string; 
  rating: number; 
  views: number;
  liked_by: number[]; 
  liked_by_count?: number; 
  updated_at: string;
  is_published: boolean;
  is_deleted: boolean; 
  deleted_at?: string | null; 
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: number; 
  author_name?: string; 
  hero_image: string;
  date: string; 
  reading_time: string; 
  syndication_links: string[]; 
  is_published: boolean;
  bookmarked_by: number[]; 
  is_deleted: boolean;
  created_at: string;
  deleted_at?: string | null;
}

export interface Comment {
  id: number;
  recipe: number | null; 
  blog_post: number | null; 
  user: number | null; 
  user_name: string;
  user_avatar: string;
  user_email?: string | null;
  user_website?: string | null;
  rating?: number | null;
  content: string;
  type: string; 
  created_at: string;
  is_read: boolean;
  parent?: number | null; 
  is_approved: boolean;
  is_anonymous: boolean;
}

export interface KitchenStats {
  total_recipes: number;
  total_views: number;
  unread_comments: number;
  total_comments: number;
  total_blogs: number;
  total_users: number;
  total_subscribers: number;
}
