-- Check the actual database schema for products table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'products'
ORDER BY ordinal_position;

-- Show sample product data to see actual field names
SELECT * FROM products LIMIT 3;
