import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { pagesService } from "@/lib/pagesService";
import CatalogPage from "@/components/CatalogPage";
import { useCatalogPageContent } from "@/hooks/usePageContent";
import { useProducts } from "@/hooks/useProducts";
import collectionBanner from "@/assets/collection-banner.jpg";

const DynamicPage = () => {
  const { path } = useParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        if (!path) return;
        
        // Convert path parameter to actual path format
        const actualPath = `/${path}`;
        const pageData = await pagesService.getPageByPath(actualPath);
        
        if (pageData) {
          setPage(pageData);
        } else {
          setError("Page not found");
        }
      } catch (err) {
        setError("Failed to load page");
        console.error('Error loading page:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [path]);

  // Load products if this is a product page
  const { data: products = [] } = useProducts(
    page?.is_product_page ? { displayPage: path } : undefined
  );

  // Get CMS content for product pages
  const pageKey = path || "";
  const cmsContent = useCatalogPageContent(pageKey);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-[92px] pb-mobile-nav">
        <AnnouncementBar />
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="font-body text-xl text-muted-foreground">Loading page...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-background pt-[92px] pb-mobile-nav">
        <AnnouncementBar />
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="font-heading text-4xl font-semibold text-foreground mb-4">Page Not Found</h1>
            <p className="font-body text-lg text-muted-foreground">The page you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // For product pages, use CatalogPage component (same layout as Collection 2026)
  if (page.is_product_page) {
    return (
      <CatalogPage
        title={page.name}
        subtitle={page.meta_description || `Explore our ${page.name} collection`}
        products={products}
        bannerImage={collectionBanner}
        cmsContent={cmsContent}
        columns={3}
      />
    );
  }

  // For simple pages, use the basic layout
  return (
    <div className="min-h-screen bg-background pt-[92px] pb-mobile-nav">
      <AnnouncementBar />
      <Navbar />
      
      <div 
        className="container mx-auto px-4 py-16"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
      
      <Footer />
    </div>
  );
};

export default DynamicPage;
