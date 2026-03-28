-- Setup Safari and Paradise Collection Products
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
    id, name, slug, price, category, style, color, display_page, status, in_stock, images, created_at
) VALUES
-- Safari Products (38 products)
(gen_random_uuid(), 'Tropical Coral Hi-Low Dress', 'tropical-coral-hi-low-dress', 0, 'Hi-Low Dress', 'hi low dress', 'Pink', 'safari', 'active', true, ARRAY['/assets/safari/safari-1.png']::text[], NOW()),
(gen_random_uuid(), 'Tropical Coral Open Frill Dress', 'tropical-coral-open-frill-dress', 0, 'Open Frill Dress', 'front open frill dress', 'Pink', 'safari', 'active', true, ARRAY['/assets/safari/safari-2.png']::text[], NOW()),
(gen_random_uuid(), 'Athena Long Shirt Dress - Blue', 'athena-long-shirt-dress-blue', 0, 'Long Shirt Dress', 'long dress', 'Blue', 'safari', 'active', true, ARRAY['/assets/safari/safari-3.png']::text[], NOW()),
(gen_random_uuid(), 'Athena Gypsy Top - Blue', 'athena-gypsy-top-blue', 0, 'Gypsy Top', 'gypsy dress', 'Blue', 'safari', 'active', true, ARRAY['/assets/safari/safari-4.png']::text[], NOW()),
(gen_random_uuid(), 'Athena Box Kaftan - Blue', 'athena-box-kaftan-blue', 0, 'Box Kaftan', 'box kaftan', 'Blue', 'safari', 'active', true, ARRAY['/assets/safari/safari-5.png']::text[], NOW()),
(gen_random_uuid(), 'Athena Gypsy Top - Blue Print', 'athena-gypsy-top-blue-print', 0, 'Gypsy Top', 'gypsy top', 'Blue', 'safari', 'active', true, ARRAY['/assets/safari/safari-6.png']::text[], NOW()),
(gen_random_uuid(), 'Athena Tank Top & Palazzo Pant - Blue', 'athena-tank-top-palazzo-pant-blue', 0, 'Tank Top + Plazo Pant', 'top and plazo pant', 'Blue', 'safari', 'active', true, ARRAY['/assets/safari/safari-7.png']::text[], NOW()),
(gen_random_uuid(), 'Sorento Kimono & Bag - Off White', 'sorento-kimono-bag-off-white', 0, 'Kimono and Bag', 'kimono and bag', 'Off White', 'safari', 'active', true, ARRAY['/assets/safari/safari-8.png']::text[], NOW()),
(gen_random_uuid(), 'Brown Leopard Shirt & Palazzo', 'brown-leopard-shirt-palazzo', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Brown', 'safari', 'active', true, ARRAY['/assets/safari/safari-9.png']::text[], NOW()),
(gen_random_uuid(), 'Brown Leopard Tank Top & Palazzo', 'brown-leopard-tank-top-palazzo', 0, 'Tank Top + Plazo Pant', 'tank top and plazo pant', 'Brown', 'safari', 'active', true, ARRAY['/assets/safari/safari-10.png']::text[], NOW()),
(gen_random_uuid(), 'Aqua Leopard Shirt & Palazzo - Black', 'aqua-leopard-shirt-palazzo-black', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Black', 'safari', 'active', true, ARRAY['/assets/safari/safari-11.png']::text[], NOW()),
(gen_random_uuid(), 'Pardus Kimono & Bag - Brown', 'pardus-kimono-bag-brown', 0, 'Kimono and Bag', 'kimono and bag', 'Brown', 'safari', 'active', true, ARRAY['/assets/safari/safari-12.png']::text[], NOW()),
(gen_random_uuid(), 'Merika Long Shirt Dress - Blue', 'merika-long-shirt-dress-blue', 0, 'Long Shirt Dress', 'long shirt', 'Blue', 'safari', 'active', true, ARRAY['/assets/safari/safari-13.png']::text[], NOW()),
(gen_random_uuid(), 'Merika Long Shirt Dress - Black', 'merika-long-shirt-dress-black', 0, 'Long Shirt Dress', 'long dress', 'Black', 'safari', 'active', true, ARRAY['/assets/safari/safari-14.png']::text[], NOW()),
(gen_random_uuid(), 'Tropical Shirt & Palazzo - Pink', 'tropical-shirt-palazzo-pink', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Pink', 'safari', 'active', true, ARRAY['/assets/safari/safari-15.png']::text[], NOW()),
(gen_random_uuid(), 'Athena Hi-Low Dress - Blue', 'athena-hi-low-dress-blue', 0, 'Hi-Low Dress', 'hi low dress', 'Blue', 'safari', 'active', true, ARRAY['/assets/safari/safari-16.png']::text[], NOW()),
(gen_random_uuid(), 'Athena Shirt & Palazzo - Blue', 'athena-shirt-palazzo-blue', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Blue', 'safari', 'active', true, ARRAY['/assets/safari/safari-17.png']::text[], NOW()),
(gen_random_uuid(), 'Sorento Gypsy Top - Off White', 'sorento-gypsy-top-off-white', 0, 'Gypsy Top', 'gypsy dress', 'Off White', 'safari', 'active', true, ARRAY['/assets/safari/safari-18.png']::text[], NOW()),
(gen_random_uuid(), 'Sorento Gypsy Top & Palazzo - Off White', 'sorento-gypsy-top-palazzo-off-white', 0, 'Gypsy Top and Plazo Pant', 'gypsy top and plazo pant', 'Off White', 'safari', 'active', true, ARRAY['/assets/safari/safari-19.png']::text[], NOW()),
(gen_random_uuid(), 'Sorento Tank Top & Palazzo - Off White', 'sorento-tank-top-palazzo-off-white', 0, 'Tank Top + Plazo Pant', 'tank top and plazo pant', 'Off White', 'safari', 'active', true, ARRAY['/assets/safari/safari-20.png']::text[], NOW()),
(gen_random_uuid(), 'Brown Leopard Kimono & Bag', 'brown-leopard-kimono-bag', 0, 'Kimono and Bag', 'kimono and bag', 'Brown', 'safari', 'active', true, ARRAY['/assets/safari/safari-21.png']::text[], NOW()),
(gen_random_uuid(), 'Brown Leopard Gypsy Top', 'brown-leopard-gypsy-top', 0, 'Gypsy Top', 'Gypsy top', 'Brown', 'safari', 'active', true, ARRAY['/assets/safari/safari-22.png']::text[], NOW()),
(gen_random_uuid(), 'Black Leopard Long Shirt Dress', 'black-leopard-long-shirt-dress', 0, 'Long Shirt Dress', 'long dress', 'Black', 'safari', 'active', true, ARRAY['/assets/safari/safari-23.png']::text[], NOW()),
(gen_random_uuid(), 'Black Leopard Shirt & Palazzo', 'black-leopard-shirt-palazzo', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Black', 'safari', 'active', true, ARRAY['/assets/safari/safari-24.png']::text[], NOW()),
(gen_random_uuid(), 'Black Leopard Gypsy Top', 'black-leopard-gypsy-top', 0, 'Gypsy Top', 'Gypsy top', 'Black and white', 'safari', 'active', true, ARRAY['/assets/safari/safari-25.png']::text[], NOW()),
(gen_random_uuid(), 'Black Leopard Kimono & Bag - Skin', 'black-leopard-kimono-bag-skin', 0, 'Kimono and Bag', 'kimono and bag', 'Skin', 'safari', 'active', true, ARRAY['/assets/safari/safari-26.png']::text[], NOW()),
(gen_random_uuid(), 'Tiger Shirt Tank Top & Palazzo - Skin', 'tiger-shirt-tank-top-palazzo-skin', 0, 'Tank Top + Plazo Pant', 'plazo pant', 'Skin', 'safari', 'active', true, ARRAY['/assets/safari/safari-27.png']::text[], NOW()),
(gen_random_uuid(), 'Aqua Leopard Short Dress - Black', 'aqua-leopard-short-dress-black', 0, 'Short Dress', 'short dress', 'Black', 'safari', 'active', true, ARRAY['/assets/safari/safari-28.png']::text[], NOW()),
(gen_random_uuid(), 'Aqua Leopard Coral Front - Black', 'aqua-leopard-coral-front-black', 0, 'Coral Front', 'coral front', 'Black', 'safari', 'active', true, ARRAY['/assets/safari/safari-29.png']::text[], NOW()),
(gen_random_uuid(), 'Aqua Leopard Hi-Low Dress - Black', 'aqua-leopard-hi-low-dress-black', 0, 'Hi-Low Dress', 'hi low dress', 'Black', 'safari', 'active', true, ARRAY['/assets/safari/safari-30.png']::text[], NOW()),
(gen_random_uuid(), 'Aqua Leopard Long Shirt Dress - Black', 'aqua-leopard-long-shirt-dress-black', 0, 'Long Shirt Dress', 'long dress', 'Black', 'safari', 'active', true, ARRAY['/assets/safari/safari-31.png']::text[], NOW()),
(gen_random_uuid(), 'Aqua Leopard Long Box Kaftan - Black', 'aqua-leopard-long-box-kaftan-black', 0, 'Long Box Kaftan', 'box kaftan', 'Black', 'safari', 'active', true, ARRAY['/assets/safari/safari-32.png']::text[], NOW()),
(gen_random_uuid(), 'Aqua Leopard Kimono & Bag - Black', 'aqua-leopard-kimono-bag-black', 0, 'Kimono and Bag', 'kimono and bag', 'Black', 'safari', 'active', true, ARRAY['/assets/safari/safari-33.png']::text[], NOW()),
(gen_random_uuid(), 'Aqua Leopard Tank Top & Palazzo - Black', 'aqua-leopard-tank-top-palazzo-black', 0, 'Tank Top + Plazo Pant', 'tank top and plazo', 'Black', 'safari', 'active', true, ARRAY['/assets/safari/safari-34.png']::text[], NOW()),
(gen_random_uuid(), 'Paradus Long Frill Dress - Brown', 'paradus-long-frill-dress-brown', 0, 'Long Frill Dress', 'long frill dress', 'Brown', 'safari', 'active', true, ARRAY['/assets/safari/safari-35.png']::text[], NOW()),
(gen_random_uuid(), 'Paradus Short Frill Dress - Brown', 'paradus-short-frill-dress-brown', 0, 'Short Frill Dress', 'short frill dress', 'Brown', 'safari', 'active', true, ARRAY['/assets/safari/safari-36.png']::text[], NOW()),
(gen_random_uuid(), 'Paradus Hi-Low Dress - Brown', 'paradus-hi-low-dress-brown', 0, 'Hi-Low Dress', 'High low dress', 'Brown', 'safari', 'active', true, ARRAY['/assets/safari/safari-37.png']::text[], NOW()),
(gen_random_uuid(), 'Paradus Tank Top & Palazzo - Brown', 'paradus-tank-top-palazzo-brown', 0, 'Tank Top + Plazo Pant', 'tank top and plazo', 'Brown', 'safari', 'active', true, ARRAY['/assets/safari/safari-38.png']::text[], NOW());

-- Insert Paradise Products
INSERT INTO products (
    id, name, slug, price, category, style, color, display_page, status, in_stock, images, created_at
) VALUES
-- Paradise Products (sample of 10 products)
(gen_random_uuid(), 'Paradise Resort Long Kaftan - Green', 'paradise-resort-long-kaftan-green', 0, 'Long Kaftan', 'Long Kaftan', 'Green', 'paradise', 'active', true, ARRAY['/assets/paradise/paradise-1.jpg']::text[], NOW()),
(gen_random_uuid(), 'Paradise Resort Hi-Low Dress - Green', 'paradise-resort-hi-low-dress-green', 0, 'Hi-Low Dress', 'High-Low Dress', 'Green', 'paradise', 'active', true, ARRAY['/assets/paradise/paradise-2.jpg']::text[], NOW()),
(gen_random_uuid(), 'Paradise Resort Shirt - Green', 'paradise-resort-shirt-green', 0, 'Shirt', 'Shirt', 'Green', 'paradise', 'active', true, ARRAY['/assets/paradise/paradise-3.jpg']::text[], NOW()),
(gen_random_uuid(), 'Florence Blue Hi-Low Dress', 'florence-blue-hi-low-dress', 0, 'Hi-Low Dress', 'High-Low Dress', 'Blue', 'paradise', 'active', true, ARRAY['/assets/paradise/paradise-4.jpg']::text[], NOW()),
(gen_random_uuid(), 'Florence Blue Long Jacket & Wrap Pants', 'florence-blue-long-jacket-wrap-pants', 0, 'Long Jacket + Wrap Pant', 'Long jacket + wrap pants', 'Blue', 'paradise', 'active', true, ARRAY['/assets/paradise/paradise-5.jpg']::text[], NOW()),
(gen_random_uuid(), 'Florence Blue Long Kaftan', 'florence-blue-long-kaftan', 0, 'Long Kaftan', 'Long Kaftan', 'Blue', 'paradise', 'active', true, ARRAY['/assets/paradise/paradise-6.jpg']::text[], NOW()),
(gen_random_uuid(), 'Florence Blue Butterfly Top', 'florence-blue-butterfly-top', 0, 'Butterfly Top', 'Butterfly Top', 'Blue', 'paradise', 'active', true, ARRAY['/assets/paradise/paradise-7.jpg']::text[], NOW()),
(gen_random_uuid(), 'Florence Grey Long Kaftan', 'florence-grey-long-kaftan', 0, 'Long Kaftan', 'Long Kaftan', 'Grey', 'paradise', 'active', true, ARRAY['/assets/paradise/paradise-8.jpg']::text[], NOW()),
(gen_random_uuid(), 'Florence Grey Razor Dress', 'florence-grey-razor-dress', 0, 'Razor Dress', 'Razor Dress', 'Grey', 'paradise', 'active', true, ARRAY['/assets/paradise/paradise-9.jpg']::text[], NOW()),
(gen_random_uuid(), 'Florence Grey Tank Top', 'florence-grey-tank-top', 0, 'Tank Top', 'Tank Top', 'Grey', 'paradise', 'active', true, ARRAY['/assets/paradise/paradise-10.jpg']::text[], NOW());

-- Verification queries
SELECT 'SAFARI PRODUCTS' as collection, COUNT(*) as product_count
FROM products 
WHERE display_page = 'safari' AND status = 'active';

SELECT 'PARADISE PRODUCTS' as collection, COUNT(*) as product_count
FROM products 
WHERE display_page = 'paradise' AND status = 'active';

-- Show sample products from each collection
SELECT 'SAFARI SAMPLE' as collection, name, category, display_page
FROM products 
WHERE display_page = 'safari' 
LIMIT 3;

SELECT 'PARADISE SAMPLE' as collection, name, category, display_page
FROM products 
WHERE display_page = 'paradise' 
LIMIT 3;

SELECT 'PARADISE PRODUCTS' as collection, COUNT(*) as product_count
FROM products 
WHERE display_page = 'paradise' AND status = 'published';

-- Show sample products from each collection
SELECT 'SAFARI SAMPLE' as collection, id, name, category, display_page
FROM products 
WHERE display_page = 'safari' 
LIMIT 3;

SELECT 'PARADISE SAMPLE' as collection, id, name, category, display_page
FROM products 
WHERE display_page = 'paradise' 
LIMIT 3;
