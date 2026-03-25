import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, Search } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import HorizontalFilterBar from "./HorizontalFilterBar";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { CatalogPageContent } from "@/hooks/usePageContent";
import { useCollectionSettings } from "@/hooks/useCollectionSettings";
import { getActiveFiltersCount, getPriceRange, applyFilters, sortProducts } from "@/lib/filterUtils";
import type { FilterState } from "@/lib/filterUtils";

interface CatalogPageProps {
  title: string;
  subtitle?: string;
  products: Product[];
  bannerImage?: string;
  cmsContent?: CatalogPageContent | null;
  columns?: 3 | 4;
}

type SortOption = "featured" | "price-low" | "price-high" | "name-az" | "name-za" | "collection-order";

const CatalogPage = ({ title, subtitle, products, bannerImage, cmsContent, columns = 4 }: CatalogPageProps) => {
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentColumns, setCurrentColumns] = useState<3 | 4>(columns as 3 | 4);
  const { getGridClasses } = useCollectionSettings();

  const getGridClassesForColumns = (cols: 3 | 4) => {
    if (cols === 3) {
      return "grid grid-cols-2 md:grid-cols-3";
    } else {
      return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  };

  // Initialize filters with price range
  const [filters, setFilters] = useState<FilterState>(() => ({
    categories: [],
    priceRange: [getPriceRange(products).min, getPriceRange(products).max],
    colors: [],
    sizes: [],
    badges: [],
    inStockOnly: false,
  }));

  // Update price range when products change
  useEffect(() => {
    const priceRange = getPriceRange(products);
    setFilters(prev => ({
      ...prev,
      priceRange: [priceRange.min, priceRange.max]
    }));
  }, [products]);

  // Use CMS content if available, otherwise fall back to props
  const displayTitle = cmsContent?.title || title;
  const displaySubtitle = cmsContent?.subtitle || subtitle;
  const displayBanner = cmsContent?.bannerImage || bannerImage;

  const announcementContent = cmsContent ? {
    text: cmsContent.announcementText,
    enabled: cmsContent.announcementEnabled,
  } : undefined;

  const footerContent = cmsContent ? {
    newsletterTitle: cmsContent.footerNewsletterTitle,
    newsletterSubtitle: cmsContent.footerNewsletterSubtitle,
    ctaText: cmsContent.footerCtaText,
    copyright: cmsContent.footerCopyright,
  } : undefined;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return cats.sort();
  }, [products]);

  const filtered = useMemo(() => {
    let filteredProducts = applyFilters(products, filters);
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.style?.toLowerCase().includes(query) ||
        p.color?.toLowerCase().includes(query)
      );
    }
    
    return sortProducts(filteredProducts, sortBy);
  }, [products, filters, sortBy, searchQuery]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy as SortOption);
  };

  return (
    <div className="min-h-screen bg-background pb-mobile-nav">
      <AnnouncementBar content={announcementContent} />
      <Navbar />

      {/* Banner */}
      {displayBanner ? (
        <div className="relative h-[25vh] sm:h-[30vh] md:h-[40vh] overflow-hidden">
          <img src={displayBanner} alt={displayTitle} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-charcoal/40" />
          <div className="relative h-full flex items-center justify-center text-center px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="font-heading text-4xl md:text-6xl text-primary-foreground font-light">{displayTitle}</h1>
              {displaySubtitle && <p className="font-body text-sm text-primary-foreground/70 mt-3 tracking-wide">{displaySubtitle}</p>}
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="py-12 md:py-16 px-6 md:px-16 text-center border-b border-border">
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-4xl md:text-6xl text-foreground font-light">
            {displayTitle}
          </motion.h1>
          {displaySubtitle && <p className="font-body text-sm text-muted-foreground mt-3 tracking-wide">{displaySubtitle}</p>}
        </div>
      )}

      {/* Breadcrumb */}
      <div className="px-6 md:px-16 py-4 border-b border-border">
        <div className="flex items-center gap-2 font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">{displayTitle}</span>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-16 py-8 md:py-12">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2 font-body text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Filter Bar */}
        <HorizontalFilterBar
          products={products}
          filters={filters}
          onFiltersChange={setFilters}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          filteredCount={filtered.length}
          totalCount={products.length}
          columns={currentColumns}
          onColumnsChange={setCurrentColumns}
        />

        {/* Mobile Filters Toggle */}
        <div className="md:hidden mt-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-border px-4 py-2 font-body text-xs tracking-wider uppercase hover:border-primary transition-colors"
          >
            <SlidersHorizontal size={14} />
            Advanced Filters
            {getActiveFiltersCount(filters, products) > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs ml-1">
                {getActiveFiltersCount(filters, products)}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Advanced Filters Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0">
            <ProductFilters
              products={products}
              collections={categories}
              filters={filters}
              onFiltersChange={setFilters}
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
              className="md:sticky md:top-24"
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-heading text-2xl text-foreground mb-2">No products found</p>
                <p className="font-body text-xs text-muted-foreground">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className={getGridClassesForColumns(currentColumns) + " gap-4 md:gap-6"}>
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer content={footerContent} />
    </div>
  );
};

export default CatalogPage;
