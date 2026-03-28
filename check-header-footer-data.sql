-- Check if site_settings table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'site_settings'
) AS table_exists;

-- Check if header_footer_content data exists
SELECT key, 
       CASE 
         WHEN value IS NOT NULL THEN 'Data exists'
         ELSE 'No data'
       END as data_status
FROM site_settings 
WHERE key = 'header_footer_content';

-- Show current header footer content (if exists)
SELECT value->'header'->'navItems' as nav_items,
       value->'header'->'whereToBuyLinks' as where_to_buy_links,
       value->'footer'->'sections' as footer_sections,
       value->'footer'->'newsletterTitle' as newsletter_title
FROM site_settings 
WHERE key = 'header_footer_content';

-- Count navigation items
SELECT jsonb_array_length(value->'header'->'navItems') as nav_items_count,
       jsonb_array_length(value->'header'->'whereToBuyLinks') as where_to_buy_count,
       jsonb_array_length(value->'footer'->'sections') as footer_sections_count
FROM site_settings 
WHERE key = 'header_footer_content';

-- Alternative count using json_array_length function
SELECT 
       CASE 
         WHEN jsonb_typeof(value->'header'->'navItems') = 'array' 
         THEN jsonb_array_length(value->'header'->'navItems')
         ELSE 0
       END as nav_items_count,
       CASE 
         WHEN jsonb_typeof(value->'header'->'whereToBuyLinks') = 'array' 
         THEN jsonb_array_length(value->'header'->'whereToBuyLinks')
         ELSE 0
       END as where_to_buy_count,
       CASE 
         WHEN jsonb_typeof(value->'footer'->'sections') = 'array' 
         THEN jsonb_array_length(value->'footer'->'sections')
         ELSE 0
       END as footer_sections_count
FROM site_settings 
WHERE key = 'header_footer_content';
