-- Add sort_order column to products table for collection-specific sorting
-- Run this in Supabase SQL Editor

-- Step 1: Add sort_order column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'sort_order'
    ) THEN
        ALTER TABLE products ADD COLUMN sort_order INTEGER DEFAULT 999;
    END IF;
END $$;

-- Step 2: Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'sort_order';

-- Step 3: Set up initial sort orders using temporary tables and joins
-- Create a temporary table with row numbers for each collection
CREATE TEMPORARY TABLE collection_sort_order AS
SELECT 
    id,
    ROW_NUMBER() OVER (
        PARTITION BY collection 
        ORDER BY 
            CASE 
                WHEN featured = true THEN 1
                WHEN original_price IS NOT NULL AND original_price > 0 THEN 2
                ELSE 3
            END,
            name ASC
    ) as row_num
FROM products 
WHERE collection IS NOT NULL;

-- Update products with their sort order
UPDATE products p
SET sort_order = c.row_num
FROM collection_sort_order c
WHERE p.id = c.id;

-- Drop temporary table
DROP TABLE collection_sort_order;

-- Step 4: Show the current sort orders by collection
SELECT 
    collection,
    sort_order,
    name,
    featured,
    original_price,
    price
FROM products 
WHERE collection IS NOT NULL
ORDER BY collection, sort_order;

-- Step 5: Manual adjustment examples (you can customize these)
-- To make a specific product appear first in its collection:
UPDATE products 
SET sort_order = 1 
WHERE collection = 'Milano' AND name ILIKE '%[specific product name]%';

-- To move a product to the end of its collection:
UPDATE products 
SET sort_order = (
    SELECT COALESCE(MAX(sort_order), 0) + 1 
    FROM products 
    WHERE collection = 'Milano'
)
WHERE collection = 'Milano' AND name ILIKE '%[specific product name]%';

-- Step 6: Final verification
SELECT 
    collection,
    COUNT(*) as total_products,
    MIN(sort_order) as first_position,
    MAX(sort_order) as last_position,
    STRING_AGG(name, ', ' ORDER BY sort_order) as product_order
FROM products 
WHERE collection IS NOT NULL
GROUP BY collection
ORDER BY collection;
