import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedStat } from "./AnimatedStat";
import { useTypewriter } from "@/hooks/useTypewriter";

interface Statistic {
  id: string;
  value: string;
  label: string;
  sort_order: number;
}

const fallbackStats = [
  { id: "1", value: "400+", label: "Successful Events", sort_order: 1 },
  { id: "2", value: "170+", label: "Valued Partnerships", sort_order: 2 },
  { id: "3", value: "8,000+", label: "Companies", sort_order: 3 },
  { id: "4", value: "1,350+", label: "Experts Featured", sort_order: 4 },
  { id: "5", value: "14,000+", label: "Delegates Engaged", sort_order: 5 },
  { id: "6", value: "500+", label: "Industry Awards", sort_order: 6 },
];

export function HeroSection() {
  const [stats, setStats] = useState<Statistic[]>([]);
  const { displayedText, isComplete } = useTypewriter("Biz Millennium", 120);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (!error && data && data.length > 0) {
        setStats(data);
      } else {
        setStats(fallbackStats);
      }
    }
    fetchStats();
  }, []);

  const displayStats = stats.length > 0 ? stats : fallbackStats;

  return (
    <section className="relative bg-background py-16 md:py-24 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-transparent pointer-events-none" />
      
      <div className="container-wide relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Main Title - Purple with Typewriter Effect */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-primary">
            {displayedText}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Unleashing Tomorrow's Business Solutions, Today. Explore a World Where Innovation Meets Commerce at Biz Millennium.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button 
              size="lg" 
              variant="outline"
              className="rounded-full px-8 bg-background border-foreground text-foreground hover:bg-foreground hover:text-background"
              asChild
            >
              <Link to="/contact">Partner with Us</Link>
            </Button>
            <Button 
              size="lg" 
              className="rounded-full px-8 bg-foreground text-background hover:bg-foreground/90"
              asChild
            >
              <a href="https://events.bizmillennium.com/" target="_blank" rel="noopener noreferrer">
                Upcoming Events
              </a>
            </Button>
          </div>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
            <span>Custom Event Solutions</span>
            <Star className="h-3 w-3 fill-current text-muted-foreground/50" />
            <span>Tailored Event Experiences</span>
            <Star className="h-3 w-3 fill-current text-muted-foreground/50" />
            <span>Global Corporate Network</span>
          </div>
        </div>
        
        {/* Stats Grid - 6 columns on desktop with animated counting */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-12">
          {displayStats.map((stat) => (
            <AnimatedStat
              key={stat.id}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
