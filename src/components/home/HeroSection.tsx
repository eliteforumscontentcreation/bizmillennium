import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedStat } from "./AnimatedStat";
import { useCyclingTypewriter } from "@/hooks/useCyclingTypewriter";

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
  const cyclingWords = [
    "Conferences",
    "Webinars",
    "Awards",
    "Data Intelligence",
  ];
  const cyclingText = useCyclingTypewriter(cyclingWords, 100, 50, 2000);

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
      <div className="bg-white pt-16 pb-16 md:pb-24">
        <div className="container-wide relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
            {/* Main Title with Purple-Cyan Gradient */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 hero-text-gradient">
              Biz Millennium
            </h1>

            {/* Cycling Typewriter Effect - "For [word]" - Same size as main title */}
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 min-h-[2.5rem] md:min-h-[3.5rem] flex items-center justify-center">
              <span className="text-black">for </span>
              <span className="ml-2 text-black">
                {cyclingText}
                <span className="inline-block w-0.5 h-6 md:h-8 bg-black ml-1 animate-pulse"></span>
              </span>
            </div>

            {/* CTA Buttons - Black color */}
            <div className="flex flex-row items-center justify-center gap-3 mb-6 md:mb-8">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-6 md:px-8 text-sm md:text-base bg-white border-black text-black hover:bg-gray-100"
                asChild
              >
                <Link to="/contact">Partner with Us</Link>
              </Button>
              <Button
                size="lg"
                className="rounded-full px-6 md:px-8 text-sm md:text-base bg-black text-white hover:bg-black/90"
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

          {/* Stats Grid - Black color with less rounded corners */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8 md:mt-12">
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
