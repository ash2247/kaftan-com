-- Simple direct SQL to remove storage limits
-- Run this in Supabase SQL Editor

-- First, check what buckets exist
SELECT id, name, file_size_limit, public FROM storage.buckets;

-- Remove file size limits from all buckets
UPDATE storage.buckets SET file_size_limit = NULL;

-- Verify changes
SELECT id, name, file_size_limit, 
  CASE WHEN file_size_limit IS NULL THEN 'UNLIMITED' 
       ELSE 'LIMITED: ' || (file_size_limit / 1024 / 1024) || 'MB' END as status
FROM storage.buckets;
