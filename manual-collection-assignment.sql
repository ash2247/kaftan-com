-- Manual Collection Assignment Script
-- Use this if the automatic assignment didn't work perfectly

-- First, see what products you currently have
SELECT 
    id,
    name,
    category,
    collection
FROM products 
ORDER BY category, name;

-- Assign specific products to collections (customize as needed)
-- Update the WHERE clauses to match your actual product names/categories

-- Example manual assignments - modify these based on your actual products
UPDATE products SET collection = 'Apella' WHERE id IN (
    SELECT id FROM products WHERE name ILIKE '%Apella%' LIMIT 10
);

UPDATE products SET collection = 'Clinto' WHERE id IN (
    SELECT id FROM products WHERE name ILIKE '%Clinto%' OR category ILIKE '%Gypsy%' LIMIT 10
);

UPDATE products SET collection = 'Frangipani' WHERE id IN (
    SELECT id FROM products WHERE name ILIKE '%Frangipani%' OR category ILIKE '%Floral%' LIMIT 10
);

UPDATE products SET collection = 'Leopard' WHERE id IN (
    SELECT id FROM products WHERE name ILIKE '%Leopard%' OR category ILIKE '%Animal%' LIMIT 10
);

UPDATE products SET collection = 'Madrid' WHERE id IN (
    SELECT id FROM products WHERE name ILIKE '%Madrid%' OR category ILIKE '%Short%' LIMIT 10
);

UPDATE products SET collection = 'Milano' WHERE id IN (
    SELECT id FROM products WHERE name ILIKE '%Milano%' OR category ILIKE '%Long%' LIMIT 10
);

UPDATE products SET collection = 'Peacock' WHERE id IN (
    SELECT id FROM products WHERE name ILIKE '%Peacock%' OR category ILIKE '%Vibrant%' LIMIT 10
);

UPDATE products SET collection = 'Picasso' WHERE id IN (
    SELECT id FROM products WHERE name ILIKE '%Picasso%' OR category ILIKE '%Art%' LIMIT 10
);

UPDATE products SET collection = 'Sicily' WHERE id IN (
    SELECT id FROM products WHERE name ILIKE '%Sicily%' OR category ILIKE '%Summer%' LIMIT 10
);

-- Check results
SELECT 
    collection,
    COUNT(*) as count,
    STRING_AGG(name, ', ') as sample_names
FROM products 
WHERE collection IS NOT NULL
GROUP BY collection
ORDER BY count DESC;
