import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  category: string | null;
  event_id: string | null;
}

interface Event {
  id: string;
  title: string;
  slug: string;
}

const Gallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch events that have gallery images
      const { data: eventsData } = await supabase
        .from("events")
        .select("id, title, slug")
        .order("event_date", { ascending: false });

      // Fetch gallery images
      const { data: galleryData } = await supabase
        .from("gallery")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (eventsData) {
        // Filter events that have gallery images
        const eventIds = new Set(
          galleryData?.map((g) => g.event_id).filter(Boolean),
        );
        const eventsWithGallery = eventsData.filter((e) => eventIds.has(e.id));
        setEvents(eventsWithGallery);

        // Auto-select first event if available
        if (eventsWithGallery.length > 0) {
          setSelectedEvent(eventsWithGallery[0].id);
        }
      }

      if (galleryData) {
        setGallery(galleryData);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  // Fallback gallery items grouped by event
  const fallbackEvents = [
    { id: "event1", title: "CFO Connect #3", slug: "cfo-connect-3" },
    { id: "event2", title: "CollaborateX #1", slug: "collaboratex-1" },
    { id: "event3", title: "CX Dynamics #2", slug: "cx-dynamics-2" },
    { id: "event4", title: "CFO Connect #4", slug: "cfo-connect-4" },
    { id: "event5", title: "CIO Insights #3", slug: "cio-insights-3" },
  ];

  const fallbackGallery: GalleryItem[] = [
    {
      id: "1",
      image_url:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      caption: "Registration Desk",
      alt_text: "Registration desk",
      category: "Events",
      event_id: "event1",
    },
    {
      id: "2",
      image_url:
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
      caption: "Networking Session",
      alt_text: "Networking",
      category: "Networking",
      event_id: "event1",
    },
    {
      id: "3",
      image_url:
        "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800",
      caption: "Keynote Session",
      alt_text: "Keynote",
      category: "Events",
      event_id: "event1",
    },
    {
      id: "4",
      image_url:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800",
      caption: "Panel Discussion",
      alt_text: "Panel",
      category: "Sessions",
      event_id: "event2",
    },
    {
      id: "5",
      image_url:
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
      caption: "Speaker Presentation",
      alt_text: "Speaker",
      category: "Sessions",
      event_id: "event2",
    },
    {
      id: "6",
      image_url:
        "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800",
      caption: "Award Ceremony",
      alt_text: "Awards",
      category: "Awards",
      event_id: "event3",
    },
    {
      id: "7",
      image_url:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      caption: "Conference Hall",
      alt_text: "Conference",
      category: "Events",
      event_id: "event4",
    },
    {
      id: "8",
      image_url:
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
      caption: "Team Building",
      alt_text: "Team",
      category: "Networking",
      event_id: "event5",
    },
  ];

  const displayEvents = events.length > 0 ? events : fallbackEvents;
  const displayGallery = gallery.length > 0 ? gallery : fallbackGallery;
  const activeEventId = selectedEvent || displayEvents[0]?.id || null;

  // Filter gallery by selected event
  const filteredGallery = activeEventId
    ? displayGallery.filter((item) => item.event_id === activeEventId)
    : displayGallery;

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container-wide text-center">
          <p className="text-muted-foreground mb-2">
            Where moments become milestones.
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            Highlights
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From large-scale summits and leadership forums to interactive
            workshops and award ceremonies, each event reflects our commitment
            to fostering dialogue, inspiring innovation, and delivering impact
            that endures.
          </p>
        </div>
      </section>

      {/* Event Tabs */}
      <section className="py-8 bg-background">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-3">
            {displayEvents.map((event, index) => (
              <Button
                key={event.id}
                variant={activeEventId === event.id ? "default" : "outline"}
                className={`rounded-full px-6 ${
                  activeEventId === event.id
                    ? "bg-primary text-primary-foreground"
                    : "border-border hover:bg-muted"
                }`}
                onClick={() => setSelectedEvent(event.id)}
              >
                {event.title}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8 md:py-16 bg-background">
        <div className="container-wide">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No photos available for this event yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGallery.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group animate-fade-in-up bg-muted/30"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={item.image_url}
                      alt={item.alt_text || item.caption || "Gallery image"}
                      className="max-w-full max-h-full w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-medium">{item.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-accent transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={selectedImage.image_url}
            alt={
              selectedImage.alt_text || selectedImage.caption || "Gallery image"
            }
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {selectedImage.caption && (
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white text-lg">{selectedImage.caption}</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Gallery;
