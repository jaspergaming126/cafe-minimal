-- =====================================================
-- Café Minimal Database Schema
-- Run this in Supabase SQL Editor to create tables
-- =====================================================

-- Drop existing tables if they exist (be careful in production!)
-- DROP TABLE IF EXISTS products;
-- DROP TABLE IF EXISTS categories;
-- DROP TABLE IF EXISTS theme_config;
-- DROP TABLE IF EXISTS social_config;
-- DROP TABLE IF EXISTS address_config;

-- =====================================================
-- Categories Table
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Products Table
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  secondary_price DECIMAL(10,2),
  image TEXT,
  category TEXT REFERENCES categories(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  available_options TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Theme Configuration Table
-- =====================================================
CREATE TABLE IF NOT EXISTS theme_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  primary_color TEXT DEFAULT '#e66e19',
  brand_name_color TEXT DEFAULT '#1b130e',
  font_family TEXT DEFAULT '''Plus Jakarta Sans'', sans-serif',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Social Media Configuration Table
-- =====================================================
CREATE TABLE IF NOT EXISTS social_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  instagram TEXT,
  facebook TEXT,
  twitter TEXT,
  tiktok TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Address Configuration Table
-- =====================================================
CREATE TABLE IF NOT EXISTS address_config (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  address_text TEXT,
  maps_url TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- Enable Row Level Security (RLS)
-- =====================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE address_config ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Public Read Access Policies
-- Allow anyone to read data (for public menu display)
-- =====================================================
CREATE POLICY "Allow public read access on categories" 
  ON categories FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on products" 
  ON products FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on theme_config" 
  ON theme_config FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on social_config" 
  ON social_config FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on address_config" 
  ON address_config FOR SELECT 
  USING (true);

-- =====================================================
-- Create indexes for better query performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_visible ON products(is_visible);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- =====================================================
-- Updated at trigger function
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theme_config_updated_at
  BEFORE UPDATE ON theme_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_config_updated_at
  BEFORE UPDATE ON social_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_address_config_updated_at
  BEFORE UPDATE ON address_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
