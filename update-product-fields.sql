-- SQL script to update products with collection, style, and color extracted from product names
-- This script parses product names and updates the new fields accordingly

-- Update products with pattern "Collection Style - Color" (e.g., "Athena Long Shirt Dress - Blue")
UPDATE products 
SET 
    collection = CASE 
        WHEN name LIKE 'Athena %' THEN 'Athena'
        WHEN name LIKE 'Sorento %' THEN 'Sorento'
        WHEN name LIKE 'Tropical %' THEN 'Tropical'
        WHEN name LIKE 'Pardus %' THEN 'Pardus'
        WHEN name LIKE 'Merika %' THEN 'Merika'
        WHEN name LIKE 'Garden %' THEN 'Garden'
        WHEN name LIKE 'Marigold %' THEN 'Marigold'
        WHEN name LIKE 'Monet %' THEN 'Monet'
        WHEN name LIKE 'Zahara %' THEN 'Zahara'
        WHEN name LIKE 'Picasso %' THEN 'Picasso'
        WHEN name LIKE 'Paradise %' THEN 'Paradise'
        WHEN name LIKE 'Safari %' THEN 'Safari'
        ELSE NULL
    END,
    style = CASE 
        WHEN name LIKE 'Athena % - %' THEN TRIM(SUBSTRING(name, 7, LOCATE(' - ', name) - 7))
        WHEN name LIKE 'Sorento % - %' THEN TRIM(SUBSTRING(name, 9, LOCATE(' - ', name) - 9))
        WHEN name LIKE 'Tropical % - %' THEN TRIM(SUBSTRING(name, 9, LOCATE(' - ', name) - 9))
        WHEN name LIKE 'Pardus % - %' THEN TRIM(SUBSTRING(name, 7, LOCATE(' - ', name) - 7))
        WHEN name LIKE 'Merika % - %' THEN TRIM(SUBSTRING(name, 7, LOCATE(' - ', name) - 7))
        WHEN name LIKE 'Garden % - %' THEN TRIM(SUBSTRING(name, 7, LOCATE(' - ', name) - 7))
        WHEN name LIKE 'Marigold % - %' THEN TRIM(SUBSTRING(name, 9, LOCATE(' - ', name) - 9))
        WHEN name LIKE 'Monet % - %' THEN TRIM(SUBSTRING(name, 7, LOCATE(' - ', name) - 7))
        WHEN name LIKE 'Zahara % - %' THEN TRIM(SUBSTRING(name, 7, LOCATE(' - ', name) - 7))
        WHEN name LIKE 'Picasso % - %' THEN TRIM(SUBSTRING(name, 8, LOCATE(' - ', name) - 8))
        WHEN name LIKE 'Paradise % - %' THEN TRIM(SUBSTRING(name, 9, LOCATE(' - ', name) - 9))
        WHEN name LIKE 'Safari % - %' THEN TRIM(SUBSTRING(name, 7, LOCATE(' - ', name) - 7))
        -- Handle pattern without dash: "Collection Style Color"
        WHEN name LIKE 'Athena %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING(name, 7, LENGTH(name) - LOCATE(' ', REVERSE(name)) - 6))
        WHEN name LIKE 'Sorento %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING(name, 9, LENGTH(name) - LOCATE(' ', REVERSE(name)) - 8))
        WHEN name LIKE 'Tropical %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING(name, 9, LENGTH(name) - LOCATE(' ', REVERSE(name)) - 8))
        WHEN name LIKE 'Pardus %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING(name, 7, LENGTH(name) - LOCATE(' ', REVERSE(name)) - 6))
        WHEN name LIKE 'Merika %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING(name, 7, LENGTH(name) - LOCATE(' ', REVERSE(name)) - 6))
        WHEN name LIKE 'Garden %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING(name, 7, LENGTH(name) - LOCATE(' ', REVERSE(name)) - 6))
        WHEN name LIKE 'Marigold %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING(name, 9, LENGTH(name) - LOCATE(' ', REVERSE(name)) - 8))
        WHEN name LIKE 'Monet %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING(name, 7, LENGTH(name) - LOCATE(' ', REVERSE(name)) - 6))
        WHEN name LIKE 'Zahara %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING(name, 7, LENGTH(name) - LOCATE(' ', REVERSE(name)) - 6))
        WHEN name LIKE 'Picasso %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING(name, 8, LENGTH(name) - LOCATE(' ', REVERSE(name)) - 7))
        WHEN name LIKE 'Paradise %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING(name, 9, LENGTH(name) - LOCATE(' ', REVERSE(name)) - 8))
        WHEN name LIKE 'Safari %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING(name, 7, LENGTH(name) - LOCATE(' ', REVERSE(name)) - 6))
        ELSE NULL
    END,
    color = CASE 
        WHEN name LIKE '% - %' THEN TRIM(SUBSTRING(name, LOCATE(' - ', name) + 3))
        WHEN name LIKE 'Athena %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING_INDEX(SUBSTRING(name, 7), ' ', -1))
        WHEN name LIKE 'Sorento %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING_INDEX(SUBSTRING(name, 9), ' ', -1))
        WHEN name LIKE 'Tropical %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING_INDEX(SUBSTRING(name, 9), ' ', -1))
        WHEN name LIKE 'Pardus %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING_INDEX(SUBSTRING(name, 7), ' ', -1))
        WHEN name LIKE 'Merika %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING_INDEX(SUBSTRING(name, 7), ' ', -1))
        WHEN name LIKE 'Garden %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING_INDEX(SUBSTRING(name, 7), ' ', -1))
        WHEN name LIKE 'Marigold %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING_INDEX(SUBSTRING(name, 9), ' ', -1))
        WHEN name LIKE 'Monet %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING_INDEX(SUBSTRING(name, 7), ' ', -1))
        WHEN name LIKE 'Zahara %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING_INDEX(SUBSTRING(name, 7), ' ', -1))
        WHEN name LIKE 'Picasso %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING_INDEX(SUBSTRING(name, 8), ' ', -1))
        WHEN name LIKE 'Paradise %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING_INDEX(SUBSTRING(name, 9), ' ', -1))
        WHEN name LIKE 'Safari %' AND name NOT LIKE '% - %' THEN TRIM(SUBSTRING_INDEX(SUBSTRING(name, 7), ' ', -1))
        ELSE NULL
    END
WHERE 
    (name LIKE '% - %' OR 
     name LIKE 'Athena %' OR 
     name LIKE 'Sorento %' OR 
     name LIKE 'Tropical %' OR 
     name LIKE 'Pardus %' OR 
     name LIKE 'Merika %' OR 
     name LIKE 'Garden %' OR 
     name LIKE 'Marigold %' OR 
     name LIKE 'Monet %' OR 
     name LIKE 'Zahara %' OR 
     name LIKE 'Picasso %' OR 
     name LIKE 'Paradise %' OR 
     name LIKE 'Safari %')
    AND (collection IS NULL OR style IS NULL OR color IS NULL);

-- Show updated products
SELECT 
    id,
    name,
    collection,
    style,
    color,
    updated_at
FROM products 
WHERE collection IS NOT NULL OR style IS NOT NULL OR color IS NOT NULL
ORDER BY updated_at DESC;
