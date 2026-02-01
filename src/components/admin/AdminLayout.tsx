import { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Image,
  MessageSquare,
  Settings,
  LogOut,
  Building2,
  Briefcase,
  BarChart3,
  Navigation,
  Layers,
  Globe,
  Mail,
  Tag,
  ImageIcon,
  ClipboardList,
} from "lucide-react";
import logo from "@/assets/logo.png";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Events", url: "/admin/events", icon: Calendar },
  { title: "Event Types", url: "/admin/event-types", icon: Tag },
  { title: "Blogs", url: "/admin/blogs", icon: FileText },
  { title: "Blog Categories", url: "/admin/blog-categories", icon: Tag },
  { title: "Careers", url: "/admin/careers", icon: Briefcase },
  { title: "Job Applications", url: "/admin/job-applications", icon: ClipboardList },
  { title: "Gallery", url: "/admin/gallery", icon: Image },
  { title: "Hero Sections", url: "/admin/hero-sections", icon: ImageIcon },
  { title: "Testimonials", url: "/admin/testimonials", icon: MessageSquare },
  { title: "Partners", url: "/admin/partners", icon: Building2 },
  { title: "Brands", url: "/admin/brands", icon: Layers },
  { title: "Domains", url: "/admin/domains", icon: Globe },
  { title: "Statistics", url: "/admin/statistics", icon: BarChart3 },
  { title: "Navigation", url: "/admin/navigation", icon: Navigation },
  { title: "Pages", url: "/admin/pages", icon: FileText },
  { title: "Contact Submissions", url: "/admin/contact-submissions", icon: Mail },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", {
        replace: true,
        state: { from: `${location.pathname}${location.search}` },
      });
    } else if (!loading && user && !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [user, loading, isAdmin, navigate, location.pathname, location.search]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-border">
          <div className="p-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <img src={logo} alt="Biz Millennium" className="h-8 w-auto" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-semibold text-primary">Admin</span>
                <span className="text-xs text-muted-foreground">Panel</span>
              </div>
            </Link>
          </div>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                      >
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <div className="mt-auto p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border flex items-center px-4 bg-background">
            <SidebarTrigger />
            <div className="ml-4">
              <h1 className="text-lg font-semibold text-foreground">
                {menuItems.find((item) => item.url === location.pathname)?.title || "Admin"}
              </h1>
            </div>
          </header>

          <main className="flex-1 p-6 bg-secondary/30 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
