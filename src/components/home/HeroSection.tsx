import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Statistic {
  id: string;
  label: string;
  value: string;
  sort_order: number;
}

interface HeroSectionProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export function HeroSection({
  headline = "Biz Millennium",
  subheadline = "Unleashing Tomorrow's Business Solutions, Today. Explore a World Where Innovation Meets Commerce at Biz Millennium.",
  ctaText = "Partner with Us",
  ctaLink = "/contact",
  secondaryCtaText = "Upcoming Events",
  secondaryCtaLink = "/events",
}: HeroSectionProps) {
  const [stats, setStats] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .order("sort_order");

      if (!error && data) {
        setStats(data);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  // Fallback data if database is empty
  const fallbackStats = [
    { id: "1", label: "Successful Events", value: "400+", sort_order: 1 },
    { id: "2", label: "Valued Partnerships", value: "170+", sort_order: 2 },
    { id: "3", label: "Companies", value: "8,000+", sort_order: 3 },
    { id: "4", label: "Experts Featured", value: "1,350+", sort_order: 4 },
    { id: "5", label: "Delegates Engaged", value: "14,000+", sort_order: 5 },
    { id: "6", label: "Industry Awards", value: "500+", sort_order: 6 },
  ];

  const displayStats = stats.length > 0 ? stats : fallbackStats;

  return (
    <section className="relative py-16 md:py-20 lg:py-24 bg-secondary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary opacity-50" />
      
      <div className="container-wide relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 animate-fade-in-up hero-text-gradient">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-100">
            {subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up animation-delay-200">
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className="px-8 rounded-full border-2 border-foreground/20 hover:bg-foreground hover:text-background"
            >
              <Link to={ctaLink}>{ctaText}</Link>
            </Button>
            <Button 
              size="lg" 
              asChild 
              className="px-8 rounded-full bg-primary hover:bg-primary/90"
            >
              <Link to={secondaryCtaLink}>{secondaryCtaText}</Link>
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground mb-10 animate-fade-in-up animation-delay-300">
            <div className="flex items-center gap-2">
              <span>Custom Event Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-3 w-3 text-accent" fill="currentColor" />
            </div>
            <div className="flex items-center gap-2">
              <span>Tailored Event Experiences</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-3 w-3 text-accent" fill="currentColor" />
            </div>
            <div className="flex items-center gap-2">
              <span>Global Corporate Network</span>
            </div>
          </div>

          {/* Stats Grid - Integrated into Hero */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 animate-fade-in-up animation-delay-400">
            {displayStats.map((stat) => (
              <div
                key={stat.id}
                className="stats-card py-4 px-3"
              >
                <div className="stats-number text-2xl md:text-3xl lg:text-4xl">{stat.value}</div>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
