import { forwardRef, useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: string;
  name: string;
  title: string | null;
  company: string | null;
  content: string;
  photo_url: string | null;
}

export const TestimonialsSection = forwardRef<HTMLElement>((_, ref) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("sort_order");

      if (!error && data) {
        setTestimonials(data);
      }
    }
    fetchTestimonials();
  }, []);

  // Fallback data
  const fallbackTestimonials = [
    { id: "1", name: "Vimal Ladha", title: "CFO", company: "PSIPL", content: "I want to express my sincere gratitude to the Biz Millennium team for organizing the exceptional CFO Connect Summit focused on the Fintech ecosystem. The event was well-organized, featuring insightful speakers who shared valuable knowledge on current trends and innovations.", photo_url: null },
    { id: "2", name: "Raghupati Mishra", title: "President & Country Head", company: "Liberty Steel Group", content: "Biz Millennium organized a well-calibrated event that was thoroughly enjoyable. The panel was a delight, featuring industry stalwarts who brought valuable insights to the discussions.", photo_url: null },
    { id: "3", name: "Arvind Talan", title: "Executive", company: "Jet Freight Logistics Limited", content: "I had the pleasure of speaking at a conference organized by Biz Millennium, and it was a remarkable experience. The event was well-organized, offering an excellent platform for learning and networking.", photo_url: null },
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
  }, [displayTestimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  }, [displayTestimonials.length]);

  // Auto-scroll effect
  useEffect(() => {
    if (displayTestimonials.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [displayTestimonials.length, isPaused, nextSlide]);

  if (displayTestimonials.length === 0) return null;

  const current = displayTestimonials[currentIndex];

  return (
    <section 
      ref={ref}
      className="py-16 md:py-24 bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-subtitle mb-2 block">Testimonials</span>
          <h2 className="section-title mb-4">What our clients say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We have a genuine approach for services and we are grateful to receive their feedback on our service.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="testimonial-card relative transition-all duration-500">
            <Quote className="h-12 w-12 text-accent/20 absolute top-6 left-6" />
            
            <div className="pt-12 pb-6 px-4 md:px-8">
              <blockquote className="text-lg md:text-xl text-foreground/90 mb-8 leading-relaxed">
                "{current.content}"
              </blockquote>
              
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-accent">
                    {current.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{current.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {current.title}{current.company && ` - ${current.company}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevSlide}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              {displayTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-8 bg-accent" : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextSlide}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = "TestimonialsSection";
