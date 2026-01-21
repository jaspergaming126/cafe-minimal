-- Migration 003: Add Footer Text
-- This script adds a footer_text column to the app_config table.

-- 1. Add footer_text column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='app_config' AND column_name='footer_text') THEN
        ALTER TABLE app_config ADD COLUMN footer_text TEXT DEFAULT '© 2026 Café Minimal. All rights reserved.';
    END IF;
END $$;
