import { useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ScrollToTop } from './components/ScrollToTop';
import { SubscriptionPopup } from './components/SubscriptionPopup';
import { PublicLayout } from './components/PublicLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Initialize TanStack Query Client for Global Request Caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Considers server data fresh for 5 minutes
      refetchOnWindowFocus: false, // Prevents aggressive network hits when re-focusing browser tab
      retry: 1, // Fail fast on broken API connections
    },
  },
});

// Lazy load pages for performance
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Recipes = lazy(() => import('./pages/Recipes').then(m => ({ default: m.Recipes })));
const Comments = lazy(() => import('./pages/Comments').then(m => ({ default: m.Comments })));
const Ingredients = lazy(() => import('./pages/Ingredients').then(m => ({ default: m.Ingredients })));
const NewRecipe = lazy(() => import('./pages/NewRecipe').then(m => ({ default: m.NewRecipe })));
const EditRecipe = lazy(() => import('./pages/EditRecipe').then(m => ({ default: m.EditRecipe })));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail').then(m => ({ default: m.RecipeDetail })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const AllBlogs = lazy(() => import('./pages/AllBlogs').then(m => ({ default: m.AllBlogs })));
const BlogDetail = lazy(() => import('./pages/BlogDetail').then(m => ({ default: m.BlogDetail })));
const EditBlog = lazy(() => import('./pages/EditBlog').then(m => ({ default: m.EditBlog })));
const NewBlog = lazy(() => import('./pages/NewBlog').then(m => ({ default: m.NewBlog })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const UserManagement = lazy(() => import('./pages/UserManagement').then(m => ({ default: m.UserManagement })));
const NewsletterRegistry = lazy(() => import('./pages/NewsletterRegistry').then(m => ({ default: m.NewsletterRegistry })));
const Archives = lazy(() => import('./pages/Archives').then(m => ({ default: m.Archives })));
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const LegalTerms = lazy(() => import('./pages/LegalTerms').then(m => ({ default: m.LegalTerms })));
const Cookies = lazy(() => import('./pages/Cookies').then(m => ({ default: m.Cookies })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const SetupAccount = lazy(() => import('./pages/SetupAccount').then(m => ({ default: m.SetupAccount })));
const Creations = lazy(() => import('./pages/Creations').then(m => ({ default: m.Creations })));
const UserDetail = lazy(() => import('./pages/UserDetail').then(m => ({ default: m.UserDetail })));

function LoadingScreen() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-stone-100 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isStaff = user && (user.role === 'ADMIN' || user.role === 'CHEF');
  
  // Define lab paths more robustly
  const staffPaths = ['/dashboard', '/new', '/comments', '/blog', '/blog/new', '/users', '/newsletter', '/archives', '/ingredients'];
  
  const isLabView = isStaff && staffPaths.some(p => location.pathname === p || (location.pathname.startsWith(p + '/') && !location.pathname.startsWith('/blog/all/')));

  const publicRoutes = (
    <>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/recipes/:id" element={<RecipeDetail />} />
      <Route path="/recipes/:id/edit" element={<ProtectedRoute><EditRecipe /></ProtectedRoute>} />
      <Route path="/users/:id" element={<UserDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog/all" element={<AllBlogs />} />
      <Route path="/blog/all/:id" element={<BlogDetail />} />
      <Route path="/blog/all/:id/edit" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/cookies" element={<Cookies />} />
      <Route path="/legal" element={<LegalTerms />} />
      <Route path="/setup-account" element={<SetupAccount />} />
    </>
  );

  return (
    <Suspense fallback={<LoadingScreen />}>
      {!isLabView ? (
        <PublicLayout>
          <AnimatePresence mode="wait">
            <Routes location={location} key="public-routes">
              {publicRoutes}
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/creations" element={<ProtectedRoute><Creations /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
          <SubscriptionPopup />
        </PublicLayout>
      ) : (
        <div className="flex min-h-screen bg-background text-zinc-900 selection:bg-primary/20">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <main className="flex-1 min-w-0 flex flex-col">
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <Routes location={location} key="staff-routes">
                  {publicRoutes}
                  <Route path="/dashboard" element={<ProtectedRoute requireStaff><Dashboard /></ProtectedRoute>} />
                  <Route path="/comments" element={<ProtectedRoute requireStaff><Comments /></ProtectedRoute>} />
                  <Route path="/ingredients" element={<ProtectedRoute requireStaff><Ingredients /></ProtectedRoute>} />
                  <Route path="/new" element={<ProtectedRoute requireStaff><NewRecipe /></ProtectedRoute>} />
                  <Route path="/blog" element={<ProtectedRoute requireStaff><Blog /></ProtectedRoute>} />
                  <Route path="/blog/new" element={<ProtectedRoute requireStaff><NewBlog /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/newsletter" element={<ProtectedRoute requireStaff><NewsletterRegistry /></ProtectedRoute>} />
                  <Route path="/archives" element={<ProtectedRoute requireStaff><Archives /></ProtectedRoute>} />
                  <Route path="/creations" element={<ProtectedRoute><Creations /></ProtectedRoute>} />
                  <Route path="/users" element={<ProtectedRoute requireStaff><UserManagement /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </AnimatePresence>
            </div>
          </main>
          <SubscriptionPopup />
        </div>
      )}
    </Suspense>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ScrollToTop />
        <AppContent />
      </AuthProvider>
      {/* Devtools floating dashboard panel helper */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-12 py-20 text-center">
      <h2 className="font-serif text-4xl text-primary font-semibold mb-4">{title}</h2>
      <p className="text-secondary text-lg">This section is currently being prepared by our kitchen team.</p>
    </div>
  );
}