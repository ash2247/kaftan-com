-- Add display_page column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS display_page TEXT DEFAULT 'all';

-- Update existing products to have 'all' as default display page
UPDATE products 
SET display_page = 'all' 
WHERE display_page IS NULL;

-- Show verification
SELECT 
    COUNT(*) as total_products,
    COUNT(CASE WHEN display_page = 'all' THEN 1 END) as all_pages,
    COUNT(CASE WHEN display_page != 'all' THEN 1 END) as specific_pages
FROM products;
