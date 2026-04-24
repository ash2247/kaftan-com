-- Comprehensive RLS Fix for Supabase
-- Run this in Supabase SQL Editor to fix all 401 Unauthorized errors

-- First, disable RLS for public tables that should be accessible to everyone
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE collections DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE header_footer DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers DISABLE ROW LEVEL SECURITY;

-- Enable RLS only for sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE smtp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for sensitive tables
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow admin users to view all orders" ON orders;
DROP POLICY IF EXISTS "Allow users to view own orders" ON orders;
DROP POLICY IF EXISTS "Allow order creation" ON orders;
DROP POLICY IF EXISTS "Allow admin users to view all order items" ON order_items;
DROP POLICY IF EXISTS "Allow users to view own order items" ON order_items;
DROP POLICY IF EXISTS "Allow order items creation" ON order_items;
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
DROP POLICY IF EXISTS "Users can view active coupons" ON coupons;
DROP POLICY IF EXISTS "Admins can manage SMTP settings" ON smtp_settings;
DROP POLICY IF EXISTS "Admins can manage email templates" ON email_templates;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth.uid() = id);

-- Create policies for orders table
CREATE POLICY "Allow admin users to view all orders" ON orders
FOR SELECT USING (
  auth.uid() IS NOT NULL AND 
  auth.jwt() ->> 'role' = '"admin"'
);

CREATE POLICY "Allow users to view own orders" ON orders
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow order creation" ON orders
FOR INSERT WITH CHECK (true);

-- Create policies for order_items table
CREATE POLICY "Allow admin users to view all order items" ON order_items
FOR SELECT USING (
  auth.uid() IS NOT NULL AND 
  auth.jwt() ->> 'role' = '"admin"'
);

CREATE POLICY "Allow users to view own order items" ON order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Allow order items creation" ON order_items
FOR INSERT WITH CHECK (true);

-- Create policies for reviews table
CREATE POLICY "Users can view all reviews" ON reviews
FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own reviews" ON reviews
FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for coupons table
CREATE POLICY "Admins can manage coupons" ON coupons
FOR ALL USING (
  auth.uid() IS NOT NULL AND 
  auth.jwt() ->> 'role' = '"admin"'
);

CREATE POLICY "Users can view active coupons" ON coupons
FOR SELECT USING (status = 'active' AND (auth.uid() IS NOT NULL OR true));

-- Create policies for smtp_settings table
CREATE POLICY "Admins can manage SMTP settings" ON smtp_settings
FOR ALL USING (
  auth.uid() IS NOT NULL AND 
  auth.jwt() ->> 'role' = '"admin"'
);

-- Create policies for email_templates table
CREATE POLICY "Admins can manage email templates" ON email_templates
FOR ALL USING (
  auth.uid() IS NOT NULL AND 
  auth.jwt() ->> 'role' = '"admin"'
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Verify RLS status
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
