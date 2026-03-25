-- Setup Categories and Collections for Kaftan Fashion Store
-- Run this in Supabase SQL Editor

-- Step 1: Create collections table if it doesn't exist
-- Note: If table already exists with different structure, you may need to drop and recreate
CREATE TABLE IF NOT EXISTS collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Insert the categories as collections
-- First clear existing data to avoid duplicates
DELETE FROM collections WHERE name IN (
    'Apella', 'Clinto', 'Frangipani', 'Leopard', 'Madrid', 
    'Milano', 'Peacock', 'Picasso', 'Sicily'
);

INSERT INTO collections (name, slug, description) VALUES
    ('Apella', 'apella', 'Elegant apella-style kaftans and resort wear'),
    ('Clinto', 'clinto', 'Modern clinto collection with contemporary designs'),
    ('Frangipani', 'frangipani', 'Frangipani inspired floral and nature collection'),
    ('Leopard', 'leopard', 'Bold leopard print patterns and animal designs'),
    ('Madrid', 'madrid', 'Madrid-inspired European fashion collection'),
    ('Milano', 'milano', 'Milano fashion week inspired luxury collection'),
    ('Peacock', 'peacock', 'Peacock feather inspired vibrant designs'),
    ('Picasso', 'picasso', 'Artistic picasso-inspired abstract patterns'),
    ('Sicily', 'sicily', 'Sicilian summer collection with Mediterranean vibes');

-- Step 3: Check current products structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Step 4: Add collection column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'collection'
    ) THEN
        ALTER TABLE products ADD COLUMN collection TEXT;
    END IF;
END $$;

-- Step 5: Assign collections to products based on current categories
-- This maps your existing product categories to the new collection names

-- Assign Apella collection to products with 'Apella' in name or category
UPDATE products 
SET collection = 'Apella' 
WHERE name ILIKE '%Apella%' OR category ILIKE '%Apella%';

-- Assign Clinto collection to products with 'Clinto' in name or category  
UPDATE products 
SET collection = 'Clinto' 
WHERE name ILIKE '%Clinto%' OR category ILIKE '%Clinto%';

-- Assign Frangipani collection to products with 'Frangipani' in name or category
UPDATE products 
SET collection = 'Frangipani' 
WHERE name ILIKE '%Frangipani%' OR category ILIKE '%Frangipani%';

-- Assign Leopard collection to products with 'Leopard' in name or category
UPDATE products 
SET collection = 'Leopard' 
WHERE name ILIKE '%Leopard%' OR category ILIKE '%Leopard%';

-- Assign Madrid collection to products with 'Madrid' in name or category
UPDATE products 
SET collection = 'Madrid' 
WHERE name ILIKE '%Madrid%' OR category ILIKE '%Madrid%';

-- Assign Milano collection to products with 'Milano' in name or category
UPDATE products 
SET collection = 'Milano' 
WHERE name ILIKE '%Milano%' OR category ILIKE '%Milano%';

-- Assign Peacock collection to products with 'Peacock' in name or category
UPDATE products 
SET collection = 'Peacock' 
WHERE name ILIKE '%Peacock%' OR category ILIKE '%Peacock%';

-- Assign Picasso collection to products with 'Picasso' in name or category
UPDATE products 
SET collection = 'Picasso' 
WHERE name ILIKE '%Picasso%' OR category ILIKE '%Picasso%';

-- Assign Sicily collection to products with 'Sicily' in name or category
UPDATE products 
SET collection = 'Sicily' 
WHERE name ILIKE '%Sicily%' OR category ILIKE '%Sicily%';

-- Step 6: Verify the assignments
SELECT 
    collection,
    COUNT(*) as product_count,
    STRING_AGG(DISTINCT category, ', ') as original_categories
FROM products 
WHERE collection IS NOT NULL 
GROUP BY collection 
ORDER BY product_count DESC;

-- Step 7: Show products without collection assignment
SELECT 
    id,
    name,
    category,
    collection
FROM products 
WHERE collection IS NULL OR collection = ''
LIMIT 10;

-- Step 8: Manual assignment for any remaining products (you can customize this)
-- For products that didn't match the above patterns, you can assign them manually

-- Example: Assign remaining products based on their current categories
UPDATE products 
SET collection = CASE 
    WHEN category ILIKE '%Gypsy%' THEN 'Clinto'
    WHEN category ILIKE '%Kimono%' THEN 'Apella'  
    WHEN category ILIKE '%Long Dress%' THEN 'Milano'
    WHEN category ILIKE '%Short Dress%' THEN 'Madrid'
    WHEN category ILIKE '%Animal%' OR category ILIKE '%Print%' THEN 'Leopard'
    WHEN category ILIKE '%Floral%' OR category ILIKE '%Flower%' THEN 'Frangipani'
    WHEN category ILIKE '%Art%' OR category ILIKE '%Abstract%' THEN 'Picasso'
    WHEN category ILIKE '%Summer%' OR category ILIKE '%Beach%' THEN 'Sicily'
    WHEN category ILIKE '%Luxury%' OR category ILIKE '%Elegant%' THEN 'Milano'
    ELSE 'Apella' -- Default fallback
END
WHERE collection IS NULL OR collection = '';

-- Final verification
SELECT 
    c.name as collection_name,
    COUNT(p.id) as product_count,
    STRING_AGG(p.name, ', ') as sample_products
FROM collections c
LEFT JOIN products p ON p.collection = c.name
GROUP BY c.id, c.name
ORDER BY product_count DESC NULLS LAST;
