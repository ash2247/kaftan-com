-- Deploy ALL Safari and Paradise Products to Live Database
-- Uses 'Active' status and includes all products

-- Step 1: Check if display_page column exists, add if it doesn't
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

-- Step 2: Check if slug column exists, add if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'slug'
    ) THEN
        ALTER TABLE products ADD COLUMN slug TEXT;
    END IF;
END $$;

-- Step 3: Update existing products to have slugs if they don't exist
UPDATE products 
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-'))
WHERE slug IS NULL OR slug = '';

-- Step 4: Insert ALL Safari Products with 'Active' status
INSERT INTO products (
    id, name, slug, price, category, style, color, display_page, status, in_stock, images, created_at
) 
SELECT 
    gen_random_uuid(), 
    name, 
    slug, 
    price, 
    category, 
    style, 
    color, 
    'safari' as display_page, 
    'Active' as status,
    true as in_stock, 
    images, 
    NOW()
FROM (
    VALUES 
    ('Tropical Coral Hi-Low Dress', 'tropical-coral-hi-low-dress', 0, 'Hi-Low Dress', 'hi low dress', 'Pink', ARRAY['/assets/safari/safari-1.png']::text[]),
    ('Tropical Coral Open Frill Dress', 'tropical-coral-open-frill-dress', 0, 'Open Frill Dress', 'front open frill dress', 'Pink', ARRAY['/assets/safari/safari-2.png']::text[]),
    ('Athena Long Shirt Dress - Blue', 'athena-long-shirt-dress-blue', 0, 'Long Shirt Dress', 'long dress', 'Blue', ARRAY['/assets/safari/safari-3.png']::text[]),
    ('Athena Gypsy Top - Blue', 'athena-gypsy-top-blue', 0, 'Gypsy Top', 'gypsy dress', 'Blue', ARRAY['/assets/safari/safari-4.png']::text[]),
    ('Athena Box Kaftan - Blue', 'athena-box-kaftan-blue', 0, 'Box Kaftan', 'box kaftan', 'Blue', ARRAY['/assets/safari/safari-5.png']::text[]),
    ('Athena Gypsy Top - Blue Print', 'athena-gypsy-top-blue-print', 0, 'Gypsy Top', 'gypsy top', 'Blue', ARRAY['/assets/safari/safari-6.png']::text[]),
    ('Athena Tank Top & Palazzo Pant - Blue', 'athena-tank-top-palazzo-pant-blue', 0, 'Tank Top + Plazo Pant', 'top and plazo pant', 'Blue', ARRAY['/assets/safari/safari-7.png']::text[]),
    ('Sorento Kimono & Bag - Off White', 'sorento-kimono-bag-off-white', 0, 'Kimono and Bag', 'kimono and bag', 'Off White', ARRAY['/assets/safari/safari-8.png']::text[]),
    ('Brown Leopard Shirt & Palazzo', 'brown-leopard-shirt-palazzo', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Brown', ARRAY['/assets/safari/safari-9.png']::text[]),
    ('Brown Leopard Tank Top & Palazzo', 'brown-leopard-tank-top-palazzo', 0, 'Tank Top + Plazo Pant', 'tank top and plazo pant', 'Brown', ARRAY['/assets/safari/safari-10.png']::text[]),
    ('Aqua Leopard Shirt & Palazzo - Black', 'aqua-leopard-shirt-palazzo-black', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Black', ARRAY['/assets/safari/safari-11.png']::text[]),
    ('Pardus Kimono & Bag - Brown', 'pardus-kimono-bag-brown', 0, 'Kimono and Bag', 'kimono and bag', 'Brown', ARRAY['/assets/safari/safari-12.png']::text[]),
    ('Merika Long Shirt Dress - Blue', 'merika-long-shirt-dress-blue', 0, 'Long Shirt Dress', 'long shirt', 'Blue', ARRAY['/assets/safari/safari-13.png']::text[]),
    ('Merika Long Shirt Dress - Black', 'merika-long-shirt-dress-black', 0, 'Long Shirt Dress', 'long dress', 'Black', ARRAY['/assets/safari/safari-14.png']::text[]),
    ('Tropical Shirt & Palazzo - Pink', 'tropical-shirt-palazzo-pink', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Pink', ARRAY['/assets/safari/safari-15.png']::text[]),
    ('Athena Hi-Low Dress - Blue', 'athena-hi-low-dress-blue', 0, 'Hi-Low Dress', 'hi low dress', 'Blue', ARRAY['/assets/safari/safari-16.png']::text[]),
    ('Athena Shirt & Palazzo - Blue', 'athena-shirt-palazzo-blue', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Blue', ARRAY['/assets/safari/safari-17.png']::text[]),
    ('Sorento Gypsy Top - Off White', 'sorento-gypsy-top-off-white', 0, 'Gypsy Top', 'gypsy dress', 'Off White', ARRAY['/assets/safari/safari-18.png']::text[]),
    ('Sorento Gypsy Top & Palazzo - Off White', 'sorento-gypsy-top-palazzo-off-white', 0, 'Gypsy Top and Plazo Pant', 'gypsy top and plazo pant', 'Off White', ARRAY['/assets/safari/safari-19.png']::text[]),
    ('Sorento Tank Top & Palazzo - Off White', 'sorento-tank-top-palazzo-off-white', 0, 'Tank Top + Plazo Pant', 'tank top and plazo pant', 'Off White', ARRAY['/assets/safari/safari-20.png']::text[]),
    ('Brown Leopard Kimono & Bag', 'brown-leopard-kimono-bag', 0, 'Kimono and Bag', 'kimono and bag', 'Brown', ARRAY['/assets/safari/safari-21.png']::text[]),
    ('Brown Leopard Gypsy Top', 'brown-leopard-gypsy-top', 0, 'Gypsy Top', 'Gypsy top', 'Brown', ARRAY['/assets/safari/safari-22.png']::text[]),
    ('Black Leopard Long Shirt Dress', 'black-leopard-long-shirt-dress', 0, 'Long Shirt Dress', 'long dress', 'Black', ARRAY['/assets/safari/safari-23.png']::text[]),
    ('Black Leopard Shirt & Palazzo', 'black-leopard-shirt-palazzo', 0, 'Shirt and Palazo', 'shirt and plazo pant', 'Black', ARRAY['/assets/safari/safari-24.png']::text[]),
    ('Black Leopard Gypsy Top', 'black-leopard-gypsy-top', 0, 'Gypsy Top', 'Gypsy top', 'Black and white', ARRAY['/assets/safari/safari-25.png']::text[]),
    ('Black Leopard Kimono & Bag - Skin', 'black-leopard-kimono-bag-skin', 0, 'Kimono and Bag', 'kimono and bag', 'Skin', ARRAY['/assets/safari/safari-26.png']::text[]),
    ('Tiger Shirt Tank Top & Palazzo - Skin', 'tiger-shirt-tank-top-palazzo-skin', 0, 'Tank Top + Plazo Pant', 'plazo pant', 'Skin', ARRAY['/assets/safari/safari-27.png']::text[]),
    ('Aqua Leopard Short Dress - Black', 'aqua-leopard-short-dress-black', 0, 'Short Dress', 'short dress', 'Black', ARRAY['/assets/safari/safari-28.png']::text[]),
    ('Aqua Leopard Coral Front - Black', 'aqua-leopard-coral-front-black', 0, 'Coral Front', 'coral front', 'Black', ARRAY['/assets/safari/safari-29.png']::text[]),
    ('Aqua Leopard Hi-Low Dress - Black', 'aqua-leopard-hi-low-dress-black', 0, 'Hi-Low Dress', 'hi low dress', 'Black', ARRAY['/assets/safari/safari-30.png']::text[]),
    ('Aqua Leopard Long Shirt Dress - Black', 'aqua-leopard-long-shirt-dress-black', 0, 'Long Shirt Dress', 'long dress', 'Black', ARRAY['/assets/safari/safari-31.png']::text[]),
    ('Aqua Leopard Long Box Kaftan - Black', 'aqua-leopard-long-box-kaftan-black', 0, 'Long Box Kaftan', 'box kaftan', 'Black', ARRAY['/assets/safari/safari-32.png']::text[]),
    ('Aqua Leopard Kimono & Bag - Black', 'aqua-leopard-kimono-bag-black', 0, 'Kimono and Bag', 'kimono and bag', 'Black', ARRAY['/assets/safari/safari-33.png']::text[]),
    ('Aqua Leopard Tank Top & Palazzo - Black', 'aqua-leopard-tank-top-palazzo-black', 0, 'Tank Top + Plazo Pant', 'tank top and plazo', 'Black', ARRAY['/assets/safari/safari-34.png']::text[]),
    ('Paradus Long Frill Dress - Brown', 'paradus-long-frill-dress-brown', 0, 'Long Frill Dress', 'long frill dress', 'Brown', ARRAY['/assets/safari/safari-35.png']::text[]),
    ('Paradus Short Frill Dress - Brown', 'paradus-short-frill-dress-brown', 0, 'Short Frill Dress', 'short frill dress', 'Brown', ARRAY['/assets/safari/safari-36.png']::text[]),
    ('Paradus Hi-Low Dress - Brown', 'paradus-hi-low-dress-brown', 0, 'Hi-Low Dress', 'High low dress', 'Brown', ARRAY['/assets/safari/safari-37.png']::text[]),
    ('Paradus Tank Top & Palazzo - Brown', 'paradus-tank-top-palazzo-brown', 0, 'Tank Top + Plazo Pant', 'tank top and plazo', 'Brown', ARRAY['/assets/safari/safari-38.png']::text[])
) AS safari_products(name, slug, price, category, style, color, images)
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE display_page = 'safari' AND name = safari_products.name
);

-- Step 5: Insert ALL Paradise Products with 'Active' status
INSERT INTO products (
    id, name, slug, price, category, style, color, display_page, status, in_stock, images, created_at
) 
SELECT 
    gen_random_uuid(), 
    name, 
    slug, 
    price, 
    category, 
    style, 
    color, 
    'paradise' as display_page, 
    'Active' as status,
    true as in_stock, 
    images, 
    NOW()
FROM (
    VALUES 
    ('Paradise Resort Long Kaftan - Green', 'paradise-resort-long-kaftan-green', 0, 'Long Kaftan', 'Long Kaftan', 'Green', ARRAY['/assets/paradise/paradise-1.jpg']::text[]),
    ('Paradise Resort Hi-Low Dress - Green', 'paradise-resort-hi-low-dress-green', 0, 'Hi-Low Dress', 'High-Low Dress', 'Green', ARRAY['/assets/paradise/paradise-2.jpg']::text[]),
    ('Paradise Resort Shirt - Green', 'paradise-resort-shirt-green', 0, 'Shirt', 'Shirt', 'Green', ARRAY['/assets/paradise/paradise-3.jpg']::text[]),
    ('Florence Blue Hi-Low Dress', 'florence-blue-hi-low-dress', 0, 'Hi-Low Dress', 'High-Low Dress', 'Blue', ARRAY['/assets/paradise/paradise-4.jpg']::text[]),
    ('Florence Blue Long Jacket & Wrap Pants', 'florence-blue-long-jacket-wrap-pants', 0, 'Long Jacket + Wrap Pant', 'Long jacket + wrap pants', 'Blue', ARRAY['/assets/paradise/paradise-5.jpg']::text[]),
    ('Florence Blue Long Kaftan', 'florence-blue-long-kaftan', 0, 'Long Kaftan', 'Long Kaftan', 'Blue', ARRAY['/assets/paradise/paradise-6.jpg']::text[]),
    ('Florence Blue Butterfly Top', 'florence-blue-butterfly-top', 0, 'Butterfly Top', 'Butterfly Top', 'Blue', ARRAY['/assets/paradise/paradise-7.jpg']::text[]),
    ('Florence Grey Long Kaftan', 'florence-grey-long-kaftan', 0, 'Long Kaftan', 'Long Kaftan', 'Grey', ARRAY['/assets/paradise/paradise-8.jpg']::text[]),
    ('Florence Grey Razor Dress', 'florence-grey-razor-dress', 0, 'Razor Dress', 'Razor Dress', 'Grey', ARRAY['/assets/paradise/paradise-9.jpg']::text[]),
    ('Florence Grey Tank Top', 'florence-grey-tank-top', 0, 'Tank Top', 'Tank Top', 'Grey', ARRAY['/assets/paradise/paradise-10.jpg']::text[]),
    ('Zahara Grey Hi-Low Dress', 'zahara-grey-hi-low-dress', 0, 'Hi-Low Dress', 'High-Low Dress', 'Grey', ARRAY['/assets/paradise/paradise-11.jpg']::text[]),
    ('Zahara Grey Sleeved Kaftan Dress', 'zahara-grey-sleeved-kaftan-dress', 0, 'Sleeved Kaftan Dress', 'Sleeved Kaftan Dress', 'Grey', ARRAY['/assets/paradise/paradise-12.jpg']::text[]),
    ('Zahara Grey Long Jacket', 'zahara-grey-long-jacket', 0, 'Long Jacket', 'Long Jacket', 'Grey', ARRAY['/assets/paradise/paradise-13.jpg']::text[]),
    ('Zahara Blue Short Jacket', 'zahara-blue-short-jacket', 0, 'Short Jacket', 'Short Jacket', 'Blue', ARRAY['/assets/paradise/paradise-14.jpg']::text[]),
    ('Zahara Blue Tank Top', 'zahara-blue-tank-top', 0, 'Tank Top', 'Tank Top', 'Blue', ARRAY['/assets/paradise/paradise-15.jpg']::text[]),
    ('Zahara Pink Hi-Low Dress', 'zahara-pink-hi-low-dress', 0, 'Hi-Low Dress', 'High-Low Dress', 'Pink', ARRAY['/assets/paradise/paradise-16.jpg']::text[]),
    ('Zahara Pink Long Cape', 'zahara-pink-long-cape', 0, 'Long Cape', 'Long Cape', 'Pink', ARRAY['/assets/paradise/paradise-17.jpg']::text[]),
    ('Zahara Pink Razor Dress', 'zahara-pink-razor-dress', 0, 'Razor Dress', 'Razor Dress', 'Pink', ARRAY['/assets/paradise/paradise-18.jpg']::text[]),
    ('Zahara Pink Gypsy Top', 'zahara-pink-gypsy-top', 0, 'Gypsy Top', 'Gypsy Top', 'Pink', ARRAY['/assets/paradise/paradise-19.jpg']::text[]),
    ('Zahara Pink Palazzo Pant', 'zahara-pink-palazzo-pant', 0, 'Plazo Pant', 'Plazo Pant', 'Pink', ARRAY['/assets/paradise/paradise-20.jpg']::text[]),
    ('Zahara Pink Short Jacket', 'zahara-pink-short-jacket', 0, 'Short Jacket', 'Short Jacket', 'Pink', ARRAY['/assets/paradise/paradise-21.jpg']::text[]),
    ('Garden Delight Long Kaftan - Aqua', 'garden-delight-long-kaftan-aqua', 0, 'Long Kaftan', 'Long Kaftan', 'Aqua', ARRAY['/assets/paradise/paradise-22.jpg']::text[]),
    ('Garden Delight Long Kaftan - Coral', 'garden-delight-long-kaftan-coral', 0, 'Long Kaftan', 'Long Kaftan', 'Coral', ARRAY['/assets/paradise/paradise-23.jpg']::text[]),
    ('Garden Delight Shirt', 'garden-delight-shirt', 0, 'Shirt', 'Shirt', 'Multi', ARRAY['/assets/paradise/paradise-24.jpg']::text[]),
    ('Marigold Aqua Brown Long Shirt Dress', 'marigold-aqua-brown-long-shirt-dress', 0, 'Long Shirt Dress', 'Long Shirt Dress', 'Aqua Brown', ARRAY['/assets/paradise/paradise-25.jpg']::text[]),
    ('Marigold Aqua Brown Short Kaftan', 'marigold-aqua-brown-short-kaftan', 0, 'Short Kaftan', 'Short Kaftan', 'Aqua Brown', ARRAY['/assets/paradise/paradise-26.jpg']::text[]),
    ('Monet Orange Gypsy Top', 'monet-orange-gypsy-top', 0, 'Gypsy Top', 'Gypsy Top', 'Orange', ARRAY['/assets/paradise/paradise-27.jpg']::text[]),
    ('Monet Orange Hi-Low Dress', 'monet-orange-hi-low-dress', 0, 'Hi-Low Dress', 'Hi-Low Dress', 'Orange', ARRAY['/assets/paradise/paradise-28.jpg']::text[]),
    ('Monet Orange Long Box Kaftan', 'monet-orange-long-box-kaftan', 0, 'Long Kaftan', 'Long Kaftan', 'Orange', ARRAY['/assets/paradise/paradise-29.jpg']::text[]),
    ('Monet Orange Shirt', 'monet-orange-shirt', 0, 'Shirt', 'Shirt', 'Orange', ARRAY['/assets/paradise/paradise-30.jpg']::text[]),
    ('Monet Orange Short Jacket', 'monet-orange-short-jacket', 0, 'Short Jacket', 'Short Jacket', 'Orange', ARRAY['/assets/paradise/paradise-31.jpg']::text[]),
    ('Monet Orange Tank Top', 'monet-orange-tank-top', 0, 'Tank Top', 'Tank Top', 'Orange', ARRAY['/assets/paradise/paradise-32.jpg']::text[]),
    ('Monet Orange Tunic Dress', 'monet-orange-tunic-dress', 0, 'Tunic Dress', 'Tunic Dress', 'Orange', ARRAY['/assets/paradise/paradise-33.jpg']::text[]),
    ('Monet Orange Wrap Pant', 'monet-orange-wrap-pant', 0, 'Wrap Pant', 'Wrap Pant', 'Orange', ARRAY['/assets/paradise/paradise-34.jpg']::text[]),
    ('Tiger Brown Short Frill Dress', 'tiger-brown-short-frill-dress', 0, 'Short Frill Dress', 'Short Frill Dress', 'Brown', ARRAY['/assets/paradise/paradise-35.jpg']::text[]),
    ('Tiger Brown Short Kaftan', 'tiger-brown-short-kaftan', 0, 'Short Kaftan', 'Short Kaftan', 'Brown', ARRAY['/assets/paradise/paradise-36.jpg']::text[]),
    ('Zahara Pink Tank Top', 'zahara-pink-tank-top', 0, 'Tank Top', 'Tank Top', 'Pink', ARRAY['/assets/paradise/paradise-37.jpg']::text[]),
    ('Zahara Pink Tank Top - Variant', 'zahara-pink-tank-top-variant', 0, 'Tank Top', 'Tank Top', 'Pink', ARRAY['/assets/paradise/paradise-38.jpg']::text[]),
    ('Zahara Pink Tank Top - Style 2', 'zahara-pink-tank-top-style-2', 0, 'Tank Top', 'Tank Top', 'Pink', ARRAY['/assets/paradise/paradise-39.jpg']::text[]),
    ('Zahara Pink Tank Top - Style 3', 'zahara-pink-tank-top-style-3', 0, 'Tank Top', 'Tank Top', 'Pink', ARRAY['/assets/paradise/paradise-40.jpg']::text[]),
    ('Zahara Pink Tank Top - Style 4', 'zahara-pink-tank-top-style-4', 0, 'Tank Top', 'Tank Top', 'Pink', ARRAY['/assets/paradise/paradise-41.jpg']::text[]),
    ('Zahara Pink Tank Top - Style 5', 'zahara-pink-tank-top-style-5', 0, 'Tank Top', 'Tank Top', 'Pink', ARRAY['/assets/paradise/paradise-42.jpg']::text[]),
    ('Zahara Pink Tank Top - Style 6', 'zahara-pink-tank-top-style-6', 0, 'Tank Top', 'Tank Top', 'Pink', ARRAY['/assets/paradise/paradise-43.jpg']::text[]),
    ('Zahara Pink Tank Top - Style 7', 'zahara-pink-tank-top-style-7', 0, 'Tank Top', 'Tank Top', 'Pink', ARRAY['/assets/paradise/paradise-44.jpg']::text[]),
    ('Zahara Pink Tank Top - Style 8', 'zahara-pink-tank-top-style-8', 0, 'Tank Top', 'Tank Top', 'Pink', ARRAY['/assets/paradise/paradise-45.jpg']::text[]),
    ('Zahara Pink Tank Top - Style 9', 'zahara-pink-tank-top-style-9', 0, 'Tank Top', 'Tank Top', 'Pink', ARRAY['/assets/paradise/paradise-46.jpg']::text[]),
    ('Zahara Pink Tank Top - Style 10', 'zahara-pink-tank-top-style-10', 0, 'Tank Top', 'Tank Top', 'Pink', ARRAY['/assets/paradise/paradise-47.jpg']::text[]),
    ('Garden Delight Long Kaftan - Blue', 'garden-delight-long-kaftan-blue', 0, 'Long Kaftan', 'Long Kaftan', 'Blue', ARRAY['/assets/paradise/paradise-48.jpg']::text[]),
    ('Garden Delight Long Kaftan - Yellow', 'garden-delight-long-kaftan-yellow', 0, 'Long Kaftan', 'Long Kaftan', 'Yellow', ARRAY['/assets/paradise/paradise-49.jpg']::text[]),
    ('Garden Delight Long Kaftan - Pink', 'garden-delight-long-kaftan-pink', 0, 'Long Kaftan', 'Long Kaftan', 'Pink', ARRAY['/assets/paradise/paradise-50.jpg']::text[]),
    ('Garden Delight Long Kaftan - Green', 'garden-delight-long-kaftan-green', 0, 'Long Kaftan', 'Long Kaftan', 'Green', ARRAY['/assets/paradise/paradise-51.jpg']::text[]),
    ('Garden Delight Long Kaftan - Purple', 'garden-delight-long-kaftan-purple', 0, 'Long Kaftan', 'Long Kaftan', 'Purple', ARRAY['/assets/paradise/paradise-52.jpg']::text[]),
    ('Garden Delight Long Kaftan - Orange', 'garden-delight-long-kaftan-orange', 0, 'Long Kaftan', 'Long Kaftan', 'Orange', ARRAY['/assets/paradise/paradise-53.jpg']::text[]),
    ('Garden Delight Long Kaftan - Red', 'garden-delight-long-kaftan-red', 0, 'Long Kaftan', 'Long Kaftan', 'Red', ARRAY['/assets/paradise/paradise-54.jpg']::text[]),
    ('Garden Delight Long Kaftan - Multi', 'garden-delight-long-kaftan-multi', 0, 'Long Kaftan', 'Long Kaftan', 'Multi', ARRAY['/assets/paradise/paradise-55.jpg']::text[]),
    ('Marigold Aqua Brown Long Kaftan', 'marigold-aqua-brown-long-kaftan', 0, 'Long Kaftan', 'Long Kaftan', 'Aqua Brown', ARRAY['/assets/paradise/paradise-56.jpg']::text[]),
    ('Marigold Aqua Brown Short Dress', 'marigold-aqua-brown-short-dress', 0, 'Short Dress', 'Short Dress', 'Aqua Brown', ARRAY['/assets/paradise/paradise-57.jpg']::text[]),
    ('Marigold Aqua Brown Shirt', 'marigold-aqua-brown-shirt', 0, 'Shirt', 'Shirt', 'Aqua Brown', ARRAY['/assets/paradise/paradise-58.jpg']::text[]),
    ('Marigold Aqua Brown Tank Top', 'marigold-aqua-brown-tank-top', 0, 'Tank Top', 'Tank Top', 'Aqua Brown', ARRAY['/assets/paradise/paradise-59.jpg']::text[]),
    ('Monet Orange Long Dress', 'monet-orange-long-dress', 0, 'Long Dress', 'Long Dress', 'Orange', ARRAY['/assets/paradise/paradise-60.jpg']::text[]),
    ('Monet Orange Short Dress', 'monet-orange-short-dress', 0, 'Short Dress', 'Short Dress', 'Orange', ARRAY['/assets/paradise/paradise-61.jpg']::text[]),
    ('Monet Orange Skirt', 'monet-orange-skirt', 0, 'Skirt', 'Skirt', 'Orange', ARRAY['/assets/paradise/paradise-62.jpg']::text[]),
    ('Monet Orange Wrap Pant', 'monet-orange-wrap-pant-2', 0, 'Wrap Pant', 'Wrap Pant', 'Orange', ARRAY['/assets/paradise/paradise-63.jpg']::text[])
) AS paradise_products(name, slug, price, category, style, color, images)
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE display_page = 'paradise' AND name = paradise_products.name
);

-- Step 6: Verification - Check results
SELECT 'SAFARI PRODUCTS' as collection, COUNT(*) as product_count
FROM products 
WHERE display_page = 'safari';

SELECT 'PARADISE PRODUCTS' as collection, COUNT(*) as product_count
FROM products 
WHERE display_page = 'paradise';

-- Show sample products with their status
SELECT 'SAFARI SAMPLE' as collection, name, category, display_page, status
FROM products 
WHERE display_page = 'safari' 
LIMIT 3;

SELECT 'PARADISE SAMPLE' as collection, name, category, display_page, status
FROM products 
WHERE display_page = 'paradise' 
LIMIT 3;
