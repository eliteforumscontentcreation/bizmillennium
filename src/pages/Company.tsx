import { Layout } from "@/components/layout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, Users, Target, Award, Globe } from "lucide-react";

interface PageContent {
  headline: string;
  subheadline: string;
  story_title: string;
  story_content: string;
  story_points: string[];
  vision_title: string;
  vision_content: string;
  mission_title: string;
  mission_content: string;
}

const defaultContent: PageContent = {
  headline: "About Biz Millennium",
  subheadline: "Unleashing Tomorrow's Business Solutions, Today. Explore a World Where Innovation Meets Commerce.",
  story_title: "Our Story",
  story_content: "Biz Millennium is dedicated to bringing professionals and industry leaders together through our high-quality business-to-business events. With a focus on networking, collaboration, and knowledge exchange, we create a platform where meaningful connections are formed and opportunities for growth are unlocked.",
  story_points: [
    "Bringing together industry leaders, professionals, and experts",
    "Fostering networking, collaboration, and knowledge exchange",
    "Curating a diverse range of conference topics",
    "Meticulous event planning and management for seamless experiences",
    "Providing a platform for building partnerships",
    "Committed to delivering value, inspiration, and growth opportunities",
  ],
  vision_title: "Our Vision",
  vision_content: "To be the premier destination for business professionals seeking meaningful connections, actionable insights, and transformative experiences.",
  mission_title: "Our Mission",
  mission_content: "We envision a world where every business event creates lasting value and drives positive change in industries across the globe.",
};

const Company = () => {
  const [content, setContent] = useState<PageContent>(defaultContent);

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase
        .from("pages")
        .select("content")
        .eq("slug", "company")
        .eq("is_published", true)
        .single();

      if (data?.content) {
        setContent({ ...defaultContent, ...(data.content as object) });
      }
    }
    fetchContent();
  }, []);

  const features = [
    { icon: Users, title: "Expert Network", description: "Access to industry leaders and professionals" },
    { icon: Target, title: "Strategic Focus", description: "Targeted events for maximum business impact" },
    { icon: Award, title: "Excellence", description: "Award-winning event management" },
    { icon: Globe, title: "Global Reach", description: "Connecting businesses worldwide" },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[hsl(280,80%,55%)] to-[hsl(320,80%,55%)] bg-clip-text text-transparent">
            {content.headline}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {content.subheadline}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-background">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-2xl bg-secondary/50 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
              {content.story_title}
            </h2>
            <p className="text-muted-foreground mb-8 text-center text-lg">
              {content.story_content}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {content.story_points.map((point, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30">
                  <span className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-accent" />
                  </span>
                  <span className="text-foreground/80">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{content.vision_title}</h2>
              <p className="text-lg text-primary-foreground/80">
                {content.vision_content}
              </p>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{content.mission_title}</h2>
              <p className="text-lg text-primary-foreground/80">
                {content.mission_content}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Company;
