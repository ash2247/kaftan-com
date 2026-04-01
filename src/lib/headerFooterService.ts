import { supabase } from "@/integrations/supabase/client";

export interface NavItem {
  id: string;
  label: string;
  to?: string;
  url?: string;
  isExternal?: boolean;
  order: number;
  enabled: boolean;
}

export interface FooterSection {
  id: string;
  title: string;
  items: FooterItem[];
  order: number;
  enabled: boolean;
}

export interface FooterItem {
  id: string;
  label: string;
  path: string;
  order: number;
  enabled: boolean;
}

export interface HeaderFooterContent {
  header: {
    navItems: NavItem[];
    whereToBuyLinks: NavItem[];
  };
  footer: {
    sections: FooterSection[];
    newsletterTitle: string;
    newsletterSubtitle: string;
    ctaText: string;
    copyright: string;
    socialLinks: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
}

const defaultHeaderFooterContent: HeaderFooterContent = {
  header: {
    navItems: [
      { id: "1", label: "Home", to: "/", order: 1, enabled: true },
      { id: "2", label: "2026 Collection", to: "/collection-2026", order: 2, enabled: true },
      { id: "3", label: "Safari Collection", to: "/safari-collection", order: 3, enabled: true },
      { id: "4", label: "Paradise Collection", to: "/paradise-collection", order: 4, enabled: true },
      { id: "5", label: "Clearance", to: "/clearance", order: 5, enabled: true },
      { id: "6", label: "Where to Buy", to: "/shop", order: 6, enabled: true },
      { id: "7", label: "Contact Us", to: "/contact-us", order: 7, enabled: true },
      { id: "8", label: "Our Story", to: "/our-story", order: 8, enabled: true },
    ],
    whereToBuyLinks: [
      { id: "wtb1", label: "Ambia collections", url: "https://www.ambia.com.au/", isExternal: true, order: 1, enabled: true },
      { id: "wtb2", label: "Pizzaz boutique", url: "https://pizazzboutique.com.au/", isExternal: true, order: 2, enabled: true },
    ],
  },
  footer: {
    sections: [
      {
        id: "menu",
        title: "Menu",
        order: 1,
        enabled: true,
        items: [
          { id: "f1", label: "Home", path: "/", order: 1, enabled: true },
          { id: "f2", label: "Safari Collection", path: "/safari-collection", order: 2, enabled: true },
          { id: "f3", label: "Paradise Collection", path: "/paradise-collection", order: 3, enabled: true },
          { id: "f4", label: "Where to Buy", path: "/clearance", order: 4, enabled: true },
          { id: "f5", label: "Contact Us", path: "/contact-us", order: 5, enabled: true },
          { id: "f6", label: "Our Story", path: "/our-story", order: 6, enabled: true },
        ],
      },
      {
        id: "know-us",
        title: "Know Us",
        order: 2,
        enabled: true,
        items: [
          { id: "f7", label: "About Us", path: "/our-story", order: 1, enabled: true },
          { id: "f8", label: "Contact", path: "/contact-us", order: 2, enabled: true },
          { id: "f9", label: "Sizing Guide", path: "#", order: 3, enabled: true },
          { id: "f10", label: "Boutique Locations", path: "#", order: 4, enabled: true },
        ],
      },
      {
        id: "policies",
        title: "Policies",
        order: 3,
        enabled: true,
        items: [
          { id: "f11", label: "Privacy Policy", path: "#", order: 1, enabled: true },
          { id: "f12", label: "Shipping", path: "#", order: 2, enabled: true },
          { id: "f13", label: "Returns", path: "#", order: 3, enabled: true },
          { id: "f14", label: "Terms & Conditions", path: "#", order: 4, enabled: true },
        ],
      },
    ],
    newsletterTitle: "Join the FashionSpectrum World",
    newsletterSubtitle: "Subscribe for exclusive access to new collections, special offers & more.",
    ctaText: "Subscribe",
    copyright: "© 2026 FashionSpectrum. All Rights Reserved.",
    socialLinks: {
      instagram: "#",
      facebook: "#",
      twitter: "#",
    },
  },
};

class HeaderFooterService {
  async getHeaderFooterContent(): Promise<HeaderFooterContent> {
    try {
      const { data, error } = await (supabase as any)
        .from('site_settings')
        .select('value')
        .eq('key', 'header_footer_content')
        .single();

      if (error) {
        console.error('Error fetching header footer content:', error);
        // Fallback to localStorage
        const localContent = localStorage.getItem('header_footer_content');
        if (localContent) {
          return JSON.parse(localContent);
        }
        return defaultHeaderFooterContent;
      }

      if (data?.value) {
        return data.value;
      }

      // If no data exists, try to save default content
      const saveResult = await this.saveHeaderFooterContent(defaultHeaderFooterContent);
      if (saveResult) {
        return defaultHeaderFooterContent;
      }

      return defaultHeaderFooterContent;
    } catch (error) {
      console.error('Error fetching header footer content:', error);
      // Fallback to localStorage
      const localContent = localStorage.getItem('header_footer_content');
      if (localContent) {
        return JSON.parse(localContent);
      }
      return defaultHeaderFooterContent;
    }
  }

  async saveHeaderFooterContent(content: HeaderFooterContent): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('site_settings')
        .upsert({
          key: 'header_footer_content',
          value: content,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'key'
        });

      if (error) {
        console.error('Error saving header footer content:', error);
        // Fallback to localStorage if database fails
        localStorage.setItem('header_footer_content', JSON.stringify(content));
        return true;
      }

      return true;
    } catch (error) {
      console.error('Error saving header footer content:', error);
      // Fallback to localStorage if database fails
      localStorage.setItem('header_footer_content', JSON.stringify(content));
      return true;
    }
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  reorderItems<T extends { order: number }>(items: T[], fromIndex: number, toIndex: number): T[] {
    const result = Array.from(items);
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);

    return result.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
  }
}

export const headerFooterService = new HeaderFooterService();
export default headerFooterService;
