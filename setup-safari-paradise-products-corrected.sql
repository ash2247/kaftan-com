-- Setup Safari and Paradise Collection Products (Corrected Version)
-- This script will populate the database with Safari and Paradise products

-- First, let's check if display_page column exists, add if it doesn't
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

-- Insert Safari Products - using only essential columns
INSERT INTO products (
    id, name, price, category, style, color, display_page, status, in_stock, images, created_at
) VALUES
-- Safari Products (38 products)
(gen_random_uuid(), 'Tropical Coral Hi-Low Dress', 0, 'Hi-Low Dress', 'hi low dress', 'Pink', 'safari', 'published', true, ARRAY['/assets/safari/safari-1.png']::text[], NOW()),
(gen_random_uuid(), 'Tropical Coral Open Frill Dress', 0, 'Open Frill Dress', 'front open frill dress', 'Pink', 'safari', 'published', true, ARRAY['/assets/safari/safari-2.png']::text[], NOW()),
(gen_random_uuid(), 'Athena Long Shirt Dress - Blue', 0, 'Long Shirt Dress', 'long dress', 'Blue', 'safari', 'published', true, ARRAY['/assets/safari/safari-3.png']::text[], NOW()),
(gen_random_uuid(), 'Athena Gypsy Top - Blue', 0, 'Gypsy Top', 'gypsy dress', 'Blue', 'safari', 'published', true, ARRAY['/assets/safari/safari-4.png']::text[], NOW()),
(gen_random_uuid(), 'Athena Box Kaftan - Blue', 0, 'Box Kaftan', 'box kaftan', 'Blue', 'safari', 'published', true, ARRAY['/assets/safari/safari-5.png']::text[], NOW()),
(gen_random_uuid(), 'Athena Gypsy Top - Blue Print', 0, 'Gypsy Top', 'gypsy top', 'Blue', 'safari', 'published', true, ARRAY['/assets/safari/safari-6.png']::text[], NOW()),
(gen_random_uuid(), 'Athena Tank Top & Palazzo Pant - Blue', 0, 'Tank Top + Plazo Pant', 'top and plazo pant', 'Blue', 'safari', 'published', true, ARRAY['/assets/safari/safari-7.png']::text[], NOW()),
(gen_random_uuid(), 'Sorento Kimono & Bag - Off White', 0, 'Kimono and Bag', 'kimono and bag', 'Off White', 'safari', 'published', true, ARRAY['/assets/safari/safari-8.png']::text[], NOW()),
(gen_random_uuid(), 'Brown Leopard Shirt & Palazzo', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Brown', 'safari', 'published', true, ARRAY['/assets/safari/safari-9.png']::text[], NOW()),
(gen_random_uuid(), 'Brown Leopard Tank Top & Palazzo', 0, 'Tank Top + Plazo Pant', 'tank top and plazo pant', 'Brown', 'safari', 'published', true, ARRAY['/assets/safari/safari-10.png']::text[], NOW());

-- Insert Paradise Products - using only essential columns
INSERT INTO products (
    id, name, price, category, style, color, display_page, status, in_stock, images, created_at
) VALUES
(gen_random_uuid(), 'Paradise Resort Long Kaftan - Green', 0, 'Long Kaftan', 'Long Kaftan', 'Green', 'paradise', 'published', true, ARRAY['/assets/paradise/paradise-1.jpg']::text[], NOW()),
(gen_random_uuid(), 'Paradise Resort Hi-Low Dress - Green', 0, 'Hi-Low Dress', 'High-Low Dress', 'Green', 'paradise', 'published', true, ARRAY['/assets/paradise/paradise-2.jpg']::text[], NOW()),
(gen_random_uuid(), 'Paradise Resort Shirt - Green', 0, 'Shirt', 'Shirt', 'Green', 'paradise', 'published', true, ARRAY['/assets/paradise/paradise-3.jpg']::text[], NOW()),
(gen_random_uuid(), 'Florence Blue Hi-Low Dress', 0, 'Hi-Low Dress', 'High-Low Dress', 'Blue', 'paradise', 'published', true, ARRAY['/assets/paradise/paradise-4.jpg']::text[], NOW()),
(gen_random_uuid(), 'Florence Blue Long Jacket & Wrap Pants', 0, 'Long Jacket + Wrap Pant', 'Long jacket + wrap pants', 'Blue', 'paradise', 'published', true, ARRAY['/assets/paradise/paradise-5.jpg']::text[], NOW()),
(gen_random_uuid(), 'Florence Blue Long Kaftan', 0, 'Long Kaftan', 'Long Kaftan', 'Blue', 'paradise', 'published', true, ARRAY['/assets/paradise/paradise-6.jpg']::text[], NOW()),
(gen_random_uuid(), 'Florence Blue Butterfly Top', 0, 'Butterfly Top', 'Butterfly Top', 'Blue', 'paradise', 'published', true, ARRAY['/assets/paradise/paradise-7.jpg']::text[], NOW()),
(gen_random_uuid(), 'Florence Grey Long Kaftan', 0, 'Long Kaftan', 'Long Kaftan', 'Grey', 'paradise', 'published', true, ARRAY['/assets/paradise/paradise-8.jpg']::text[], NOW()),
(gen_random_uuid(), 'Florence Grey Razor Dress', 0, 'Razor Dress', 'Razor Dress', 'Grey', 'paradise', 'published', true, ARRAY['/assets/paradise/paradise-9.jpg']::text[], NOW()),
(gen_random_uuid(), 'Florence Grey Tank Top', 0, 'Tank Top', 'Tank Top', 'Grey', 'paradise', 'published', true, ARRAY['/assets/paradise/paradise-10.jpg']::text[], NOW());

-- Verification queries
SELECT 'SAFARI PRODUCTS' as collection, COUNT(*) as product_count
FROM products 
WHERE display_page = 'safari' AND status = 'published';

SELECT 'PARADISE PRODUCTS' as collection, COUNT(*) as product_count
FROM products 
WHERE display_page = 'paradise' AND status = 'published';

-- Show sample products from each collection
SELECT 'SAFARI SAMPLE' as collection, name, category, display_page
FROM products 
WHERE display_page = 'safari' 
LIMIT 3;

SELECT 'PARADISE SAMPLE' as collection, name, category, display_page
FROM products 
WHERE display_page = 'paradise' 
LIMIT 3;
