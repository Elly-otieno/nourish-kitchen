import {
  Recipe,
  BlogPost,
  User,
  KitchenStats,
  Comment,
  UserRole,
  Subscriber,
  CommentReplyResponse,
} from "../types";

const API_BASE = "http://127.0.0.1:8000/api";

/**
 * Utility to manage headers and Auth tokens
 */
const getHeaders = (isFormData = false): HeadersInit => {
  const headers: HeadersInit = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  const token = localStorage.getItem("access_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Generic error handler for fetch responses
 */
const handleResponse = async (res: Response) => {
  if (res.status === 401) {
    localStorage.clear();
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));

    let errorMessage = errorData.detail || "An error occurred";

    if (typeof errorData === "object" && !errorData.detail) {
      const firstKey = Object.keys(errorData)[0];
      const firstError = errorData[firstKey];
      errorMessage = Array.isArray(firstError)
        ? `${firstKey}: ${firstError[0]}`
        : JSON.stringify(errorData);
    }

    throw new Error(errorMessage);
  }

  return res.status === 204 ? null : res.json();
};

export const api = {
  // --- Recipes ---
  async getRecipes(params?: { q?: string; cat?: string }): Promise<Recipe[]> {
    const url = new URL(`${API_BASE}/recipes/`);
    if (params?.q) url.searchParams.append("search", params.q);
    if (params?.cat) url.searchParams.append("categories", params.cat);

    const res = await fetch(url.toString(), { headers: getHeaders() });
    return handleResponse(res);
  },

  async getRecipe(id: string): Promise<Recipe> {
    const res = await fetch(`${API_BASE}/recipes/${id}/`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createRecipe(recipe: Partial<Recipe> | FormData): Promise<Recipe> {
    const isFormData = recipe instanceof FormData;
    const res = await fetch(`${API_BASE}/recipes/`, {
      method: "POST",
      headers: getHeaders(isFormData),
      body: isFormData ? recipe : JSON.stringify(recipe),
    });
    return handleResponse(res);
  },

  async updateRecipe(
    id: string,
    recipe: Partial<Recipe> | FormData,
  ): Promise<Recipe> {
    const isFormData = recipe instanceof FormData;
    const res = await fetch(`${API_BASE}/recipes/${id}/`, {
      method: "PATCH", // Using PATCH for partial production updates
      headers: getHeaders(isFormData),
      body: isFormData ? recipe : JSON.stringify(recipe),
    });
    return handleResponse(res);
  },

  async deleteRecipe(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/recipes/${id}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async permanentDeleteRecipe(id: string): Promise<void> {
    const url = `${API_BASE}/recipes/${id}/?permanent=true`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async toggleLikeRecipe(
    recipeId: string,
  ): Promise<{ liked: boolean; count: number }> {
    const res = await fetch(`${API_BASE}/recipes/${recipeId}/toggle-like/`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async restoreRecipe(id: string): Promise<Recipe> {
    const res = await fetch(`${API_BASE}/recipes/${id}/restore/`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // --- Blog Posts (Backend endpoint is /posts/) ---
  async getBlogs(): Promise<BlogPost[]> {
    const res = await fetch(`${API_BASE}/posts/`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async getBlog(id: string): Promise<BlogPost> {
    const res = await fetch(`${API_BASE}/posts/${id}/`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createBlog(blog: Partial<BlogPost> | FormData): Promise<BlogPost> {
    const isFormData = blog instanceof FormData;
    const res = await fetch(`${API_BASE}/posts/`, {
      method: "POST",
      headers: getHeaders(isFormData),
      body: isFormData ? blog : JSON.stringify(blog),
    });
    return handleResponse(res);
  },

   async updateBlog(
    id: string,
    blog: Partial<BlogPost> | FormData,
  ): Promise<BlogPost> {
    const isFormData = blog instanceof FormData;
    const res = await fetch(`${API_BASE}/posts/${id}/`, {
      method: "PATCH", 
      headers: getHeaders(isFormData),
      body: isFormData ? blog : JSON.stringify(blog),
    });
    return handleResponse(res);
  },

  async deleteBlog(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/posts/${id}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async restoreBlog(id: string): Promise<BlogPost> {
    const res = await fetch(`${API_BASE}/posts/${id}/restore/`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async permanentDeleteBlog(id: string): Promise<void> {
    const url = `${API_BASE}/posts/${id}/?permanent=true`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async toggleBookmarkBlog(id: string): Promise<{ bookmarked: boolean }> {
    const res = await fetch(`${API_BASE}/posts/${id}/toggle-bookmark/`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // --- Users & Authentication ---
  async login(
    email: string,
    password: string,
  ): Promise<{ access: string; refresh: string; user: User }> {
    const res = await fetch(`${API_BASE}/users/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await handleResponse(res);
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    return data;
  },

  async register(
    data: any,
  ): Promise<{ user: User; access: string; refresh: string }> {
    const res = await fetch(`${API_BASE}/users/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/users/me/`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users/`, { headers: getHeaders() });
    return handleResponse(res);
  },

  /**
   * Invites/Creates a new member inside the registry.
   */
  createUser: async (payload: {
    name: string;
    email: string;
    role: UserRole;
  }): Promise<User> => {
    const body = {
      name: payload.name,
      email: payload.email,
      role: payload.role,
      username: payload.email.split("@")[0],
    };

    const res = await fetch(`${API_BASE}/users/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    return handleResponse(res);
  },

  async updateUser(
    userId: string,
    payload: FormData | Record<string, any>,
  ): Promise<User> {
    const isFormData = payload instanceof FormData;

    const res = await fetch(`${API_BASE}/users/update-me/`, {
      method: "PATCH",
      headers: getHeaders(isFormData),
      body: isFormData ? payload : JSON.stringify(payload),
    });

    return handleResponse(res);
  },

  /**
   * Deletes a user by their unique identifier.
   */
  deleteUser: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/users/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(res);
  },

  /**
   * Verifies if an invitation token sent via email is valid and hasn't expired.
   * Typically used in a useEffect hook when the user lands on the registration page.
   * * @param token The raw validation token extracted from the URL query params
   */
  verifyInviteToken: async (
    token: string,
  ): Promise<{ email: string; role: UserRole; valid: boolean }> => {
    const res = await fetch(
      `${API_BASE}/auth/invite/verify/?token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    return handleResponse(res);
  },

  /**
   * Completes the invitation workflow by setting a password and profile configuration
   * for the invited kitchen staff member, changing their status to "active".
   */
  setupInvitedAccount: async (payload: {
    token: string;
    password: string;
    name?: string;
  }): Promise<User> => {
    const res = await fetch(`${API_BASE}/auth/invite/setup/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    return handleResponse(res);
  },

  /**
   * Initiates or executes a secure password recovery flow.
   * Can be used for both requesting a reset email or submitting the new password choice.
   */
  resetPassword: async (
    payload:
      | { email: string }
      | { token: string; uid: string; password_new: string },
  ): Promise<{ message: string; success: boolean }> => {
    // Determine context dynamically based on incoming fields
    const isExecution = "password_new" in payload;
    const targetEndpoint = isExecution
      ? "/auth/password-reset/confirm/"
      : "/auth/password-reset/request/";

    const res = await fetch(`${API_BASE}${targetEndpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    return handleResponse(res);
  },

  // --- Comments ---
  async createComment(comment: Partial<Comment>): Promise<Comment> {
    const res = await fetch(`${API_BASE}/comments/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(comment),
    });
    return handleResponse(res);
  },

  async approveComment(id: string): Promise<Comment> {
    const res = await fetch(`${API_BASE}/comments/${id}/approve/`, {
      method: "PATCH",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async replyToComment(
    commentId: number | string,
    content: string,
  ): Promise<CommentReplyResponse> {
    const res = await fetch(`${API_BASE}/comments/${commentId}/reply/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ content: content.trim() }),
    });

    return handleResponse(res);
  },

  async getComments(id: string): Promise<Comment[]> {
    const res = await fetch(`${API_BASE}/comments/${id}/`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getAllComments(): Promise<Comment[]> {
    const res = await fetch(`${API_BASE}/comments/`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async deleteComment(id: string): Promise<Comment> {
    const res = await fetch(`${API_BASE}/comments/${id}/delete/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // --- Newsletter ---
  async getNewsletterSubscribers(): Promise<Subscriber[]> {
    const res = await fetch(`${API_BASE}/newsletter/subscribers/`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async subscribeToNewsletter(email: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/newsletter/subscribe/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },

  async sendNewsletter(
    subject: string,
    content: string,
  ): Promise<{ status: string; count: number }> {
    const res = await fetch(`${API_BASE}/newsletter/send/`, {
      method: "POST",
      headers: {
        ...getHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject, content }),
    });

    return handleResponse(res);
  },

  // --- Stats & Admin ---
  async getStats(): Promise<KitchenStats> {
    const res = await fetch(`${API_BASE}/stats/`, { headers: getHeaders() });
    return handleResponse(res);
  },

  async getArchives(): Promise<{ recipes: Recipe[]; blogs: BlogPost[] }> {
    const res = await fetch(`${API_BASE}/archives/`, { headers: getHeaders() });
    return handleResponse(res);
  },
};
