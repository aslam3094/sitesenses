import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { HelmetProvider } from "react-helmet-async";

// Layouts
import PublicLayout from "@/components/layout/PublicLayout";
import AppLayout from "@/components/layout/AppLayout";

// Public Pages
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Pricing from "@/pages/Pricing";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";

// Protected Pages
import Dashboard from "@/pages/Dashboard";
import Chatbot from "@/pages/Chatbot";
import KnowledgeSources from "@/pages/KnowledgeSources";
import Settings from "@/pages/Settings";
import AdminBlog from "@/pages/AdminBlog";
import ChatWidget from "@/pages/ChatWidget";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Route>

            {/* Auth Route */}
            <Route path="/auth" element={<Auth />} />

            {/* Widget Route (standalone, no layout) */}
            <Route path="/widget" element={<ChatWidget />} />

            {/* Protected Routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/knowledge" element={<KnowledgeSources />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin/blog" element={<AdminBlog />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
