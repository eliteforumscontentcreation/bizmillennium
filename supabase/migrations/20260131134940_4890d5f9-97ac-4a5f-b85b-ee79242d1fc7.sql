-- Add admin CRUD policies for navigation table
CREATE POLICY "Admins can insert navigation"
ON public.navigation
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update navigation"
ON public.navigation
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete navigation"
ON public.navigation
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for hero_sections
CREATE POLICY "Admins can insert hero_sections"
ON public.hero_sections
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update hero_sections"
ON public.hero_sections
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete hero_sections"
ON public.hero_sections
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for site_settings
CREATE POLICY "Admins can update site_settings"
ON public.site_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for brands
CREATE POLICY "Admins can insert brands"
ON public.brands
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update brands"
ON public.brands
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete brands"
ON public.brands
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for pages
CREATE POLICY "Admins can insert pages"
ON public.pages
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pages"
ON public.pages
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pages"
ON public.pages
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));