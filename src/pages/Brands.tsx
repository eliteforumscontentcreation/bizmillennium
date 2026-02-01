import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  featured_image: string | null;
  website_url: string | null;
  sort_order: number;
}

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (!error && data) {
        setBrands(data);
      }
      setLoading(false);
    }
    fetchBrands();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[hsl(280,80%,55%)] to-[hsl(320,80%,55%)] bg-clip-text text-transparent">
            Our Brands
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the portfolio of brands under the Biz Millennium umbrella, each dedicated to excellence in their respective domains.
          </p>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-wide">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading brands...</div>
          ) : brands.length === 0 ? (
            <div className="text-center text-muted-foreground">No brands available yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl transition-all duration-300"
                >
                  {brand.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={brand.featured_image}
                        alt={brand.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {brand.logo_url && (
                        <img
                          src={brand.logo_url}
                          alt={`${brand.name} logo`}
                          className="h-12 w-12 object-contain"
                        />
                      )}
                      <h3 className="text-xl font-bold text-foreground">{brand.name}</h3>
                    </div>
                    {brand.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {brand.description}
                      </p>
                    )}
                    {brand.website_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={brand.website_url} target="_blank" rel="noopener noreferrer">
                          Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Brands;
