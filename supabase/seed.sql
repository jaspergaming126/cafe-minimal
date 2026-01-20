-- =====================================================
-- Café Minimal - Seed Data
-- Run this AFTER the migration script to populate tables
-- =====================================================

-- =====================================================
-- Insert Categories
-- =====================================================
INSERT INTO categories (id, label, sort_order) VALUES
  ('all', 'All', 0),
  ('chefs-choice', 'Chef''s Selection', 1),
  ('coffee', 'Coffee & Brews', 2),
  ('tea', 'Premium Teas', 3),
  ('bakery', 'Fresh Bakery', 4),
  ('savory', 'Savory Delights', 5)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  sort_order = EXCLUDED.sort_order;

-- =====================================================
-- Insert Products
-- =====================================================

-- Chef's Choice Products
INSERT INTO products (id, name, description, price, category, is_featured, is_visible, image) VALUES
  ('1', 'Avocado Toast Deluxe', 'Sourdough, poached egg, chili flakes, microgreens.', 12.50, 'chefs-choice', true, true, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhgNZN6sxvRbKYzO7U-L46qzyfiwhIzv03rqKP6Mqn0t2jv4kydFQJWRbdJuqUrTZxX1g88OoqEyKzS-5-0_y3p_UnHi3jez2XGZJi1ZcM-y2pMenHNTTPwRQpzGrfF6s-zwezhJwx9pIkVEz_CEFY4aEyfiaUwbpCSoyzp3Gn6ulDN_bbEZbrBBkoklwAXWuPzu5RFkkGtIqoesctmyjqdz7GR5CezJqNmGd2oY_EOVhxFsPS7wLC-dtJN1lSQIwGbrDpdd5Qu6U'),
  ('cc-2', 'Matcha Soufflé Pancakes', 'Light and airy matcha-infused pancakes served with fresh seasonal berries and pure maple syrup.', 14.50, 'chefs-choice', true, true, 'https://images.unsplash.com/photo-1575853121743-60c24f0a7502?q=80&w=800&auto=format&fit=crop')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  is_featured = EXCLUDED.is_featured,
  is_visible = EXCLUDED.is_visible,
  image = EXCLUDED.image;

-- Coffee Products
INSERT INTO products (id, name, description, price, secondary_price, category, is_visible, image, available_options) VALUES
  ('2', 'Classic Cappuccino', 'Rich espresso with steamed milk foam and a dusting of cocoa.', 4.50, 5.00, 'coffee', true, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfZtX3kigxcZSfKJ00K38sMx0TijUdAvJBUb4Yw9XbFXYS3XjGmHtVYLiUsim4s87ztdX_JM3cKG9blTalf3P9gyM66e5Tx-lOb0BOpgeT2-ue2xxWTm3ADvbYvsxzuruYHNItvIm171v5gYB-R6Xdsvv8mCHNwfC9Vu5aR_Ej6kJrbwkpY4u0Xui1MgPrkscbLNQtZs6QY8SrNajbpcicSzZ7OTIBuqxg7biwpv0OcvGLBR5QSwI8E6Y8NVXuwO4XCHA8bosl1Kc', ARRAY['Hot', 'Cold']),
  ('c-3', 'Piccolo Latte', 'A "little" latte made with a restricted double shot of espresso.', 4.80, NULL, 'coffee', true, NULL, ARRAY['Hot']),
  ('c-4', 'Flat White', 'Espresso with microfoam (steamed milk with small, fine bubbles).', 4.50, NULL, 'coffee', true, NULL, ARRAY['Hot', 'Cold']),
  ('c-6', 'Spanish Latte', 'Creamy espresso-based drink sweetened with condensed milk.', 5.50, NULL, 'coffee', true, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop', ARRAY['Hot', 'Cold'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  secondary_price = EXCLUDED.secondary_price,
  category = EXCLUDED.category,
  is_visible = EXCLUDED.is_visible,
  image = EXCLUDED.image,
  available_options = EXCLUDED.available_options;

-- Tea Products
INSERT INTO products (id, name, description, price, category, is_visible, image, available_options) VALUES
  ('t-3', 'Chamomile Bliss', 'Soothing caffeine-free herbal infusion with honey notes.', 3.50, 'tea', true, NULL, ARRAY['Hot']),
  ('t-4', 'Earl Grey Reserve', 'Classic black tea infused with double bergamot and blue cornflowers.', 4.50, 'tea', true, NULL, NULL),
  ('t-5', 'Hojicha Latte', 'Roasted green tea with a nutty, smoky flavor and velvety milk.', 5.50, 'tea', true, 'https://images.unsplash.com/photo-1594631252845-29fc4586c55c?q=80&w=800&auto=format&fit=crop', ARRAY['Hot', 'Cold']),
  ('t-6', 'Oolong Milk Tea', 'Robust oolong tea leaves blended with creamy milk and cane sugar.', 5.00, 'tea', true, NULL, ARRAY['Hot', 'Cold'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  is_visible = EXCLUDED.is_visible,
  image = EXCLUDED.image,
  available_options = EXCLUDED.available_options;

-- Bakery Products
INSERT INTO products (id, name, description, price, category, is_visible, image) VALUES
  ('b-1', 'Pain au Chocolat', 'French dark chocolate wrapped in 81 layers of buttery dough.', 4.25, 'bakery', true, 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=800&auto=format&fit=crop'),
  ('b-2', 'Classic Butter Croissant', 'Traditional flaky, crescent-shaped pastry made with premium butter.', 3.80, 'bakery', true, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop'),
  ('b-3', 'Almond Croissant', 'Twice-baked with almond frangipane and topped with toasted flakes.', 4.90, 'bakery', true, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop'),
  ('b-4', 'Blueberry Crumble Muffin', 'Bursting with fresh blueberries and topped with a brown sugar streusel.', 3.50, 'bakery', true, NULL),
  ('b-5', 'Cinnamon Swirl Roll', 'Soft brioche dough with Ceylon cinnamon and cream cheese glaze.', 4.50, 'bakery', true, 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=800&auto=format&fit=crop'),
  ('b-6', 'Lemon Poppyseed Scone', 'Crumbly, buttery scone with fresh lemon zest and poppyseeds.', 3.90, 'bakery', true, NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  is_visible = EXCLUDED.is_visible,
  image = EXCLUDED.image;

-- Savory Products
INSERT INTO products (id, name, description, price, secondary_price, category, is_visible, image, available_options) VALUES
  ('s-1', 'Smoked Salmon Bagel', 'Everything bagel, cream cheese, capers, red onion, dill.', 11.50, NULL, 'savory', true, 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=800&auto=format&fit=crop', NULL),
  ('s-2', 'Classic Chicken Sandwich', 'Grilled chicken breast with avocado, lettuce, and herb mayo.', 10.50, NULL, 'savory', true, NULL, NULL),
  ('s-3', 'Roasted Veggie Wrap', 'Hummus, roasted peppers, zucchini, and spinach in a whole wheat wrap.', 9.00, NULL, 'savory', true, NULL, NULL),
  ('s-4', 'Beef & Mushroom Pie', 'Slow-cooked beef and button mushrooms in a rich gravy.', 8.50, NULL, 'savory', true, 'https://images.unsplash.com/photo-1604467731651-40479f649808?q=80&w=800&auto=format&fit=crop', NULL),
  ('s-5', 'Crystal Prawn Dumplings', 'Translucent skins filled with whole succulent prawns and bamboo shoots.', 12.00, 14.50, 'savory', true, 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800&auto=format&fit=crop', ARRAY['Steamed', 'Baked']),
  ('s-8', 'BBQ Chicken Bao', 'Soft white buns with honey-glazed BBQ chicken filling.', 6.00, 7.20, 'savory', true, NULL, ARRAY['Steamed', 'Baked']),
  ('s-9', 'Curry Puff Trio', 'Crispy pastry filled with spiced potato, chicken, and egg.', 4.50, 5.50, 'savory', true, NULL, ARRAY['Steamed', 'Baked'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  secondary_price = EXCLUDED.secondary_price,
  category = EXCLUDED.category,
  is_visible = EXCLUDED.is_visible,
  image = EXCLUDED.image,
  available_options = EXCLUDED.available_options;

-- =====================================================
-- Insert Configuration Data
-- =====================================================

-- Theme Config
INSERT INTO theme_config (id, primary_color, brand_name_color, font_family) VALUES
  (1, '#e66e19', '#1b130e', '''Plus Jakarta Sans'', sans-serif')
ON CONFLICT (id) DO UPDATE SET
  primary_color = EXCLUDED.primary_color,
  brand_name_color = EXCLUDED.brand_name_color,
  font_family = EXCLUDED.font_family;

-- Social Config
INSERT INTO social_config (id, instagram, facebook) VALUES
  (1, 'https://instagram.com/cafeminimal', 'https://facebook.com/cafeminimal_official')
ON CONFLICT (id) DO UPDATE SET
  instagram = EXCLUDED.instagram,
  facebook = EXCLUDED.facebook;

-- Address Config
INSERT INTO address_config (id, address_text, maps_url) VALUES
  (1, '123 Coffee Street, Brew City, CA 90210', 'https://www.google.com/maps/search/?api=1&query=123+Coffee+Street+Brew+City+CA+90210')
ON CONFLICT (id) DO UPDATE SET
  address_text = EXCLUDED.address_text,
  maps_url = EXCLUDED.maps_url;

-- =====================================================
-- Verification Query (run to check data)
-- =====================================================
-- SELECT 'Categories:' as info, count(*) as count FROM categories
-- UNION ALL
-- SELECT 'Products:', count(*) FROM products
-- UNION ALL
-- SELECT 'Visible Products:', count(*) FROM products WHERE is_visible = true;
