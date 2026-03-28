-- Deploy Safari and Paradise Products with Multiple Status Options
-- Try different status values until one works

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

-- Step 4: Try inserting with different status values
-- Try 'draft' first (common in e-commerce)
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
    'draft' as status,
    true as in_stock, 
    images, 
    NOW()
FROM (
    VALUES 
    ('Tropical Coral Hi-Low Dress', 'tropical-coral-hi-low-dress', 0, 'Hi-Low Dress', 'hi low dress', 'Pink', ARRAY['/assets/safari/safari-1.png']::text[]),
    ('Tropical Coral Open Frill Dress', 'tropical-coral-open-frill-dress', 0, 'Open Frill Dress', 'front open frill dress', 'Pink', ARRAY['/assets/safari/safari-2.png']::text[]),
    ('Athena Long Shirt Dress - Blue', 'athena-long-shirt-dress-blue', 0, 'Long Shirt Dress', 'long dress', 'Blue', ARRAY['/assets/safari/safari-3.png']::text[]),
    ('Athena Gypsy Top - Blue', 'athena-gypsy-top-blue', 0, 'Gypsy Top', 'gypsy dress', 'Blue', ARRAY['/assets/safari/safari-4.png']::text[]),
    ('Athena Box Kaftan - Blue', 'athena-box-kaftan-blue', 0, 'Box Kaftan', 'box kaftan', 'Blue', ARRAY['/assets/safari/safari-5.png']::text[])
) AS safari_products(name, slug, price, category, style, color, images)
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE display_page = 'safari' AND name = safari_products.name
);

-- Step 5: If draft fails, try with 'published'
-- This will only run if the previous insert failed
DO $$
BEGIN
    -- Check if any Safari products were inserted
    IF (SELECT COUNT(*) FROM products WHERE display_page = 'safari') = 0 THEN
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
            'published' as status,
            true as in_stock, 
            images, 
            NOW()
        FROM (
            VALUES 
            ('Tropical Coral Hi-Low Dress', 'tropical-coral-hi-low-dress', 0, 'Hi-Low Dress', 'hi low dress', 'Pink', ARRAY['/assets/safari/safari-1.png']::text[]),
            ('Tropical Coral Open Frill Dress', 'tropical-coral-open-frill-dress', 0, 'Open Frill Dress', 'front open frill dress', 'Pink', ARRAY['/assets/safari/safari-2.png']::text[]),
            ('Athena Long Shirt Dress - Blue', 'athena-long-shirt-dress-blue', 0, 'Long Shirt Dress', 'long dress', 'Blue', ARRAY['/assets/safari/safari-3.png']::text[]),
            ('Athena Gypsy Top - Blue', 'athena-gypsy-top-blue', 0, 'Gypsy Top', 'gypsy dress', 'Blue', ARRAY['/assets/safari/safari-4.png']::text[]),
            ('Athena Box Kaftan - Blue', 'athena-box-kaftan-blue', 0, 'Box Kaftan', 'box kaftan', 'Blue', ARRAY['/assets/safari/safari-5.png']::text[])
        ) AS safari_products(name, slug, price, category, style, color, images)
        WHERE NOT EXISTS (
            SELECT 1 FROM products WHERE display_page = 'safari' AND name = safari_products.name
        );
    END IF;
END $$;

-- Step 6: Insert Paradise products with the same status that worked for Safari
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
    p.status as status,
    true as in_stock, 
    images, 
    NOW()
FROM (
    VALUES 
    ('Paradise Resort Long Kaftan - Green', 'paradise-resort-long-kaftan-green', 0, 'Long Kaftan', 'Long Kaftan', 'Green', ARRAY['/assets/paradise/paradise-1.jpg']::text[]),
    ('Paradise Resort Hi-Low Dress - Green', 'paradise-resort-hi-low-dress-green', 0, 'Hi-Low Dress', 'High-Low Dress', 'Green', ARRAY['/assets/paradise/paradise-2.jpg']::text[]),
    ('Paradise Resort Shirt - Green', 'paradise-resort-shirt-green', 0, 'Shirt', 'Shirt', 'Green', ARRAY['/assets/paradise/paradise-3.jpg']::text[]),
    ('Florence Blue Hi-Low Dress', 'florence-blue-hi-low-dress', 0, 'Hi-Low Dress', 'High-Low Dress', 'Blue', ARRAY['/assets/paradise/paradise-4.jpg']::text[]),
    ('Florence Blue Long Jacket & Wrap Pants', 'florence-blue-long-jacket-wrap-pants', 0, 'Long Jacket + Wrap Pant', 'Long jacket + wrap pants', 'Blue', ARRAY['assets/paradise/paradise-5.jpg']::text[])
) AS paradise_products(name, slug, price, category, style, color, images)
CROSS JOIN (SELECT status FROM products WHERE display_page = 'safari' LIMIT 1) p
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE display_page = 'paradise' AND name = paradise_products.name
);

-- Step 7: Verification
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
