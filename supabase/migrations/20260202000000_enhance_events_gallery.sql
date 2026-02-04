-- Migration: Enhance Events and Gallery Management
-- Date: 2026-02-02
-- Description: Add indexes and ensure schema supports enhanced gallery and events features

-- Add index on gallery.event_id for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_event_id ON public.gallery(event_id);

-- Add index on events.is_upcoming for filtering
CREATE INDEX IF NOT EXISTS idx_events_is_upcoming ON public.events(is_upcoming);

-- Add index on events.event_date for sorting
CREATE INDEX IF NOT EXISTS idx_events_event_date ON public.events(event_date DESC);

-- Ensure registration_url column exists (it should already exist from schema)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'events' 
    AND column_name = 'registration_url'
  ) THEN
    ALTER TABLE public.events ADD COLUMN registration_url TEXT;
  END IF;
END $$;

-- Add comment to registration_url column
COMMENT ON COLUMN public.events.registration_url IS 'External URL for event registration';

-- Update updated_at trigger for events table (if not exists)
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update updated_at trigger for gallery table (if not exists)
DROP TRIGGER IF EXISTS update_gallery_updated_at ON public.gallery;
CREATE TRIGGER update_gallery_updated_at
  BEFORE UPDATE ON public.gallery
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();