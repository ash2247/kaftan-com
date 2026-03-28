-- Quick Fix: Add Safari and Paradise Products to Database
-- Run this script in Supabase SQL Editor

-- Check if display_page column exists, add if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'display_page'
    ) THEN
        ALTER TABLE products ADD COLUMN display_page TEXT DEFAULT 'all';
    END IF;
END $$;

-- Update existing products to have display_page if NULL
UPDATE products SET display_page = 'all' WHERE display_page IS NULL;

-- Insert Safari products if they don't exist
INSERT INTO products (id, name, price, category, style, color, display_page, status, in_stock, images, created_at)
VALUES 
('sf1', 'Tropical Coral Hi-Low Dress', 0, 'Hi-Low Dress', 'hi low dress', 'Pink', 'safari', 'published', true, '["/assets/safari/safari-1.png"]', NOW()),
('sf2', 'Tropical Coral Open Frill Dress', 0, 'Open Frill Dress', 'front open frill dress', 'Pink', 'safari', 'published', true, '["/assets/safari/safari-2.png"]', NOW()),
('sf3', 'Athena Long Shirt Dress - Blue', 0, 'Long Shirt Dress', 'long dress', 'Blue', 'safari', 'published', true, '["/assets/safari/safari-3.png"]', NOW())
ON CONFLICT (id) DO UPDATE SET
    display_page = 'safari',
    status = 'published',
    in_stock = true;

-- Insert Paradise products if they don't exist
INSERT INTO products (id, name, price, category, style, color, display_page, status, in_stock, images, created_at)
VALUES 
('pr1', 'Paradise Resort Long Kaftan - Green', 0, 'Long Kaftan', 'Long Kaftan', 'Green', 'paradise', 'published', true, '["/assets/paradise/paradise-1.jpg"]', NOW()),
('pr2', 'Paradise Resort Hi-Low Dress - Green', 0, 'Hi-Low Dress', 'High-Low Dress', 'Green', 'paradise', 'published', true, '["/assets/paradise/paradise-2.jpg"]', NOW()),
('pr3', 'Paradise Resort Shirt - Green', 0, 'Shirt', 'Shirt', 'Green', 'paradise', 'published', true, '["/assets/paradise/paradise-3.jpg"]', NOW())
ON CONFLICT (id) DO UPDATE SET
    display_page = 'paradise',
    status = 'published',
    in_stock = true;

-- Verification
SELECT 'SAFARI PRODUCTS' as collection, COUNT(*) as count FROM products WHERE display_page = 'safari';
SELECT 'PARADISE PRODUCTS' as collection, COUNT(*) as count FROM products WHERE display_page = 'paradise';
