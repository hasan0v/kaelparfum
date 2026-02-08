-- KƏEL PARFÜM - Admin User & Initial Data Setup
-- Run this AFTER schema.sql in Supabase SQL Editor

-- Note: You need to create the admin user through Supabase Auth first
-- Go to Authentication > Users > Add User
-- Email: admin@kaelparfum.az
-- Password: KaelAdmin2024!
-- Then run this SQL to set them as admin

-- Update the admin profile (replace 'YOUR_ADMIN_USER_ID' with actual user ID after creation)
-- UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_ADMIN_USER_ID';

-- Insert initial categories
INSERT INTO categories (name, slug, description, is_active, display_order) VALUES
('Qadın ətirləri', 'qadin-etirleri', 'Qadınlar üçün parfüm kolleksiyası', true, 1),
('Kişi ətirləri', 'kisi-etirleri', 'Kişilər üçün parfüm kolleksiyası', true, 2),
('Uniseks ətirlər', 'uniseks-etirler', 'Uniseks parfüm kolleksiyası', true, 3),
('Kosmetika', 'kosmetika', 'Kosmetika məhsulları', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert initial brands
INSERT INTO brands (name, slug, description, is_active) VALUES
('Chanel', 'chanel', 'Fransız lüks moda və parfüm evi', true),
('Dior', 'dior', 'Fransız lüks moda evi', true),
('Tom Ford', 'tom-ford', 'Amerika lüks brendı', true),
('Versace', 'versace', 'İtalyan moda evi', true),
('Gucci', 'gucci', 'İtalyan lüks moda evi', true),
('YSL', 'ysl', 'Yves Saint Laurent parfümləri', true),
('Armani', 'armani', 'İtalyan moda evi', true),
('Dolce & Gabbana', 'dolce-gabbana', 'İtalyan lüks brendı', true),
('Lancôme', 'lancome', 'Fransız kosmetika və parfüm evi', true),
('Burberry', 'burberry', 'Britaniya lüks brendı', true)
ON CONFLICT (slug) DO NOTHING;

-- Initial site settings
INSERT INTO site_settings (key, value) VALUES
('site_name', 'KƏEL PARFÜM'),
('whatsapp_number', '994709717477'),
('free_delivery_threshold', '50'),
('delivery_fee', '5')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
