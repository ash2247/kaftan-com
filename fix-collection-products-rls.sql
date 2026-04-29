-- Fix RLS policies for collection_products table
-- This script will allow admin users to manage collection-product assignments

-- First, let's check the current RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'collection_products';

-- Drop existing policies if they exist (to start fresh)
DROP POLICY IF EXISTS "collection_products_select_policy" ON collection_products;
DROP POLICY IF EXISTS "collection_products_insert_policy" ON collection_products;
DROP POLICY IF EXISTS "collection_products_update_policy" ON collection_products;
DROP POLICY IF EXISTS "collection_products_delete_policy" ON collection_products;

-- Enable RLS on the table if not already enabled
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;

-- Create policies for collection_products table

-- 1. Allow authenticated users to read collection assignments
CREATE POLICY "collection_products_select_policy" ON collection_products
    FOR SELECT USING (auth.role() = 'authenticated');

-- 2. Allow admin users to insert collection assignments
CREATE POLICY "collection_products_insert_policy" ON collection_products
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

-- 3. Allow admin users to update collection assignments
CREATE POLICY "collection_products_update_policy" ON collection_products
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

-- 4. Allow admin users to delete collection assignments
CREATE POLICY "collection_products_delete_policy" ON collection_products
    FOR DELETE USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_roles.user_id = auth.uid() 
            AND user_roles.role = 'admin'
        )
    );

-- Alternative: If you want to allow any authenticated user to manage collections
-- (less secure but simpler for development)
-- Uncomment the following lines and comment out the admin-specific policies above:

/*
CREATE POLICY "collection_products_insert_policy" ON collection_products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "collection_products_update_policy" ON collection_products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "collection_products_delete_policy" ON collection_products
    FOR DELETE USING (auth.role() = 'authenticated');
*/

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
