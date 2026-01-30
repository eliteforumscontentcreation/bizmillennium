import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Monitor, Star, Gem } from "lucide-react";
import heroEvent from "@/assets/hero-event.jpg";

interface EventType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Monitor,
  Star,
  Gem,
};

export function EventTypesSection() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);

  useEffect(() => {
    async function fetchEventTypes() {
      const { data, error } = await supabase
        .from("event_types")
        .select("*")
        .order("sort_order");

      if (!error && data) {
        setEventTypes(data);
      }
    }
    fetchEventTypes();
  }, []);

  // Fallback data
  const fallbackTypes = [
    { id: "1", name: "In-house Events", description: "Your Venue, Our Expertise: Transforming Your Space into a Thriving Business Ecosystem to create Unforgettable Experiences.", icon: "Building2" },
    { id: "2", name: "Virtual Events", description: "Breaking Barriers, Building Bridges: Connecting Global Businesses into the Future of Networking and Collaboration.", icon: "Monitor" },
    { id: "3", name: "Flagship Events", description: "Setting Sail for Success: Our Flagship Events Redefine Industry Standards. A journey Where Business Brilliance Takes Center Stage.", icon: "Star" },
    { id: "4", name: "Bespoke Events", description: "Exclusivity Redefined: Our Bespoke Events are Crafted to Perfectly Align With Your Brand to elevate Your Business Presence.", icon: "Gem" },
  ];

  const displayTypes = eventTypes.length > 0 ? eventTypes : fallbackTypes;

  return (
    <section className="relative">
      {/* Background Image */}
      <div 
        className="w-full h-[400px] md:h-[500px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroEvent})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Event Types Cards */}
      <div className="container-wide relative -mt-32 md:-mt-40 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTypes.map((type, index) => {
            const IconComponent = iconMap[type.icon] || Star;
            return (
              <div
                key={type.id}
                className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <IconComponent className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {type.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
