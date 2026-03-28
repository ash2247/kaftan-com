-- Fix image paths to match the actual dist/assets/ folder structure
-- Update paths to use /assets/ (which points to dist/assets/ in production)

-- Step 1: Update Safari image paths to use /assets/
UPDATE products 
SET images = ARRAY(
    SELECT REPLACE(image_path, '/src/assets/safari/', '/assets/')
    FROM unnest(images) as image_path
)
WHERE display_page = 'safari' AND '/src/assets/safari/' = ANY(images);

-- Step 2: Update Paradise image paths to use /assets/
UPDATE products 
SET images = ARRAY(
    SELECT REPLACE(image_path, '/src/assets/paradise/', '/assets/')
    FROM unnest(images) as image_path
)
WHERE display_page = 'paradise' AND '/src/assets/paradise/' = ANY(images);

-- Step 3: Also update any remaining /assets/safari/ paths to just /assets/
UPDATE products 
SET images = ARRAY(
    SELECT REPLACE(image_path, '/assets/safari/', '/assets/')
    FROM unnest(images) as image_path
)
WHERE display_page = 'safari' AND '/assets/safari/' = ANY(images);

-- Step 4: Update any remaining /assets/paradise/ paths to just /assets/
UPDATE products 
SET images = ARRAY(
    SELECT REPLACE(image_path, '/assets/paradise/', '/assets/')
    FROM unnest(images) as image_path
)
WHERE display_page = 'paradise' AND '/assets/paradise/' = ANY(images);

-- Step 5: Verification - Check updated image paths
SELECT 'SAFARI IMAGE PATHS' as collection, name, unnest(images) as image_path
FROM products 
WHERE display_page = 'safari'
LIMIT 3;

SELECT 'PARADISE IMAGE PATHS' as collection, name, unnest(images) as image_path
FROM products 
WHERE display_page = 'paradise'
LIMIT 3;

-- Step 6: Show the actual file names that should exist
SELECT 'EXPECTED SAFARI FILES' as info, '/assets/safari-' || generate_series(1, 38) || '.png' as expected_path
UNION ALL
SELECT 'EXPECTED PARADISE FILES' as info, '/assets/paradise-' || generate_series(1, 63) || '.jpg' as expected_path
LIMIT 10;
