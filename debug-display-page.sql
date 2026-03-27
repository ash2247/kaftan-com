-- Debug script to check if products are saved with display_page correctly
-- Run this in Supabase SQL Editor to verify your product data

-- 1. Check if display_page column exists and has data
SELECT 
    id, 
    name, 
    display_page, 
    status, 
    in_stock,
    created_at
FROM products 
ORDER BY created_at DESC 
LIMIT 10;

-- 2. Check products specifically for each page type
-- Clearance products
SELECT 'CLEARANCE' as page_type, COUNT(*) as count
FROM products 
WHERE display_page IN ('clearance', 'all')
AND in_stock = true;

-- Safari products  
SELECT 'SAFARI' as page_type, COUNT(*) as count
FROM products 
WHERE display_page IN ('safari', 'all')
AND in_stock = true;

-- Paradise products
SELECT 'PARADISE' as page_type, COUNT(*) as count
FROM products 
WHERE display_page IN ('paradise', 'all')
AND in_stock = true;

-- 3. Check your most recent product specifically
-- Replace 'YOUR PRODUCT NAME' with the actual name of the product you created
SELECT 
    id, 
    name, 
    display_page, 
    status,
    in_stock,
    price,
    category,
    created_at
FROM products 
WHERE name LIKE '%YOUR PRODUCT NAME%' 
OR display_page != 'all'
ORDER BY created_at DESC;
