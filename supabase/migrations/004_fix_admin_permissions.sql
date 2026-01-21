-- Migration 004: Fix Admin Permissions and Schema
-- Run this script in your Supabase SQL Editor to resolve "Failed to save" errors.

-- 1. Ensure app_config table exists with all columns
CREATE TABLE IF NOT EXISTS app_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  brand_name TEXT DEFAULT 'Café Minimal',
  show_logo BOOLEAN DEFAULT TRUE,
  logo_url TEXT,
  logo_visible BOOLEAN DEFAULT TRUE,
  hero_message TEXT DEFAULT 'Slow moments, fast memories.',
  show_hero_message BOOLEAN DEFAULT TRUE,
  hero_image TEXT,
  font_size_base INTEGER DEFAULT 16,
  footer_text TEXT DEFAULT '© 2026 Café Minimal. All rights reserved.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add footer_text column if it was missing (idempotent)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='app_config' AND column_name='footer_text') THEN
        ALTER TABLE app_config ADD COLUMN footer_text TEXT DEFAULT '© 2026 Café Minimal. All rights reserved.';
    END IF;
END $$;

-- 3. Ensure a row exists (Config is single-row)
INSERT INTO app_config (id, brand_name) 
VALUES (1, 'Café Minimal')
ON CONFLICT (id) DO NOTHING;

-- 4. Fix RLS Policies (Allow Anon Updates)
-- First, drop existing policies to avoid conflicts or outdated logic
DROP POLICY IF EXISTS "Allow anon update on app_config" ON app_config;
DROP POLICY IF EXISTS "Allow anon insert on app_config" ON app_config;
DROP POLICY IF EXISTS "Allow public read access on app_config" ON app_config;

-- Re-create liberal policies for the Admin Panel
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on app_config" 
ON app_config FOR SELECT 
USING (true);

CREATE POLICY "Allow anon update on app_config" 
ON app_config FOR UPDATE 
USING (true);

CREATE POLICY "Allow anon insert on app_config" 
ON app_config FOR INSERT 
WITH CHECK (true);

-- 5. Fix other config tables too, just in case
-- Theme Config
DROP POLICY IF EXISTS "Allow anon update on theme_config" ON theme_config;
CREATE POLICY "Allow anon update on theme_config" ON theme_config FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon insert on theme_config" ON theme_config;
CREATE POLICY "Allow anon insert on theme_config" ON theme_config FOR INSERT WITH CHECK (true);

-- Social Config
DROP POLICY IF EXISTS "Allow anon update on social_config" ON social_config;
CREATE POLICY "Allow anon update on social_config" ON social_config FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon insert on social_config" ON social_config;
CREATE POLICY "Allow anon insert on social_config" ON social_config FOR INSERT WITH CHECK (true);

-- Address Config
DROP POLICY IF EXISTS "Allow anon update on address_config" ON address_config;
CREATE POLICY "Allow anon update on address_config" ON address_config FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon insert on address_config" ON address_config;
CREATE POLICY "Allow anon insert on address_config" ON address_config FOR INSERT WITH CHECK (true);
