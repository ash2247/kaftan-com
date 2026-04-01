-- Migration: Create pages table for dynamic page management
-- This table stores all dynamic pages created by users

-- Step 1: Create the pages table
CREATE TABLE IF NOT EXISTS pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    path TEXT NOT NULL UNIQUE,
    content TEXT DEFAULT '<h1>Page Title</h1><p>Add your content here.</p>',
    meta_title TEXT,
    meta_description TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    is_system BOOLEAN DEFAULT FALSE,
    is_product_page BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_path ON pages(path);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_is_product_page ON pages(is_product_page);

-- Step 3: Insert initial system pages (only if they don't exist)
INSERT INTO pages (name, slug, path, content, meta_title, meta_description, status, is_system) VALUES
('Home', 'home', '/', '<h1>Welcome to Fashion Spectrum Luxe</h1><p>Discover our latest collections</p>', 'Home - Fashion Spectrum Luxe', 'Fashion Spectrum Luxe - Home Page', 'published', TRUE),
('Shop', 'shop', '/shop', '<h1>Shop All Products</h1><p>Browse our complete collection</p>', 'Shop - Fashion Spectrum Luxe', 'Shop our latest fashion collections', 'published', TRUE),
('Collections', 'collections', '/collections', '<h1>Our Collections</h1><p>Explore curated fashion collections</p>', 'Collections - Fashion Spectrum Luxe', 'Discover our fashion collections', 'published', TRUE),
('New Arrivals', 'new-arrivals', '/new-arrivals', '<h1>New Arrivals</h1><p>Check out the latest styles</p>', 'New Arrivals - Fashion Spectrum Luxe', 'Shop our newest fashion arrivals', 'published', TRUE),
('Sale', 'sale', '/sale', '<h1>Sale</h1><p>Find great deals on selected items</p>', 'Sale - Fashion Spectrum Luxe', 'Shop our sale collection for great deals', 'published', TRUE),
('Best Sellers', 'best-sellers', '/best-sellers', '<h1>Best Sellers</h1><p>Our most popular products</p>', 'Best Sellers - Fashion Spectrum Luxe', 'Shop our bestselling fashion items', 'published', TRUE),
('About', 'about', '/about', '<h1>About Us</h1><p>Learn more about Fashion Spectrum Luxe</p>', 'About - Fashion Spectrum Luxe', 'About Fashion Spectrum Luxe', 'draft', TRUE),
('Contact', 'contact', '/contact', '<h1>Contact Us</h1><p>Get in touch with our team</p>', 'Contact - Fashion Spectrum Luxe', 'Contact Fashion Spectrum Luxe', 'draft', TRUE)
ON CONFLICT (path) DO NOTHING;

-- Step 4: Create trigger for updated_at (drop and recreate if exists)
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
DROP FUNCTION IF EXISTS update_pages_updated_at_column();

CREATE FUNCTION update_pages_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pages_updated_at 
    BEFORE UPDATE ON pages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_pages_updated_at_column();

-- Step 5: Verify the table creation
SELECT 
    COUNT(*) as total_pages,
    COUNT(CASE WHEN is_system = TRUE THEN 1 END) as system_pages,
    COUNT(CASE WHEN is_product_page = TRUE THEN 1 END) as product_pages,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published_pages
FROM pages;

-- Step 6: Show sample data
SELECT 
    name,
    path,
    status,
    is_system,
    is_product_page,
    created_at
FROM pages 
ORDER BY created_at
LIMIT 5;

-- Success message
SELECT 'Migration completed: pages table created with initial system pages' as status;
