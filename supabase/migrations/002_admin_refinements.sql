-- Migration 002: Admin Refinements
-- This script fixes missing tables and ensures the admin panel can update data.

-- 1. Create app_config table if it doesn't exist
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert default row for app_config if it's empty
INSERT INTO app_config (id, brand_name) 
VALUES (1, 'Café Minimal')
ON CONFLICT (id) DO NOTHING;

-- 3. Enable RLS on app_config
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- 4. Public Access Policies (Read)
-- Ensure all tables have public read access (anon role)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on app_config') THEN
        CREATE POLICY "Allow public read access on app_config" ON app_config FOR SELECT USING (true);
    END IF;
END $$;

-- 5. Admin Access Policies (Write/Update/Delete) for anon role
-- NOTE: In a production app, these should be restricted to authenticated users.
-- For this standalone admin panel, we are enabling anon writes for simplicity.

-- Categories
CREATE POLICY "Allow anon insert on categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on categories" ON categories FOR DELETE USING (true);

-- Products
CREATE POLICY "Allow anon insert on products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update on products" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete on products" ON products FOR DELETE USING (true);

-- Theme Config
CREATE POLICY "Allow anon update on theme_config" ON theme_config FOR UPDATE USING (true);
CREATE POLICY "Allow anon insert on theme_config" ON theme_config FOR INSERT WITH CHECK (true);

-- Social Config
CREATE POLICY "Allow anon update on social_config" ON social_config FOR UPDATE USING (true);
CREATE POLICY "Allow anon insert on social_config" ON social_config FOR INSERT WITH CHECK (true);

-- Address Config
CREATE POLICY "Allow anon update on address_config" ON address_config FOR UPDATE USING (true);
CREATE POLICY "Allow anon insert on address_config" ON address_config FOR INSERT WITH CHECK (true);

-- App Config
CREATE POLICY "Allow anon update on app_config" ON app_config FOR UPDATE USING (true);
CREATE POLICY "Allow anon insert on app_config" ON app_config FOR INSERT WITH CHECK (true);

-- 6. Add logo_url and logo_visible to app_config if they were somehow missed in creation
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='app_config' AND column_name='logo_url') THEN
        ALTER TABLE app_config ADD COLUMN logo_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='app_config' AND column_name='logo_visible') THEN
        ALTER TABLE app_config ADD COLUMN logo_visible BOOLEAN DEFAULT TRUE;
    END IF;
END $$;
