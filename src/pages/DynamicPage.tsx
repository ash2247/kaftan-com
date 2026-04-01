import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { pagesService } from "@/lib/pagesService";
import { useProducts } from "@/hooks/useProducts";

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
          
          // If it's a product page, load products
          if (pageData.is_product_page) {
            // Products will be loaded by the useProducts hook
          }
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

  return (
    <div className="min-h-screen bg-background pt-[92px] pb-mobile-nav">
      <AnnouncementBar />
      <Navbar />
      
      {page.is_product_page ? (
        /* Product Page Layout */
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-4">
              {page.name}
            </h1>
            <div 
              className="font-body text-lg text-muted-foreground max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: page.content.replace(/<h1>.*?<\/h1>/, '').replace(/<p>.*?<\/p>/, '') }}
            />
          </div>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-body text-lg font-semibold text-foreground mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-body text-lg text-primary">${product.price}</span>
                      {product.badge && (
                        <span className="font-body text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-body text-lg text-muted-foreground">No products found in this collection.</p>
            </div>
          )}
        </div>
      ) : (
        /* Simple Page Layout */
        <div 
          className="container mx-auto px-4 py-16"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default DynamicPage;
