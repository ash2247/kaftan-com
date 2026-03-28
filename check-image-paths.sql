-- Check image paths and diagnose image display issues

-- Step 1: Check what image paths are stored in the database
SELECT display_page, name, images
FROM products 
WHERE display_page IN ('safari', 'paradise')
LIMIT 5;

-- Step 2: Check a few sample image paths from each collection
SELECT 'SAFARI IMAGES' as collection, name, unnest(images) as image_path
FROM products 
WHERE display_page = 'safari'
LIMIT 3;

SELECT 'PARADISE IMAGES' as collection, name, unnest(images) as image_path
FROM products 
WHERE display_page = 'paradise'
LIMIT 3;

-- Step 3: Check if there are any products with missing images
SELECT display_page, COUNT(*) as total_products,
       COUNT(CASE WHEN images IS NULL OR array_length(images, 1) = 0 THEN 1 END) as missing_images
FROM products 
WHERE display_page IN ('safari', 'paradise')
GROUP BY display_page;

-- Step 4: Show the exact image path format being used
SELECT 'IMAGE PATH FORMAT' as info, 
       unnest(images) as sample_path,
       LENGTH(unnest(images)) as path_length
FROM products 
WHERE display_page = 'safari' 
LIMIT 1;
