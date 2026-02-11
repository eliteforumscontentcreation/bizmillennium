import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  featured_image: string | null;
  author_name: string | null;
  author_image: string | null;
  published_at: string | null;
  category_id: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      if (!slug) return;

      try {
        // Fetch blog details
        const { data: blogData, error: blogError } = await supabase
          .from("blogs")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .single();

        if (blogError) {
          console.error("Error fetching blog:", blogError);
          setError(blogError.message);
        } else if (blogData) {
          setBlog(blogData);

          // Fetch category if exists
          if (blogData.category_id) {
            const { data: categoryData } = await supabase
              .from("blog_categories")
              .select("*")
              .eq("id", blogData.category_id)
              .single();

            if (categoryData) {
              setCategory(categoryData);
            }
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <section className="py-16 md:py-24 bg-background">
          <div className="container-wide text-center">
            <h1 className="text-3xl font-bold mb-4">Error Loading Blog Post</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
        <section className="py-16 md:py-24 bg-background">
          <div className="container-wide text-center">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
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
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="max-w-3xl">
            {category && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-accent/10 text-accent">
                {category.name}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            <div className="flex flex-wrap gap-6 text-foreground/80">
              {blog.author_name && (
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>{blog.author_name}</span>
                </div>
              )}
              {blog.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>
                    {new Date(blog.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            {blog.featured_image && (
              <div className="mb-12 rounded-xl overflow-hidden">
                <img
                  src={blog.featured_image}
                  alt={blog.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              {blog.content && typeof blog.content === 'object' && Array.isArray(blog.content) ? (
                blog.content.map((block: any, index: number) => {
                  if (block.type === 'paragraph') {
                    return <p key={index} className="mb-4 text-foreground leading-relaxed">{block.content}</p>;
                  } else if (block.type === 'heading') {
                    const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
                    return <HeadingTag key={index} className="font-bold mb-4 mt-8 text-foreground">{block.content}</HeadingTag>;
                  } else if (block.type === 'list') {
                    return (
                      <ul key={index} className="list-disc pl-6 mb-4 text-foreground">
                        {block.items?.map((item: string, i: number) => (
                          <li key={i} className="mb-2">{item}</li>
                        ))}
                      </ul>
                    );
                  } else if (block.type === 'image') {
                    return (
                      <div key={index} className="my-8">
                        <img src={block.url} alt={block.caption || ''} className="w-full rounded-lg" />
                        {block.caption && <p className="text-sm text-muted-foreground mt-2 text-center">{block.caption}</p>}
                      </div>
                    );
                  }
                  return null;
                })
              ) : (
                <div className="text-muted-foreground">
                  <p>Content not available</p>
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <Button asChild variant="outline">
                <Link to="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to All Posts
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogDetail;