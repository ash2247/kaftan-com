-- Full Database Backup for Kaftan-Com
-- Generated on: 2025-03-19
-- Database: Supabase PostgreSQL
-- Project ID: nhwoqzokmujucwxbdtjk

-- ========================================
-- 1. TABLE STRUCTURES
-- ========================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    original_price DECIMAL(10,2),
    in_stock BOOLEAN DEFAULT true,
    category TEXT,
    colors TEXT[],
    sizes TEXT[],
    images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collection Products table
CREATE TABLE IF NOT EXISTS collection_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(collection_id, product_id)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address JSONB,
    billing_address JSONB,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    size TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT,
    customer_email TEXT,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, product_id),
    UNIQUE(customer_email, product_id)
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT,
    customer_email TEXT,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    size TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, product_id, size, color),
    UNIQUE(customer_email, product_id, size, color)
);

-- Newsletter Subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_collections_is_active ON collections(is_active);
CREATE INDEX IF NOT EXISTS idx_collection_products_collection_id ON collection_products(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_products_product_id ON collection_products(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_session_id ON wishlist(session_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_customer_email ON wishlist(customer_email);
CREATE INDEX IF NOT EXISTS idx_cart_session_id ON cart(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_customer_email ON cart(customer_email);

-- ========================================
-- 3. RLS (ROW LEVEL SECURITY) POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Collections policies
CREATE POLICY "Enable read access for all users" ON collections FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON collections FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON collections FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON collections FOR DELETE USING (auth.role() = 'authenticated');

-- Orders policies
CREATE POLICY "Enable read access for own orders" ON orders FOR SELECT USING (auth.uid()::text = customer_email OR auth.role() = 'service_role');
CREATE POLICY "Enable insert for all users" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON orders FOR UPDATE USING (auth.role() = 'service_role');

-- Order Items policies
CREATE POLICY "Enable read access for own order items" ON order_items FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id 
    AND (auth.uid()::text = orders.customer_email OR auth.role() = 'service_role')
));
CREATE POLICY "Enable insert for all users" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON order_items FOR UPDATE USING (auth.role() = 'service_role');

-- Wishlist policies
CREATE POLICY "Enable read access for own wishlist" ON wishlist FOR SELECT USING (
    (session_id IS NOT NULL) OR 
    (auth.uid()::text = customer_email) OR 
    (auth.role() = 'service_role')
);
CREATE POLICY "Enable insert for all users" ON wishlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for own wishlist" ON wishlist FOR UPDATE USING (
    (session_id IS NOT NULL) OR 
    (auth.uid()::text = customer_email) OR 
    (auth.role() = 'service_role')
);
CREATE POLICY "Enable delete for own wishlist" ON wishlist FOR DELETE USING (
    (session_id IS NOT NULL) OR 
    (auth.uid()::text = customer_email) OR 
    (auth.role() = 'service_role')
);

-- Cart policies
CREATE POLICY "Enable read access for own cart" ON cart FOR SELECT USING (
    (session_id IS NOT NULL) OR 
    (auth.uid()::text = customer_email) OR 
    (auth.role() = 'service_role')
);
CREATE POLICY "Enable insert for all users" ON cart FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for own cart" ON cart FOR UPDATE USING (
    (session_id IS NOT NULL) OR 
    (auth.uid()::text = customer_email) OR 
    (auth.role() = 'service_role')
);
CREATE POLICY "Enable delete for own cart" ON cart FOR DELETE USING (
    (session_id IS NOT NULL) OR 
    (auth.uid()::text = customer_email) OR 
    (auth.role() = 'service_role')
);

-- Newsletter policies
CREATE POLICY "Enable read access for service role" ON newsletter_subscribers FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "Enable insert for all users" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for service role" ON newsletter_subscribers FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Enable delete for service role" ON newsletter_subscribers FOR DELETE USING (auth.role() = 'service_role');

-- ========================================
-- 4. TRIGGERS AND FUNCTIONS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON cart FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 5. SAMPLE DATA INSERTS (if needed for restore)
-- ========================================

-- Note: Actual data should be exported separately using pg_dump or Supabase dashboard
-- This structure file contains only the schema definition

-- ========================================
-- 6. STORAGE BUCKETS (if applicable)
-- ========================================

-- Note: Storage buckets need to be created via Supabase dashboard or API
-- Common buckets for this project:
-- - products (for product images)
-- - collections (for collection banners)
-- - uploads (for user uploads)

-- ========================================
-- BACKUP COMPLETION
-- ========================================

-- This backup file contains the complete database schema
-- To restore: 
-- 1. Create new Supabase project
-- 2. Run this SQL file in the SQL Editor
-- 3. Restore data using pg_dump or CSV exports
-- 4. Recreate storage buckets via dashboard
-- 5. Update environment variables with new project details
