import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

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
    { id: "1", slug: "networking-redefined", title: "Preeti Jain Joins Adani GCC as Chief People Officer to Lead HR Innovation", excerpt: "Explore how modern B2B events are transforming networking.", featured_image: "https://bizmillennium.com/wp-content/uploads/2025/02/Networking-Redefined-at-B2B-Events.jpg", category_id: null, author_name: "Biz Millennium", published_at: "2025-02-15" },
    { id: "2", slug: "hybrid-events", title: "ASG Eye Hospital Welcomes Karuna Ponnada as New Global CHRO", excerpt: "Discover how hybrid events combine in-person and virtual experiences.", featured_image: "https://bizmillennium.com/wp-content/uploads/2025/02/Hybrid-Events-The-Best-of-Both-Worlds-1-1.jpg", category_id: null, author_name: "Biz Millennium", published_at: "2025-02-10" },
    { id: "3", slug: "sustainable-conferences", title: "Infra.Market Boosts Leadership with Anil Kulkarni as New COO", excerpt: "Learn about eco-friendly approaches to business conferences.", featured_image: "https://bizmillennium.com/wp-content/uploads/2025/02/Sustainable-Practices-in-B2B-Conferences.jpg", category_id: null, author_name: "Biz Millennium", published_at: "2025-02-05" },
    { id: "4", slug: "behind-the-scenes", title: "Nathan SV Joins PwC as Senior Leadership Prime", excerpt: "A look at what makes conferences truly impactful.", featured_image: "https://bizmillennium.com/wp-content/uploads/2025/01/Behind-the-Scenes-of-Impactful-Conferences.jpg", category_id: null, author_name: "Biz Millennium", published_at: "2025-01-20" },
    { id: "5", slug: "attendee-journeys", title: "Allcargo Logistics Appoints Rajat Jain as New CEO", excerpt: "Creating unforgettable experiences for event attendees.", featured_image: "https://bizmillennium.com/wp-content/uploads/2025/01/Crafting-Memorable-Attendee-Journeys.jpg", category_id: null, author_name: "Biz Millennium", published_at: "2025-01-15" },
    { id: "6", slug: "partnerships", title: "Vanita Pandey Joins Bureau CMS in Australia Global", excerpt: "Leveraging events for long-term business relationships.", featured_image: "https://bizmillennium.com/wp-content/uploads/2025/01/Building-Lasting-Partnerships-Through-Events.jpg", category_id: null, author_name: "Biz Millennium", published_at: "2025-01-10" },
  ];

  const displayBlogs = blogs.length > 0 ? blogs : fallbackBlogs;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-wide">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Leader's Spotlight
        </h2>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayBlogs.map((blog, index) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.slug}`}
              className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image with overlay */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={blog.featured_image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Blue overlay with "Leadership Update" text */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1a56db] to-[#1a56db]/80 flex flex-col justify-center items-center p-4">
                  <span className="text-white/40 text-6xl font-serif leading-none">"</span>
                  <span className="text-white text-xl font-bold leading-tight text-center">
                    Leadership<br />Update
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 bg-white">
                <h3 className="text-lg font-semibold text-foreground mb-4 line-clamp-3 group-hover:text-accent transition-colors">
                  {blog.title}
                </h3>
                <span className="text-sm font-medium text-accent uppercase tracking-wider flex items-center gap-1">
                  READ MORE <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
