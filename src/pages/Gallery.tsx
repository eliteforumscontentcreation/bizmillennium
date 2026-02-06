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
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch events
      const { data: eventsData } = await supabase
        .from("events")
        .select("id, title, slug")
        .order("event_date", { ascending: false });

      // Fetch all active gallery images (both event-linked and site gallery)
      const { data: galleryData, error } = await supabase
        .from("gallery")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) {
        console.error("Error fetching gallery:", error);
      }

      if (eventsData) {
        // Filter events that have gallery images
        const eventIds = new Set(
          galleryData?.map((g) => g.event_id).filter(Boolean),
        );
        const eventsWithGallery = eventsData.filter((e) => eventIds.has(e.id));
        setEvents(eventsWithGallery);
      }

      if (galleryData) {
        setGallery(galleryData);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  // Check if there are site gallery items (no event_id)
  const hasSiteGallery = gallery.some((item) => !item.event_id);

  // Filter gallery based on selection
  const filteredGallery =
    selectedFilter === "all"
      ? gallery
      : selectedFilter === "site"
        ? gallery.filter((item) => !item.event_id)
        : gallery.filter((item) => item.event_id === selectedFilter);

  // Get display items - if no data, show nothing (no fallbacks)
  const displayGallery = filteredGallery;

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

      {/* Filter Tabs */}
      <section className="py-8 bg-background">
        <div className="container-wide">
          <div className="flex flex-wrap justify-center gap-3">
            {/* All Photos Tab */}
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              className={`rounded-full px-6 ${
                selectedFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "border-border hover:bg-muted"
              }`}
              onClick={() => setSelectedFilter("all")}
            >
              All Photos
            </Button>

            {/* Site Gallery Tab - only show if there are site gallery items */}
            {hasSiteGallery && (
              <Button
                variant={selectedFilter === "site" ? "default" : "outline"}
                className={`rounded-full px-6 ${
                  selectedFilter === "site"
                    ? "bg-primary text-primary-foreground"
                    : "border-border hover:bg-muted"
                }`}
                onClick={() => setSelectedFilter("site")}
              >
                General Gallery
              </Button>
            )}

            {/* Event Tabs */}
            {events.map((event) => (
              <Button
                key={event.id}
                variant={selectedFilter === event.id ? "default" : "outline"}
                className={`rounded-full px-6 ${
                  selectedFilter === event.id
                    ? "bg-primary text-primary-foreground"
                    : "border-border hover:bg-muted"
                }`}
                onClick={() => setSelectedFilter(event.id)}
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
          ) : displayGallery.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No photos available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayGallery.map((item, index) => (
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
