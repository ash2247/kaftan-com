import { supabase } from '@/integrations/supabase/client';

export interface Page {
  id: string;
  name: string;
  slug: string;
  path: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  status: 'draft' | 'published';
  is_system: boolean;
  is_product_page?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageListItem {
  id: string;
  name: string;
  path: string;
  status: 'draft' | 'published';
  updated_at: string;
}

// Mock data for now - will be replaced with real database calls
const mockPages: PageListItem[] = [
  { id: '1', name: 'Home', path: '/', status: 'published', updated_at: 'Feb 27, 2025' },
  { id: '2', name: 'Shop', path: '/shop', status: 'published', updated_at: 'Feb 25, 2025' },
  { id: '3', name: 'Collections', path: '/collections', status: 'published', updated_at: 'Feb 20, 2025' },
  { id: '4', name: 'New Arrivals', path: '/new-arrivals', status: 'published', updated_at: 'Feb 22, 2025' },
  { id: '7', name: 'About', path: '/about', status: 'draft', updated_at: 'Feb 10, 2025' },
  { id: '8', name: 'Contact', path: '/contact', status: 'draft', updated_at: 'Feb 8, 2025' },
];

export const pagesService = {
  // Get all pages (for admin)
  async getAllPages(): Promise<PageListItem[]> {
    try {
      // Get from database
      const { data, error } = await (supabase as any)
        .from('pages')
        .select('id, name, path, status, updated_at')
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Database error:', error);
        return mockPages; // Fallback to mock data
      }
      
      return (data as PageListItem[]) || [];
    } catch (error) {
      console.error('Error fetching pages:', error);
      return mockPages; // Fallback to mock data
    }
  },

  // Get page by ID (for editing)
  async getPageById(id: string): Promise<Page | null> {
    try {
      // Get from database
      const { data, error } = await (supabase as any)
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Database error fetching page:', error);
        // Fallback to mock data
        const mockPage: Page = {
          id,
          name: mockPages.find(p => p.id === id)?.name || 'Unknown Page',
          slug: this.generateSlug(mockPages.find(p => p.id === id)?.name || 'unknown'),
          path: mockPages.find(p => p.id === id)?.path || '/unknown',
          content: '<h1>Page Content</h1><p>This is the default page content.</p>',
          meta_title: `${mockPages.find(p => p.id === id)?.name || 'Page'} - Fashion Spectrum Luxe`,
          meta_description: `Description for ${mockPages.find(p => p.id === id)?.name || 'page'}`,
          status: 'draft',
          is_system: ['1', '2', '3', '4', '5', '6'].includes(id), // First 6 are system pages
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return mockPage;
      }
      
      return data as Page;
    } catch (error) {
      console.error('Error fetching page:', error);
      return null;
    }
  },

  // Get page by path (for frontend)
  async getPageByPath(path: string): Promise<Page | null> {
    try {
      // Try database first
      const { data, error } = await (supabase as any)
        .from('pages')
        .select('*')
        .eq('path', path)
        .eq('status', 'published')
        .single();
      
      if (data) {
        return data;
      }

      if (error) {
        console.error('Database error fetching page by path:', error);
      }
      
      // Fallback to localStorage for dynamic pages
      const localPages = localStorage.getItem('created_pages');
      if (localPages) {
        const pages = JSON.parse(localPages);
        const page = pages.find(p => p.path === path);
        if (page) {
          return page;
        }
      }
      
      // Fallback to mock data
      const page = mockPages.find(p => p.path === path);
      if (!page) return null;
      
      return {
        id: page.id,
        name: page.name,
        slug: this.generateSlug(page.name),
        path: page.path,
        content: `<h1>${page.name}</h1><p>Content for ${page.name} page.</p>`,
        meta_title: `${page.name} - Fashion Spectrum Luxe`,
        meta_description: `Description for ${page.name} page`,
        status: page.status,
        is_system: ['1', '2', '3', '4', '5', '6'].includes(page.id),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Real implementation when database is ready:
      // const { data, error } = await supabase
      //   .from('pages')
      //   .select('*')
      //   .eq('path', path)
      //   .eq('status', 'published')
      //   .single();
      // if (error) throw error;
      // return data;
    } catch (error) {
      console.error('Error fetching page by path:', error);
      return null;
    }
  },

  // Create new page
  async createPage(page: Omit<Page, 'id' | 'created_at' | 'updated_at'>): Promise<Page | null> {
    try {
      // Insert into database
      const { data, error } = await (supabase as any)
        .from('pages')
        .insert({
          ...page,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Database error creating page:', error);
        // Fallback to mock creation
        const newPage: Page = {
          ...page,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Also save to localStorage for persistence
        const existingPages = localStorage.getItem('created_pages');
        const pages = existingPages ? JSON.parse(existingPages) : [];
        pages.push(newPage);
        localStorage.setItem('created_pages', JSON.stringify(pages));
        
        return newPage;
      }
      
      return data as Page;
    } catch (error) {
      console.error('Error creating page:', error);
      // Fallback to mock creation
      const newPage: Page = {
        ...page,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Also save to localStorage for persistence
      const existingPages = localStorage.getItem('created_pages');
      const pages = existingPages ? JSON.parse(existingPages) : [];
      pages.push(newPage);
      localStorage.setItem('created_pages', JSON.stringify(pages));
      
      return newPage;
    }
  },

  // Update page
  async updatePage(id: string, updates: Partial<Omit<Page, 'id' | 'created_at'>>): Promise<Page | null> {
    try {
      // Try to update in database first
      const { data, error } = await (supabase as any)
        .from('pages')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Database error updating page:', error);
        // Fallback to mock update
        const existingPage = await this.getPageById(id);
        if (!existingPage) return null;
        
        const updatedPage: Page = {
          ...existingPage,
          ...updates,
          updated_at: new Date().toISOString(),
        };
        return updatedPage;
      }
      
      return data as Page;
    } catch (error) {
      console.error('Error updating page:', error);
      // Fallback to mock update
      const existingPage = await this.getPageById(id);
      if (!existingPage) return null;
      
      const updatedPage: Page = {
        ...existingPage,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      return updatedPage;
    }
  },

  // Delete page (allow deletion of any page)
  async deletePage(id: string): Promise<boolean> {
    try {
      // Check if page exists
      const page = await this.getPageById(id);
      if (!page) return false;
      
      // Delete from database
      const { error } = await (supabase as any)
        .from('pages')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Database error deleting page:', error);
        // Fallback to mock deletion
        return true;
      }
      
      return true;
      
      // Real implementation when database is ready:
      // const { error } = await supabase
      //   .from('pages')
      //   .delete()
      //   .eq('id', id);
      // if (error) throw error;
      // return true;
    } catch (error) {
      console.error('Error deleting page:', error);
      // Fallback to mock deletion
      return true;
    }
  },

  // Toggle page status
  async togglePageStatus(id: string): Promise<Page | null> {
    try {
      const page = await this.getPageById(id);
      if (!page) return null;
      
      const newStatus = page.status === 'published' ? 'draft' : 'published';
      return await this.updatePage(id, { status: newStatus });
      
      // Real implementation when database is ready:
      // const { data: currentPage } = await supabase
      //   .from('pages')
      //   .select('status')
      //   .eq('id', id)
      //   .single();
      // if (!currentPage) throw new Error('Page not found');
      // const newStatus = currentPage.status === 'published' ? 'draft' : 'published';
      // const { data, error } = await supabase
      //   .from('pages')
      //   .update({
      //     status: newStatus,
      //     updated_at: new Date().toISOString()
      //   })
      //   .eq('id', id)
      //   .select()
      //   .single();
      // if (error) throw error;
      // return data;
    } catch (error) {
      console.error('Error toggling page status:', error);
      return null;
    }
  },

  // Generate slug from name
  generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  },

  // Generate path from name/slug
  generatePath(name: string, slug?: string): string {
    const pageSlug = slug || this.generateSlug(name);
    return pageSlug === 'home' ? '/' : `/${pageSlug}`;
  }
};
