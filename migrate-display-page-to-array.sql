-- Migration: Convert display_page from single TEXT to TEXT array for multi-select support
-- This allows products to appear on multiple pages simultaneously

-- Step 1: Add the new display_pages column as TEXT array
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS display_pages TEXT[] DEFAULT '{all}';

-- Step 2: Migrate existing single display_page values to the new array format
UPDATE products 
SET display_pages = CASE 
    WHEN display_page IS NULL OR display_page = '' THEN '{all}'
    WHEN display_page = 'all' THEN '{all}'
    ELSE ARRAY[display_page]
END
WHERE display_pages IS NULL OR display_pages = '{all}';

-- Step 3: Verify the migration
SELECT 
    COUNT(*) as total_products,
    COUNT(CASE WHEN display_pages = '{all}' THEN 1 END) as all_pages,
    COUNT(CASE WHEN display_pages != '{all}' THEN 1 END) as specific_pages,
    COUNT(display_page) as old_column_still_populated
FROM products;

-- Step 4: Show sample of the migration results
SELECT 
    name, 
    display_page as old_display_page,
    display_pages as new_display_pages
FROM products 
LIMIT 5;

-- Step 5: After verification, you can optionally drop the old column
-- Uncomment the following lines only after verifying migration is successful:
-- ALTER TABLE products DROP COLUMN IF EXISTS display_page;

-- Step 6: Create index for better query performance on display_pages
CREATE INDEX IF NOT EXISTS idx_products_display_pages ON products USING GIN(display_pages);

-- Success message
SELECT 'Migration completed: display_page converted to display_pages array for multi-select support' as status;
