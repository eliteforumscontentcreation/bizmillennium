import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CtaSection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} className="py-16 md:py-24 bg-background border-b border-border">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Illustration */}
          <div className="flex-shrink-0">
            <div className="relative">
              {/* Mailbox illustration using gradients and shapes */}
              <svg
                width="280"
                height="240"
                viewBox="0 0 280 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                {/* Person */}
                <circle cx="180" cy="50" r="25" fill="#FFDBB4" />
                <ellipse cx="180" cy="85" rx="35" ry="25" fill="#F59E0B" />
                <rect x="165" y="85" width="30" height="45" fill="#F59E0B" />
                
                {/* Megaphone */}
                <ellipse cx="225" cy="60" rx="25" ry="15" fill="#6B7280" />
                <rect x="200" y="55" width="25" height="10" fill="#9CA3AF" />
                
                {/* Mail box */}
                <rect x="60" y="100" width="100" height="120" rx="8" fill="#EF4444" />
                <rect x="70" y="110" width="80" height="40" rx="4" fill="#DC2626" />
                <text x="85" y="137" fill="white" fontSize="14" fontWeight="bold">MAIL</text>
                
                {/* Post */}
                <rect x="100" y="220" width="20" height="30" fill="#374151" />
                
                {/* Paper planes */}
                <path d="M40 60 L60 70 L50 80 Z" fill="#9CA3AF" />
                <path d="M230 30 L250 40 L240 50 Z" fill="#9CA3AF" />
                <path d="M250 90 L270 100 L260 110 Z" fill="#9CA3AF" />
              </svg>
            </div>
          </div>
          
          {/* Content */}
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Have Any Project In Mind?
            </h2>
            <Button 
              size="lg" 
              className="bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white rounded-full px-8"
              asChild
            >
              <Link to="/contact">
                Reach Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

CtaSection.displayName = "CtaSection";
