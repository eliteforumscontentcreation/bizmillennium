import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  Calendar,
  FileText,
  Briefcase,
  Image,
  MessageSquare,
  Users,
  TrendingUp,
  Eye,
} from "lucide-react";

interface DashboardStats {
  events: number;
  blogs: number;
  careers: number;
  gallery: number;
  testimonials: number;
  contacts: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    events: 0,
    blogs: 0,
    careers: 0,
    gallery: 0,
    testimonials: 0,
    contacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, blogs, careers, gallery, testimonials] = await Promise.all([
          supabase.from("events").select("id", { count: "exact", head: true }),
          supabase.from("blogs").select("id", { count: "exact", head: true }),
          supabase.from("careers").select("id", { count: "exact", head: true }),
          supabase.from("gallery").select("id", { count: "exact", head: true }),
          supabase.from("testimonials").select("id", { count: "exact", head: true }),
        ]);

        setStats({
          events: events.count || 0,
          blogs: blogs.count || 0,
          careers: careers.count || 0,
          gallery: gallery.count || 0,
          testimonials: testimonials.count || 0,
          contacts: 0, // Contact submissions are write-only
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Events", value: stats.events, icon: Calendar, color: "text-blue-500" },
    { title: "Blog Posts", value: stats.blogs, icon: FileText, color: "text-green-500" },
    { title: "Job Openings", value: stats.careers, icon: Briefcase, color: "text-purple-500" },
    { title: "Gallery Images", value: stats.gallery, icon: Image, color: "text-pink-500" },
    { title: "Testimonials", value: stats.testimonials, icon: MessageSquare, color: "text-orange-500" },
    { title: "Contacts", value: stats.contacts, icon: Users, color: "text-cyan-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome to Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your website content and monitor performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? (
                    <div className="h-9 w-16 bg-muted animate-pulse rounded" />
                  ) : (
                    stat.value
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Use the sidebar to navigate to different sections and manage your content.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Create and manage events
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Write and publish blog posts
                </li>
                <li className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  Post job openings
                </li>
                <li className="flex items-center gap-2">
                  <Image className="h-4 w-4 text-muted-foreground" />
                  Upload gallery images
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-accent" />
                Website Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Preview your website to see how changes appear to visitors.
              </p>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:underline"
              >
                Open Website
                <Eye className="h-4 w-4" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
