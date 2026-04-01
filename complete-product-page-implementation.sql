-- ========================================
-- COMPLETE PRODUCT PAGE MANAGEMENT SYSTEM
-- ========================================
-- This query creates all necessary tables and implements
-- the complete product page editing functionality

-- 1. PAGES TABLE (for dynamic pages)
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL UNIQUE,
    content TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    is_system BOOLEAN DEFAULT FALSE,
    is_product_page BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BANNER_CONTENT TABLE (for home page and catalog pages)
CREATE TABLE IF NOT EXISTS banner_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key VARCHAR(100) NOT NULL UNIQUE,
    
    -- Hero Section
    hero_title_line1 TEXT,
    hero_title_line2 TEXT,
    hero_subtitle TEXT,
    hero_cta_text TEXT,
    hero_cta_link TEXT,
    hero_auto_slide BOOLEAN DEFAULT TRUE,
    hero_slide_interval INTEGER DEFAULT 4500,
    hero_slides JSONB DEFAULT '[]',
    
    -- Announcement Bar
    announcement_text TEXT DEFAULT 'Free Shipping Over $300',
    announcement_enabled BOOLEAN DEFAULT TRUE,
    
    -- Collection Banner
    collection_banner_subtitle TEXT,
    collection_banner_title TEXT,
    collection_banner_cta_text TEXT,
    collection_banner_cta_link TEXT,
    collection_image TEXT,
    
    -- About Section
    about_title TEXT,
    about_paragraph1 TEXT,
    about_paragraph2 TEXT,
    about_cta_text TEXT,
    about_image TEXT,
    
    -- Footer
    footer_newsletter_title TEXT,
    footer_newsletter_subtitle TEXT,
    footer_cta_text TEXT,
    footer_copyright TEXT,
    
    -- Page Sections
    sections JSONB DEFAULT '[]',
    
    -- Catalog Page Specific Fields
    page_title TEXT,
    page_subtitle TEXT,
    page_banner_image TEXT,
    show_banner BOOLEAN DEFAULT FALSE,
    page_meta_description TEXT,
    page_og_image TEXT,
    page_announcement_text TEXT DEFAULT 'Free Shipping Over $300',
    page_announcement_enabled BOOLEAN DEFAULT TRUE,
    page_products JSONB DEFAULT '[]',
    page_footer_newsletter_title TEXT,
    page_footer_newsletter_subtitle TEXT,
    page_footer_cta_text TEXT,
    page_footer_copyright TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if they don't exist (for existing tables)
DO $$
BEGIN
    -- Check if column exists before adding
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='banner_content' AND column_name='page_title') THEN
        ALTER TABLE banner_content ADD COLUMN page_title TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='banner_content' AND column_name='page_subtitle') THEN
        ALTER TABLE banner_content ADD COLUMN page_subtitle TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='banner_content' AND column_name='page_banner_image') THEN
        ALTER TABLE banner_content ADD COLUMN page_banner_image TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='banner_content' AND column_name='show_banner') THEN
        ALTER TABLE banner_content ADD COLUMN show_banner BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='banner_content' AND column_name='page_meta_description') THEN
        ALTER TABLE banner_content ADD COLUMN page_meta_description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='banner_content' AND column_name='page_og_image') THEN
        ALTER TABLE banner_content ADD COLUMN page_og_image TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='banner_content' AND column_name='page_announcement_text') THEN
        ALTER TABLE banner_content ADD COLUMN page_announcement_text TEXT DEFAULT 'Free Shipping Over $300';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='banner_content' AND column_name='page_announcement_enabled') THEN
        ALTER TABLE banner_content ADD COLUMN page_announcement_enabled BOOLEAN DEFAULT TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='banner_content' AND column_name='page_products') THEN
        ALTER TABLE banner_content ADD COLUMN page_products JSONB DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='banner_content' AND column_name='page_footer_newsletter_title') THEN
        ALTER TABLE banner_content ADD COLUMN page_footer_newsletter_title TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='banner_content' AND column_name='page_footer_newsletter_subtitle') THEN
        ALTER TABLE banner_content ADD COLUMN page_footer_newsletter_subtitle TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='banner_content' AND column_name='page_footer_cta_text') THEN
        ALTER TABLE banner_content ADD COLUMN page_footer_cta_text TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='banner_content' AND column_name='page_footer_copyright') THEN
        ALTER TABLE banner_content ADD COLUMN page_footer_copyright TEXT;
    END IF;
END $$;

-- 3. PRODUCTS TABLE (existing, but showing structure for reference)
-- This table should already exist in your system
-- id, name, slug, description, price, image, category, etc.

-- 4. PAGE_PRODUCTS TABLE (for managing products on pages)
CREATE TABLE IF NOT EXISTS page_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    image TEXT,
    price DECIMAL(10,2) NOT NULL,
    size VARCHAR(20) DEFAULT 'medium' CHECK (size IN ('small', 'medium', 'large')),
    "order" INTEGER NOT NULL DEFAULT 0,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(page_id, product_id)
);

-- 5. INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_pages_path ON pages(path);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_banner_content_page_key ON banner_content(page_key);
CREATE INDEX IF NOT EXISTS idx_page_products_page_id ON page_products(page_id);
CREATE INDEX IF NOT EXISTS idx_page_products_order ON page_products(page_id, "order");
CREATE INDEX IF NOT EXISTS idx_page_products_enabled ON page_products(page_id, enabled);

-- 6. INSERT DEFAULT DATA (with conflict handling)
INSERT INTO pages (id, name, slug, path, content, meta_title, meta_description, status, is_system, is_product_page) VALUES
('00000000-0000-0000-0000-000000000001', 'Home', 'home', '/', '<h1>Home</h1><p>Welcome to FashionSpectrum</p>', 'FashionSpectrum — Luxury Kaftan & Resort Wear', 'Discover handcrafted luxury kaftans, dresses & resort wear', 'published', TRUE, FALSE),
('00000000-0000-0000-0000-000000000002', 'Shop', 'shop', '/shop', '<h1>Shop All</h1><p>Explore our complete collection</p>', 'Shop All - FashionSpectrum', 'Browse our full collection of luxury resort wear', 'published', TRUE, TRUE),
('00000000-0000-0000-0000-000000000003', 'Collections', 'collections', '/collections', '<h1>Collections</h1><p>Curated collections for every occasion</p>', 'Collections - FashionSpectrum', 'Browse curated collections of luxury resort wear', 'published', TRUE, TRUE),
('00000000-0000-0000-0000-000000000004', 'New Arrivals', 'new-arrivals', '/new-arrivals', '<h1>New Arrivals</h1><p>The latest additions to our collection</p>', 'New Arrivals - FashionSpectrum', 'See our latest pieces and new collections', 'published', TRUE, TRUE),
('00000000-0000-0000-0000-000000000005', 'About', 'about', '/about', '<h1>About Us</h1><p>Learn about FashionSpectrum</p>', 'About FashionSpectrum', 'Learn about our brand and story', 'draft', TRUE, FALSE),
('00000000-0000-0000-0000-000000000006', 'Contact', 'contact', '/contact', '<h1>Contact Us</h1><p>Get in touch with us</p>', 'Contact FashionSpectrum', 'Get in touch with our team', 'draft', TRUE, FALSE)
ON CONFLICT (slug) DO NOTHING;

-- 7. INSERT DEFAULT BANNER CONTENT
INSERT INTO banner_content (page_key, page_title, page_subtitle, show_banner, page_announcement_text, page_announcement_enabled, page_footer_newsletter_title, page_footer_newsletter_subtitle, page_footer_cta_text, page_footer_copyright) VALUES
('shop', 'Shop All', 'Explore our complete collection of luxury resort wear', FALSE, 'Free Shipping Over $300', TRUE, 'Join the FashionSpectrum World', 'Subscribe for exclusive access to new collections, special offers & more.', 'Subscribe', '© 2026 FashionSpectrum. All Rights Reserved.'),
('collections', 'Collections', 'Curated collections for every occasion', FALSE, 'Free Shipping Over $300', TRUE, 'Join the FashionSpectrum World', 'Subscribe for exclusive access to new collections, special offers & more.', 'Subscribe', '© 2026 FashionSpectrum. All Rights Reserved.'),
('new-arrivals', 'New Arrivals', 'The latest additions to our collection', FALSE, 'Free Shipping Over $300', TRUE, 'Join the FashionSpectrum World', 'Subscribe for exclusive access to new collections, special offers & more.', 'Subscribe', '© 2026 FashionSpectrum. All Rights Reserved.'),
('sale', 'Summer Sale', 'Limited time offers on select styles', FALSE, 'Free Shipping Over $300', TRUE, 'Join the FashionSpectrum World', 'Subscribe for exclusive access to new collections, special offers & more.', 'Subscribe', '© 2026 FashionSpectrum. All Rights Reserved.'),
('best-sellers', 'Best Sellers', 'Our most loved pieces', FALSE, 'Free Shipping Over $300', TRUE, 'Join the FashionSpectrum World', 'Subscribe for exclusive access to new collections, special offers & more.', 'Subscribe', '© 2026 FashionSpectrum. All Rights Reserved.'),
('about', 'About Us', '', FALSE, 'Free Shipping Over $300', TRUE, 'Join the FashionSpectrum World', 'Subscribe for exclusive access to new collections, special offers & more.', 'Subscribe', '© 2026 FashionSpectrum. All Rights Reserved.'),
('contact', 'Contact Us', '', FALSE, 'Free Shipping Over $300', TRUE, 'Join the FashionSpectrum World', 'Subscribe for exclusive access to new collections, special offers & more.', 'Subscribe', '© 2026 FashionSpectrum. All Rights Reserved.')
ON CONFLICT (page_key) DO NOTHING;

-- 8. CREATE TRIGGERS for updated_at (with conflict handling)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop triggers if they exist, then recreate them
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
DROP TRIGGER IF EXISTS update_banner_content_updated_at ON banner_content;
DROP TRIGGER IF EXISTS update_page_products_updated_at ON page_products;

-- Create triggers
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banner_content_updated_at BEFORE UPDATE ON banner_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_products_updated_at BEFORE UPDATE ON page_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. VIEWS for easy querying

-- View for pages with their content
CREATE OR REPLACE VIEW pages_with_content AS
SELECT 
    p.*,
    bc.page_title,
    bc.page_subtitle,
    bc.page_banner_image,
    bc.show_banner,
    bc.page_meta_description,
    bc.page_og_image,
    bc.page_announcement_text,
    bc.page_announcement_enabled,
    bc.page_products,
    bc.page_footer_newsletter_title,
    bc.page_footer_newsletter_subtitle,
    bc.page_footer_cta_text,
    bc.page_footer_copyright
FROM pages p
LEFT JOIN banner_content bc ON p.path = '/' || bc.page_key OR (p.path = '/' AND bc.page_key = 'home');

-- View for product pages with their managed products
CREATE OR REPLACE VIEW product_pages_with_items AS
SELECT 
    p.*,
    bc.page_title,
    bc.page_subtitle,
    bc.page_banner_image,
    bc.show_banner,
    bc.page_announcement_text,
    bc.page_announcement_enabled,
    bc.page_products,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', pp.id,
                'productId', pp.product_id,
                'name', pp.name,
                'image', pp.image,
                'price', pp.price,
                'size', pp.size,
                'order', pp.order,
                'enabled', pp.enabled
            ) ORDER BY pp.order
        ) FILTER (WHERE pp.id IS NOT NULL),
        '[]'::json
    ) as managed_products
FROM pages p
LEFT JOIN banner_content bc ON p.path = '/' || bc.page_key OR (p.path = '/' AND bc.page_key = 'home')
LEFT JOIN page_products pp ON p.id = pp.page_id
WHERE p.is_product_page = TRUE
GROUP BY p.id, bc.page_title, bc.page_subtitle, bc.page_banner_image, bc.show_banner, bc.page_announcement_text, bc.page_announcement_enabled, bc.page_products;

-- 10. SAMPLE QUERIES for common operations

-- Get all published pages
-- SELECT * FROM pages WHERE status = 'published' ORDER BY name;

-- Get page by path with content
-- SELECT * FROM pages_with_content WHERE path = '/shop';

-- Get product page with managed products
-- SELECT * FROM product_pages_with_items WHERE path = '/shop';

-- Add product to page
-- INSERT INTO page_products (page_id, product_id, name, image, price, size, "order", enabled)
-- VALUES ('page-uuid', 'product-uuid', 'Product Name', 'image-url', 299.99, 'medium', 0, TRUE);

-- Update product order on page
-- UPDATE page_products SET "order" = 1 WHERE id = 'product-item-uuid';

-- Toggle product visibility
-- UPDATE page_products SET enabled = NOT enabled WHERE id = 'product-item-uuid';

-- Update product size
-- UPDATE page_products SET size = 'large' WHERE id = 'product-item-uuid';

-- Remove product from page
-- DELETE FROM page_products WHERE id = 'product-item-uuid';

-- Update page banner settings
-- UPDATE banner_content 
-- SET show_banner = TRUE, page_banner_image = 'new-image-url', page_title = 'New Title'
-- WHERE page_key = 'shop';

-- Update announcement text
-- UPDATE banner_content 
-- SET page_announcement_text = 'New Announcement Text', page_announcement_enabled = TRUE
-- WHERE page_key = 'shop';

-- ========================================
-- IMPLEMENTATION COMPLETE
-- ========================================
-- This provides a complete foundation for:
-- 1. Dynamic page management
-- 2. Product page editing with banner control
-- 3. Product item management (add/remove/reorder/resize)
-- 4. Announcement text editing
-- 5. Footer content management
-- 6. SEO settings
-- 7. Proper data relationships and constraints
