-- Fix image paths for live deployment
-- This script updates image paths to match your live server structure

-- Step 1: Update Safari product image paths
UPDATE products 
SET images = ARRAY_REPLACE(
    images, 
    '/assets/safari/safari-1.png',
    '/assets/safari/safari-1.png'
)
WHERE display_page = 'safari' AND '/assets/safari/safari-1.png' = ANY(images);

-- Step 2: Update all Safari image paths to ensure they start with /assets/
UPDATE products 
SET images = ARRAY(
    SELECT CASE 
        WHEN image_path LIKE '/assets/%' THEN image_path
        WHEN image_path LIKE 'assets/%' THEN '/' || image_path
        ELSE '/assets/safari/' || image_path
    END
    FROM unnest(images) as image_path
)
WHERE display_page = 'safari';

-- Step 3: Update all Paradise image paths to ensure they start with /assets/
UPDATE products 
SET images = ARRAY(
    SELECT CASE 
        WHEN image_path LIKE '/assets/%' THEN image_path
        WHEN image_path LIKE 'assets/%' THEN '/' || image_path
        ELSE '/assets/paradise/' || image_path
    END
    FROM unnest(images) as image_path
)
WHERE display_page = 'paradise';

-- Step 4: Verification - Check updated image paths
SELECT 'SAFARI IMAGE PATHS' as collection, name, unnest(images) as image_path
FROM products 
WHERE display_page = 'safari'
LIMIT 3;

SELECT 'PARADISE IMAGE PATHS' as collection, name, unnest(images) as image_path
FROM products 
WHERE display_page = 'paradise'
LIMIT 3;

-- Step 5: Alternative - Try different common image path patterns
-- If the above doesn't work, uncomment and try these alternatives:

-- Alternative 1: Try without leading slash
/*
UPDATE products 
SET images = ARRAY(
    SELECT REPLACE(image_path, '/assets/', 'assets/')
    FROM unnest(images) as image_path
)
WHERE display_page IN ('safari', 'paradise');
*/

-- Alternative 2: Try with full URL
/*
UPDATE products 
SET images = ARRAY(
    SELECT 'https://fashionspectrum.com.au' || image_path
    FROM unnest(images) as image_path
)
WHERE display_page IN ('safari', 'paradise');
*/

-- Alternative 3: Try with different folder structure
/*
UPDATE products 
SET images = ARRAY(
    SELECT REPLACE(image_path, '/assets/', '/public/assets/')
    FROM unnest(images) as image_path
)
WHERE display_page IN ('safari', 'paradise');
*/
