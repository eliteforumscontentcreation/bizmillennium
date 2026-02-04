-- Create service_form_fields table for customizable form fields
CREATE TABLE IF NOT EXISTS service_form_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT NOT NULL CHECK (service_type IN ('conferences', 'roundtable', 'in-house', 'data-generation')),
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'email', 'tel', 'textarea', 'number', 'url', 'date')),
  placeholder TEXT,
  is_required BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  validation_rules JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(service_type, field_name)
);

-- Create index for faster queries
CREATE INDEX idx_service_form_fields_service_type ON service_form_fields(service_type);
CREATE INDEX idx_service_form_fields_active ON service_form_fields(is_active);
CREATE INDEX idx_service_form_fields_sort_order ON service_form_fields(sort_order);

-- Enable RLS
ALTER TABLE service_form_fields ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active form fields (public needs to see form structure)
CREATE POLICY "Anyone can view active service form fields"
  ON service_form_fields
  FOR SELECT
  TO public
  USING (is_active = true);

-- Only authenticated users can manage form fields
CREATE POLICY "Authenticated users can manage service form fields"
  ON service_form_fields
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_service_form_fields_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_service_form_fields_updated_at
  BEFORE UPDATE ON service_form_fields
  FOR EACH ROW
  EXECUTE FUNCTION update_service_form_fields_updated_at();

-- Modify service_contact_submissions to store dynamic form data
ALTER TABLE service_contact_submissions 
ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}';

-- Insert default form fields for each service type
INSERT INTO service_form_fields (service_type, field_name, field_label, field_type, placeholder, is_required, sort_order) VALUES
-- Conferences default fields
('conferences', 'name', 'Your Name', 'text', 'Enter your full name', true, 1),
('conferences', 'email', 'Your Email', 'email', 'Enter your email address', true, 2),
('conferences', 'phone', 'Phone Number', 'tel', 'Enter your phone number', false, 3),
('conferences', 'company', 'Company', 'text', 'Enter your company name', false, 4),
('conferences', 'subject', 'Subject', 'text', 'Enter subject', false, 5),
('conferences', 'message', 'Your Message', 'textarea', 'Enter your message', true, 6),

-- Roundtable default fields
('roundtable', 'name', 'Your Name', 'text', 'Enter your full name', true, 1),
('roundtable', 'email', 'Your Email', 'email', 'Enter your email address', true, 2),
('roundtable', 'phone', 'Phone Number', 'tel', 'Enter your phone number', false, 3),
('roundtable', 'company', 'Company', 'text', 'Enter your company name', false, 4),
('roundtable', 'subject', 'Subject', 'text', 'Enter subject', false, 5),
('roundtable', 'message', 'Your Message', 'textarea', 'Enter your message', true, 6),

-- In-House default fields
('in-house', 'name', 'Your Name', 'text', 'Enter your full name', true, 1),
('in-house', 'email', 'Your Email', 'email', 'Enter your email address', true, 2),
('in-house', 'phone', 'Phone Number', 'tel', 'Enter your phone number', false, 3),
('in-house', 'company', 'Company', 'text', 'Enter your company name', false, 4),
('in-house', 'subject', 'Subject', 'text', 'Enter subject', false, 5),
('in-house', 'message', 'Your Message', 'textarea', 'Enter your message', true, 6),

-- Data Generation default fields
('data-generation', 'name', 'Your Name', 'text', 'Enter your full name', true, 1),
('data-generation', 'email', 'Your Email', 'email', 'Enter your email address', true, 2),
('data-generation', 'phone', 'Phone Number', 'tel', 'Enter your phone number', false, 3),
('data-generation', 'company', 'Company', 'text', 'Enter your company name', false, 4),
('data-generation', 'subject', 'Subject', 'text', 'Enter subject', false, 5),
('data-generation', 'message', 'Your Message', 'textarea', 'Enter your message', true, 6);