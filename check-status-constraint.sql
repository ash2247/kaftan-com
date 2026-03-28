-- Check the status column constraints and allowed values
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'status';

-- Check existing products to see what status values are actually used
SELECT DISTINCT status, COUNT(*) as count
FROM products 
GROUP BY status
ORDER BY count DESC;

-- Check if there are any Safari or Paradise products in the database
SELECT 
    display_page, 
    status, 
    COUNT(*) as product_count
FROM products 
WHERE display_page IN ('safari', 'paradise')
GROUP BY display_page, status
ORDER BY display_page, status;

-- Try to find the check constraint definition (fixed for different PostgreSQL versions)
SELECT conname, convalidated, condeferrable, condeferred
FROM pg_constraint 
WHERE conrelid = 'products'::regclass AND contype = 'c';

-- Check total products in database
SELECT COUNT(*) as total_products FROM products;
