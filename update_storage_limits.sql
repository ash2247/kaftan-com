-- ========================================
-- REMOVE ALL SUPABASE STORAGE LIMITATIONS
-- ========================================

-- Remove ALL file size limits from ALL storage buckets
UPDATE storage.buckets 
SET 
  file_size_limit = NULL, -- NULL means completely unlimited
  public = true,
  allowed_mime_types = NULL -- Allow all file types (will still be filtered by upload service)
WHERE id IN ('public', 'media', 'products');

-- Also update any other buckets that might exist
UPDATE storage.buckets 
SET 
  file_size_limit = NULL,
  public = true,
  allowed_mime_types = NULL
WHERE file_size_limit IS NOT NULL;

-- Verify all buckets are now unlimited
SELECT 
  id, 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types,
  CASE 
    WHEN file_size_limit IS NULL THEN 'UNLIMITED'
    WHEN file_size_limit = 0 THEN 'UNLIMITED'
    ELSE 'LIMITED: ' || (file_size_limit / 1024 / 1024) || 'MB'
  END as status
FROM storage.buckets;

-- Also remove any row-level security policies that might restrict uploads
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Admin Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admin Deletes" ON storage.objects;

-- Create new unrestricted policies for authenticated users
CREATE POLICY "Allow all authenticated uploads" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow all authenticated reads" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow all authenticated updates" ON storage.objects
  FOR UPDATE
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow all authenticated deletes" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (true);

-- Allow public read access for images
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id IN ('public', 'media', 'products'));

COMMIT;
