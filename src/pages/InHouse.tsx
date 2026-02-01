import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Settings, Users, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageContent {
  headline: string;
  subheadline: string;
  description: string;
  services: { icon: string; title: string; description: string }[];
}

const defaultContent: PageContent = {
  headline: "In-House Events",
  subheadline: "Tailored Corporate Solutions",
  description: "We bring our expertise directly to your organization. Our in-house event solutions are customized to meet your specific objectives, culture, and audience.",
  services: [
    { icon: "building", title: "Corporate Training", description: "Skill development programs tailored to your team" },
    { icon: "settings", title: "Custom Workshops", description: "Interactive sessions designed for your goals" },
    { icon: "users", title: "Team Building", description: "Strengthen collaboration and company culture" },
    { icon: "sparkles", title: "Leadership Retreats", description: "Strategic planning and executive development" },
  ],
};

const iconMap: { [key: string]: any } = {
  building: Building2,
  settings: Settings,
  users: Users,
  sparkles: Sparkles,
};

const InHouse = () => {
  const [content, setContent] = useState<PageContent>(defaultContent);

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase
        .from("pages")
        .select("content")
        .eq("slug", "in-house")
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

      {/* Services */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our In-House Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Building2;
              return (
                <div key={index} className="flex gap-4 p-6 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", description: "Understanding your needs and objectives" },
              { step: "02", title: "Design", description: "Creating a tailored event program" },
              { step: "03", title: "Deliver", description: "Executing with precision and excellence" },
              { step: "04", title: "Debrief", description: "Measuring impact and gathering feedback" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-accent mb-4">{item.step}</div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Team?</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Let's discuss how we can create an impactful in-house event for your organization.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="/contact">
              Schedule a Consultation <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default InHouse;
