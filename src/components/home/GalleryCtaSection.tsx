import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera } from "lucide-react";

export function GalleryCtaSection() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container-wide">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-accent font-medium text-sm uppercase tracking-wider mb-4 block">
            Our Motto
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Delivering the exceptional
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Explore our gallery to see the unforgettable moments from our past events.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            asChild
            className="gap-2"
          >
            <Link to="/gallery">
              <Camera className="h-5 w-5" />
              Visit Event Gallery
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
