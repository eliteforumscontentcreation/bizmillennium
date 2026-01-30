import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  alt_text: string | null;
  category: string | null;
}

const Gallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("sort_order");

      if (!error && data) {
        setGallery(data);
      }
      setLoading(false);
    }
    fetchGallery();
  }, []);

  // Fallback gallery items
  const fallbackGallery = [
    { id: "1", image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800", caption: "CFO Connect Summit", alt_text: "Conference venue", category: "Events" },
    { id: "2", image_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800", caption: "Networking Session", alt_text: "Networking event", category: "Networking" },
    { id: "3", image_url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800", caption: "Supply Chain Summit", alt_text: "Business conference", category: "Events" },
    { id: "4", image_url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800", caption: "Panel Discussion", alt_text: "Panel discussion", category: "Sessions" },
    { id: "5", image_url: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800", caption: "Keynote Speaker", alt_text: "Speaker on stage", category: "Sessions" },
    { id: "6", image_url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800", caption: "Award Ceremony", alt_text: "Award ceremony", category: "Awards" },
  ];

  const displayGallery = gallery.length > 0 ? gallery : fallbackGallery;

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 hero-text-gradient">
            Event Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore moments from our past events. Each image tells a story of connection, 
            learning, and business excellence.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayGallery.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img
                  src={item.image_url}
                  alt={item.alt_text || item.caption || "Gallery image"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-medium">{item.caption}</p>
                    {item.category && (
                      <span className="text-sm text-white/70">{item.category}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            alt={selectedImage.alt_text || selectedImage.caption || "Gallery image"}
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
