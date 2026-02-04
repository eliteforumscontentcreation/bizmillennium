import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import expertiseImage from "@/assets/expertise-image.jpg";

const expertisePoints = [
  "Bringing together industry leaders, professionals, and experts",
  "Fostering networking, collaboration, and knowledge exchange",
  "Curating a diverse range of conference topics",
  "Meticulous event planning and management for seamless experiences",
  "Providing a platform for building partnerships and staying ahead in business",
  "Committed to delivering value, inspiration, and growth opportunities",
  "Empowering professionals through thought-provoking content and sessions",
];

export function ExpertiseSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <span className="section-subtitle mb-2 block">Our Expertise</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6">A New Learning Experience</h2>
            <p className="text-muted-foreground mb-8">
              We are dedicated to bringing professionals and industry leaders together through our 
              high-quality business-to-business events. With a focus on networking, collaboration, 
              and knowledge exchange, we create a platform where meaningful connections are formed 
              and opportunities for growth are unlocked.
            </p>
            
            <ul className="space-y-3 mb-8">
              {expertisePoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-accent" />
                  </span>
                  <span className="text-sm text-foreground/80">{point}</span>
                </li>
              ))}
            </ul>

            <Button asChild>
              <Link to="/about" className="gap-2">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={expertiseImage}
                alt="Business professionals networking at an event"
                className="w-full h-auto aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
