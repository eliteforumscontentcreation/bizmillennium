import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Users } from "lucide-react";
import { ServiceContactForm } from "@/components/ServiceContactForm";

interface Event {
  id: string;
  title: string;
  featured_image: string | null;
  event_date: string | null;
  location: string | null;
}

interface PageContent {
  headline: string;
  subheadline: string;
  description: string;
  features: { title: string; description: string }[];
}

const defaultContent: PageContent = {
  headline: "In-House Events",
  subheadline: "Exclusive Corporate Training",
  description: "Bring world-class training and development directly to your organization with our customized in-house events, designed to meet your specific business needs and objectives.",
  features: [
    { title: "Customized Content", description: "Tailored programs for your organization" },
    { title: "Expert Facilitators", description: "Industry-leading trainers and consultants" },
    { title: "Flexible Scheduling", description: "Events designed around your calendar" },
    { title: "Measurable Results", description: "Track progress and ROI effectively" },
  ],
};

const InHouse = () => {
  const [content, setContent] = useState<PageContent>(defaultContent);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: pageData } = await supabase
        .from("pages")
        .select("content")
        .eq("slug", "in-house")
        .eq("is_published", true)
        .single();

      if (pageData?.content) {
        setContent({ ...defaultContent, ...(pageData.content as object) });
      }

      const { data: eventsData } = await supabase
        .from("events")
        .select("*, event_types!inner(name)")
        .eq("event_types.name", "In-House")
        .order("event_date", { ascending: false })
        .limit(6);

      if (eventsData) {
        setEvents(eventsData as Event[]);
      }
    }
    fetchData();
  }, []);

  return (
    <Layout>
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container-wide text-center">
          <p className="text-sm uppercase tracking-wider text-accent font-semibold mb-4">
            {content.subheadline}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            {content.headline}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {content.description}
          </p>
        </div>
      </section>

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

      {events.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container-wide">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Recent In-House Programs
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
                        <Building2 className="h-4 w-4" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
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

      {/* Contact Form */}
      <ServiceContactForm
        serviceType="in-house"
        title="Transform Your Team"
        description="Contact us to discuss customized in-house training solutions for your organization."
      />
    </Layout>
  );
};

export default InHouse;