import { Link } from "react-router-dom";
import { Menu, ChevronDown, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

interface NavigationItem {
  id: string;
  name: string;
  link: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
}

// Fallback navigation structure matching the reference image
const fallbackAboutItems = [
  { id: "1", name: "Company", link: "/about", description: "Discover our journey and core values.", color: "bg-blue-500", parent_id: null, sort_order: 1, is_active: true },
  { id: "2", name: "Our Brands", link: "/brands", description: "Explore the brands that define us.", color: "bg-orange-500", parent_id: null, sort_order: 2, is_active: true },
  { id: "3", name: "Partners", link: "/partners", description: "Building successful collaborations worldwide.", color: "bg-green-500", parent_id: null, sort_order: 3, is_active: true },
  { id: "4", name: "Event Gallery", link: "/gallery", description: "A glimpse into our memorable moments.", color: "bg-pink-500", parent_id: null, sort_order: 4, is_active: true },
  { id: "5", name: "Blog", link: "/blog", description: "Insights, trends, and thought leadership.", color: "bg-red-500", parent_id: null, sort_order: 5, is_active: true },
  { id: "6", name: "Careers", link: "/careers", description: "Join our team and shape the future.", color: "bg-cyan-500", parent_id: null, sort_order: 6, is_active: true },
];

const fallbackBusinessItems = [
  { id: "7", name: "Conferences", link: "/events?type=conference", description: "Leading industry events & discussions.", color: "bg-orange-500", parent_id: null, sort_order: 1, is_active: true },
  { id: "8", name: "Roundtable", link: "/events?type=roundtable", description: "Exclusive, high-level discussions.", color: "bg-cyan-500", parent_id: null, sort_order: 2, is_active: true },
  { id: "9", name: "In-house", link: "/events?type=inhouse", description: "Tailored solutions for your organization.", color: "bg-gray-600", parent_id: null, sort_order: 3, is_active: true },
  { id: "10", name: "Data Generation", link: "/events?type=data", description: "Custom data as per your needs.", color: "bg-purple-500", parent_id: null, sort_order: 4, is_active: true },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setAboutDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setAboutDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-primary backdrop-blur supports-[backdrop-filter]:bg-primary/95 border-b border-primary-foreground/10">
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Biz Millennium" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* About Dropdown */}
            <div 
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="flex items-center gap-1 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                About
                <ChevronDown className={`h-4 w-4 transition-transform ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu Dropdown */}
              {aboutDropdownOpen && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] bg-background rounded-xl shadow-xl border border-border p-6 z-50"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="grid grid-cols-2 gap-8">
                    {/* About BM Column */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-4">About BM</h3>
                      <div className="space-y-3">
                        {fallbackAboutItems.map((item) => (
                          <Link
                            key={item.id}
                            to={item.link}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                            onClick={() => setAboutDropdownOpen(false)}
                          >
                            <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                              <div className="w-3 h-3 border-2 border-white rounded-sm" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {item.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Our Businesses Column */}
                    <div className="border-l border-border pl-8">
                      <h3 className="text-sm font-semibold text-foreground mb-4">Our Businesses</h3>
                      <div className="space-y-3">
                        {fallbackBusinessItems.map((item) => (
                          <Link
                            key={item.id}
                            to={item.link}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                            onClick={() => setAboutDropdownOpen(false)}
                          >
                            <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                              <div className="w-3 h-3 border-2 border-white rounded-sm" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {item.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {item.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link
                        to="/events"
                        className="flex items-center gap-2 mt-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setAboutDropdownOpen(false)}
                      >
                        Explore all Services
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/events"
              className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Events
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="secondary" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/contact">Partner with Us</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <nav className="flex flex-col gap-4 mt-8">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">About BM</div>
                  {fallbackAboutItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      onClick={() => setIsOpen(false)}
                      className="block py-2 text-foreground hover:text-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Our Businesses</div>
                  {fallbackBusinessItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      onClick={() => setIsOpen(false)}
                      className="block py-2 text-foreground hover:text-accent transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <Link
                    to="/events"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-lg font-medium text-foreground hover:text-accent transition-colors"
                  >
                    Events
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-lg font-medium text-foreground hover:text-accent transition-colors"
                  >
                    Contact
                  </Link>
                </div>
                <Button className="mt-4" asChild>
                  <Link to="/contact" onClick={() => setIsOpen(false)}>
                    Partner with Us
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
