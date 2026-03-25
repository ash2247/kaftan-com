-- Add status column to products table
-- Run this in Supabase SQL Editor

-- Step 1: Add status column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'status'
    ) THEN
        ALTER TABLE products ADD COLUMN status TEXT DEFAULT 'Active';
    END IF;
END $$;

-- Step 2: Add check constraint for valid status values
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'products' AND constraint_name = 'products_status_check'
    ) THEN
        ALTER TABLE products 
        ADD CONSTRAINT products_status_check 
        CHECK (status IN ('Active', 'Draft', 'Archived'));
    END IF;
END $$;

-- Step 3: Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'status';

-- Step 4: Update existing products to have 'Active' status if they have null
UPDATE products 
SET status = 'Active' 
WHERE status IS NULL;

-- Step 5: Show current status distribution
SELECT 
    status,
    COUNT(*) as count,
    STRING_AGG(name, ', ' ORDER BY created_at DESC) as sample_products
FROM products 
GROUP BY status 
ORDER BY status;
