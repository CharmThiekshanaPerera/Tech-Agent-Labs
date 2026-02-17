import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSiteVisitTracker } from "@/hooks/useSiteVisitTracker";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlogPosts from "./pages/admin/AdminBlogPosts";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminDemos from "./pages/admin/AdminDemos";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminResetPassword from "./pages/admin/AdminResetPassword";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminSocialAutomation from "./pages/admin/AdminSocialAutomation";

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
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
            <Route path="/admin/demos" element={<AdminDemos />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/documents" element={<AdminDocuments />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SiteTracker>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
