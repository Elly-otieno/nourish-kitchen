export type UserRole = 'ADMIN' | 'CHEF' | 'USER';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  joinedAt: string;
  lastSeen?: string;
  status: 'active' | 'pending';
}

export interface Ingredient {
  id: string;
  qty: string;
  unit: string;
  customUnit?: string;
  category: string;
  name: string;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  image?: string;
}

export interface Recipe {
  id: string;
  title: string;
  story: string;
  authorId: string;
  authorName: string;
  prepTime: string;
  cuisine: string;
  categories: string[];
  heroImage: string;
  youtubeLink?: string;
  calories?: string;
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  ingredients: Ingredient[];
  steps: Step[];
  proTip: string;
  rating: number;
  views: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  heroImage: string;
  date: string;
  readingTime: string;
  syndicationLinks: {
    site: string;
    url: string;
  }[];
  isPublished: boolean;
  bookmarkedBy: string[];
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface Comment {
  id: string;
  entityId: string; // recipeId or blogId
  userId: string;
  userName: string;
  userAvatar: string;
  userEmail?: string;
  userWebsite?: string;
  rating?: number;
  content: string;
  type?: 'comment' | 'question';
  createdAt: string;
  isRead: boolean;
  parentId?: string;
  isApproved: boolean;
  isAnonymous: boolean;
}

export interface KitchenStats {
  totalRecipes: number;
  totalViews: number;
  unreadComments: number;
  totalComments: number;
  totalBlogs: number;
  totalUsers: number;
  totalSubscribers: number;
}
