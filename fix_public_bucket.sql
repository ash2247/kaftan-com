-- Fix for 'public' bucket file size limits
-- Run this in Supabase SQL Editor

-- Check current 'public' bucket settings
SELECT id, name, file_size_limit, public FROM storage.buckets WHERE id = 'public';

-- Remove file size limit specifically from 'public' bucket
UPDATE storage.buckets 
SET file_size_limit = NULL 
WHERE id = 'public';

-- Also remove from any bucket that might exist
UPDATE storage.buckets 
SET file_size_limit = NULL 
WHERE file_size_limit IS NOT NULL;

-- Verify the fix
SELECT id, name, file_size_limit, 
  CASE WHEN file_size_limit IS NULL THEN 'UNLIMITED' 
       ELSE 'LIMITED: ' || (file_size_limit / 1024 / 1024) || 'MB' END as status
FROM storage.buckets;
