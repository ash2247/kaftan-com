import { supabase } from '@/integrations/supabase/client';

export interface BannerContent {
  id?: string;
  page_key: string;
  hero_title_line1?: string;
  hero_title_line2?: string;
  hero_subtitle?: string;
  hero_cta_text?: string;
  hero_cta_link?: string;
  hero_auto_slide?: boolean;
  hero_slide_interval?: number;
  announcement_text?: string;
  announcement_enabled?: boolean;
  collection_banner_subtitle?: string;
  collection_banner_title?: string;
  collection_banner_cta_text?: string;
  collection_banner_cta_link?: string;
  collection_image?: string;
  about_title?: string;
  about_paragraph1?: string;
  about_paragraph2?: string;
  about_cta_text?: string;
  about_image?: string;
  footer_newsletter_title?: string;
  footer_newsletter_subtitle?: string;
  footer_cta_text?: string;
  footer_copyright?: string;
  sections?: any[];
  hero_slides?: any[];
  created_at?: string;
  updated_at?: string;
}

class BannerContentService {
  private tableName = 'banner_content';

  // Get banner content for a specific page
  async getBannerContent(pageKey: string): Promise<BannerContent | null> {
    try {
      console.log('🔍 Fetching banner content for page:', pageKey);
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .eq('page_key', pageKey)
        .single();

      if (error) {
        console.log('❌ Supabase error:', error);
        // If no record exists, return null
        if (error.code === 'PGRST116') {
          console.log('ℹ️ No banner content found for page:', pageKey);
          return null;
        }
        throw error;
      }

      console.log('✅ Banner content fetched successfully:', data);
      return data as BannerContent;
    } catch (error) {
      console.error('❌ Error fetching banner content:', error);
      return null;
    }
  }

  // Save or update banner content
  async saveBannerContent(pageKey: string, content: Omit<BannerContent, 'id' | 'page_key' | 'created_at' | 'updated_at'>): Promise<BannerContent | null> {
    try {
      console.log('💾 Saving banner content for page:', pageKey);
      console.log('📝 Content to save:', content);
      
      // Check if record exists
      const existing = await this.getBannerContent(pageKey);

      if (existing) {
        console.log('🔄 Updating existing banner content');
        // Update existing record
        const { data, error } = await supabase
          .from(this.tableName as any)
          .update({
            ...content,
            updated_at: new Date().toISOString()
          })
          .eq('page_key', pageKey)
          .select()
          .single();

        if (error) {
          console.error('❌ Update error:', error);
          throw error;
        }
        console.log('✅ Banner content updated successfully:', data);
        return data as BannerContent;
      } else {
        console.log('➕ Creating new banner content');
        // Create new record
        const { data, error } = await supabase
          .from(this.tableName as any)
          .insert({
            page_key: pageKey,
            ...content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as any)
          .select()
          .single();

        if (error) {
          console.error('❌ Insert error:', error);
          throw error;
        }
        console.log('✅ Banner content created successfully:', data);
        return data as BannerContent;
      }
    } catch (error) {
      console.error('❌ Error saving banner content:', error);
      return null;
    }
  }

  // Delete banner content for a page
  async deleteBannerContent(pageKey: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(this.tableName as any)
        .delete()
        .eq('page_key', pageKey);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting banner content:', error);
      return false;
    }
  }

  // Get all banner content (for admin)
  async getAllBannerContent(): Promise<BannerContent[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data as BannerContent[]) || [];
    } catch (error) {
      console.error('Error fetching all banner content:', error);
      return [];
    }
  }
}

export const bannerContentService = new BannerContentService();
