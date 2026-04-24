-- Minimal RLS Fix for Supabase - Only for existing tables
-- Run this in Supabase SQL Editor to fix 401 Unauthorized errors

-- Disable RLS for public tables that should be accessible to everyone
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE collections DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE header_footer DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers DISABLE ROW LEVEL SECURITY;

-- Enable RLS only for sensitive tables that exist
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE smtp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for sensitive tables (only if they exist)
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
DROP POLICY IF EXISTS "Users can view active coupons" ON coupons;
DROP POLICY IF EXISTS "Admins can manage SMTP settings" ON smtp_settings;
DROP POLICY IF EXISTS "Admins can manage email templates" ON email_templates;

-- Create policies for reviews table (if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews' AND table_schema = 'public') THEN
        CREATE POLICY "Users can view all reviews" ON reviews
        FOR SELECT USING (true);

        CREATE POLICY "Users can create reviews" ON reviews
        FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

        CREATE POLICY "Users can update own reviews" ON reviews
        FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create policies for coupons table (if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'coupons' AND table_schema = 'public') THEN
        CREATE POLICY "Admins can manage coupons" ON coupons
        FOR ALL USING (
            auth.uid() IS NOT NULL AND 
            auth.jwt() ->> 'role' = '"admin"'
        );

        CREATE POLICY "Users can view active coupons" ON coupons
        FOR SELECT USING (status = 'active' AND (auth.uid() IS NOT NULL OR true));
    END IF;
END $$;

-- Create policies for smtp_settings table (if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'smtp_settings' AND table_schema = 'public') THEN
        CREATE POLICY "Admins can manage SMTP settings" ON smtp_settings
        FOR ALL USING (
            auth.uid() IS NOT NULL AND 
            auth.jwt() ->> 'role' = '"admin"'
        );
    END IF;
END $$;

-- Create policies for email_templates table (if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_templates' AND table_schema = 'public') THEN
        CREATE POLICY "Admins can manage email templates" ON email_templates
        FOR ALL USING (
            auth.uid() IS NOT NULL AND 
            auth.jwt() ->> 'role' = '"admin"'
        );
    END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Verify RLS status for all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verify policies are in place
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
