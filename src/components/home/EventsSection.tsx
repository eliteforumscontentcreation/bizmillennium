import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

interface Event {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  location: string | null;
  event_date: string | null;
  featured_image: string | null;
  hero_image: string | null;
  registration_url: string | null;
  is_upcoming: boolean;
}

export function EventsSection() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false })
        .limit(6);

      if (!error && data) {
        const upcoming = data.filter((e) => e.is_upcoming);
        const past = data.filter((e) => !e.is_upcoming);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section
        id="events-section"
        className="py-16 md:py-24 bg-secondary scroll-mt-16"
      >
        <div className="container-wide">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  // Don't show section if no events
  if (upcomingEvents.length === 0 && pastEvents.length === 0) {
    return null;
  }

  const EventCard = ({ event }: { event: Event }) => (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Image - full width, auto height to show complete image */}
      <Link to={`/events/${event.slug}`} className="block">
        <div className="overflow-hidden bg-muted">
          <img
            src={
              event.featured_image ||
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
            }
            alt={event.title}
            className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Badge */}
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
            event.is_upcoming
              ? "bg-accent/10 text-accent"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {event.is_upcoming ? "Upcoming" : "Past Event"}
        </span>

        {/* Title */}
        <Link to={`/events/${event.slug}`}>
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {event.title}
          </h3>
        </Link>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Location */}
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        )}

        {/* Date - in accent color */}
        {event.event_date && (
          <div className="flex items-center gap-2 text-sm text-pink-600 font-medium mb-4">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(event.event_date).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 bg-black text-white hover:bg-black/90 border-black"
          >
            <Link to={`/events/${event.slug}`}>View Details</Link>
          </Button>
          {event.registration_url && event.is_upcoming && (
            <Button
              size="sm"
              asChild
              className="flex-1 gap-1 bg-black text-white hover:bg-black/90"
            >
              <a
                href={event.registration_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Register
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="events-section"
      className="py-16 md:py-24 bg-secondary scroll-mt-16"
    >
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black inline-block">
            Our Events
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our upcoming and past events. Join us for exceptional
            business conferences, networking opportunities, and industry-leading
            discussions.
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-8 w-full sm:w-auto">
            <TabsTrigger value="upcoming">
              Upcoming Events ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Events ({pastEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-background rounded-2xl">
                <p className="text-muted-foreground mb-4">
                  No upcoming events at the moment.
                </p>
                <Button asChild>
                  <Link to="/contact">Contact us for custom events</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-background rounded-2xl">
                <p className="text-muted-foreground">
                  No past events to display.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
