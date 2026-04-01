import { useQuery } from "@tanstack/react-query";
import { pagesService } from "@/lib/pagesService";

export const useNavigationPages = () => {
  return useQuery({
    queryKey: ["navigation-pages"],
    queryFn: async () => {
      try {
        const allPages = await pagesService.getAllPages();
        // Filter only published, non-system pages for navigation
        const navigationPages = allPages.filter(page => 
          page.status === 'published' && 
          !['/', '/shop', '/collections', '/contact-us', '/our-story'].includes(page.path)
        );
        return navigationPages;
      } catch (error) {
        console.error('Error fetching navigation pages:', error);
        return [];
      }
    },
  });
};
