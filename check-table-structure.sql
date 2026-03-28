-- Check the actual structure of the products table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Check a sample row to understand the current data structure
SELECT * FROM products LIMIT 1;
