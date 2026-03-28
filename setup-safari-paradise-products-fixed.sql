-- Setup Safari and Paradise Collection Products (Fixed Version)
-- This script will populate the database with Safari and Paradise products

-- First, let's check if display_page column exists
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

-- Insert Safari Products
INSERT INTO products (
    id, name, price, category, style, color, display_page, status, in_stock, images, created_at
) VALUES
-- Safari Products (38 products)
(gen_random_uuid(), 'Tropical Coral Hi-Low Dress', 0, 'Hi-Low Dress', 'hi low dress', 'Pink', 'safari', 'published', true, '["/assets/safari/safari-1.png"]', NOW()),
(gen_random_uuid(), 'Tropical Coral Open Frill Dress', 0, 'Open Frill Dress', 'front open frill dress', 'Pink', 'safari', 'published', true, '["/assets/safari/safari-2.png"]', NOW()),
(gen_random_uuid(), 'Athena Long Shirt Dress - Blue', 0, 'Long Shirt Dress', 'long dress', 'Blue', 'safari', 'published', true, '["/assets/safari/safari-3.png"]', NOW()),
(gen_random_uuid(), 'Athena Gypsy Top - Blue', 0, 'Gypsy Top', 'gypsy dress', 'Blue', 'safari', 'published', true, '["/assets/safari/safari-4.png"]', NOW()),
(gen_random_uuid(), 'Athena Box Kaftan - Blue', 0, 'Box Kaftan', 'box kaftan', 'Blue', 'safari', 'published', true, '["/assets/safari/safari-5.png"]', NOW()),
(gen_random_uuid(), 'Athena Gypsy Top - Blue Print', 0, 'Gypsy Top', 'gypsy top', 'Blue', 'safari', 'published', true, '["/assets/safari/safari-6.png"]', NOW()),
(gen_random_uuid(), 'Athena Tank Top & Palazzo Pant - Blue', 0, 'Tank Top + Plazo Pant', 'top and plazo pant', 'Blue', 'safari', 'published', true, '["/assets/safari/safari-7.png"]', NOW()),
(gen_random_uuid(), 'Sorento Kimono & Bag - Off White', 0, 'Kimono and Bag', 'kimono and bag', 'Off White', 'safari', 'published', true, '["/assets/safari/safari-8.png"]', NOW()),
(gen_random_uuid(), 'Brown Leopard Shirt & Palazzo', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Brown', 'safari', 'published', true, '["/assets/safari/safari-9.png"]', NOW()),
(gen_random_uuid(), 'Brown Leopard Tank Top & Palazzo', 0, 'Tank Top + Plazo Pant', 'tank top and plazo pant', 'Brown', 'safari', 'published', true, '["/assets/safari/safari-10.png"]', NOW()),
(gen_random_uuid(), 'Aqua Leopard Shirt & Palazzo - Black', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Black', 'safari', 'published', true, '["/assets/safari/safari-11.png"]', NOW()),
(gen_random_uuid(), 'Pardus Kimono & Bag - Brown', 0, 'Kimono and Bag', 'kimono and bag', 'Brown', 'safari', 'published', true, '["/assets/safari/safari-12.png"]', NOW()),
(gen_random_uuid(), 'Merika Long Shirt Dress - Blue', 0, 'Long Shirt Dress', 'long shirt', 'Blue', 'safari', 'published', true, '["/assets/safari/safari-13.png"]', NOW()),
(gen_random_uuid(), 'Merika Long Shirt Dress - Black', 0, 'Long Shirt Dress', 'long dress', 'Black', 'safari', 'published', true, '["/assets/safari/safari-14.png"]', NOW()),
(gen_random_uuid(), 'Tropical Shirt & Palazzo - Pink', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Pink', 'safari', 'published', true, '["/assets/safari/safari-15.png"]', NOW()),
(gen_random_uuid(), 'Athena Hi-Low Dress - Blue', 0, 'Hi-Low Dress', 'hi low dress', 'Blue', 'safari', 'published', true, '["/assets/safari/safari-16.png"]', NOW()),
(gen_random_uuid(), 'Athena Shirt & Palazzo - Blue', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Blue', 'safari', 'published', true, '["/assets/safari/safari-17.png"]', NOW()),
(gen_random_uuid(), 'Sorento Gypsy Top - Off White', 0, 'Gypsy Top', 'gypsy dress', 'Off White', 'safari', 'published', true, '["/assets/safari/safari-18.png"]', NOW()),
(gen_random_uuid(), 'Sorento Gypsy Top & Palazzo - Off White', 0, 'Gypsy Top and Plazo Pant', 'gypsy top and plazo pant', 'Off White', 'safari', 'published', true, '["/assets/safari/safari-19.png"]', NOW()),
(gen_random_uuid(), 'Sorento Tank Top & Palazzo - Off White', 0, 'Tank Top + Plazo Pant', 'tank top and plazo pant', 'Off White', 'safari', 'published', true, '["/assets/safari/safari-20.png"]', NOW()),
(gen_random_uuid(), 'Brown Leopard Kimono & Bag', 0, 'Kimono and Bag', 'kimono and bag', 'Brown', 'safari', 'published', true, '["/assets/safari/safari-21.png"]', NOW()),
(gen_random_uuid(), 'Brown Leopard Gypsy Top', 0, 'Gypsy Top', 'Gypsy top', 'Brown', 'safari', 'published', true, '["/assets/safari/safari-22.png"]', NOW()),
(gen_random_uuid(), 'Black Leopard Long Shirt Dress', 0, 'Long Shirt Dress', 'long dress', 'Black', 'safari', 'published', true, '["/assets/safari/safari-23.png"]', NOW()),
(gen_random_uuid(), 'Black Leopard Shirt & Palazzo', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Black', 'safari', 'published', true, '["/assets/safari/safari-24.png"]', NOW()),
(gen_random_uuid(), 'Black Leopard Gypsy Top', 0, 'Gypsy Top', 'Gypsy top', 'Black and white', 'safari', 'published', true, '["/assets/safari/safari-25.png"]', NOW()),
(gen_random_uuid(), 'Black Leopard Kimono & Bag - Skin', 0, 'Kimono and Bag', 'kimono and bag', 'Skin', 'safari', 'published', true, '["/assets/safari/safari-26.png"]', NOW()),
(gen_random_uuid(), 'Tiger Shirt Tank Top & Palazzo - Skin', 0, 'Tank Top + Plazo Pant', 'plazo pant', 'Skin', 'safari', 'published', true, '["/assets/safari/safari-27.png"]', NOW()),
(gen_random_uuid(), 'Aqua Leopard Short Dress - Black', 0, 'Short Dress', 'short dress', 'Black', 'safari', 'published', true, '["/assets/safari/safari-28.png"]', NOW()),
(gen_random_uuid(), 'Aqua Leopard Coral Front - Black', 0, 'Coral Front', 'coral front', 'Black', 'safari', 'published', true, '["/assets/safari/safari-29.png"]', NOW()),
(gen_random_uuid(), 'Aqua Leopard Hi-Low Dress - Black', 0, 'Hi-Low Dress', 'hi low dress', 'Black', 'safari', 'published', true, '["/assets/safari/safari-30.png"]', NOW()),
(gen_random_uuid(), 'Aqua Leopard Long Shirt Dress - Black', 0, 'Long Shirt Dress', 'long dress', 'Black', 'safari', 'published', true, '["/assets/safari/safari-31.png"]', NOW()),
(gen_random_uuid(), 'Aqua Leopard Long Box Kaftan - Black', 0, 'Long Box Kaftan', 'box kaftan', 'Black', 'safari', 'published', true, '["/assets/safari/safari-32.png"]', NOW()),
(gen_random_uuid(), 'Aqua Leopard Kimono & Bag - Black', 0, 'Kimono and Bag', 'kimono and bag', 'Black', 'safari', 'published', true, '["/assets/safari/safari-33.png"]', NOW()),
(gen_random_uuid(), 'Aqua Leopard Tank Top & Palazzo - Black', 0, 'Tank Top + Plazo Pant', 'tank top and plazo', 'Black', 'safari', 'published', true, '["/assets/safari/safari-34.png"]', NOW()),
(gen_random_uuid(), 'Paradus Long Frill Dress - Brown', 0, 'Long Frill Dress', 'long frill dress', 'Brown', 'safari', 'published', true, '["/assets/safari/safari-35.png"]', NOW()),
(gen_random_uuid(), 'Paradus Short Frill Dress - Brown', 0, 'Short Frill Dress', 'short frill dress', 'Brown', 'safari', 'published', true, '["/assets/safari/safari-36.png"]', NOW()),
(gen_random_uuid(), 'Paradus Hi-Low Dress - Brown', 0, 'Hi-Low Dress', 'High low dress', 'Brown', 'safari', 'published', true, '["/assets/safari/safari-37.png"]', NOW()),
(gen_random_uuid(), 'Paradus Tank Top & Palazzo - Brown', 0, 'Tank Top + Plazo Pant', 'tank top and plazo', 'Brown', 'safari', 'published', true, '["/assets/safari/safari-38.png"]', NOW());

-- Insert Paradise Products (first 10 as sample)
INSERT INTO products (
    id, name, price, category, style, color, display_page, status, in_stock, images, created_at
) VALUES
(gen_random_uuid(), 'Paradise Resort Long Kaftan - Green', 0, 'Long Kaftan', 'Long Kaftan', 'Green', 'paradise', 'published', true, '["/assets/paradise/paradise-1.jpg"]', NOW()),
(gen_random_uuid(), 'Paradise Resort Hi-Low Dress - Green', 0, 'Hi-Low Dress', 'High-Low Dress', 'Green', 'paradise', 'published', true, '["/assets/paradise/paradise-2.jpg"]', NOW()),
(gen_random_uuid(), 'Paradise Resort Shirt - Green', 0, 'Shirt', 'Shirt', 'Green', 'paradise', 'published', true, '["/assets/paradise/paradise-3.jpg"]', NOW()),
(gen_random_uuid(), 'Florence Blue Hi-Low Dress', 0, 'Hi-Low Dress', 'High-Low Dress', 'Blue', 'paradise', 'published', true, '["/assets/paradise/paradise-4.jpg"]', NOW()),
(gen_random_uuid(), 'Florence Blue Long Jacket & Wrap Pants', 0, 'Long Jacket + Wrap Pant', 'Long jacket + wrap pants', 'Blue', 'paradise', 'published', true, '["/assets/paradise/paradise-5.jpg"]', NOW()),
(gen_random_uuid(), 'Florence Blue Long Kaftan', 0, 'Long Kaftan', 'Long Kaftan', 'Blue', 'paradise', 'published', true, '["/assets/paradise/paradise-6.jpg"]', NOW()),
(gen_random_uuid(), 'Florence Blue Butterfly Top', 0, 'Butterfly Top', 'Butterfly Top', 'Blue', 'paradise', 'published', true, '["/assets/paradise/paradise-7.jpg"]', NOW()),
(gen_random_uuid(), 'Florence Grey Long Kaftan', 0, 'Long Kaftan', 'Long Kaftan', 'Grey', 'paradise', 'published', true, '["/assets/paradise/paradise-8.jpg"]', NOW()),
(gen_random_uuid(), 'Florence Grey Razor Dress', 0, 'Razor Dress', 'Razor Dress', 'Grey', 'paradise', 'published', true, '["/assets/paradise/paradise-9.jpg"]', NOW()),
(gen_random_uuid(), 'Florence Grey Tank Top', 0, 'Tank Top', 'Tank Top', 'Grey', 'paradise', 'published', true, '["/assets/paradise/paradise-10.jpg"]', NOW());

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
