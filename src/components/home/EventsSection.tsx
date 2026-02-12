import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin } from "lucide-react";
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

// Helper function to check if an event is upcoming based on its date
const isEventUpcoming = (eventDate: string | null): boolean => {
  if (!eventDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  const eventDateObj = new Date(eventDate);
  eventDateObj.setHours(0, 0, 0, 0);
  return eventDateObj >= today;
};

export function EventsSection() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });

    if (!error && data) {
      // Automatically categorize events based on event_date
      const upcoming = data.filter((e) => isEventUpcoming(e.event_date));
      const past = data.filter((e) => !isEventUpcoming(e.event_date));
      
      // Sort upcoming events in ascending order (earliest first)
      upcoming.sort((a, b) => {
        if (!a.event_date || !b.event_date) return 0;
        return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
      });
      
      // Sort past events in descending order (most recent first)
      past.sort((a, b) => {
        if (!a.event_date || !b.event_date) return 0;
        return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
      });
      
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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

  const EventCard = ({ event }: { event: Event }) => {
    // Determine if event is upcoming based on date (not the is_upcoming field)
    const upcoming = isEventUpcoming(event.event_date);
    
    // Handle card click - redirect to registration URL if available
    const handleCardClick = () => {
      if (event.registration_url) {
        window.open(event.registration_url, "_blank", "noopener,noreferrer");
      }
    };

    return (
      <div
        onClick={handleCardClick}
        className={`group bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
          event.registration_url ? "cursor-pointer" : ""
        }`}
      >
        {/* Image - full width, auto height to show complete image */}
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

        {/* Content */}
        <div className="p-5">
          {/* Badge */}
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
              upcoming
                ? "bg-accent/10 text-accent"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {upcoming ? "Upcoming" : "Past Event"}
          </span>

          {/* Title */}
          <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {event.title}
          </h3>

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
            <div className="flex items-center gap-2 text-sm text-pink-600 font-medium">
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
        </div>
      </div>
    );
  };

  // Limit to 6 events for homepage display
  const displayedUpcomingEvents = upcomingEvents.slice(0, 6);
  const displayedPastEvents = pastEvents.slice(0, 6);

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
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedUpcomingEvents.map((event) => (
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
                {displayedPastEvents.map((event) => (
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
            <Link to="/events#upcoming">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}