import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Careers from "./pages/Careers";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import EventsAdmin from "./pages/admin/EventsAdmin";
import BlogsAdmin from "./pages/admin/BlogsAdmin";
import CareersAdmin from "./pages/admin/CareersAdmin";
import GalleryAdmin from "./pages/admin/GalleryAdmin";
import TestimonialsAdmin from "./pages/admin/TestimonialsAdmin";
import PartnersAdmin from "./pages/admin/PartnersAdmin";
import DomainsAdmin from "./pages/admin/DomainsAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/events" element={<EventsAdmin />} />
            <Route path="/admin/blogs" element={<BlogsAdmin />} />
            <Route path="/admin/careers" element={<CareersAdmin />} />
            <Route path="/admin/gallery" element={<GalleryAdmin />} />
            <Route path="/admin/testimonials" element={<TestimonialsAdmin />} />
            <Route path="/admin/partners" element={<PartnersAdmin />} />
            <Route path="/admin/domains" element={<DomainsAdmin />} />
            <Route path="/admin/users" element={<UsersAdmin />} />
            <Route path="/admin/settings" element={<SettingsAdmin />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
