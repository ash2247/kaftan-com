-- Example: Update just the newsletter settings
UPDATE site_settings 
SET value = jsonb_set(
    jsonb_set(
        jsonb_set(value, '{footer,newsletterTitle}', '"New Newsletter Title"', true),
        '{footer,newsletterSubtitle}', '"New newsletter subtitle text"', true
    ),
    '{footer,ctaText}', '"Subscribe Now"', true
),
updated_at = NOW()
WHERE key = 'header_footer_content';

-- Example: Add a new navigation item
UPDATE site_settings 
SET value = jsonb_set(
    value,
    '{header,navItems}',
    value->'header'->'navItems' || '{
        "id": "new_item",
        "label": "New Page",
        "to": "/new-page",
        "order": 9,
        "enabled": true
    }'::jsonb,
    true
),
updated_at = NOW()
WHERE key = 'header_footer_content';

-- Example: Update social media links
UPDATE site_settings 
SET value = jsonb_set(
    jsonb_set(
        jsonb_set(
            value,
            '{footer,socialLinks,instagram}',
            '"https://instagram.com/yourusername"',
            true
        ),
        '{footer,socialLinks,facebook}',
        '"https://facebook.com/yourpage"',
        true
    ),
    '{footer,socialLinks,twitter}',
    '"https://twitter.com/yourusername"',
    true
),
updated_at = NOW()
WHERE key = 'header_footer_content';

-- Example: Disable a specific navigation item
UPDATE site_settings 
SET value = jsonb_set(
    value,
    '{header,navItems,2,enabled}',
    'false',
    true
),
updated_at = NOW()
WHERE key = 'header_footer_content';

-- Example: Reorder navigation items (swap positions 1 and 2)
UPDATE site_settings 
SET value = jsonb_set(
    value,
    '{header,navItems}',
    jsonb_build_array(
        (value->'header'->'navItems'->1),
        (value->'header'->'navItems'->0),
        (value->'header'->'navItems'->2),
        (value->'header'->'navItems'->3),
        (value->'header'->'navItems'->4),
        (value->'header'->'navItems'->5),
        (value->'header'->'navItems'->6),
        (value->'header'->'navItems'->7)
    ),
    true
),
updated_at = NOW()
WHERE key = 'header_footer_content';

-- Example: Remove a navigation item (by index)
UPDATE site_settings 
SET value = jsonb_set(
    value,
    '{header,navItems}',
    (
        SELECT jsonb_agg(elem) 
        FROM jsonb_array_elements(value->'header'->'navItems') WITH ORDINALITY AS t(elem, ord)
        WHERE t.ord != 3  -- Remove the 3rd item (1-based)
    ),
    true
),
updated_at = NOW()
WHERE key = 'header_footer_content';

-- Example: Update a specific navigation item by ID
UPDATE site_settings 
SET value = jsonb_set(
    value,
    '{header,navItems}',
    (
        SELECT jsonb_agg(
            CASE 
                WHEN elem->>'id' = '2' 
                THEN jsonb_set(elem, '{label}', '"Updated Label"', true)
                ELSE elem
            END
        )
        FROM jsonb_array_elements(value->'header'->'navItems') AS elem
    ),
    true
),
updated_at = NOW()
WHERE key = 'header_footer_content';

-- Example: Add a new footer section
UPDATE site_settings 
SET value = jsonb_set(
    value,
    '{footer,sections}',
    value->'footer'->'sections' || '{
        "id": "new_section",
        "title": "New Section",
        "order": 4,
        "enabled": true,
        "items": [
            {
                "id": "new_item1",
                "label": "New Item 1",
                "path": "/new-item-1",
                "order": 1,
                "enabled": true
            }
        ]
    }'::jsonb,
    true
),
updated_at = NOW()
WHERE key = 'header_footer_content';
