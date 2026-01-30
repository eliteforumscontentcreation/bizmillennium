import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Landmark, Factory, Truck, Leaf, Cpu, Target, Pill, Users 
} from "lucide-react";

interface Domain {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, React.ElementType> = {
  Landmark,
  Factory,
  Truck,
  Leaf,
  Cpu,
  Target,
  Pill,
  Users,
};

export function DomainsSection() {
  const [domains, setDomains] = useState<Domain[]>([]);

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
    { id: "1", name: "Finance & Legal", description: "Where numbers meet regulations, our finance and legal conferences provide a platform for experts to dissect complexities.", icon: "Landmark" },
    { id: "2", name: "Manufacturing", description: "From cutting-edge technologies to sustainable practices, our manufacturing conferences spotlight industry trends.", icon: "Factory" },
    { id: "3", name: "Supply & Logistics", description: "In the heartbeat of global trade, our supply and logistics conferences facilitate conversations on optimizing supply chains.", icon: "Truck" },
    { id: "4", name: "CSR & Sustainability", description: "Our CSR and sustainability conferences unite visionaries committed to creating positive social and environmental impacts.", icon: "Leaf" },
    { id: "5", name: "Information Tech", description: "At the intersection of innovation and tech, we host IT conferences fostering groundbreaking discussions.", icon: "Cpu" },
    { id: "6", name: "Marketing & Sales", description: "Empowering brands to shine, our marketing and sales conferences unveil strategies that resonate.", icon: "Target" },
    { id: "7", name: "Pharmaceutical", description: "In the realm of healthcare breakthroughs, our pharmaceutical conferences converge top minds.", icon: "Pill" },
    { id: "8", name: "HR", description: "Navigating the human landscape, our HR conferences delve into talent management, leadership, and workplace culture.", icon: "Users" },
  ];

  const displayDomains = domains.length > 0 ? domains : fallbackDomains;

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">Domains we cater</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We organize conferences and events across multiple industry verticals, 
            bringing together experts and thought leaders from diverse fields.
          </p>
        </div>

        {/* Domain Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayDomains.map((domain, index) => {
            const IconComponent = iconMap[domain.icon] || Landmark;
            return (
              <div
                key={domain.id}
                className="domain-card group animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                  <IconComponent className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {domain.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {domain.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
