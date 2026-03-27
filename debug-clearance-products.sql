-- Debug script to check why Clearance products aren't showing
-- Run this in your Supabase SQL Editor

-- 1. Check if display_page column exists and has data
SELECT 
    'COLUMN_CHECK' as check_type,
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'display_page';

-- 2. Check your most recent products with display_page
SELECT 
    id, 
    name, 
    display_page, 
    status,
    in_stock,
    price,
    original_price,
    created_at
FROM products 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Specifically check Clearance products
SELECT 
    'CLEARANCE_PRODUCTS' as check_type,
    COUNT(*) as total_clearance_products,
    COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_products,
    COUNT(CASE WHEN in_stock = true THEN 1 END) as in_stock_products
FROM products 
WHERE display_page IN ('clearance', 'all');

-- 4. Check what the Clearance page query would return
SELECT 
    id, 
    name, 
    display_page, 
    status,
    in_stock,
    original_price,
    price
FROM products 
WHERE in_stock = true
  AND original_price IS NOT NULL
  AND original_price > 0
  AND display_page IN ('clearance', 'all')
ORDER BY created_at DESC;

-- 5. Check if there are any products with original_price (required for clearance)
SELECT 
    'ORIGINAL_PRICE_CHECK' as check_type,
    COUNT(*) as total_products,
    COUNT(CASE WHEN original_price IS NOT NULL THEN 1 END) as with_original_price,
    COUNT(CASE WHEN original_price > 0 THEN 1 END) with_positive_original_price
FROM products;
