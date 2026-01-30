import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

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
  return (
    <section className="relative py-16 md:py-24 lg:py-32 bg-secondary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary opacity-50" />
      
      <div className="container-wide relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 animate-fade-in-up hero-text-gradient">
            {headline}
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
            {subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-200">
            <Button size="lg" asChild className="btn-primary px-8">
              <Link to={ctaLink}>{ctaText}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8">
              <Link to={secondaryCtaLink}>{secondaryCtaText}</Link>
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-muted-foreground animate-fade-in-up animation-delay-300">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" />
              <span>Custom Event Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" />
              <span>Tailored Event Experiences</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" />
              <span>Global Corporate Network</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
