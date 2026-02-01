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
  CtaSection,
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
      <CtaSection />
    </Layout>
  );
};

export default Index;
