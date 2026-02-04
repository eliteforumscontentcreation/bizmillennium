import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Users } from "lucide-react";
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
  headline: "Roundtable Discussions",
  subheadline: "Intimate Executive Forums",
  description: "Participate in exclusive roundtable discussions where senior executives and industry leaders share insights, challenges, and solutions in a collaborative, confidential environment.",
  features: [
    { title: "Peer Learning", description: "Learn from fellow executives' experiences" },
    { title: "Strategic Insights", description: "Gain perspectives on critical business issues" },
    { title: "Confidential Setting", description: "Speak freely in a trusted environment" },
    { title: "Action-Oriented", description: "Walk away with practical solutions" },
  ],
};

const Roundtable = () => {
  const [content, setContent] = useState<PageContent>(defaultContent);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: pageData } = await supabase
        .from("pages")
        .select("content")
        .eq("slug", "roundtable")
        .eq("is_published", true)
        .single();

      if (pageData?.content) {
        setContent({ ...defaultContent, ...(pageData.content as object) });
      }

      const { data: eventsData } = await supabase
        .from("events")
        .select("*, event_types!inner(name)")
        .eq("event_types.name", "Roundtable")
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
              Upcoming Roundtables
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
                        <MessageCircle className="h-4 w-4" />
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
        serviceType="roundtable"
        title="Join the Conversation"
        description="Request an invitation to our exclusive executive roundtable discussions."
      />
    </Layout>
  );
};

export default Roundtable;