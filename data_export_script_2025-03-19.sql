-- Data Export Script for Kaftan-Com
-- Generated on: 2025-03-19
-- Use this to export all data from Supabase

-- ========================================
-- EXPORT ALL PRODUCTS DATA
-- ========================================
COPY (
    SELECT 
        id::text,
        name,
        description,
        price,
        original_price,
        in_stock,
        category,
        COALESCE(colors, '{}')::text,
        COALESCE(sizes, '{}')::text,
        COALESCE(images, '{}')::text,
        created_at,
        updated_at
    FROM products
    ORDER BY created_at DESC
) TO 'products_export.csv' WITH CSV HEADER;

-- ========================================
-- EXPORT COLLECTIONS DATA
-- ========================================
COPY (
    SELECT 
        id::text,
        name,
        description,
        slug,
        image_url,
        is_active,
        sort_order,
        created_at,
        updated_at
    FROM collections
    ORDER BY sort_order, name
) TO 'collections_export.csv' WITH CSV HEADER;

-- ========================================
-- EXPORT COLLECTION PRODUCTS RELATIONSHIP
-- ========================================
COPY (
    SELECT 
        id::text,
        collection_id::text,
        product_id::text,
        sort_order,
        created_at
    FROM collection_products
    ORDER BY collection_id, sort_order
) TO 'collection_products_export.csv' WITH CSV HEADER;

-- ========================================
-- EXPORT CATEGORIES DATA
-- ========================================
COPY (
    SELECT 
        id::text,
        name,
        slug,
        description,
        image_url,
        sort_order,
        is_active,
        created_at,
        updated_at
    FROM categories
    ORDER BY sort_order, name
) TO 'categories_export.csv' WITH CSV HEADER;

-- ========================================
-- EXPORT ORDERS DATA
-- ========================================
COPY (
    SELECT 
        id::text,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address::text,
        billing_address::text,
        total_amount,
        status,
        payment_status,
        payment_method,
        notes,
        created_at,
        updated_at
    FROM orders
    ORDER BY created_at DESC
) TO 'orders_export.csv' WITH CSV HEADER;

-- ========================================
-- EXPORT ORDER ITEMS DATA
-- ========================================
COPY (
    SELECT 
        id::text,
        order_id::text,
        product_id::text,
        product_name,
        quantity,
        unit_price,
        total_price,
        size,
        color,
        created_at
    FROM order_items
    ORDER BY order_id, created_at
) TO 'order_items_export.csv' WITH CSV HEADER;

-- ========================================
-- EXPORT WISHLIST DATA
-- ========================================
COPY (
    SELECT 
        id::text,
        session_id,
        customer_email,
        product_id::text,
        created_at
    FROM wishlist
    ORDER BY created_at DESC
) TO 'wishlist_export.csv' WITH CSV HEADER;

-- ========================================
-- EXPORT CART DATA
-- ========================================
COPY (
    SELECT 
        id::text,
        session_id,
        customer_email,
        product_id::text,
        quantity,
        size,
        color,
        created_at,
        updated_at
    FROM cart
    ORDER BY created_at DESC
) TO 'cart_export.csv' WITH CSV HEADER;

-- ========================================
-- EXPORT NEWSLETTER SUBSCRIBERS
-- ========================================
COPY (
    SELECT 
        id::text,
        email,
        is_active,
        created_at
    FROM newsletter_subscribers
    ORDER BY created_at DESC
) TO 'newsletter_subscribers_export.csv' WITH CSV HEADER;

-- ========================================
-- STORAGE BACKUP NOTES
-- ========================================

-- Storage buckets need to be backed up separately:
-- 1. Products: Download all product images from Supabase Storage
-- 2. Collections: Download collection banner images
-- 3. Any other user uploads

-- Use Supabase dashboard or CLI to download storage:
-- supabase storage download --bucket products --path ./backup/products/
-- supabase storage download --bucket collections --path ./backup/collections/

-- ========================================
-- ENVIRONMENT VARIABLES BACKUP
-- ========================================

-- Environment variables (save these securely):
-- VITE_SUPABASE_PROJECT_ID="nhwoqzokmujucwxbdtjk"
-- VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_a5vSxsPcDg7IDWyogq7NDA_McD_LkIO"
-- VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5od29xem9rbXVqdWN3eGJkdGprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NTE2MzEsImV4cCI6MjA4OTAyNzYzMX0.EtpNWPoSIPwcgWe_VYtskWIbthQyDivu8xURd9pDvdA"
-- VITE_SUPABASE_URL="https://nhwoqzokmujucwxbdtjk.supabase.co"

-- Cloudinary Configuration:
-- VITE_CLOUDINARY_CLOUD_NAME=dainvbpyo
-- VITE_CLOUDINARY_API_KEY=548957641943123
-- VITE_CLOUDINARY_API_SECRET=0Ejvzrf2UJBartKE_5tvk5rpquY
-- VITE_CLOUDINARY_URL=cloudinary://548957641943123:0Ejvzrf2UJBartKE_5tvk5rpquY@dainvbpyo
