-- Check the products table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Check if collection column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'collection';

-- Sample data to see current structure
SELECT id, name, category, collection, in_stock 
FROM products 
LIMIT 5;

-- Check what collections exist if collection column has data
SELECT DISTINCT collection, COUNT(*) as product_count
FROM products 
WHERE collection IS NOT NULL AND collection != ''
GROUP BY collection
ORDER BY product_count DESC;

-- Check what categories exist
SELECT DISTINCT category, COUNT(*) as product_count
FROM products 
WHERE category IS NOT NULL AND category != ''
GROUP BY category
ORDER BY product_count DESC;
