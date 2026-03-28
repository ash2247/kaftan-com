import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Package, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HorizontalFilterBar from "@/components/HorizontalFilterBar";
import type { FilterState } from "@/lib/filterUtils";
import { getFilterOptions, getPriceRange, applyFilters, sortProducts } from "@/lib/filterUtils";
import type { Product as FilterProduct } from "@/lib/products";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: "published" | "draft" | "scheduled";
  featured: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

interface DBProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  images?: string[];
  category: string;
  in_stock: boolean;
}

const CollectionDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("latest");
  const [currentColumns, setCurrentColumns] = useState<3 | 4>(3);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize filters
  const [filters, setFilters] = useState<FilterState>(() => ({
    categories: [],
    priceRange: [0, 1000],
    colors: [],
    sizes: [],
    badges: [],
    inStockOnly: false,
  }));

  const getGridClassesForColumns = (cols: 3 | 4) => {
    if (cols === 3) {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    } else {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    }
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  useEffect(() => {
    const fetchCollection = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch collection
        const { data: collectionData, error: collectionError } = await (supabase as any)
          .from('collections')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (collectionError) throw collectionError;

        setCollection(collectionData);

        // Fetch products in this collection
        const { data: productData, error: productError } = await (supabase as any)
          .from('collection_products')
          .select(`
            products!inner(
              id, name, slug, price, description, images, category, in_stock
            )
          `)
          .eq('collection_id', collectionData.id);

        if (productError) throw productError;

        const productsList = productData?.map((item: any) => item.products) || [];
        setProducts(productsList);

      } catch (err) {
        console.error('Error fetching collection:', err);
        setError('Failed to load collection');
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [slug]);

  // Convert DB products to filter-compatible format
  const convertedProducts: FilterProduct[] = useMemo(() => {
    return products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.images?.[0] || "/placeholder.svg",
      images: p.images || [],
      badge: p.in_stock ? undefined : "Sold out",
      category: p.category,
      in_stock: p.in_stock
    }));
  }, [products]);

  // Update price range when products change
  useEffect(() => {
    if (convertedProducts.length > 0) {
      const priceRange = getPriceRange(convertedProducts);
      setFilters(prev => ({
        ...prev,
        priceRange: [priceRange.min, priceRange.max]
      }));
    }
  }, [convertedProducts]);

  // Apply filters and search
  const filteredProducts = useMemo(() => {
    let result = [...convertedProducts];

    // Apply filters
    result = applyFilters(result, filters);
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.style?.toLowerCase().includes(query) ||
        p.color?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    return sortProducts(result, sortBy);
  }, [convertedProducts, filters, sortBy, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-[92px] pb-mobile-nav">
        <AnnouncementBar />
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="font-heading text-xl text-muted-foreground">Loading collection...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-background pt-[92px] pb-mobile-nav">
        <AnnouncementBar />
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="font-heading text-xl text-destructive">Collection not found</p>
            <Link to="/collections" className="text-primary hover:underline mt-4 inline-block">
              ← Back to Collections
            </Link>
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
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/collections" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Collections
        </Link>

        {/* Collection Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {collection.featured && (
              <span className="inline-block bg-primary text-primary-foreground text-xs font-body uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                Featured Collection
              </span>
            )}
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-4">
              {collection.name}
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              {collection.description || 'Discover this beautiful collection.'}
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground font-body">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Created {new Date(collection.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Package size={14} />
                {products.length} Products
              </span>
            </div>
          </motion.div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Filter Bar */}
        <HorizontalFilterBar
          products={convertedProducts}
          filters={filters}
          onFiltersChange={setFilters}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          filteredCount={filteredProducts.length}
          totalCount={convertedProducts.length}
          columns={currentColumns}
          onColumnsChange={setCurrentColumns}
        />

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-heading text-xl text-muted-foreground">No products found</p>
            <p className="font-body text-muted-foreground mt-2">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className={getGridClassesForColumns(currentColumns) + " gap-6"}>
            {filteredProducts.map((product, index) => {
              // Find the original DB product to get slug and description
              const originalProduct = products.find(p => p.id === product.id);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group"
                >
                  <Link to={`/product/${originalProduct?.slug || product.id}`} className="block">
                    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
                      {/* Product Image */}
                      <div className="relative overflow-hidden aspect-[3/4] bg-secondary">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-muted-foreground/30">
                            <Package size={48} />
                          </div>
                        )}
                      </div>

                      {/* Product Content */}
                      <div className="p-4">
                        <div className="mb-2">
                          <h3 className="font-heading text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="font-body text-sm text-muted-foreground line-clamp-2">
                            {originalProduct?.description || ''}
                          </p>
                        </div>

                        {/* Product Price */}
                        <div className="flex items-center justify-between">
                          <span className="font-heading text-lg font-semibold text-primary">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="text-primary font-medium text-sm uppercase tracking-wider">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CollectionDetail;
