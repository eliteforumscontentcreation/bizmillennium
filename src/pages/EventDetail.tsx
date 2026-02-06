import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, ExternalLink, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Json } from "@/integrations/supabase/types";

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: Json | null;
  featured_image: string | null;
  event_date: string | null;
  end_date: string | null;
  location: string | null;
  venue: string | null;
  registration_url: string | null;
  is_upcoming: boolean;
}

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  category: string | null;
  event_id: string | null;
}

const EventDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      if (!slug) return;

      try {
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("slug", slug)
          .single();

        if (eventError) {
          console.error("Error fetching event:", eventError);
          setError(eventError.message);
        } else if (eventData) {
          setEvent(eventData);

          // Fetch gallery images for this event
          const { data: galleryData, error: galleryError } = await supabase
            .from("gallery")
            .select("*")
            .eq("event_id", eventData.id)
            .eq("is_active", true)
            .order("sort_order", { ascending: true });

          if (galleryError) {
            console.error("Error fetching gallery:", galleryError);
          } else if (galleryData) {
            setGalleryImages(galleryData);
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
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

  if (error) {
    return (
      <Layout>
        <section className="py-16 md:py-24 bg-background">
          <div className="container-wide text-center">
            <h1 className="text-3xl font-bold mb-4">Error Loading Event</h1>
            <p className="text-muted-foreground mb-8">{error}</p>
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
        {(event.hero_image || event.featured_image) && (
          <div className="absolute inset-0 opacity-20">
            <img
              src={event.hero_image || event.featured_image}
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
            <span
              className={`event-badge mb-4 ${event.is_upcoming ? "event-badge-upcoming" : "event-badge-past"}`}
            >
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
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Register Now
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            {event.featured_image && (
              <div className="mb-12 rounded-2xl overflow-hidden shadow-xl bg-muted/30">
                <div className="aspect-video w-full flex items-center justify-center">
                  <img
                    src={event.featured_image}
                    alt={event.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
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
              <div className="bg-primary text-primary-foreground rounded-xl p-8 text-center mb-12">
                <h3 className="text-2xl font-bold mb-4">Ready to Join?</h3>
                <p className="text-primary-foreground/80 mb-6">
                  Secure your spot at this exclusive event today.
                </p>
                <Button size="lg" variant="secondary" asChild className="gap-2">
                  <a
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Register Now
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Event Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="py-8 md:py-12 bg-secondary/30">
          <div className="container-wide">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Event Gallery
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse through the highlights and memorable moments from this
                event.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group animate-fade-in-up bg-muted/30"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={item.image_url}
                      alt={
                        item.alt_text || item.caption || "Event gallery image"
                      }
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
          </div>
        </section>
      )}

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

export default EventDetail;
