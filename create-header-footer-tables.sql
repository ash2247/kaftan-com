-- Create site_settings table for storing header/footer content
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- Insert default header footer content
INSERT INTO site_settings (key, value) VALUES 
(
  'header_footer_content',
  '{
    "header": {
      "navItems": [
        {
          "id": "1",
          "label": "Home",
          "to": "/",
          "order": 1,
          "enabled": true
        },
        {
          "id": "2",
          "label": "2026 Collection",
          "to": "/collection-2026",
          "order": 2,
          "enabled": true
        },
        {
          "id": "3",
          "label": "Safari Collection",
          "to": "/safari-collection",
          "order": 3,
          "enabled": true
        },
        {
          "id": "4",
          "label": "Paradise Collection",
          "to": "/paradise-collection",
          "order": 4,
          "enabled": true
        },
        {
          "id": "5",
          "label": "Clearance",
          "to": "/clearance",
          "order": 5,
          "enabled": true
        },
        {
          "id": "6",
          "label": "Where to Buy",
          "to": "/shop",
          "order": 6,
          "enabled": true
        },
        {
          "id": "7",
          "label": "Contact Us",
          "to": "/contact-us",
          "order": 7,
          "enabled": true
        },
        {
          "id": "8",
          "label": "Our Story",
          "to": "/our-story",
          "order": 8,
          "enabled": true
        }
      ],
      "whereToBuyLinks": [
        {
          "id": "wtb1",
          "label": "Ambia collections",
          "url": "https://www.ambia.com.au/",
          "isExternal": true,
          "order": 1,
          "enabled": true
        },
        {
          "id": "wtb2",
          "label": "Pizzaz boutique",
          "url": "https://pizazzboutique.com.au/",
          "isExternal": true,
          "order": 2,
          "enabled": true
        }
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
            {
              "id": "f1",
              "label": "Home",
              "path": "/",
              "order": 1,
              "enabled": true
            },
            {
              "id": "f2",
              "label": "Safari Collection",
              "path": "/safari-collection",
              "order": 2,
              "enabled": true
            },
            {
              "id": "f3",
              "label": "Paradise Collection",
              "path": "/paradise-collection",
              "order": 3,
              "enabled": true
            },
            {
              "id": "f4",
              "label": "Where to Buy",
              "path": "/clearance",
              "order": 4,
              "enabled": true
            },
            {
              "id": "f5",
              "label": "Contact Us",
              "path": "/contact-us",
              "order": 5,
              "enabled": true
            },
            {
              "id": "f6",
              "label": "Our Story",
              "path": "/our-story",
              "order": 6,
              "enabled": true
            }
          ]
        },
        {
          "id": "know-us",
          "title": "Know Us",
          "order": 2,
          "enabled": true,
          "items": [
            {
              "id": "f7",
              "label": "About Us",
              "path": "/our-story",
              "order": 1,
              "enabled": true
            },
            {
              "id": "f8",
              "label": "Contact",
              "path": "/contact-us",
              "order": 2,
              "enabled": true
            },
            {
              "id": "f9",
              "label": "Sizing Guide",
              "path": "#",
              "order": 3,
              "enabled": true
            },
            {
              "id": "f10",
              "label": "Boutique Locations",
              "path": "#",
              "order": 4,
              "enabled": true
            }
          ]
        },
        {
          "id": "policies",
          "title": "Policies",
          "order": 3,
          "enabled": true,
          "items": [
            {
              "id": "f11",
              "label": "Privacy Policy",
              "path": "#",
              "order": 1,
              "enabled": true
            },
            {
              "id": "f12",
              "label": "Shipping",
              "path": "#",
              "order": 2,
              "enabled": true
            },
            {
              "id": "f13",
              "label": "Returns",
              "path": "#",
              "order": 3,
              "enabled": true
            },
            {
              "id": "f14",
              "label": "Terms & Conditions",
              "path": "#",
              "order": 4,
              "enabled": true
            }
          ]
        }
      ],
      "newsletterTitle": "Join the FashionSpectrum World",
      "newsletterSubtitle": "Subscribe for exclusive access to new collections, special offers & more.",
      "ctaText": "Subscribe",
      "copyright": "© 2026 FashionSpectrum. All Rights Reserved.",
      "socialLinks": {
        "instagram": "#",
        "facebook": "#",
        "twitter": "#"
      }
    }
  }'
) ON CONFLICT (key) DO NOTHING;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_settings_updated_at 
    BEFORE UPDATE ON site_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
