-- Add admin CRUD policies for all content tables

-- Events table policies for admins
CREATE POLICY "Admins can insert events"
ON public.events
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update events"
ON public.events
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete events"
ON public.events
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Blogs table policies for admins
CREATE POLICY "Admins can insert blogs"
ON public.blogs
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blogs"
ON public.blogs
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blogs"
ON public.blogs
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can select all blogs"
ON public.blogs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Careers table policies for admins
CREATE POLICY "Admins can insert careers"
ON public.careers
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update careers"
ON public.careers
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete careers"
ON public.careers
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Gallery table policies for admins
CREATE POLICY "Admins can insert gallery"
ON public.gallery
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update gallery"
ON public.gallery
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete gallery"
ON public.gallery
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Testimonials table policies for admins
CREATE POLICY "Admins can insert testimonials"
ON public.testimonials
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update testimonials"
ON public.testimonials
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete testimonials"
ON public.testimonials
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Partners table policies for admins
CREATE POLICY "Admins can insert partners"
ON public.partners
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update partners"
ON public.partners
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete partners"
ON public.partners
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Domains table policies for admins
CREATE POLICY "Admins can insert domains"
ON public.domains
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update domains"
ON public.domains
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete domains"
ON public.domains
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Statistics table policies for admins
CREATE POLICY "Admins can insert statistics"
ON public.statistics
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update statistics"
ON public.statistics
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete statistics"
ON public.statistics
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Event types table policies for admins
CREATE POLICY "Admins can insert event_types"
ON public.event_types
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update event_types"
ON public.event_types
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete event_types"
ON public.event_types
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Blog categories table policies for admins
CREATE POLICY "Admins can insert blog_categories"
ON public.blog_categories
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog_categories"
ON public.blog_categories
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog_categories"
ON public.blog_categories
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));