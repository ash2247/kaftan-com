-- Simple Collections Setup - No Conflicts
-- Run this in Supabase SQL Editor

-- Step 1: Just insert collections that don't exist
INSERT INTO collections (name, slug, description, status) 
SELECT 
    unnest(ARRAY['Apella', 'Clinto', 'Frangipani', 'Leopard', 'Madrid', 'Milano', 'Peacock', 'Picasso', 'Sicily']),
    unnest(ARRAY['apella', 'clinto', 'frangipani', 'leopard', 'madrid', 'milano', 'peacock', 'picasso', 'sicily']),
    unnest(ARRAY[
        'Elegant apella-style kaftans and resort wear',
        'Modern clinto collection with contemporary designs',
        'Frangipani inspired floral and nature collection',
        'Bold leopard print patterns and animal designs',
        'Madrid-inspired European fashion collection',
        'Milano fashion week inspired luxury collection',
        'Peacock feather inspired vibrant designs',
        'Artistic picasso-inspired abstract patterns',
        'Sicilian summer collection with Mediterranean vibes'
    ]),
    'published'
ON CONFLICT (slug) DO NOTHING;

-- Step 2: Check what we have now
SELECT 
    name, 
    slug, 
    status,
    created_at
FROM collections 
WHERE name IN ('Apella', 'Clinto', 'Frangipani', 'Leopard', 'Madrid', 'Milano', 'Peacock', 'Picasso', 'Sicily')
ORDER BY name;

-- Step 3: Add collection column to products if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'collection'
    ) THEN
        ALTER TABLE products ADD COLUMN collection TEXT;
    END IF;
END $$;

-- Step 4: Show products table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Step 5: Assign collections to products based on patterns
UPDATE products 
SET collection = 'Apella' 
WHERE name ILIKE '%Apella%' OR category ILIKE '%Apella%';

UPDATE products 
SET collection = 'Clinto' 
WHERE name ILIKE '%Clinto%' OR category ILIKE '%Clinto%';

UPDATE products 
SET collection = 'Frangipani' 
WHERE name ILIKE '%Frangipani%' OR category ILIKE '%Frangipani%';

UPDATE products 
SET collection = 'Leopard' 
WHERE name ILIKE '%Leopard%' OR category ILIKE '%Leopard%';

UPDATE products 
SET collection = 'Madrid' 
WHERE name ILIKE '%Madrid%' OR category ILIKE '%Madrid%';

UPDATE products 
SET collection = 'Milano' 
WHERE name ILIKE '%Milano%' OR category ILIKE '%Milano%';

UPDATE products 
SET collection = 'Peacock' 
WHERE name ILIKE '%Peacock%' OR category ILIKE '%Peacock%';

UPDATE products 
SET collection = 'Picasso' 
WHERE name ILIKE '%Picasso%' OR category ILIKE '%Picasso%';

UPDATE products 
SET collection = 'Sicily' 
WHERE name ILIKE '%Sicily%' OR category ILIKE '%Sicily%';

-- Step 6: Verify assignments
SELECT 
    collection,
    COUNT(*) as product_count,
    STRING_AGG(DISTINCT category, ', ') as original_categories
FROM products 
WHERE collection IS NOT NULL 
GROUP BY collection 
ORDER BY product_count DESC;
