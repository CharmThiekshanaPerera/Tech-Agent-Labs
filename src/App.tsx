import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlogPosts from "./pages/admin/AdminBlogPosts";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminDemos from "./pages/admin/AdminDemos";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminDocuments from "./pages/admin/AdminDocuments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/blog" element={<AdminBlogPosts />} />
          <Route path="/admin/testimonials" element={<AdminTestimonials />} />
          <Route path="/admin/demos" element={<AdminDemos />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/documents" element={<AdminDocuments />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
