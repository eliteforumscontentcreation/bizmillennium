import { Layout } from "@/components/layout";
import {
  HeroSection,
  PartnersSection,
  EventTypesSection,
  ExpertiseSection,
  DomainsSection,
  TestimonialsSection,
  BlogSection,
  GalleryCtaSection,
} from "@/components/home";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PartnersSection />
      <EventTypesSection />
      <ExpertiseSection />
      <DomainsSection />
      <TestimonialsSection />
      <BlogSection />
      <GalleryCtaSection />
    </Layout>
  );
};

export default Index;
