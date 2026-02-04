import { Layout } from "@/components/layout";
import {
  HeroSection,
  PartnersSection,
  EventTypesSection,
  EventsSection,
  ExpertiseSection,
  DomainsSection,
  TestimonialsSection,
  BlogSection,
  GalleryCtaSection,
  CtaSection,
} from "@/components/home";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PartnersSection />
      <EventTypesSection />
      <EventsSection />
      <ExpertiseSection />
      <DomainsSection />
      <TestimonialsSection />
      <BlogSection />
      <GalleryCtaSection />
      <CtaSection />
    </Layout>
  );
};

export default Index;