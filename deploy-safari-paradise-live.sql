-- Deploy Safari and Paradise Products to Live Database
-- Run this script in your LIVE Supabase SQL Editor

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

-- Step 4: Insert Safari Products (if they don't already exist)
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
    'active' as status, 
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
    ('Brown Leopard Tank Top & Palazzo', 'brown-leopard-tank-top-palazzo', 0, 'Tank Top + Plazo Pant', 'tank top and plazo pant', 'Brown', ARRAY['/assets/safari/safari-10.png']::text[])
) AS safari_products(name, slug, price, category, style, color, images)
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE display_page = 'safari' AND name = safari_products.name
);

-- Step 5: Insert Paradise Products (if they don't already exist)
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
    'active' as status, 
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
    ('Florence Grey Tank Top', 'florence-grey-tank-top', 0, 'Tank Top', 'Tank Top', 'Grey', ARRAY['/assets/paradise/paradise-10.jpg']::text[])
) AS paradise_products(name, slug, price, category, style, color, images)
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE display_page = 'paradise' AND name = paradise_products.name
);

-- Step 6: Verification - Check results
SELECT 'SAFARI PRODUCTS' as collection, COUNT(*) as product_count
FROM products 
WHERE display_page = 'safari' AND status = 'active';

SELECT 'PARADISE PRODUCTS' as collection, COUNT(*) as product_count
FROM products 
WHERE display_page = 'paradise' AND status = 'active';

-- Show sample products
SELECT 'SAFARI SAMPLE' as collection, name, category, display_page, status
FROM products 
WHERE display_page = 'safari' 
LIMIT 3;

SELECT 'PARADISE SAMPLE' as collection, name, category, display_page, status
FROM products 
WHERE display_page = 'paradise' 
LIMIT 3;
