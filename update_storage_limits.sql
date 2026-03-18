-- ========================================
-- UPDATE SUPABASE STORAGE BUCKET FOR UNLIMITED FILE SIZES
-- ========================================

-- Update the media storage bucket to remove file size limits
UPDATE storage.buckets 
SET 
  file_size_limit = NULL, -- NULL means unlimited
  public = true
WHERE id = 'media';

-- Also update if there's a 'public' bucket (common default)
UPDATE storage.buckets 
SET 
  file_size_limit = NULL,
  public = true
WHERE id = 'public';

-- Verify the changes
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id IN ('media', 'public');

COMMIT;
