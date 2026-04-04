-- SQL Query to add custom pages to navigation
-- This will insert existing published custom pages into the header_footer navigation

-- First, let's check what custom pages exist
SELECT id, name, path, status FROM pages 
WHERE status = 'published' 
AND path NOT IN ('/', '/shop', '/collections', '/contact-us', '/our-story')
ORDER BY created_at;

-- Update header_footer table with navigation items including custom pages
INSERT INTO header_footer (id, content, created_at, updated_at)
VALUES (
  'navigation',
  '{
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
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW();

-- Dynamic query to add custom pages automatically
WITH custom_pages AS (
  SELECT 
    id,
    name,
    path,
    ROW_NUMBER() OVER (ORDER BY created_at) + 8 as order_num
  FROM pages 
  WHERE status = 'published' 
  AND path NOT IN ('/', '/shop', '/collections', '/contact-us', '/our-story')
),
updated_content AS (
  SELECT jsonb_set(
    jsonb_set(
      content,
      '{header,navItems}',
      COALESCE(
        content->'header'->'navItems',
        '[]'::jsonb
      ) || (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', p.id::text,
            'label', p.name,
            'to', p.path,
            'order', p.order_num,
            'enabled', true
          )
        )
        FROM custom_pages p
      )
    ),
    '{footer,sections,0,items}',
    COALESCE(
      content->'footer'->'sections'->0->'items',
      '[]'::jsonb
    ) || (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', 'f' || (p.order_num + 6)::text,
          'label', p.name,
          'path', p.path,
          'order', p.order_num + 6,
          'enabled', true
        )
      )
      FROM custom_pages p
    )
  ) as new_content
  FROM header_footer WHERE id = 'navigation'
)
UPDATE header_footer 
SET content = new_content, updated_at = NOW()
FROM updated_content
WHERE header_footer.id = 'navigation';
