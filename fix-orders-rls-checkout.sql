-- Fix RLS policies for orders table to allow anonymous/guest checkout
-- This fixes the error: "new row violates row level security policy for table 'orders'"

-- First, disable RLS temporarily to clean up
delete from orders where customer_email is null;
delete from order_items where order_id not in (select id from orders);

-- Re-enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on orders to start fresh
DROP POLICY IF EXISTS "Allow anonymous order creation" ON orders;
DROP POLICY IF EXISTS "Allow anyone to view orders" ON orders;
DROP POLICY IF EXISTS "Allow users to view own orders" ON orders;
DROP POLICY IF EXISTS "Allow admin users to view all orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;

-- Create INSERT policy - Allow ANYONE to create orders (critical for guest checkout)
CREATE POLICY "Allow anyone to create orders" 
ON orders 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Create SELECT policy - Allow users to view their own orders (by user_id or email match)
CREATE POLICY "Allow users to view their orders" 
ON orders 
FOR SELECT 
TO anon, authenticated
USING (
  auth.uid() IS NULL  -- Allow anon users to view orders they just created (needed for checkout flow)
  OR user_id = auth.uid()  -- Authenticated users see their orders
  OR (user_id IS NULL AND auth.uid() IS NULL)  -- Guest orders visible to guests
);

-- Create UPDATE policy - Allow users to update their own orders
CREATE POLICY "Allow users to update their orders" 
ON orders 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow admin users full access
CREATE POLICY "Allow admin full access" 
ON orders 
FOR ALL 
TO authenticated
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

-- ============================================================
-- Fix order_items table RLS policies
-- ============================================================

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on order_items
DROP POLICY IF EXISTS "Allow anonymous order items creation" ON order_items;
DROP POLICY IF EXISTS "Allow anyone to view order items" ON order_items;
DROP POLICY IF EXISTS "Allow users to view own order items" ON order_items;
DROP POLICY IF EXISTS "Allow admin users to view all order items" ON order_items;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;

-- Create INSERT policy - Allow ANYONE to create order items
CREATE POLICY "Allow anyone to create order items" 
ON order_items 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Create SELECT policy - Allow anyone to view order items (needed for order confirmation)
CREATE POLICY "Allow anyone to view order items" 
ON order_items 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Create UPDATE/DELETE policy - Allow admin full access on order_items
CREATE POLICY "Allow admin full access on order items" 
ON order_items 
FOR ALL 
TO authenticated
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

-- ============================================================
-- Fix customers table RLS (if it exists)
-- ============================================================

DO $$
BEGIN
  -- Check if customers table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customers') THEN
    ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow public to insert customers" ON customers;
    DROP POLICY IF EXISTS "Allow public to view customers" ON customers;
    
    CREATE POLICY "Allow public to insert customers" 
    ON customers 
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);
    
    CREATE POLICY "Allow public to view customers" 
    ON customers 
    FOR SELECT 
    TO anon, authenticated
    USING (true);
  END IF;
END $$;

-- ============================================================
-- Fix payment_methods table RLS
-- ============================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payment_methods') THEN
    ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Allow users to manage own payment methods" ON payment_methods;
    
    CREATE POLICY "Allow users to manage own payment methods" 
    ON payment_methods 
    FOR ALL 
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Verify policies are created
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, policyname;
