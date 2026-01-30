import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Briefcase, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Career {
  id: string;
  slug: string;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: string | null;
  description: string | null;
}

const Careers = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCareers() {
      const { data, error } = await supabase
        .from("careers")
        .select("*")
        .eq("is_active", true);

      if (!error && data) {
        setCareers(data);
      }
      setLoading(false);
    }
    fetchCareers();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 hero-text-gradient">
            Join Our Team
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Be part of a dynamic team that's shaping the future of B2B events. 
            We're always looking for talented individuals to join our mission.
          </p>
        </div>
      </section>

      {/* Careers List */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-wide">
          {careers.length > 0 ? (
            <div className="space-y-6">
              {careers.map((career) => (
                <Link
                  key={career.id}
                  to={`/careers/${career.slug}`}
                  className="block bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                        {career.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {career.department && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {career.department}
                          </span>
                        )}
                        {career.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {career.location}
                          </span>
                        )}
                        {career.employment_type && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {career.employment_type}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" className="gap-2 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No open positions at the moment. Check back soon!
              </p>
              <Button asChild>
                <Link to="/contact">Send us your resume</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don't see a role for you?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
          </p>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
