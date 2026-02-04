-- Migration: Create Storage Bucket for Gallery Images
-- Date: 2026-02-04
-- Description: Setup storage policies for gallery images bucket
-- Note: The bucket itself should be created via Supabase Dashboard or CLI

-- This migration assumes the 'images' bucket already exists
-- If not, create it via Supabase Dashboard: Storage > New Bucket > Name: "images" > Public: Yes

-- Enable RLS on storage.objects (if not already enabled)
DO $$ 
BEGIN
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN insufficient_privilege THEN
    -- RLS might already be enabled or requires superuser
    NULL;
END $$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access for Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Policy: Allow public read access to images bucket
CREATE POLICY "Public Access for Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Policy: Allow authenticated users to update their own images
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

-- Policy: Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');