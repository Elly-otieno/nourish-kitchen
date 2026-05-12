import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import { MOCK_RECIPES, MOCK_BLOGS, MOCK_USERS, MOCK_COMMENTS, MOCK_STATS } from "./src/constants/mockData.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // In-memory data store initialized with mock data
  let recipes = MOCK_RECIPES.map(r => ({
    ...r,
    calories: r.calories || (Math.floor(Math.random() * 500) + 200) + ' kcal',
    spiceLevel: r.spiceLevel || (['Mild', 'Medium', 'Hot'][Math.floor(Math.random() * 3)] as any),
    isDeleted: false,
    deletedAt: undefined
  }));
  let blogs = MOCK_BLOGS.map(b => ({ ...b, bookmarkedBy: [], isDeleted: false, deletedAt: undefined }));
  let users = [...MOCK_USERS];
  let comments = MOCK_COMMENTS.map(c => ({ 
    ...c, 
    isApproved: true, 
    isAnonymous: false 
  }));
  let newsletterSubscriptions: { email: string; date: string }[] = [];
  
  const catchyPhrases = [
    "A dash of love makes everything taste better. Enjoy!",
    "Good food is all about good vibes and fresh spices.",
    "The secret ingredient is always a bit of patience. Made with love.",
    "Serve hot and share with someone you love.",
    "Cooking is a form of celebration—enjoy every bite!",
    "From our kitchen to yours, may this bring warmth to your table."
  ];

  // API Routes
  
  app.post("/api/subscribe", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!newsletterSubscriptions.find(s => s.email === email)) {
      newsletterSubscriptions.push({ 
        email, 
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
      });
    }
    res.status(200).json({ success: true });
  });

  app.get("/api/newsletter/subscribers", (req, res) => {
    res.json(newsletterSubscriptions);
  });

  app.post("/api/newsletter/send", (req, res) => {
    const { subject, content } = req.body;
    console.log(`Sending newsletter: ${subject} to ${newsletterSubscriptions.length} subscribers`);
    // Mock success
    res.json({ success: true, count: newsletterSubscriptions.length });
  });
  
  // Recipes
  app.get("/api/recipes", (req, res) => {
    let filtered = recipes.filter(r => !r.isDeleted);
    const { q, cat } = req.query;

    if (cat) {
      filtered = filtered.filter(r => r.categories.some(c => c.toLowerCase() === (cat as string).toLowerCase()));
    }

    if (q) {
      const search = (q as string).toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(search) || 
        r.story.toLowerCase().includes(search) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(search))
      );
    }

    res.json(filtered);
  });

  app.get("/api/recipes/:id", (req, res) => {
    const recipe = recipes.find(r => r.id === req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    
    // Increment view count if not deleted
    if (!recipe.isDeleted) {
      recipe.views = (recipe.views || 0) + 1;
    }
    res.json(recipe);
  });

  app.post("/api/recipes", upload.single('heroImage'), (req, res) => {
    try {
      const body = req.body;
      if (!body.title) return res.status(400).json({ error: "Title is required" });
      
      const heroImage = req.file ? `/uploads/${req.file.filename}` : (body.heroImage || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80');
      const defaultProTip = catchyPhrases[Math.floor(Math.random() * catchyPhrases.length)];

      const newRecipe = {
        ...body,
        id: Math.random().toString(36).substr(2, 9),
        heroImage,
        categories: typeof body.categories === 'string' ? JSON.parse(body.categories) : (body.categories || []),
        ingredients: typeof body.ingredients === 'string' ? JSON.parse(body.ingredients) : (body.ingredients || []),
        steps: typeof body.steps === 'string' ? JSON.parse(body.steps) : (body.steps || []),
        proTip: body.proTip || defaultProTip,
        isPublished: body.isPublished === 'true' || body.isPublished === true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        views: 0,
        rating: 5.0,
        likedBy: [],
        isDeleted: false
      };
      recipes.unshift(newRecipe);
      res.status(201).json(newRecipe);
    } catch (err) {
      console.error('Error creating recipe:', err);
      res.status(500).json({ error: "Failed to create recipe due to data processing error" });
    }
  });

  app.put("/api/recipes/:id", upload.single('heroImage'), (req, res) => {
    const index = recipes.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
      const body = req.body;
      const heroImage = req.file ? `/uploads/${req.file.filename}` : body.heroImage;
      
      const defaultProTip = catchyPhrases[Math.floor(Math.random() * catchyPhrases.length)];
      
      const updatedData = {
        ...body,
        heroImage,
        categories: typeof body.categories === 'string' ? JSON.parse(body.categories) : body.categories,
        ingredients: typeof body.ingredients === 'string' ? JSON.parse(body.ingredients) : body.ingredients,
        steps: typeof body.steps === 'string' ? JSON.parse(body.steps) : body.steps,
        proTip: body.proTip || recipes[index].proTip || defaultProTip,
        isPublished: body.isPublished !== undefined ? (body.isPublished === 'true' || body.isPublished === true) : recipes[index].isPublished,
        updatedAt: new Date().toISOString().split('T')[0]
      };

      recipes[index] = { ...recipes[index], ...updatedData };
      res.json(recipes[index]);
    } else {
      res.status(404).json({ error: "Recipe not found" });
    }
  });

  app.delete("/api/recipes/:id", (req, res) => {
    const index = recipes.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
      recipes[index].isDeleted = true;
      recipes[index].deletedAt = new Date().toISOString();
      res.status(200).json({ success: true, message: "Recipe moved to archives" });
    } else {
      res.status(404).json({ error: "Recipe not found" });
    }
  });

  app.post("/api/recipes/:id/restore", (req, res) => {
    const index = recipes.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
      recipes[index].isDeleted = false;
      recipes[index].deletedAt = undefined;
      res.json(recipes[index]);
    } else {
      res.status(404).json({ error: "Recipe not found" });
    }
  });

  app.delete("/api/recipes/:id/permanent", (req, res) => {
    recipes = recipes.filter(r => r.id !== req.params.id);
    res.status(204).end();
  });

  app.patch("/api/recipes/:id/toggle-like", (req, res) => {
    const { userId } = req.body;
    const index = recipes.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
      const recipe = recipes[index];
      if (!recipe.likedBy) recipe.likedBy = [];
      
      const userIndex = recipe.likedBy.indexOf(userId);
      if (userIndex === -1) {
        recipe.likedBy.push(userId);
      } else {
        recipe.likedBy.splice(userIndex, 1);
      }
      
      res.json(recipe);
    } else {
      res.status(404).json({ error: "Recipe not found" });
    }
  });

  // Blogs
  app.get("/api/blogs", (req, res) => {
    res.json(blogs.filter(b => !b.isDeleted));
  });

  app.delete("/api/blogs/:id", (req, res) => {
    const index = blogs.findIndex(b => b.id === req.params.id);
    if (index !== -1) {
      blogs[index].isDeleted = true;
      blogs[index].deletedAt = new Date().toISOString();
      res.status(200).json({ success: true, message: "Blog moved to archives" });
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  });

  app.post("/api/blogs/:id/restore", (req, res) => {
    const index = blogs.findIndex(b => b.id === req.params.id);
    if (index !== -1) {
      blogs[index].isDeleted = false;
      blogs[index].deletedAt = undefined;
      res.json(blogs[index]);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  });

  app.delete("/api/blogs/:id/permanent", (req, res) => {
    blogs = blogs.filter(b => b.id !== req.params.id);
    res.status(204).end();
  });

  app.get("/api/blogs/:id", (req, res) => {
    const blog = blogs.find(b => b.id === req.params.id);
    if (blog) res.json(blog);
    else res.status(404).json({ error: "Blog post not found" });
  });

  app.put("/api/blogs/:id", upload.single('heroImage'), (req, res) => {
    const index = blogs.findIndex(b => b.id === req.params.id);
    if (index !== -1) {
      const body = req.body;
      const heroImage = req.file ? `/uploads/${req.file.filename}` : body.heroImage;
      
      const updatedData = {
        ...body,
        heroImage,
        syndicationLinks: typeof body.syndicationLinks === 'string' ? JSON.parse(body.syndicationLinks) : body.syndicationLinks,
        isPublished: body.isPublished !== undefined ? (body.isPublished === 'true' || body.isPublished === true) : blogs[index].isPublished,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      blogs[index] = { ...blogs[index], ...updatedData };
      res.json(blogs[index]);
    } else {
      res.status(404).json({ error: "Blog post not found" });
    }
  });

  app.patch("/api/blogs/:id/toggle-bookmark", (req, res) => {
    const { userId } = req.body;
    const index = blogs.findIndex(b => b.id === req.params.id);
    if (index !== -1) {
      const blog = blogs[index];
      if (!blog.bookmarkedBy) blog.bookmarkedBy = [];
      const userIdx = blog.bookmarkedBy.indexOf(userId);
      if (userIdx === -1) {
        blog.bookmarkedBy.push(userId);
      } else {
        blog.bookmarkedBy.splice(userIdx, 1);
      }
      res.json(blog);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  });

  app.post("/api/blogs", upload.single('heroImage'), (req, res) => {
    try {
      const body = req.body;
      if (!body.title) return res.status(400).json({ error: "Title and content are required" });

      const heroImage = req.file ? `/uploads/${req.file.filename}` : (body.heroImage || 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80');

      const newBlog = {
        ...body,
        id: Math.random().toString(36).substr(2, 9),
        heroImage,
        syndicationLinks: typeof body.syndicationLinks === 'string' ? JSON.parse(body.syndicationLinks) : (body.syndicationLinks || []),
        isPublished: body.isPublished === 'true' || body.isPublished === true,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        bookmarkedBy: [],
        isDeleted: false
      };
      blogs.unshift(newBlog);
      res.status(201).json(newBlog);
    } catch (err) {
      console.error('Error creating blog:', err);
      res.status(500).json({ error: "Failed to create journal entry due to processing error" });
    }
  });

  // Users
  let inviteTokens = new Map<string, string>(); // token -> email

  app.get("/api/users", (req, res) => {
    res.json(users);
  });

  app.post("/api/users", (req, res) => {
    const { name, email, role } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email are required" });
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: "Member already exists" });
    }

    const token = Math.random().toString(36).substr(2, 12);
    inviteTokens.set(token, email);

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: role || 'CHEF',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      status: 'pending' as const,
      joinedAt: new Date().toISOString().split('T')[0],
      lastSeen: 'Never',
      bio: "New joiner in the kitchen!"
    };

    users.push(newUser);
    
    console.log(`[MAIL MOCK] To: ${email} - Welcome to Nourish Kitchen! Set up your account here: http://localhost:3000/setup-account?token=${token}`);

    res.status(201).json({ ...newUser, inviteToken: token });
  });

  app.get("/api/invite/verify/:token", (req, res) => {
    const email = inviteTokens.get(req.params.token);
    if (!email) return res.status(404).json({ error: "Invalid or expired token" });
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ email: user.email, name: user.name });
  });

  app.post("/api/invite/setup", (req, res) => {
    const { token, password, name } = req.body;
    const email = inviteTokens.get(token);
    if (!email) return res.status(400).json({ error: "Invalid token" });

    const user = users.find(u => u.email === email);
    if (user) {
      user.status = 'active';
      user.name = name || user.name;
      // In a real app we'd save the password hash here
      inviteTokens.delete(token);
      res.json({ success: true, user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    console.log(`[USER] Request to delete user ID: ${id}`);
    
    if (id === '1') {
      console.log(`[USER] Deletion blocked: Master Chef (ID unit 1) protection`);
      return res.status(400).json({ error: "Cannot remove the master chef" });
    }
    
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      console.log(`[USER] Deleted user: ${users[index].name} (${users[index].email})`);
      users.splice(index, 1);
      res.status(204).end();
    } else {
      console.log(`[USER] Deletion failed: User ID ${id} not found`);
      res.status(404).json({ error: "User not found" });
    }
  });

  // Comments
  app.get("/api/comments", (req, res) => {
    res.json(comments);
  });

  app.post("/api/comments", (req, res) => {
    const newComment = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isRead: false,
      isApproved: (req.body.isAnonymous || !req.body.userId || req.body.userId === 'guest') ? false : true
    };
    comments.push(newComment);
    res.status(201).json(newComment);
  });

  app.patch("/api/comments/:id/approve", (req, res) => {
    const index = comments.findIndex(c => c.id === req.params.id);
    if (index !== -1) {
      comments[index].isApproved = true;
      res.json(comments[index]);
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  });

  app.delete("/api/comments/:id", (req, res) => {
    comments = comments.filter(c => c.id !== req.params.id);
    res.status(204).end();
  });

  app.patch("/api/users/:id", upload.single('avatar'), (req, res) => {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index !== -1) {
      const body = req.body;
      const avatar = req.file ? `/uploads/${req.file.filename}` : body.avatar;
      
      users[index] = { ...users[index], ...body, avatar };
      res.json(users[index]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Archives
  app.get("/api/archives", (req, res) => {
    res.json({
      recipes: recipes.filter(r => r.isDeleted),
      blogs: blogs.filter(b => b.isDeleted)
    });
  });

  // Home Stats
  app.get("/api/stats", (req, res) => {
    const activeRecipes = recipes.filter(r => !r.isDeleted);
    const activeBlogs = blogs.filter(b => !b.isDeleted);
    res.json({
      totalRecipes: activeRecipes.length,
      totalViews: activeRecipes.reduce((acc, r) => acc + (r.views || 0), 0),
      unreadComments: comments.filter(c => !c.isRead).length,
      totalComments: comments.length,
      totalBlogs: activeBlogs.length,
      totalUsers: users.length,
      totalSubscribers: newsletterSubscriptions.length
    });
  });

  // Auth mock
  app.post("/api/register", (req, res) => {
    const { email, name, password, role, avatar, bio } = req.body;
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: name || email.split('@')[0],
      role: role || 'USER',
      avatar: avatar || `https://i.pravatar.cc/150?u=${email}`,
      bio: bio || "New cook in the kitchen!",
      joinedAt: new Date().toISOString(),
      status: 'active' as const
    };

    users.push(newUser);
    res.status(201).json({ user: newUser, token: "mock-jwt-token" });
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (user) {
      res.json({ user, token: "mock-jwt-token" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/forgot-password", (req, res) => {
    const { email } = req.body;
    const user = users.find(u => u.email === email);
    // Even if user not found, we return 200 for security (standard practice)
    console.log(`Password reset requested for: ${email}`);
    res.json({ success: true, message: "If an account exists, a reset link has been sent." });
  });

  app.post("/api/auth/reset-password", (req, res) => {
    const { token, password } = req.body;
    console.log(`Password reset for token: ${token}`);
    // Mock success - in a real app check token and update password
    res.json({ success: true, message: "Password has been successfully updated." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
