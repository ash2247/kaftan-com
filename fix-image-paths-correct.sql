-- Fix image paths to match actual folder structure
-- Update paths from /assets/safari/ to /src/assets/safari/

-- Step 1: Update Safari image paths to use /src/assets/safari/
UPDATE products 
SET images = ARRAY(
    SELECT REPLACE(image_path, '/assets/safari/', '/src/assets/safari/')
    FROM unnest(images) as image_path
)
WHERE display_page = 'safari' AND '/assets/safari/' = ANY(images);

-- Step 2: Update Paradise image paths to use /src/assets/paradise/
UPDATE products 
SET images = ARRAY(
    SELECT REPLACE(image_path, '/assets/paradise/', '/src/assets/paradise/')
    FROM unnest(images) as image_path
)
WHERE display_page = 'paradise' AND '/assets/paradise/' = ANY(images);

-- Step 3: Verification - Check updated image paths
SELECT 'SAFARI IMAGE PATHS' as collection, name, unnest(images) as image_path
FROM products 
WHERE display_page = 'safari'
LIMIT 3;

SELECT 'PARADISE IMAGE PATHS' as collection, name, unnest(images) as image_path
FROM products 
WHERE display_page = 'paradise'
LIMIT 3;

-- Step 4: Alternative - Try just /assets/ if /src/assets/ doesn't work
/*
UPDATE products 
SET images = ARRAY(
    SELECT REPLACE(image_path, '/src/assets/', '/assets/')
    FROM unnest(images) as image_path
)
WHERE display_page IN ('safari', 'paradise');
*/
