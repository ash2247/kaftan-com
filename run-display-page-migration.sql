-- Run this migration to update the database for multi-select display pages
-- This will convert the single display_page column to a display_pages array

-- First, let's check the current state
SELECT '=== BEFORE MIGRATION ===' as info;
SELECT 
    COUNT(*) as total_products,
    COUNT(CASE WHEN display_page = 'all' THEN 1 END) as all_pages_count,
    COUNT(CASE WHEN display_page != 'all' AND display_page IS NOT NULL THEN 1 END) as specific_pages_count
FROM products;

-- Show sample current data
SELECT name, display_page FROM products LIMIT 3;

-- Run the migration
\i migrate-display-page-to-array.sql

-- Check results after migration
SELECT '=== AFTER MIGRATION ===' as info;
SELECT 
    COUNT(*) as total_products,
    COUNT(CASE WHEN display_pages = '{all}' THEN 1 END) as all_pages_count,
    COUNT(CASE WHEN display_pages != '{all}' THEN 1 END) as specific_pages_count
FROM products;

-- Show sample new data
SELECT name, display_pages FROM products LIMIT 3;
