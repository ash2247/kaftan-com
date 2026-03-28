-- Create banner_content table for storing centralized banner data
CREATE TABLE IF NOT EXISTS banner_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  hero_title_line1 TEXT,
  hero_title_line2 TEXT,
  hero_subtitle TEXT,
  hero_cta_text TEXT,
  hero_cta_link TEXT,
  hero_auto_slide BOOLEAN DEFAULT true,
  hero_slide_interval INTEGER DEFAULT 4500,
  announcement_text TEXT,
  announcement_enabled BOOLEAN DEFAULT true,
  collection_banner_subtitle TEXT,
  collection_banner_title TEXT,
  collection_banner_cta_text TEXT,
  collection_banner_cta_link TEXT,
  collection_image TEXT,
  about_title TEXT,
  about_paragraph1 TEXT,
  about_paragraph2 TEXT,
  about_cta_text TEXT,
  about_image TEXT,
  footer_newsletter_title TEXT,
  footer_newsletter_subtitle TEXT,
  footer_cta_text TEXT,
  footer_copyright TEXT,
  sections JSONB DEFAULT '[]'::jsonb,
  hero_slides JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security)
ALTER TABLE banner_content ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read banner content
CREATE POLICY "Authenticated users can view banner content" ON banner_content
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Create policy for authenticated users to insert/update banner content
CREATE POLICY "Authenticated users can manage banner content" ON banner_content
  FOR ALL USING (auth.role() = 'authenticated');

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_banner_content_page_key ON banner_content(page_key);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_banner_content_updated_at 
  BEFORE UPDATE ON banner_content 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
