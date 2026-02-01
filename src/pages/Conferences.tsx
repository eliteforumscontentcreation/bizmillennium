import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PageContent {
  headline: string;
  subheadline: string;
  description: string;
  features: { title: string; description: string }[];
}

const defaultContent: PageContent = {
  headline: "Conferences",
  subheadline: "World-Class Business Conferences",
  description: "Our flagship conferences bring together industry leaders, innovators, and decision-makers from around the globe. Experience thought-provoking keynotes, interactive sessions, and unparalleled networking opportunities.",
  features: [
    { title: "Expert Speakers", description: "Learn from industry pioneers and thought leaders" },
    { title: "Networking", description: "Connect with professionals from around the world" },
    { title: "Insights", description: "Gain actionable insights for your business" },
    { title: "Innovation", description: "Discover the latest trends and technologies" },
  ],
};

const Conferences = () => {
  const [content, setContent] = useState<PageContent>(defaultContent);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch page content
      const { data: pageData } = await supabase
        .from("pages")
        .select("content")
        .eq("slug", "conferences")
        .eq("is_published", true)
        .single();

      if (pageData?.content) {
        setContent({ ...defaultContent, ...(pageData.content as object) });
      }

      // Fetch conference events
      const { data: eventsData } = await supabase
        .from("events")
        .select("*, event_types!inner(name)")
        .eq("event_types.name", "Conference")
        .order("event_date", { ascending: false })
        .limit(6);

      if (eventsData) {
        setEvents(eventsData);
      }
    }
    fetchData();
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

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.features.map((feature, index) => (
              <div key={index} className="p-6 rounded-2xl bg-secondary/50 text-center">
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {events.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container-wide">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Upcoming Conferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl overflow-hidden bg-card border border-border hover:shadow-lg transition-shadow"
                >
                  {event.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={event.featured_image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                    {event.event_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Explore our upcoming conferences and secure your spot today.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="https://events.bizmillennium.com/" target="_blank" rel="noopener noreferrer">
              View All Events <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Conferences;
