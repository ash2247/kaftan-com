-- Simple RLS policies for collection_products table
-- This allows any authenticated user to manage collections (less secure but will work)

-- Drop existing policies
DROP POLICY IF EXISTS "collection_products_select_policy" ON collection_products;
DROP POLICY IF EXISTS "collection_products_insert_policy" ON collection_products;
DROP POLICY IF EXISTS "collection_products_update_policy" ON collection_products;
DROP POLICY IF EXISTS "collection_products_delete_policy" ON collection_products;

-- Enable RLS on the table
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;

-- Create simple policies for any authenticated user

-- 1. Allow authenticated users to read collection assignments
CREATE POLICY "collection_products_select_policy" ON collection_products
    FOR SELECT USING (auth.role() = 'authenticated');

-- 2. Allow authenticated users to insert collection assignments
CREATE POLICY "collection_products_insert_policy" ON collection_products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Allow authenticated users to update collection assignments
CREATE POLICY "collection_products_update_policy" ON collection_products
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. Allow authenticated users to delete collection assignments
CREATE POLICY "collection_products_delete_policy" ON collection_products
    FOR DELETE USING (auth.role() = 'authenticated');

-- Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'collection_products';
