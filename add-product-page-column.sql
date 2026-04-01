-- Migration: Add is_product_page column to pages table
-- This allows distinguishing between product pages and simple pages

-- Step 1: Add the new column
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS is_product_page BOOLEAN DEFAULT FALSE;

-- Step 2: Add comment for documentation
COMMENT ON COLUMN pages.is_product_page IS 'Indicates if this is a product page (optimized for product display)';

-- Step 3: Update existing pages to be simple pages by default
UPDATE pages 
SET is_product_page = FALSE 
WHERE is_product_page IS NULL;

-- Step 4: Verify the migration
SELECT 
    COUNT(*) as total_pages,
    COUNT(CASE WHEN is_product_page = TRUE THEN 1 END) as product_pages,
    COUNT(CASE WHEN is_product_page = FALSE THEN 1 END) as simple_pages
FROM pages;

-- Step 5: Show sample results
SELECT 
    name,
    path,
    is_product_page,
    status
FROM pages 
ORDER BY created_at DESC
LIMIT 5;

-- Success message
SELECT 'Migration completed: is_product_page column added to pages table' as status;
