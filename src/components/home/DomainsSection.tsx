import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Cpu, 
  Target, 
  Pill, 
  Users, 
  Landmark, 
  Factory, 
  Truck, 
  Leaf,
  Sparkles
} from "lucide-react";

interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Target,
  Pill,
  Users,
  Landmark,
  Factory,
  Truck,
  Leaf,
};

// Define different gradient colors for each domain
const domainColors = [
  "from-[#1e40af] via-[#3b82f6] to-[#06b6d4]", // Blue gradient
  "from-[#ea580c] via-[#f97316] to-[#fb923c]", // Orange gradient
  "from-[#7c3aed] via-[#a855f7] to-[#c084fc]", // Purple gradient
  "from-[#059669] via-[#10b981] to-[#34d399]", // Green gradient
  "from-[#dc2626] via-[#ef4444] to-[#f87171]", // Red gradient
  "from-[#0891b2] via-[#06b6d4] to-[#22d3ee]", // Cyan gradient
  "from-[#4f46e5] via-[#6366f1] to-[#818cf8]", // Indigo gradient
  "from-[#16a34a] via-[#22c55e] to-[#4ade80]", // Lime gradient
];

export function DomainsSection() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function fetchDomains() {
      const { data, error } = await supabase
        .from("domains")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (!error && data) {
        setDomains(data);
      }
    }
    fetchDomains();
  }, []);

  // Fallback data with enhanced descriptions
  const fallbackDomains = [
    { 
      id: "1", 
      name: "Information Technology", 
      description: "At the intersection of innovation and technology, we host cutting-edge IT conferences that foster groundbreaking discussions on digital transformation, cybersecurity, cloud computing, and emerging technologies shaping the future of business.", 
      icon: "Cpu" 
    },
    { 
      id: "2", 
      name: "Marketing & Sales", 
      description: "Empowering brands to shine in competitive markets, our marketing and sales conferences unveil proven strategies, innovative tactics, and data-driven approaches that resonate with modern consumers and drive measurable business growth.", 
      icon: "Target" 
    },
    { 
      id: "3", 
      name: "Pharmaceutical", 
      description: "In the realm of healthcare breakthroughs and medical innovation, our pharmaceutical conferences converge top minds in drug development, clinical research, regulatory compliance, and patient-centric care to advance the future of medicine.", 
      icon: "Pill" 
    },
    { 
      id: "4", 
      name: "Human Resources", 
      description: "Navigating the evolving landscape of talent management, our HR conferences delve deep into employee engagement, leadership development, diversity & inclusion, and workplace culture transformation that shapes thriving organizations.", 
      icon: "Users" 
    },
    { 
      id: "5", 
      name: "Finance & Legal", 
      description: "Where financial expertise meets regulatory excellence, our finance and legal conferences provide a premier platform for industry leaders to dissect market complexities, compliance challenges, and strategic opportunities in an ever-changing business environment.", 
      icon: "Landmark" 
    },
    { 
      id: "6", 
      name: "Manufacturing", 
      description: "From Industry 4.0 technologies to sustainable manufacturing practices, our conferences spotlight the latest trends in automation, supply chain optimization, quality control, and operational excellence driving the future of production.", 
      icon: "Factory" 
    },
    { 
      id: "7", 
      name: "Supply Chain & Logistics", 
      description: "In the heartbeat of global commerce, our supply chain and logistics conferences facilitate critical conversations on optimizing operations, leveraging AI and IoT, managing disruptions, and building resilient distribution networks.", 
      icon: "Truck" 
    },
    { 
      id: "8", 
      name: "CSR & Sustainability", 
      description: "Uniting visionaries committed to creating lasting positive impact, our CSR and sustainability conferences explore innovative approaches to environmental stewardship, social responsibility, and ethical business practices that benefit both planet and profit.", 
      icon: "Leaf" 
    },
  ];

  const displayDomains = domains.length > 0 ? domains : fallbackDomains;
  const selectedDomain = displayDomains[selectedIndex];

  // Auto-scroll effect
  useEffect(() => {
    if (displayDomains.length <= 1) return;
    if (isPaused) return;

    const intervalId = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % displayDomains.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(intervalId);
  }, [displayDomains.length, isPaused]);

  const IconComponent = selectedDomain?.icon ? iconMap[selectedDomain.icon] || Sparkles : Sparkles;
  const currentGradient = domainColors[selectedIndex % domainColors.length];

  return (
    <section 
      className="py-20 md:py-28 bg-gradient-to-b from-background via-secondary/30 to-background relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="container-wide relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-subtitle mb-4 inline-block">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Domains We Cater
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Delivering world-class conferences and events across diverse industries
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left - Enhanced Gradient Card with Selected Domain */}
          <div className="relative h-[500px] md:h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/20 to-accent/20 rounded-3xl blur-2xl"></div>
            <div className={`relative h-full rounded-3xl overflow-hidden bg-gradient-to-br ${currentGradient} shadow-2xl transform transition-all duration-500 hover:scale-[1.02]`}>
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
                {/* Icon at top */}
                <div className="flex justify-start">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:rotate-6">
                    <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                </div>

                {/* Domain info at bottom */}
                <div className="space-y-6">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                    {selectedDomain?.name}
                  </h3>
                  
                  <p className="text-white/90 text-base md:text-lg leading-relaxed max-w-xl">
                    {selectedDomain?.description}
                  </p>

                  {/* Progress indicator */}
                  <div className="flex gap-2">
                    {displayDomains.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          index === selectedIndex 
                            ? 'w-12 bg-white' 
                            : 'w-8 bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Compact Domain List matching reference image */}
          <div className="space-y-2 h-[500px] md:h-[600px] overflow-y-auto pr-2">
            {displayDomains.map((domain, index) => {
              const DomainIcon = domain.icon ? iconMap[domain.icon] || Sparkles : Sparkles;
              const isSelected = selectedIndex === index;
              
              return (
                <button
                  key={domain.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group ${
                    isSelected 
                      ? 'bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-2 border-accent shadow-md' 
                      : 'bg-card hover:bg-secondary/50 border-2 border-transparent hover:border-border'
                  }`}
                >
                  {/* Icon - smaller and more compact */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isSelected 
                      ? 'bg-gradient-to-br from-accent to-primary text-white shadow-md' 
                      : 'bg-secondary text-muted-foreground group-hover:bg-accent/20 group-hover:text-accent'
                  }`}>
                    <DomainIcon className="w-5 h-5" />
                  </div>

                  {/* Text - more compact */}
                  <div className="flex-1 text-left">
                    <span className={`text-base font-semibold transition-colors duration-300 block ${
                      isSelected 
                        ? 'text-foreground' 
                        : 'text-muted-foreground group-hover:text-foreground'
                    }`}>
                      {domain.name}
                    </span>
                  </div>

                  {/* Indicator - smaller */}
                  <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    isSelected 
                      ? 'bg-accent scale-125' 
                      : 'bg-border group-hover:bg-accent/50'
                  }`}></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}