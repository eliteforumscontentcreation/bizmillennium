import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export function DomainsSection() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function fetchDomains() {
      const { data, error } = await supabase
        .from("domains")
        .select("*")
        .order("sort_order");

      if (!error && data) {
        setDomains(data);
      }
    }
    fetchDomains();
  }, []);

  // Fallback data
  const fallbackDomains = [
    { id: "1", name: "Information Tech", description: "At the intersection of innovation and tech, we host IT conferences fostering groundbreaking discussions.", icon: "Cpu" },
    { id: "2", name: "Marketing and Sales", description: "Empowering brands to shine, our marketing and sales conferences unveil strategies that resonate.", icon: "Target" },
    { id: "3", name: "Pharmaceutical", description: "In the realm of healthcare breakthroughs, our pharmaceutical conferences converge top minds.", icon: "Pill" },
    { id: "4", name: "HR", description: "Navigating the human landscape, our HR conferences delve into talent management, leadership, and workplace culture, shaping the businesses through discussions.", icon: "Users" },
    { id: "5", name: "Finance & Legal", description: "Where numbers meet regulations, our finance and legal conferences provide a platform for experts to dissect complexities.", icon: "Landmark" },
    { id: "6", name: "Manufacturing", description: "From cutting-edge technologies to sustainable practices, our manufacturing conferences spotlight industry trends.", icon: "Factory" },
    { id: "7", name: "Supply & Logistics", description: "In the heartbeat of global trade, our supply and logistics conferences facilitate conversations on optimizing supply chains.", icon: "Truck" },
    { id: "8", name: "CSR & Sustainability", description: "Our CSR and sustainability conferences unite visionaries committed to creating positive social and environmental impacts.", icon: "Leaf" },
  ];

  const displayDomains = domains.length > 0 ? domains : fallbackDomains;
  const selectedDomain = displayDomains[selectedIndex];

  // Auto-scroll effect
  useEffect(() => {
    if (displayDomains.length <= 1) return;
    if (isPaused) return;

    const intervalId = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % displayDomains.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(intervalId);
  }, [displayDomains.length, isPaused]);

  return (
    <section 
      className="py-16 md:py-24 bg-secondary"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container-wide">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
          Domains we cater
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Gradient Card with Selected Domain */}
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#4fd1c5] via-[#68d391] to-[#ecc94b]">
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {selectedDomain?.name}
              </h3>
              <p className="text-white/90 text-base md:text-lg leading-relaxed">
                {selectedDomain?.description}
              </p>
            </div>
          </div>

          {/* Right - Domain List */}
          <div className="flex flex-col justify-center space-y-4">
            {displayDomains.map((domain, index) => (
              <button
                key={domain.id}
                onClick={() => setSelectedIndex(index)}
                className={`flex items-center gap-4 text-left transition-all duration-300 group`}
              >
                <div 
                  className={`w-16 h-10 rounded-full transition-all duration-300 ${
                    selectedIndex === index 
                      ? 'bg-accent' 
                      : 'bg-accent/30 group-hover:bg-accent/50'
                  }`}
                />
                <span 
                  className={`text-lg font-medium transition-colors duration-300 ${
                    selectedIndex === index 
                      ? 'text-foreground' 
                      : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {domain.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}