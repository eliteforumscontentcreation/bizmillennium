import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  author_name: string | null;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      if (!slug) return;

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (!error && data) {
        setBlog(data);
      }
      setLoading(false);
    }
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <section className="py-16 md:py-24 bg-background">
          <div className="container-wide text-center">
            <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-secondary">
        {blog.featured_image && (
          <div className="absolute inset-0 opacity-20">
            <img
              src={blog.featured_image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="container-wide relative z-10">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="text-lg text-muted-foreground max-w-3xl mb-6">
              {blog.excerpt}
            </p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {blog.author_name && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{blog.author_name}</span>
              </div>
            )}
            {blog.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(blog.published_at).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {blog.featured_image && (
        <section className="py-8 bg-background">
          <div className="container-wide">
            <div className="aspect-[16/9] overflow-hidden rounded-2xl">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            {blog.content ? (
              <div
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            ) : (
              <p className="text-muted-foreground text-center py-12">
                No content available for this blog post.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Back to Blog CTA */}
      <section className="py-12 bg-secondary">
        <div className="container-wide text-center">
          <Button size="lg" asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              View All Blog Posts
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default BlogDetail;