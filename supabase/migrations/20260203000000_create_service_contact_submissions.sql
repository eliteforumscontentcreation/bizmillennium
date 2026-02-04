-- Create service_contact_submissions table for individual service inquiries
CREATE TABLE IF NOT EXISTS service_contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT NOT NULL CHECK (service_type IN ('conferences', 'roundtable', 'in-house', 'data-generation')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_service_contact_service_type ON service_contact_submissions(service_type);
CREATE INDEX idx_service_contact_status ON service_contact_submissions(status);
CREATE INDEX idx_service_contact_created_at ON service_contact_submissions(created_at DESC);

-- Enable RLS
ALTER TABLE service_contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public can submit forms)
CREATE POLICY "Anyone can submit service contact forms"
  ON service_contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users can view
CREATE POLICY "Authenticated users can view service contact submissions"
  ON service_contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update service contact submissions"
  ON service_contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_service_contact_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_service_contact_updated_at
  BEFORE UPDATE ON service_contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_service_contact_updated_at();