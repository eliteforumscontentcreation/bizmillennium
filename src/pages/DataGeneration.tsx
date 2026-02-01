import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database, BarChart3, Target, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageContent {
  headline: string;
  subheadline: string;
  description: string;
  capabilities: { icon: string; title: string; description: string }[];
}

const defaultContent: PageContent = {
  headline: "Data Generation",
  subheadline: "Insights That Drive Decisions",
  description: "Our data generation services help you understand your market, identify opportunities, and make informed business decisions backed by quality data and analytics.",
  capabilities: [
    { icon: "database", title: "Market Research", description: "Comprehensive industry analysis and market intelligence" },
    { icon: "chart", title: "Lead Generation", description: "Qualified leads matched to your ideal customer profile" },
    { icon: "target", title: "Audience Insights", description: "Deep understanding of your target demographics" },
    { icon: "shield", title: "Data Quality", description: "Verified, accurate, and compliant data solutions" },
  ],
};

const iconMap: { [key: string]: any } = {
  database: Database,
  chart: BarChart3,
  target: Target,
  shield: Shield,
};

const DataGeneration = () => {
  const [content, setContent] = useState<PageContent>(defaultContent);

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase
        .from("pages")
        .select("content")
        .eq("slug", "data-generation")
        .eq("is_published", true)
        .single();

      if (data?.content) {
        setContent({ ...defaultContent, ...(data.content as object) });
      }
    }
    fetchContent();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container-wide text-center">
          <p className="text-sm uppercase tracking-wider text-accent font-semibold mb-4">
            {content.subheadline}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[hsl(280,80%,55%)] to-[hsl(320,80%,55%)] bg-clip-text text-transparent">
            {content.headline}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.capabilities.map((capability, index) => {
              const IconComponent = iconMap[capability.icon] || Database;
              return (
                <div key={index} className="flex gap-4 p-6 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{capability.title}</h3>
                    <p className="text-muted-foreground">{capability.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">1M+</div>
              <p className="text-muted-foreground">Data Points Collected</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">98%</div>
              <p className="text-muted-foreground">Data Accuracy Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">500+</div>
              <p className="text-muted-foreground">Clients Served</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">50+</div>
              <p className="text-muted-foreground">Industries Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Power Your Decisions with Data</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Let us help you unlock insights that drive growth and competitive advantage.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="/contact">
              Start a Project <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default DataGeneration;
