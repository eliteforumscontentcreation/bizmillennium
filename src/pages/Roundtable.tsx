import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, MessageSquare, Lightbulb, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageContent {
  headline: string;
  subheadline: string;
  description: string;
  benefits: { icon: string; title: string; description: string }[];
}

const defaultContent: PageContent = {
  headline: "Executive Roundtables",
  subheadline: "Intimate Discussions, Powerful Insights",
  description: "Our executive roundtables provide an exclusive setting for senior leaders to engage in candid discussions, share experiences, and tackle industry challenges together.",
  benefits: [
    { icon: "users", title: "Peer-to-Peer Learning", description: "Engage with fellow executives facing similar challenges" },
    { icon: "message", title: "Candid Discussions", description: "Off-the-record conversations in a trusted environment" },
    { icon: "lightbulb", title: "Actionable Insights", description: "Leave with practical strategies you can implement immediately" },
    { icon: "target", title: "Focused Topics", description: "Deep dives into specific industry challenges and opportunities" },
  ],
};

const iconMap: { [key: string]: any } = {
  users: Users,
  message: MessageSquare,
  lightbulb: Lightbulb,
  target: Target,
};

const Roundtable = () => {
  const [content, setContent] = useState<PageContent>(defaultContent);

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase
        .from("pages")
        .select("content")
        .eq("slug", "roundtable")
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

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Join Our Roundtables?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.benefits.map((benefit, index) => {
              const IconComponent = iconMap[benefit.icon] || Users;
              return (
                <div key={index} className="flex gap-4 p-6 rounded-2xl bg-secondary/30">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Format Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Roundtable Format</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="p-6">
                <div className="text-4xl font-bold text-accent mb-2">15-20</div>
                <p className="text-muted-foreground">Senior Executives</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-accent mb-2">3-4</div>
                <p className="text-muted-foreground">Hours of Discussion</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-accent mb-2">100%</div>
                <p className="text-muted-foreground">Confidential</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Request an Invitation</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Our roundtables are invitation-only. Contact us to learn about upcoming sessions.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="/contact">
              Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Roundtable;
