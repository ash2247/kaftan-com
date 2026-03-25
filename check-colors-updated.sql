-- Query to check if colors have been updated in the database
-- This will show you the current state of the collection, style, and color fields

-- Check overall statistics
SELECT 
    'Total Products' as metric,
    COUNT(*) as count
FROM products
UNION ALL
SELECT 
    'Products with Collection',
    COUNT(*)
FROM products 
WHERE collection IS NOT NULL
UNION ALL
SELECT 
    'Products with Style',
    COUNT(*)
FROM products 
WHERE style IS NOT NULL
UNION ALL
SELECT 
    'Products with Color',
    COUNT(*)
FROM products 
WHERE color IS NOT NULL
UNION ALL
SELECT 
    'Products with All Fields',
    COUNT(*)
FROM products 
WHERE collection IS NOT NULL AND style IS NOT NULL AND color IS NOT NULL;

-- Show sample of updated products with their parsed data
SELECT 
    id,
    name as original_name,
    collection,
    style,
    color,
    updated_at
FROM products 
WHERE collection IS NOT NULL OR style IS NOT NULL OR color IS NOT NULL
ORDER BY 
    CASE 
        WHEN collection IS NOT NULL AND style IS NOT NULL AND color IS NOT NULL THEN 1
        WHEN collection IS NOT NULL OR style IS NOT NULL OR color IS NOT NULL THEN 2
        ELSE 3
    END,
    updated_at DESC
LIMIT 20;

-- Show products that might need manual review (null values)
SELECT 
    id,
    name as original_name,
    collection,
    style,
    color
FROM products 
WHERE collection IS NULL OR style IS NULL OR color IS NULL
ORDER BY name
LIMIT 10;

-- Check specific examples to verify parsing worked correctly
SELECT 
    name as original_name,
    collection,
    style,
    color,
    CASE 
        WHEN name LIKE '% - %' THEN 'Dash Pattern'
        WHEN name LIKE 'Picasso %' THEN 'Picasso Pattern'
        WHEN name LIKE 'Athena %' THEN 'Athena Pattern'
        WHEN name LIKE 'Garden %' THEN 'Garden Pattern'
        ELSE 'Other Pattern'
    END as pattern_type
FROM products 
WHERE name LIKE '%Picasso%' OR name LIKE '%Athena%' OR name LIKE '%Garden%'
ORDER BY name
LIMIT 15;
