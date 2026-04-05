-- Check what custom pages exist
SELECT id, name, path, status 
FROM pages 
WHERE status = 'published' 
AND path NOT IN ('/', '/shop', '/collections', '/contact-us', '/our-story')
ORDER BY created_at;

-- Add current published custom pages to navigation
UPDATE site_settings 
SET value = jsonb_set(
  value,
  '{header,navItems}',
  value->'header'->'navItems' || (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', p.id::text,
        'label', p.name,
        'to', p.path,
        'order', ROW_NUMBER() OVER (ORDER BY p.created_at) + 8,
        'enabled', true
      )
    )
    FROM pages p
    WHERE p.status = 'published' 
    AND p.path NOT IN ('/', '/shop', '/collections', '/contact-us', '/our-story')
    AND NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements(value->'header'->'navItems') as nav_item
      WHERE nav_item->>'to' = p.path
    )
  )
),
updated_at = NOW()
WHERE key = 'header_footer_content';
