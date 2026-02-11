import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, ChevronDown, ArrowRight, Building2, Briefcase, Users, Image, FileText, UserPlus, Mic2, UsersRound, Home, Database } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import logo from "@/images/Logo.jpg";

// About BM items with icons
const fallbackAboutItems = [
  { id: "1", name: "Company", link: "/company", description: "Discover our journey and core values.", color: "bg-blue-500", icon: Building2 },
  { id: "2", name: "Our Brands", link: "/brands", description: "Explore the brands that define us.", color: "bg-orange-500", icon: Briefcase },
  { id: "3", name: "Partners", link: "/partners", description: "Building successful collaborations worldwide.", color: "bg-green-500", icon: Users },
  { id: "4", name: "Event Gallery", link: "/gallery", description: "A glimpse into our memorable moments.", color: "bg-pink-500", icon: Image },
  { id: "5", name: "Blog", link: "/blog", description: "Insights, trends, and thought leadership.", color: "bg-red-500", icon: FileText },
  { id: "6", name: "Careers", link: "/careers", description: "Join our team and shape the future.", color: "bg-cyan-500", icon: UserPlus },
];

// Our Businesses items with icons - now unclickable
const fallbackBusinessItems = [
  { id: "7", name: "Conferences", description: "Leading industry events & discussions.", color: "bg-orange-500", icon: Mic2 },
  { id: "8", name: "Roundtable", description: "Exclusive, high-level discussions.", color: "bg-cyan-500", icon: UsersRound },
  { id: "9", name: "In-house", description: "Tailored solutions for your organization.", color: "bg-gray-600", icon: Home },
  { id: "10", name: "Data Generation", description: "Custom data as per your needs.", color: "bg-purple-500", icon: Database },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
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
    <header className="sticky top-0 z-50 w-full bg-black">
      <div className="container-wide">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Biz Millennium" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation - moved more to the right */}
          <nav className="hidden md:flex items-center gap-8 ml-auto mr-8">
            {/* About Dropdown */}
            <div 
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white transition-colors"
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
                      <h3 className="text-sm font-semibold text-foreground mb-4">About Biz Millennium</h3>
                      <div className="space-y-3">
                        {fallbackAboutItems.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={item.id}
                              to={item.link}
                              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
                              onClick={() => setAboutDropdownOpen(false)}
                            >
                              <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                                <IconComponent className="w-5 h-5 text-white" />
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
                          );
                        })}
                      </div>
                    </div>

                    {/* Our Businesses Column - Now unclickable */}
                    <div className="border-l border-border pl-8">
                      <h3 className="text-sm font-semibold text-foreground mb-4">Our Businesses</h3>
                      <div className="space-y-3">
                        {fallbackBusinessItems.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <div
                              key={item.id}
                              className="flex items-start gap-3 p-2 rounded-lg cursor-default"
                            >
                              <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                                <IconComponent className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground">
                                  {item.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <Link
                        to="/services"
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
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Events
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="secondary" asChild className="bg-white hover:bg-white/90 text-foreground">
              <Link to="/contact">Partner with Us</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <nav className="flex flex-col gap-4 mt-8">
                {/* Collapsible About Section */}
                <Collapsible open={mobileAboutOpen} onOpenChange={setMobileAboutOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-lg font-medium text-foreground">
                    About
                    <ChevronDown className={`h-5 w-5 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">About BM</div>
                      {fallbackAboutItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            key={item.id}
                            to={item.link}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 py-2 text-foreground hover:text-accent transition-colors"
                          >
                            <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Our Businesses</div>
                      {fallbackBusinessItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 py-2 text-foreground cursor-default"
                          >
                            <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            {item.name}
                          </div>
                        );
                      })}
                      <Link
                        to="/services"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Explore all Services
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

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