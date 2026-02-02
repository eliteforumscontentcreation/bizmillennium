import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: any;
  featured_image: string | null;
  event_date: string | null;
  end_date: string | null;
  location: string | null;
  venue: string | null;
  registration_url: string | null;
  is_upcoming: boolean;
}

const EventDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      if (!slug) return;

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        setEvent(data);
      }
      setLoading(false);
    }
    fetchEvent();
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

  if (!event) {
    return (
      <Layout>
        <section className="py-16 md:py-24 bg-background">
          <div className="container-wide text-center">
            <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/events">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
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
        {event.featured_image && (
          <div className="absolute inset-0 opacity-20">
            <img
              src={event.featured_image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="container-wide relative z-10">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>
          
          <div className="max-w-3xl">
            <span className={`event-badge mb-4 ${event.is_upcoming ? "event-badge-upcoming" : "event-badge-past"}`}>
              {event.is_upcoming ? "Upcoming Event" : "Past Event"}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              {event.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-foreground/80 mb-8">
              {event.event_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>
                    {new Date(event.event_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {event.registration_url && event.is_upcoming && (
              <Button size="lg" asChild className="gap-2">
                <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                  Register Now
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            {event.featured_image && (
              <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={event.featured_image}
                  alt={event.title}
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
            )}

            {event.description && (
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {event.venue && (
              <div className="bg-secondary/50 rounded-xl p-6 mb-12">
                <h3 className="text-lg font-semibold mb-2">Venue</h3>
                <p className="text-muted-foreground">{event.venue}</p>
              </div>
            )}

            {event.registration_url && event.is_upcoming && (
              <div className="bg-primary text-primary-foreground rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Join?</h3>
                <p className="text-primary-foreground/80 mb-6">
                  Secure your spot at this exclusive event today.
                </p>
                <Button size="lg" variant="secondary" asChild className="gap-2">
                  <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                    Register Now
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EventDetail;