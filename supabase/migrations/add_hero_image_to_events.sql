-- Migration: Add hero_image column to events table
-- Description: Adds a hero_image field to store the main banner image URL for event pages
-- Date: 2024

-- Add hero_image column to events table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'events'
        AND column_name = 'hero_image'
    ) THEN
        ALTER TABLE events ADD COLUMN hero_image TEXT;
    END IF;
END $$;

-- Add comment to describe the column
COMMENT ON COLUMN events.hero_image IS 'URL for the hero/banner image displayed at the top of the event detail page';
