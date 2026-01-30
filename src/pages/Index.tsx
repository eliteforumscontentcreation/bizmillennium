import { Layout } from "@/components/layout";
import {
  HeroSection,
  StatsSection,
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
      <StatsSection />
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
