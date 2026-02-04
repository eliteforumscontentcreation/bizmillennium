import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
}

const fallbackPartnerLogos = [
  { id: "1", name: "Clear", logo_url: "https://bizmillennium.com/wp-content/uploads/2023/08/clear-Our-Partners.jpg", website_url: null },
  { id: "2", name: "Workplace", logo_url: "https://bizmillennium.com/wp-content/uploads/2023/08/workplace-Our-Partners.jpg", website_url: null },
  { id: "3", name: "Chrome Enterprise", logo_url: "https://bizmillennium.com/wp-content/uploads/2023/08/Chrome-Our-Partners.jpg", website_url: null },
  { id: "4", name: "AWS", logo_url: "https://bizmillennium.com/wp-content/uploads/2023/08/aws-Our-Partners.jpg", website_url: null },
  { id: "5", name: "Happay", logo_url: "https://bizmillennium.com/wp-content/uploads/2023/08/Happay-Our-Partners.jpg", website_url: null },
  { id: "6", name: "Dell", logo_url: "https://bizmillennium.com/wp-content/uploads/2023/08/Dell-Our-Partners.jpg", website_url: null },
  { id: "7", name: "Freshworks", logo_url: "https://bizmillennium.com/wp-content/uploads/2023/08/Freshworks-Our-Partners.jpg", website_url: null },
  { id: "8", name: "Apple", logo_url: "https://bizmillennium.com/wp-content/uploads/2023/08/apple-Our-Partners.jpg", website_url: null },
];

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    async function fetchPartners() {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (!error && data && data.length > 0) {
        setPartners(data);
      }
    }
    fetchPartners();
  }, []);

  const displayPartners = partners.length > 0 ? partners : fallbackPartnerLogos;
  
  // Duplicate the partners array for seamless infinite scroll
  const duplicatedPartners = [...displayPartners, ...displayPartners];

  return (
    <section className="py-12 bg-background overflow-hidden">
      <div className="container-wide">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Partners</h2>
          <div className="h-px flex-1 bg-border" />
          <Link 
            to="/partners" 
            className="text-accent font-medium hover:underline whitespace-nowrap"
          >
            view all
          </Link>
        </div>
      </div>

      {/* Infinite Scrolling Carousel */}
      <div className="relative overflow-hidden">
        <div 
          className="partner-slider flex"
          style={{
            width: 'max-content'
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
            >
              {partner.website_url ? (
                <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="h-16 md:h-20 w-auto object-contain"
                  />
                </a>
              ) : (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="h-16 md:h-20 w-auto object-contain"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
