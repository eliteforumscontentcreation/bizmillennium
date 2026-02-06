import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedStat } from "./AnimatedStat";

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
    <section className="relative overflow-hidden">
      {/* White Content Area */}
      <div className="bg-white pt-12 md:pt-16 pb-12 md:pb-20">
        <div className="container-wide relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
            {/* Main Title with Purple-Cyan Gradient */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 hero-text-gradient">
              Biz Millennium
            </h1>

            {/* Static Tagline - matching reference image */}
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 px-4 max-w-3xl mx-auto leading-relaxed">
              Unleashing Tomorrow's Business Solutions, Today. Explore a World
              Where Innovation Meets Commerce at Biz Millennium.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-row items-center justify-center gap-3 mb-6 md:mb-8">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-5 md:px-8 text-sm md:text-base bg-white border-black text-black hover:bg-gray-100"
                asChild
              >
                <Link to="/contact">Partner with Us</Link>
              </Button>
              <Button
                size="lg"
                className="rounded-full px-5 md:px-8 text-sm md:text-base bg-black text-white hover:bg-black/90"
                asChild
              >
                <a
                  href="https://events.bizmillennium.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Upcoming Events
                </a>
              </Button>
            </div>

            {/* Feature highlights - Hidden on mobile */}
            <div className="hidden sm:flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 text-muted-foreground text-sm sm:text-base">
              <span>Custom Event Solutions</span>
              <span className="text-yellow-500">★</span>
              <span>Tailored Event Experiences</span>
              <span className="text-yellow-500">★</span>
              <span>Global Corporate Network</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mt-6 md:mt-10">
            {displayStats.map((stat) => (
              <AnimatedStat
                key={stat.id}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
