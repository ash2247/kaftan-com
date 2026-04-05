-- Simple approach: Add custom pages to existing navigation
-- First check current state
SELECT value::text as current_nav 
FROM site_settings 
WHERE key = 'header_footer_content';

-- Get custom pages with row numbers
WITH numbered_pages AS (
  SELECT 
    id,
    name,
    path,
    ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM pages 
  WHERE status = 'published' 
  AND path NOT IN ('/', '/shop', '/collections', '/contact-us', '/our-story')
)
-- Then add custom pages
UPDATE site_settings 
SET value = jsonb_set(
  value,
  '{header,navItems}',
  COALESCE(
    -- Add custom pages to existing nav items
    value->'header'->'navItems' || (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', p.id::text,
          'label', p.name,
          'to', p.path,
          'order', (p.row_num + 8)::int,
          'enabled', true
        )
      )
      FROM numbered_pages p
    ),
    -- Keep existing nav items if no custom pages
    value->'header'->'navItems'
  )
),
updated_at = NOW()
WHERE key = 'header_footer_content';
