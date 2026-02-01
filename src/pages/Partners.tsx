import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  sort_order: number;
}

const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (!error && data) {
        setPartners(data);
      }
      setLoading(false);
    }
    fetchPartners();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[hsl(280,80%,55%)] to-[hsl(320,80%,55%)] bg-clip-text text-transparent">
            Our Partners
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're proud to work with industry-leading organizations that share our commitment to excellence and innovation.
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-wide">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading partners...</div>
          ) : partners.length === 0 ? (
            <div className="text-center text-muted-foreground">No partners available yet.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {partners.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.website_url || "#"}
                  target={partner.website_url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="h-16 md:h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <span className="mt-4 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center">
                    {partner.name}
                  </span>
                  {partner.website_url && (
                    <ExternalLink className="h-4 w-4 mt-2 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Become a Partner</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join our network of industry leaders and unlock new opportunities for growth and collaboration.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-full px-8 py-3 bg-background text-foreground hover:bg-background/90 font-medium transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Partners;
