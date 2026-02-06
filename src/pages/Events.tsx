import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Event {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  location: string | null;
  venue: string | null;
  event_date: string | null;
  featured_image: string | null;
  hero_image: string | null;
  registration_url: string | null;
  is_upcoming: boolean;
  is_featured: boolean;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("event_date", { ascending: false });

        if (error) {
          console.error("Error fetching events:", error);
          setError(error.message);
        } else if (data) {
          console.log("Fetched events:", data);
          console.log(
            "Featured images:",
            data.map((e) => ({
              title: e.title,
              featured_image: e.featured_image,
            })),
          );
          setEvents(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred while loading events");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter((e) => e.is_upcoming);
  const pastEvents = events.filter((e) => !e.is_upcoming);

  const EventCard = ({ event }: { event: Event }) => {
    const imageUrl =
      event.featured_image ||
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800";

    return (
      <div className="group">
        {/* Image - full width, auto height to show complete image */}
        <Link to={`/events/${event.slug}`} className="block">
          <div className="rounded-2xl overflow-hidden bg-muted mb-4">
            <img
              src={imageUrl}
              alt={event.title}
              className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                console.error("Image failed to load:", imageUrl);
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800";
              }}
            />
          </div>
        </Link>

        {/* Location */}
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        )}

        {/* Date - in accent color like reference */}
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

        {/* View Details Button */}
        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-full bg-black text-white hover:bg-black/90 border-black"
        >
          <Link to={`/events/${event.slug}`}>View Details</Link>
        </Button>
      </div>
    );
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 hero-text-gradient">
            Our Events
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our upcoming and past events. Join us for exceptional
            business conferences, networking opportunities, and industry-leading
            discussions.
          </p>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-wide">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">
                Error loading events: {error}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-black text-white hover:bg-black/90"
              >
                Retry
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-8">
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
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No upcoming events at the moment.
                    </p>
                    <Button
                      className="mt-4 bg-black text-white hover:bg-black/90"
                      asChild
                    >
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
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No past events to display.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
