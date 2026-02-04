-- Seed data for Biz Millennium
-- This file contains sample data for testing and development

-- Insert sample site settings
INSERT INTO public.site_settings (
  site_title,
  site_tagline,
  contact_email,
  contact_phone,
  contact_address,
  facebook_url,
  twitter_url,
  linkedin_url,
  instagram_url,
  global_seo_title,
  global_seo_description
) VALUES (
  'Biz Millennium',
  'Unleashing Tomorrow''s Business Solutions, Today',
  'info@bizmillennium.com',
  '+1 (555) 123-4567',
  '123 Business Ave, Suite 100, City, State 12345',
  'https://facebook.com/bizmillennium',
  'https://twitter.com/bizmillennium',
  'https://linkedin.com/company/bizmillennium',
  'https://instagram.com/bizmillennium',
  'Biz Millennium - Business Events & Conferences',
  'Leading provider of world-class business conferences, roundtables, and corporate training events.'
);

-- Insert sample event types
INSERT INTO public.event_types (name, description, icon, sort_order) VALUES
('Conference', 'Large-scale industry conferences', 'users', 1),
('Roundtable', 'Intimate executive discussions', 'message-circle', 2),
('In-House', 'Custom corporate training', 'building', 3),
('Data Generation', 'Data analytics and BI events', 'database', 4);

-- Insert sample blog categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
('Industry Insights', 'industry-insights', 'Latest trends and analysis in business'),
('Event Recaps', 'event-recaps', 'Highlights from our recent events'),
('Leadership', 'leadership', 'Leadership development and best practices'),
('Technology', 'technology', 'Business technology and digital transformation');

-- Insert sample domains
INSERT INTO public.domains (name, description, icon, sort_order) VALUES
('Finance & Banking', 'Financial services and banking solutions', 'dollar-sign', 1),
('Healthcare', 'Healthcare and medical industry', 'heart', 2),
('Technology', 'IT and software solutions', 'cpu', 3),
('Manufacturing', 'Manufacturing and industrial', 'factory', 4),
('Retail', 'Retail and e-commerce', 'shopping-cart', 5),
('Energy', 'Energy and utilities', 'zap', 6);

-- Insert sample statistics
INSERT INTO public.statistics (label, value, sort_order) VALUES
('Events Hosted', '500+', 1),
('Industry Leaders', '10,000+', 2),
('Countries Reached', '50+', 3),
('Years of Excellence', '15+', 4);

-- Note: For production, you would add:
-- - Sample events
-- - Sample blog posts
-- - Sample testimonials
-- - Sample partners
-- - Sample brands

-- To use this seed file:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Create a new query
-- 3. Paste the contents of this file
-- 4. Click "Run"