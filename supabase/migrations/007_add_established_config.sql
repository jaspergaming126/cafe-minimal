-- Migration 007: Add established text configuration
-- Adds ability to edit and toggle the "Established" text on the landing page

ALTER TABLE app_config 
ADD COLUMN IF NOT EXISTS established_text TEXT DEFAULT 'Established 2024',
ADD COLUMN IF NOT EXISTS show_established BOOLEAN DEFAULT TRUE;

-- Update existing row
UPDATE app_config 
SET 
  established_text = COALESCE(established_text, 'Established 2024'),
  show_established = COALESCE(show_established, TRUE)
WHERE id = 1;
