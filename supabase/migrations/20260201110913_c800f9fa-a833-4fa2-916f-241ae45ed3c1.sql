-- Allow admins to read contact submissions
CREATE POLICY "Admins can read contact submissions"
ON public.contact_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update contact submissions (mark as read)
CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete contact submissions
CREATE POLICY "Admins can delete contact submissions"
ON public.contact_submissions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to read job applications
CREATE POLICY "Admins can read job applications"
ON public.job_applications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update job applications (change status)
CREATE POLICY "Admins can update job applications"
ON public.job_applications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete job applications
CREATE POLICY "Admins can delete job applications"
ON public.job_applications
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to manage event speakers
CREATE POLICY "Admins can insert event speakers"
ON public.event_speakers
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update event speakers"
ON public.event_speakers
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete event speakers"
ON public.event_speakers
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to read all pages (including unpublished)
CREATE POLICY "Admins can select all pages"
ON public.pages
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));