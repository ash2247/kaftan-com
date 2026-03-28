-- Fix image paths to point to actual src/assets/ folder location
-- This script updates each product with the correct image number

-- Step 1: Update Safari products (1-38)
UPDATE products SET images = ARRAY['/src/assets/safari/safari-1.png'] WHERE display_page = 'safari' AND name = 'Tropical Coral Hi-Low Dress';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-2.png'] WHERE display_page = 'safari' AND name = 'Tropical Coral Open Frill Dress';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-3.png'] WHERE display_page = 'safari' AND name = 'Athena Long Shirt Dress - Blue';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-4.png'] WHERE display_page = 'safari' AND name = 'Athena Gypsy Top - Blue';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-5.png'] WHERE display_page = 'safari' AND name = 'Athena Box Kaftan - Blue';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-6.png'] WHERE display_page = 'safari' AND name = 'Athena Gypsy Top - Blue Print';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-7.png'] WHERE display_page = 'safari' AND name = 'Athena Tank Top & Palazzo Pant - Blue';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-8.png'] WHERE display_page = 'safari' AND name = 'Sorento Kimono & Bag - Off White';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-9.png'] WHERE display_page = 'safari' AND name = 'Brown Leopard Shirt & Palazzo';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-10.png'] WHERE display_page = 'safari' AND name = 'Brown Leopard Tank Top & Palazzo';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-11.png'] WHERE display_page = 'safari' AND name = 'Aqua Leopard Shirt & Palazzo - Black';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-12.png'] WHERE display_page = 'safari' AND name = 'Pardus Kimono & Bag - Brown';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-13.png'] WHERE display_page = 'safari' AND name = 'Merika Long Shirt Dress - Blue';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-14.png'] WHERE display_page = 'safari' AND name = 'Merika Long Shirt Dress - Black';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-15.png'] WHERE display_page = 'safari' AND name = 'Tropical Shirt & Palazzo - Pink';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-16.png'] WHERE display_page = 'safari' AND name = 'Athena Hi-Low Dress - Blue';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-17.png'] WHERE display_page = 'safari' AND name = 'Athena Shirt & Palazzo - Blue';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-18.png'] WHERE display_page = 'safari' AND name = 'Sorento Gypsy Top - Off White';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-19.png'] WHERE display_page = 'safari' AND name = 'Sorento Gypsy Top & Palazzo - Off White';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-20.png'] WHERE display_page = 'safari' AND name = 'Sorento Tank Top & Palazzo - Off White';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-21.png'] WHERE display_page = 'safari' AND name = 'Brown Leopard Kimono & Bag';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-22.png'] WHERE display_page = 'safari' AND name = 'Brown Leopard Gypsy Top';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-23.png'] WHERE display_page = 'safari' AND name = 'Black Leopard Long Shirt Dress';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-24.png'] WHERE display_page = 'safari' AND name = 'Black Leopard Shirt & Palazzo';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-25.png'] WHERE display_page = 'safari' AND name = 'Black Leopard Gypsy Top';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-26.png'] WHERE display_page = 'safari' AND name = 'Black Leopard Kimono & Bag - Skin';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-27.png'] WHERE display_page = 'safari' AND name = 'Tiger Shirt Tank Top & Palazzo - Skin';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-28.png'] WHERE display_page = 'safari' AND name = 'Aqua Leopard Short Dress - Black';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-29.png'] WHERE display_page = 'safari' AND name = 'Aqua Leopard Coral Front - Black';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-30.png'] WHERE display_page = 'safari' AND name = 'Aqua Leopard Hi-Low Dress - Black';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-31.png'] WHERE display_page = 'safari' AND name = 'Aqua Leopard Long Shirt Dress - Black';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-32.png'] WHERE display_page = 'safari' AND name = 'Aqua Leopard Long Box Kaftan - Black';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-33.png'] WHERE display_page = 'safari' AND name = 'Aqua Leopard Kimono & Bag - Black';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-34.png'] WHERE display_page = 'safari' AND name = 'Aqua Leopard Tank Top & Palazzo - Black';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-35.png'] WHERE display_page = 'safari' AND name = 'Paradus Long Frill Dress - Brown';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-36.png'] WHERE display_page = 'safari' AND name = 'Paradus Short Frill Dress - Brown';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-37.png'] WHERE display_page = 'safari' AND name = 'Paradus Hi-Low Dress - Brown';
UPDATE products SET images = ARRAY['/src/assets/safari/safari-38.png'] WHERE display_page = 'safari' AND name = 'Paradus Tank Top & Palazzo - Brown';

-- Step 2: Update Paradise products (1-10 - sample)
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-1.jpg'] WHERE display_page = 'paradise' AND name = 'Paradise Resort Long Kaftan - Green';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-2.jpg'] WHERE display_page = 'paradise' AND name = 'Paradise Resort Hi-Low Dress - Green';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-3.jpg'] WHERE display_page = 'paradise' AND name = 'Paradise Resort Shirt - Green';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-4.jpg'] WHERE display_page = 'paradise' AND name = 'Florence Blue Hi-Low Dress';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-5.jpg'] WHERE display_page = 'paradise' AND name = 'Florence Blue Long Jacket & Wrap Pants';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-6.jpg'] WHERE display_page = 'paradise' AND name = 'Florence Blue Long Kaftan';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-7.jpg'] WHERE display_page = 'paradise' AND name = 'Florence Blue Butterfly Top';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-8.jpg'] WHERE display_page = 'paradise' AND name = 'Florence Grey Long Kaftan';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-9.jpg'] WHERE display_page = 'paradise' AND name = 'Florence Grey Razor Dress';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-10.jpg'] WHERE display_page = 'paradise' AND name = 'Florence Grey Tank Top';

-- Step 3: Verification - Check updated image paths
SELECT 'SAFARI IMAGE PATHS' as collection, name, unnest(images) as image_path
FROM products 
WHERE display_page = 'safari'
LIMIT 3;

SELECT 'PARADISE IMAGE PATHS' as collection, name, unnest(images) as image_path
FROM products 
WHERE display_page = 'paradise'
LIMIT 3;
