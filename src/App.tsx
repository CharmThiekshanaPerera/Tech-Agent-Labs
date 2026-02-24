import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSiteVisitTracker } from "@/hooks/useSiteVisitTracker";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-load non-homepage routes to reduce initial bundle
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminBlogPosts = lazy(() => import("./pages/admin/AdminBlogPosts"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminDemos = lazy(() => import("./pages/admin/AdminDemos"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminDocuments = lazy(() => import("./pages/admin/AdminDocuments"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminResetPassword = lazy(() => import("./pages/admin/AdminResetPassword"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminNewsletter = lazy(() => import("./pages/admin/AdminNewsletter"));
const AdminSocialAutomation = lazy(() => import("./pages/admin/AdminSocialAutomation"));
const AdminChatLogs = lazy(() => import("./pages/admin/AdminChatLogs"));
const AdminSEO = lazy(() => import("./pages/admin/AdminSEO"));
const AdminRevenue = lazy(() => import("./pages/admin/AdminRevenue"));

const queryClient = new QueryClient();

const SiteTracker = ({ children }: { children: React.ReactNode }) => {
  useSiteVisitTracker();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SiteTracker>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/reset-password" element={<AdminResetPassword />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/blog" element={<AdminBlogPosts />} />
              <Route path="/admin/newsletter" element={<AdminNewsletter />} />
              <Route path="/admin/social" element={<AdminSocialAutomation />} />
              <Route path="/admin/chat-logs" element={<AdminChatLogs />} />
              <Route path="/admin/seo" element={<AdminSEO />} />
              <Route path="/admin/revenue" element={<AdminRevenue />} />
              <Route path="/admin/testimonials" element={<AdminTestimonials />} />
              <Route path="/admin/demos" element={<AdminDemos />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/documents" element={<AdminDocuments />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </SiteTracker>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
