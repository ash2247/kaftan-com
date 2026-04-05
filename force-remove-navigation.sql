-- Check current navigation content to see what's still there
SELECT value::text as navigation_content
FROM site_settings 
WHERE key = 'header_footer_content';

-- Check what pages exist
SELECT id, name, path, status 
FROM pages 
WHERE status = 'published' 
ORDER BY created_at;

-- Force remove specific page from navigation (replace with actual page path)
-- Example: If you deleted '/my-custom-page', run:
UPDATE site_settings 
SET value = jsonb_set(
  value,
  '{header,navItems}',
  COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', nav_item->>'id',
          'label', nav_item->>'label',
          'to', nav_item->>'to',
          'order', nav_item->>'order',
          'enabled', nav_item->>'enabled'
        )
      )
      FROM jsonb_array_elements(value->'header'->'navItems') as nav_item
      WHERE nav_item->>'to' != '/my-custom-page'  -- Replace with deleted page path
    ),
    '[]'::jsonb
  )
),
updated_at = NOW()
WHERE key = 'header_footer_content';

-- Alternative: Complete navigation reset (if above doesn't work)
UPDATE site_settings 
SET value = '{
  "header": {
    "navItems": [
      {"id": "1", "label": "Home", "to": "/", "order": 1, "enabled": true},
      {"id": "2", "label": "2026 Collection", "to": "/collection-2026", "order": 2, "enabled": true},
      {"id": "3", "label": "Safari Collection", "to": "/safari-collection", "order": 3, "enabled": true},
      {"id": "4", "label": "Paradise Collection", "to": "/paradise-collection", "order": 4, "enabled": true},
      {"id": "5", "label": "Clearance", "to": "/clearance", "order": 5, "enabled": true},
      {"id": "6", "label": "Where to Buy", "to": "/shop", "order": 6, "enabled": true},
      {"id": "7", "label": "Contact Us", "to": "/contact-us", "order": 7, "enabled": true},
      {"id": "8", "label": "Our Story", "to": "/our-story", "order": 8, "enabled": true}
    ],
    "whereToBuyLinks": [
      {"id": "wtb1", "label": "Ambia collections", "url": "https://www.ambia.com.au/", "isExternal": true, "order": 1, "enabled": true},
      {"id": "wtb2", "label": "Pizzaz boutique", "url": "https://pizazzboutique.com.au/", "isExternal": true, "order": 2, "enabled": true}
    ]
  },
  "footer": {
    "sections": [
      {
        "id": "menu",
        "title": "Menu",
        "order": 1,
        "enabled": true,
        "items": [
          {"id": "f1", "label": "Home", "path": "/", "order": 1, "enabled": true},
          {"id": "f2", "label": "Safari Collection", "path": "/safari-collection", "order": 2, "enabled": true},
          {"id": "f3", "label": "Paradise Collection", "path": "/paradise-collection", "order": 3, "enabled": true},
          {"id": "f4", "label": "Where to Buy", "path": "/clearance", "order": 4, "enabled": true},
          {"id": "f5", "label": "Contact Us", "path": "/contact-us", "order": 5, "enabled": true},
          {"id": "f6", "label": "Our Story", "path": "/our-story", "order": 6, "enabled": true}
        ]
      }
    ],
    "newsletterTitle": "",
    "newsletterSubtitle": "",
    "ctaText": "",
    "copyright": "",
    "socialLinks": {
      "instagram": "",
      "facebook": "",
      "twitter": ""
    }
  }
}'::jsonb,
updated_at = NOW()
WHERE key = 'header_footer_content';

-- Then add back current published pages (excluding the deleted one)
WITH numbered_pages AS (
  SELECT 
    id,
    name,
    path,
    ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM pages 
  WHERE status = 'published' 
  AND path NOT IN ('/', '/shop', '/collections', '/contact-us', '/our-story', '/my-custom-page')  -- Exclude deleted page
)
UPDATE site_settings 
SET value = jsonb_set(
  value,
  '{header,navItems}',
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', p.id::text,
        'label', p.name,
        'to', p.path,
        'order', p.row_num + 8,
        'enabled', true
      )
    )
    FROM numbered_pages p
  )
),
updated_at = NOW()
WHERE key = 'header_footer_content';
