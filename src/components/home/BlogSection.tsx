import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  category_id: string | null;
  author_name: string | null;
  published_at: string | null;
}

export function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setBlogs(data);
      }
    }
    fetchBlogs();
  }, []);

  // Fallback data
  const fallbackBlogs = [
    { id: "1", slug: "networking-redefined", title: "Networking Redefined at B2B Events", excerpt: "Explore how modern B2B events are transforming networking.", featured_image: "https://bizmillennium.com/wp-content/uploads/2025/02/Networking-Redefined-at-B2B-Events.jpg", category_id: null, author_name: "Biz Millennium", published_at: "2025-02-15" },
    { id: "2", slug: "hybrid-events", title: "Hybrid Events: The Best of Both Worlds", excerpt: "Discover how hybrid events combine in-person and virtual experiences.", featured_image: "https://bizmillennium.com/wp-content/uploads/2025/02/Hybrid-Events-The-Best-of-Both-Worlds-1-1.jpg", category_id: null, author_name: "Biz Millennium", published_at: "2025-02-10" },
    { id: "3", slug: "sustainable-conferences", title: "Sustainable Practices in B2B Conferences", excerpt: "Learn about eco-friendly approaches to business conferences.", featured_image: "https://bizmillennium.com/wp-content/uploads/2025/02/Sustainable-Practices-in-B2B-Conferences.jpg", category_id: null, author_name: "Biz Millennium", published_at: "2025-02-05" },
    { id: "4", slug: "behind-the-scenes", title: "Behind the Scenes of Impactful Conferences", excerpt: "A look at what makes conferences truly impactful.", featured_image: "https://bizmillennium.com/wp-content/uploads/2025/01/Behind-the-Scenes-of-Impactful-Conferences.jpg", category_id: null, author_name: "Biz Millennium", published_at: "2025-01-20" },
    { id: "5", slug: "attendee-journeys", title: "Crafting Memorable Attendee Journeys", excerpt: "Creating unforgettable experiences for event attendees.", featured_image: "https://bizmillennium.com/wp-content/uploads/2025/01/Crafting-Memorable-Attendee-Journeys.jpg", category_id: null, author_name: "Biz Millennium", published_at: "2025-01-15" },
    { id: "6", slug: "partnerships", title: "Building Lasting Partnerships Through Events", excerpt: "Leveraging events for long-term business relationships.", featured_image: "https://bizmillennium.com/wp-content/uploads/2025/01/Building-Lasting-Partnerships-Through-Events.jpg", category_id: null, author_name: "Biz Millennium", published_at: "2025-01-10" },
  ];

  const displayBlogs = blogs.length > 0 ? blogs : fallbackBlogs;

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container-wide">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="section-title mb-4">Read More Of Our Blogs</h2>
            <p className="text-muted-foreground max-w-xl">
              Explore more of our blogs to have a better understanding of business events and our services.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/blog" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBlogs.map((blog, index) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.slug}`}
              className="blog-card group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={blog.featured_image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-medium text-accent uppercase tracking-wider">
                  Blogs
                </span>
                <h3 className="text-lg font-semibold text-foreground mt-2 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  Read More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
