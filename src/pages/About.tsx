import { Layout } from "@/components/layout";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import expertiseImage from "@/assets/expertise-image.jpg";

const aboutPoints = [
  "Bringing together industry leaders, professionals, and experts",
  "Fostering networking, collaboration, and knowledge exchange",
  "Curating a diverse range of conference topics",
  "Meticulous event planning and management for seamless experiences",
  "Providing a platform for building partnerships",
  "Committed to delivering value, inspiration, and growth opportunities",
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 hero-text-gradient">
            About Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unleashing Tomorrow's Business Solutions, Today. Explore a World Where Innovation Meets Commerce.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div>
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={expertiseImage}
                  alt="Business professionals at Biz Millennium event"
                  className="w-full h-auto aspect-[4/3] object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <p className="text-muted-foreground mb-6">
                Biz Millennium is dedicated to bringing professionals and industry leaders together 
                through our high-quality business-to-business events. With a focus on networking, 
                collaboration, and knowledge exchange, we create a platform where meaningful 
                connections are formed and opportunities for growth are unlocked.
              </p>
              <p className="text-muted-foreground mb-8">
                Our team of experienced event professionals works tirelessly to deliver exceptional 
                experiences that leave lasting impressions. From intimate roundtables to large-scale 
                conferences, we tailor each event to meet the unique needs of our clients and attendees.
              </p>
              
              <ul className="space-y-3 mb-8">
                {aboutPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-accent" />
                    </span>
                    <span className="text-foreground/80">{point}</span>
                  </li>
                ))}
              </ul>

              <Button asChild size="lg" className="gap-2">
                <Link to="/services">
                  Explore Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision</h2>
            <p className="text-lg text-primary-foreground/80">
              To be the premier destination for business professionals seeking meaningful 
              connections, actionable insights, and transformative experiences. We envision 
              a world where every business event creates lasting value and drives positive 
              change in industries across the globe.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;