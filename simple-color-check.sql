-- Simple query to check color updates - focused and clear

-- 1. Quick summary of color updates
SELECT 
    'Total Products' as status,
    COUNT(*) as count
FROM products
UNION ALL
SELECT 
    'Colors Updated',
    COUNT(*)
FROM products 
WHERE color IS NOT NULL AND color != ''
UNION ALL
SELECT 
    'Colors Missing',
    COUNT(*)
FROM products 
WHERE color IS NULL OR color = '';

-- 2. Show actual color examples
SELECT 
    name as product_name,
    color as extracted_color,
    CASE 
        WHEN color IS NOT NULL AND color != '' THEN '✅ Updated'
        ELSE '❌ Missing'
    END as status
FROM products 
ORDER BY 
    CASE 
        WHEN color IS NOT NULL AND color != '' THEN 1
        ELSE 2
    END,
    name
LIMIT 15;

-- 3. Show specific examples you mentioned
SELECT 
    name as product_name,
    collection,
    style,
    color as extracted_color
FROM products 
WHERE name LIKE '%Picasso%' OR name LIKE '%Athena%' OR name LIKE '%Garden%'
ORDER BY name
LIMIT 10;
