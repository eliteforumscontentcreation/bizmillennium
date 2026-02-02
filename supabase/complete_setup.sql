-- ============================================
-- BIZ MILLENNIUM - COMPLETE DATABASE SETUP
-- This file drops all existing data and tables
-- and creates everything from scratch
-- ============================================

-- ============================================
-- STEP 1: DROP ALL EXISTING OBJECTS
-- ============================================

-- Drop triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
DROP TRIGGER IF EXISTS update_navigation_updated_at ON public.navigation;
DROP TRIGGER IF EXISTS update_pages_updated_at ON public.pages;
DROP TRIGGER IF EXISTS update_hero_sections_updated_at ON public.hero_sections;
DROP TRIGGER IF EXISTS update_statistics_updated_at ON public.statistics;
DROP TRIGGER IF EXISTS update_partners_updated_at ON public.partners;
DROP TRIGGER IF EXISTS update_event_types_updated_at ON public.event_types;
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
DROP TRIGGER IF EXISTS update_event_speakers_updated_at ON public.event_speakers;
DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON public.blog_categories;
DROP TRIGGER IF EXISTS update_blogs_updated_at ON public.blogs;
DROP TRIGGER IF EXISTS update_gallery_updated_at ON public.gallery;
DROP TRIGGER IF EXISTS update_domains_updated_at ON public.domains;
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
DROP TRIGGER IF EXISTS update_careers_updated_at ON public.careers;
DROP TRIGGER IF EXISTS update_job_applications_updated_at ON public.job_applications;
DROP TRIGGER IF EXISTS update_brands_updated_at ON public.brands;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.has_role(UUID, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Drop all tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS public.contact_submissions CASCADE;
DROP TABLE IF EXISTS public.job_applications CASCADE;
DROP TABLE IF EXISTS public.careers CASCADE;
DROP TABLE IF EXISTS public.gallery CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.brands CASCADE;
DROP TABLE IF EXISTS public.partners CASCADE;
DROP TABLE IF EXISTS public.domains CASCADE;
DROP TABLE IF EXISTS public.statistics CASCADE;
DROP TABLE IF EXISTS public.event_speakers CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.event_types CASCADE;
DROP TABLE IF EXISTS public.blogs CASCADE;
DROP TABLE IF EXISTS public.blog_categories CASCADE;
DROP TABLE IF EXISTS public.hero_sections CASCADE;
DROP TABLE IF EXISTS public.pages CASCADE;
DROP TABLE IF EXISTS public.navigation CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop enum type
DROP TYPE IF EXISTS public.app_role CASCADE;

-- ============================================
-- STEP 2: CREATE ENUM TYPES
-- ============================================

CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- ============================================
-- STEP 3: CREATE ALL TABLES
-- ============================================

-- Profiles table for user information
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles for RBAC
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Site settings (singleton table)
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_title TEXT NOT NULL DEFAULT 'Biz Millennium',
    site_tagline TEXT DEFAULT 'Unleashing Tomorrow''s Business Solutions, Today',
    logo_url TEXT,
    favicon_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    contact_address TEXT,
    facebook_url TEXT,
    twitter_url TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    global_seo_title TEXT,
    global_seo_description TEXT,
    global_seo_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Navigation menu items
CREATE TABLE public.navigation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    link TEXT NOT NULL,
    parent_id UUID REFERENCES public.navigation(id) ON DELETE SET NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Dynamic pages
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT false,
    seo_title TEXT,
    seo_description TEXT,
    seo_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Hero sections for pages
CREATE TABLE public.hero_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
    headline TEXT NOT NULL,
    subheadline TEXT,
    cta_text TEXT,
    cta_link TEXT,
    secondary_cta_text TEXT,
    secondary_cta_link TEXT,
    background_image TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blog categories
CREATE TABLE public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blog posts
CREATE TABLE public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content JSONB DEFAULT '[]'::jsonb,
    featured_image TEXT,
    author_name TEXT,
    author_image TEXT,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMPTZ,
    seo_title TEXT,
    seo_description TEXT,
    seo_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Event types
CREATE TABLE public.event_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Events
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    content JSONB DEFAULT '[]'::jsonb,
    featured_image TEXT,
    event_type_id UUID REFERENCES public.event_types(id) ON DELETE SET NULL,
    event_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    location TEXT,
    venue TEXT,
    registration_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_upcoming BOOLEAN NOT NULL DEFAULT true,
    seo_title TEXT,
    seo_description TEXT,
    seo_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Event speakers
CREATE TABLE public.event_speakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT,
    company TEXT,
    bio TEXT,
    photo_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Careers/Job postings
CREATE TABLE public.careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    department TEXT,
    location TEXT,
    employment_type TEXT DEFAULT 'Full-time',
    description TEXT,
    responsibilities JSONB DEFAULT '[]'::jsonb,
    requirements JSONB DEFAULT '[]'::jsonb,
    apply_form_fields JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Job applications
CREATE TABLE public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id UUID NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_phone TEXT,
    resume_url TEXT,
    cover_letter TEXT,
    form_data JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Brands
CREATE TABLE public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    featured_image TEXT,
    website_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    seo_title TEXT,
    seo_description TEXT,
    seo_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Partners
CREATE TABLE public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Testimonials
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT,
    company TEXT,
    content TEXT NOT NULL,
    photo_url TEXT,
    rating INT DEFAULT 5,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Gallery
CREATE TABLE public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption TEXT,
    alt_text TEXT,
    category TEXT,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Business domains
CREATE TABLE public.domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Statistics
CREATE TABLE public.statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact submissions
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- STEP 4: CREATE FUNCTIONS
-- ============================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Role check function (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- ============================================
-- STEP 5: CREATE TRIGGERS
-- ============================================

-- New user trigger (attached to auth.users)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_navigation_updated_at BEFORE UPDATE ON public.navigation FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hero_sections_updated_at BEFORE UPDATE ON public.hero_sections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON public.statistics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_event_types_updated_at BEFORE UPDATE ON public.event_types FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_event_speakers_updated_at BEFORE UPDATE ON public.event_speakers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON public.blog_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON public.domains FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON public.careers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- STEP 6: ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 7: CREATE RLS POLICIES
-- ============================================

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Public read policies for frontend display
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read active navigation" ON public.navigation FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read published pages" ON public.pages FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read active hero sections" ON public.hero_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active statistics" ON public.statistics FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active partners" ON public.partners FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active event types" ON public.event_types FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public can read event speakers" ON public.event_speakers FOR SELECT USING (true);
CREATE POLICY "Public can read blog categories" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Public can read published blogs" ON public.blogs FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read active gallery" ON public.gallery FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active domains" ON public.domains FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active testimonials" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active careers" ON public.careers FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active brands" ON public.brands FOR SELECT USING (is_active = true);

-- Allow public to submit job applications and contact forms
CREATE POLICY "Public can submit job applications" ON public.job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit contact forms" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Admin CRUD policies for all content tables
CREATE POLICY "Admins can update site_settings" ON public.site_settings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert site_settings" ON public.site_settings FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert navigation" ON public.navigation FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update navigation" ON public.navigation FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete navigation" ON public.navigation FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert pages" ON public.pages FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update pages" ON public.pages FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete pages" ON public.pages FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can select all pages" ON public.pages FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert hero_sections" ON public.hero_sections FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update hero_sections" ON public.hero_sections FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete hero_sections" ON public.hero_sections FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert events" ON public.events FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert event speakers" ON public.event_speakers FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update event speakers" ON public.event_speakers FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete event speakers" ON public.event_speakers FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert blogs" ON public.blogs FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update blogs" ON public.blogs FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete blogs" ON public.blogs FOR DELETE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can select all blogs" ON public.blogs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert blog_categories" ON public.blog_categories FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update blog_categories" ON public.blog_categories FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete blog_categories" ON public.blog_categories FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert careers" ON public.careers FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update careers" ON public.careers FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete careers" ON public.careers FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read job applications" ON public.job_applications FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update job applications" ON public.job_applications FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete job applications" ON public.job_applications FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert gallery" ON public.gallery FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update gallery" ON public.gallery FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete gallery" ON public.gallery FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update testimonials" ON public.testimonials FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete testimonials" ON public.testimonials FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert partners" ON public.partners FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update partners" ON public.partners FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete partners" ON public.partners FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert domains" ON public.domains FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update domains" ON public.domains FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete domains" ON public.domains FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert statistics" ON public.statistics FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update statistics" ON public.statistics FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete statistics" ON public.statistics FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert event_types" ON public.event_types FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update event_types" ON public.event_types FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete event_types" ON public.event_types FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert brands" ON public.brands FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update brands" ON public.brands FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete brands" ON public.brands FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read contact submissions" ON public.contact_submissions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete contact submissions" ON public.contact_submissions FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- STEP 8: INSERT WEBSITE DATA
-- ============================================

-- Insert site settings
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
  youtube_url,
  global_seo_title,
  global_seo_description
) VALUES (
  'Biz Millennium',
  'Unleashing Tomorrow''s Business Solutions, Today',
  'info@bizmillennium.com',
  '+91 9876543210',
  'Mumbai, India',
  'https://facebook.com/bizmillennium',
  'https://twitter.com/bizmillennium',
  'https://linkedin.com/company/bizmillennium',
  'https://instagram.com/bizmillennium',
  'https://youtube.com/@bizmillennium',
  'Biz Millennium - Business Events & Conferences',
  'Leading provider of world-class business conferences, roundtables, and corporate training events.'
);

-- Insert statistics (from HeroSection fallback data)
INSERT INTO public.statistics (label, value, sort_order, is_active) VALUES
('Successful Events', '400+', 1, true),
('Valued Partnerships', '170+', 2, true),
('Companies', '8,000+', 3, true),
('Experts Featured', '1,350+', 4, true),
('Delegates Engaged', '14,000+', 5, true),
('Industry Awards', '500+', 6, true);

-- Insert partners (from PartnersSection fallback data)
INSERT INTO public.partners (name, logo_url, website_url, sort_order, is_active) VALUES
('Clear', 'https://bizmillennium.com/wp-content/uploads/2023/08/clear-Our-Partners.jpg', NULL, 1, true),
('Workplace', 'https://bizmillennium.com/wp-content/uploads/2023/08/workplace-Our-Partners.jpg', NULL, 2, true),
('Chrome Enterprise', 'https://bizmillennium.com/wp-content/uploads/2023/08/Chrome-Our-Partners.jpg', NULL, 3, true),
('AWS', 'https://bizmillennium.com/wp-content/uploads/2023/08/aws-Our-Partners.jpg', NULL, 4, true),
('Happay', 'https://bizmillennium.com/wp-content/uploads/2023/08/Happay-Our-Partners.jpg', NULL, 5, true),
('Dell', 'https://bizmillennium.com/wp-content/uploads/2023/08/Dell-Our-Partners.jpg', NULL, 6, true),
('Freshworks', 'https://bizmillennium.com/wp-content/uploads/2023/08/Freshworks-Our-Partners.jpg', NULL, 7, true),
('Apple', 'https://bizmillennium.com/wp-content/uploads/2023/08/apple-Our-Partners.jpg', NULL, 8, true);

-- Insert event types (from EventTypesSection fallback data)
INSERT INTO public.event_types (name, description, icon, sort_order, is_active) VALUES
('In-house Events', 'Your Venue, Our Expertise: Transforming Your Space into a Thriving Business Ecosystem to create Unforgettable Experiences.', 'Building2', 1, true),
('Virtual Events', 'Breaking Barriers, Building Bridges: Connecting Global Businesses into the Future of Networking and Collaboration.', 'Monitor', 2, true),
('Flagship Events', 'Setting Sail for Success: Our Flagship Events Redefine Industry Standards. A journey Where Business Brilliance Takes Center Stage.', 'Star', 3, true),
('Bespoke Events', 'Exclusivity Redefined: Our Bespoke Events are Crafted to Perfectly Align With Your Brand to elevate Your Business Presence.', 'Gem', 4, true);

-- Insert domains (from DomainsSection fallback data)
INSERT INTO public.domains (name, description, icon, sort_order, is_active) VALUES
('Information Tech', 'At the intersection of innovation and tech, we host IT conferences fostering groundbreaking discussions.', 'Cpu', 1, true),
('Marketing and Sales', 'Empowering brands to shine, our marketing and sales conferences unveil strategies that resonate.', 'Target', 2, true),
('Pharmaceutical', 'In the realm of healthcare breakthroughs, our pharmaceutical conferences converge top minds.', 'Pill', 3, true),
('HR', 'Navigating the human landscape, our HR conferences delve into talent management, leadership, and workplace culture, shaping the businesses through discussions.', 'Users', 4, true),
('Finance & Legal', 'Where numbers meet regulations, our finance and legal conferences provide a platform for experts to dissect complexities.', 'Landmark', 5, true),
('Manufacturing', 'From cutting-edge technologies to sustainable practices, our manufacturing conferences spotlight industry trends.', 'Factory', 6, true),
('Supply & Logistics', 'In the heartbeat of global trade, our supply and logistics conferences facilitate conversations on optimizing supply chains.', 'Truck', 7, true),
('CSR & Sustainability', 'Our CSR and sustainability conferences unite visionaries committed to creating positive social and environmental impacts.', 'Leaf', 8, true);

-- Insert testimonials (from TestimonialsSection fallback data)
INSERT INTO public.testimonials (name, title, company, content, photo_url, rating, sort_order, is_active) VALUES
('Vimal Ladha', 'CFO', 'PSIPL', 'I want to express my sincere gratitude to the Biz Millennium team for organizing the exceptional CFO Connect Summit focused on the Fintech ecosystem. The event was well-organized, featuring insightful speakers who shared valuable knowledge on current trends and innovations.', NULL, 5, 1, true),
('Raghupati Mishra', 'President & Country Head', 'Liberty Steel Group', 'Biz Millennium organized a well-calibrated event that was thoroughly enjoyable. The panel was a delight, featuring industry stalwarts who brought valuable insights to the discussions.', NULL, 5, 2, true),
('Arvind Talan', 'Executive', 'Jet Freight Logistics Limited', 'I had the pleasure of speaking at a conference organized by Biz Millennium, and it was a remarkable experience. The event was well-organized, offering an excellent platform for learning and networking.', NULL, 5, 3, true);

-- Insert blog categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
('Industry Insights', 'industry-insights', 'Latest trends and analysis in business'),
('Event Recaps', 'event-recaps', 'Highlights from our recent events'),
('Leadership', 'leadership', 'Leadership development and best practices'),
('Technology', 'technology', 'Business technology and digital transformation');

-- Insert blog posts (from BlogSection fallback data)
INSERT INTO public.blogs (title, slug, excerpt, featured_image, author_name, is_published, is_featured, published_at) VALUES
('Preeti Jain Joins Adani GCC as Chief People Officer to Lead HR Innovation', 'networking-redefined', 'Explore how modern B2B events are transforming networking.', 'https://bizmillennium.com/wp-content/uploads/2025/02/Networking-Redefined-at-B2B-Events.jpg', 'Biz Millennium', true, true, '2025-02-15'),
('ASG Eye Hospital Welcomes Karuna Ponnada as New Global CHRO', 'hybrid-events', 'Discover how hybrid events combine in-person and virtual experiences.', 'https://bizmillennium.com/wp-content/uploads/2025/02/Hybrid-Events-The-Best-of-Both-Worlds-1-1.jpg', 'Biz Millennium', true, false, '2025-02-10'),
('Infra.Market Boosts Leadership with Anil Kulkarni as New COO', 'sustainable-conferences', 'Learn about eco-friendly approaches to business conferences.', 'https://bizmillennium.com/wp-content/uploads/2025/02/Sustainable-Practices-in-B2B-Conferences.jpg', 'Biz Millennium', true, false, '2025-02-05'),
('Nathan SV Joins PwC as Senior Leadership Prime', 'behind-the-scenes', 'A look at what makes conferences truly impactful.', 'https://bizmillennium.com/wp-content/uploads/2025/01/Behind-the-Scenes-of-Impactful-Conferences.jpg', 'Biz Millennium', true, false, '2025-01-20'),
('Allcargo Logistics Appoints Rajat Jain as New CEO', 'attendee-journeys', 'Creating unforgettable experiences for event attendees.', 'https://bizmillennium.com/wp-content/uploads/2025/01/Crafting-Memorable-Attendee-Journeys.jpg', 'Biz Millennium', true, false, '2025-01-15'),
('Vanita Pandey Joins Bureau CMS in Australia Global', 'partnerships', 'Leveraging events for long-term business relationships.', 'https://bizmillennium.com/wp-content/uploads/2025/01/Building-Lasting-Partnerships-Through-Events.jpg', 'Biz Millennium', true, false, '2025-01-10');

-- Insert navigation menu items
INSERT INTO public.navigation (name, link, sort_order, is_active) VALUES
('Home', '/', 1, true),
('About', '/about', 2, true),
('Events', '/events', 3, true),
('Blog', '/blog', 4, true),
('Careers', '/careers', 5, true),
('Gallery', '/gallery', 6, true),
('Contact', '/contact', 7, true);

-- ============================================
-- SETUP COMPLETE
-- ============================================