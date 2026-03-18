-- Simple bucket-only fix (no RLS changes)
-- Run this in Supabase SQL Editor

-- Only update bucket settings - no policy changes
UPDATE storage.buckets 
SET 
  file_size_limit = NULL,
  allowed_mime_types = NULL
WHERE id = 'public';

-- Verify the change
SELECT id, name, file_size_limit, 
  CASE WHEN file_size_limit IS NULL THEN 'UNLIMITED' 
       ELSE 'LIMITED: ' || (file_size_limit / 1024 / 1024) || 'MB' END as status
FROM storage.buckets 
WHERE id = 'public';
