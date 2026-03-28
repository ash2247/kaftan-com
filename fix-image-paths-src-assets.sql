-- Fix image paths to point to actual src/assets/ folder location
-- Update all image paths to use /src/assets/safari/ and /src/assets/paradise/

-- Step 1: Update ALL Safari product image paths to use /src/assets/safari/
UPDATE products 
SET images = ARRAY(
    SELECT '/src/assets/safari/safari-' || generate_series(1, 38) || '.png'
) || ARRAY[]::text[]
WHERE display_page = 'safari';

-- Step 2: Update ALL Paradise product image paths to use /src/assets/paradise/
UPDATE products 
SET images = ARRAY(
    SELECT '/src/assets/paradise/paradise-' || generate_series(1, 63) || '.jpg'
) || ARRAY[]::text[]
WHERE display_page = 'paradise';

-- Alternative approach: Update each product individually with correct image number
-- Step 3: Update Safari products with their specific image numbers
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

-- Step 4: Update Paradise products with their specific image numbers
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
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-11.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Grey Hi-Low Dress';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-12.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Grey Sleeved Kaftan Dress';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-13.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Grey Long Jacket';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-14.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Blue Short Jacket';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-15.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Blue Tank Top';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-16.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Hi-Low Dress';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-17.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Long Cape';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-18.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Razor Dress';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-19.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Gypsy Top';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-20.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Palazzo Pant';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-21.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Short Jacket';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-22.jpg'] WHERE display_page = 'paradise' AND name = 'Garden Delight Long Kaftan - Aqua';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-23.jpg'] WHERE display_page = 'paradise' AND name = 'Garden Delight Long Kaftan - Coral';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-24.jpg'] WHERE display_page = 'paradise' AND name = 'Garden Delight Shirt';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-25.jpg'] WHERE display_page = 'paradise' AND name = 'Marigold Aqua Brown Long Shirt Dress';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-26.jpg'] WHERE display_page = 'paradise' AND name = 'Marigold Aqua Brown Short Kaftan';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-27.jpg'] WHERE display_page = 'paradise' AND name = 'Monet Orange Gypsy Top';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-28.jpg'] WHERE display_page = 'paradise' AND name = 'Monet Orange Hi-Low Dress';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-29.jpg'] WHERE display_page = 'paradise' AND name = 'Monet Orange Long Box Kaftan';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-30.jpg'] WHERE display_page = 'paradise' AND name = 'Monet Orange Shirt';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-31.jpg'] WHERE display_page = 'paradise' AND name = 'Monet Orange Short Jacket';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-32.jpg'] WHERE display_page = 'paradise' AND name = 'Monet Orange Tank Top';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-33.jpg'] WHERE display_page = 'paradise' AND name = 'Monet Orange Tunic Dress';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-34.jpg'] WHERE display_page = 'paradise' AND name = 'Monet Orange Wrap Pant';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-35.jpg'] WHERE display_page = 'paradise' AND name = 'Tiger Brown Short Frill Dress';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-36.jpg'] WHERE display_page = 'paradise' AND name = 'Tiger Brown Short Kaftan';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-37.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Tank Top';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-38.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Tank Top - Variant';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-39.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Tank Top - Style 2';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-40.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Tank Top - Style 3';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-41.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Tank Top - Style 4';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-42.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Tank Top - Style 5';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-43.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Tank Top - Style 6';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-44.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Tank Top - Style 7';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-45.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Tank Top - Style 8';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-46.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Tank Top - Style 9';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-47.jpg'] WHERE display_page = 'paradise' AND name = 'Zahara Pink Tank Top - Style 10';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-48.jpg'] WHERE display_page = 'paradise' AND name = 'Garden Delight Long Kaftan - Blue';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-49.jpg'] WHERE display_page = 'paradise' AND name = 'Garden Delight Long Kaftan - Yellow';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-50.jpg'] WHERE display_page = 'paradise' AND name = 'Garden Delight Long Kaftan - Pink';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-51.jpg'] WHERE display_page = 'paradise' AND name = 'Garden Delight Long Kaftan - Green';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-52.jpg'] WHERE display_page = 'paradise' AND name = 'Garden Delight Long Kaftan - Purple';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-53.jpg'] WHERE display_page = 'paradise' AND name = 'Garden Delight Long Kaftan - Orange';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-54.jpg'] WHERE display_page = 'paradise' AND name = 'Garden Delight Long Kaftan - Red';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-55.jpg'] WHERE display_page = 'paradise' AND name = 'Garden Delight Long Kaftan - Multi';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-56.jpg'] WHERE display_page = 'paradise' AND name = 'Marigold Aqua Brown Long Kaftan';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-57.jpg'] WHERE display_page = 'paradise' AND name = 'Marigold Aqua Brown Short Dress';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-58.jpg'] WHERE display_page = 'paradise' AND name = 'Marigold Aqua Brown Shirt';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-59.jpg'] WHERE display_page = 'paradise' AND name = 'Marigold Aqua Brown Tank Top';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-60.jpg'] WHERE display_page = 'paradise' AND name = 'Monet Orange Long Dress';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-61.jpg'] WHERE display_page = 'paradise' AND name = 'Monet Orange Short Dress';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-62.jpg'] WHERE display_page = 'paradise' AND name = 'Monet Orange Skirt';
UPDATE products SET images = ARRAY['/src/assets/paradise/paradise-63.jpg'] WHERE display_page = 'paradise' AND name = 'Monet Orange Wrap Pant';

-- Step 5: Verification - Check updated image paths
SELECT 'SAFARI IMAGE PATHS' as collection, name, unnest(images) as image_path
FROM products 
WHERE display_page = 'safari'
LIMIT 3;

SELECT 'PARADISE IMAGE PATHS' as collection, name, unnest(images) as image_path
FROM products 
WHERE display_page = 'paradise'
LIMIT 3;
