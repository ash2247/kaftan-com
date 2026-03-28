-- Find what status values are allowed by the check constraint
-- Try different common status values to see what works

-- First, let's see what status values are already used successfully
SELECT DISTINCT status, COUNT(*) as count
FROM products 
GROUP BY status
ORDER BY count DESC;

-- Let's try to find the constraint definition using pg_get_constraintdef
SELECT conname, pg_get_constraintdef(oid) as constraint_def
FROM pg_constraint 
WHERE conrelid = 'products'::regclass AND contype = 'c';

-- Try to see if there are any products with status = 'active' already
SELECT COUNT(*) as active_count FROM products WHERE status = 'active';

-- Try to see if there are any products with status = 'published' already  
SELECT COUNT(*) as published_count FROM products WHERE status = 'published';

-- Try to see if there are any products with status = 'draft' already
SELECT COUNT(*) as draft_count FROM products WHERE status = 'draft';

-- Try to see if there are any products with status = 'inactive' already
SELECT COUNT(*) as inactive_count FROM products WHERE status = 'inactive';

-- Try to see if there are any products with status = 'available' already
SELECT COUNT(*) as available_count FROM products WHERE status = 'available';
