-- Debug script to check product price data
-- Run this in Supabase SQL Editor

-- Check recent products with their price data
SELECT 
    id, 
    name, 
    price,
    original_price,
    display_page,
    status,
    in_stock,
    created_at
FROM products 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if any products have null/zero prices
SELECT 
    'PRICE_ISSUES' as check_type,
    COUNT(*) as total_products,
    COUNT(CASE WHEN price IS NULL THEN 1 END) as null_price,
    COUNT(CASE WHEN price = 0 THEN 1 END) as zero_price,
    COUNT(CASE WHEN price > 0 THEN 1 END) as valid_price
FROM products;

-- Check specific product by name (replace with actual product name)
SELECT 
    id, 
    name, 
    price,
    original_price,
    display_page,
    status,
    in_stock
FROM products 
WHERE name LIKE '%Pink Radiance%' 
   OR name LIKE '%Maxi Dress%'
ORDER BY created_at DESC;
