-- Sync Categories with Collections
-- This will update product categories to match their assigned collections
-- Run this in Supabase SQL Editor

-- Step 1: Update all products to have category = collection
UPDATE products 
SET category = collection 
WHERE collection IS NOT NULL AND collection != '';

-- Step 2: Show the results
SELECT 
    collection,
    category,
    COUNT(*) as product_count,
    STRING_AGG(name, ', ') as sample_products
FROM products 
WHERE collection IS NOT NULL 
GROUP BY collection, category
ORDER BY product_count DESC;

-- Step 3: Show products without collection/category
SELECT 
    id,
    name,
    category,
    collection
FROM products 
WHERE collection IS NULL OR collection = ''
LIMIT 10;

-- Step 4: Assign default collection/category to any remaining products
UPDATE products 
SET category = 'Apella', collection = 'Apella'
WHERE (collection IS NULL OR collection = '') AND (category IS NULL OR category = '');

-- Final verification
SELECT 
    category,
    COUNT(*) as product_count
FROM products 
WHERE category IS NOT NULL AND category != ''
GROUP BY category
ORDER BY product_count DESC;
