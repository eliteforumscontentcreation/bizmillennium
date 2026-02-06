-- Migration: Gallery RLS (Row Level Security) Policies
-- Description: Ensures gallery items are publicly readable and manageable by admins
-- Date: 2024

-- Enable RLS on gallery table if not already enabled
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Gallery items are viewable by everyone" ON gallery;
DROP POLICY IF EXISTS "Gallery items are insertable by authenticated users" ON gallery;
DROP POLICY IF EXISTS "Gallery items are updatable by authenticated users" ON gallery;
DROP POLICY IF EXISTS "Gallery items are deletable by authenticated users" ON gallery;

-- Policy: Allow everyone to read active gallery items (public access)
CREATE POLICY "Gallery items are viewable by everyone"
ON gallery
FOR SELECT
USING (true);

-- Policy: Allow authenticated users to insert gallery items
CREATE POLICY "Gallery items are insertable by authenticated users"
ON gallery
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to update gallery items
CREATE POLICY "Gallery items are updatable by authenticated users"
ON gallery
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to delete gallery items
CREATE POLICY "Gallery items are deletable by authenticated users"
ON gallery
FOR DELETE
TO authenticated
USING (true);

-- Grant necessary permissions
GRANT SELECT ON gallery TO anon;
GRANT SELECT ON gallery TO authenticated;
GRANT INSERT, UPDATE, DELETE ON gallery TO authenticated;

-- Also ensure the storage bucket for images is accessible
-- Note: Run this in the Supabase dashboard under Storage > Policies if needed
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
-- ON CONFLICT (id) DO UPDATE SET public = true;
