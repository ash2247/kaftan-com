-- Complete removal of ALL storage restrictions
-- Run this in Supabase SQL Editor

-- First, completely disable RLS on storage objects temporarily
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Then update ALL buckets to be truly unlimited
UPDATE storage.buckets 
SET 
  file_size_limit = NULL,
  allowed_mime_types = NULL,
  public = true;

-- Re-enable RLS with completely permissive policies
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Admin Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admin Deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow all authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow all authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow all authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow all authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;

-- Create completely unrestricted policies
CREATE POLICY "Enable all inserts" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable all selects" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Enable all updates" ON storage.objects FOR UPDATE WITH CHECK (true);
CREATE POLICY "Enable all deletes" ON storage.objects FOR DELETE USING (true);

-- Verify final state
SELECT id, name, file_size_limit, public FROM storage.buckets;
