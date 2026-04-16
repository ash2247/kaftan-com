-- Fix collections table RLS policies to allow admin to create/update/delete collections

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage collections" ON collections;
DROP POLICY IF EXISTS "Admins can view all collections" ON collections;
DROP POLICY IF EXISTS "Admins can insert collections" ON collections;
DROP POLICY IF EXISTS "Admins can update collections" ON collections;
DROP POLICY IF EXISTS "Admins can delete collections" ON collections;
DROP POLICY IF EXISTS "Everyone can view published collections" ON collections;

-- Create SELECT policy - Everyone can view published collections
CREATE POLICY "Everyone can view published collections" ON collections
  FOR SELECT
  USING (status = 'published');

-- Create SELECT policy - Admins can view ALL collections (including drafts)
CREATE POLICY "Admins can view all collections" ON collections
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create INSERT policy - Only admins can create collections
CREATE POLICY "Admins can insert collections" ON collections
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create UPDATE policy - Only admins can update collections
CREATE POLICY "Admins can update collections" ON collections
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create DELETE policy - Only admins can delete collections
CREATE POLICY "Admins can delete collections" ON collections
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Verify policies are created
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'collections'
ORDER BY policyname;
