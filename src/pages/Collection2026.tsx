import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import HorizontalFilterBar from "@/components/HorizontalFilterBar";
import { SlidersHorizontal, ChevronDown, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/lib/products";
import type { FilterState } from "@/lib/filterUtils";
import { getActiveFiltersCount, getPriceRange, applyFilters, sortProducts } from "@/lib/filterUtils";
import { getAllProducts, slugify } from "@/lib/productUtils";

const sortOptions = [
  { label: "Sort by latest", value: "latest" },
  { label: "Sort by name", value: "name" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
];

const Collection2026 = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentColumns, setCurrentColumns] = useState<3 | 4>(3); // Default to 3 columns for larger images
  // All products are displayed at once (no pagination)

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const getGridClassesForColumns = (cols: 3 | 4) => {
    if (cols === 3) {
      return "grid grid-cols-2 md:grid-cols-3";
    } else {
      return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  };

  // Initialize filters with categories only
  const [filters, setFilters] = useState<FilterState>(() => ({
    categories: [],
    priceRange: [0, 1000],
    colors: [],
    sizes: [],
    badges: [],
    inStockOnly: false,
  }));

  // Update filters when products change (only for price range)
  useEffect(() => {
    if (products.length > 0) {
      const priceRange = getPriceRange(products);
      setFilters(prev => ({
        ...prev,
        priceRange: [priceRange.min, priceRange.max]
      }));
    }
  }, [products]);

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, []);

  // No pagination - all products displayed at once

  const fetchCollections = async () => {
    try {
      // First try to get collections from database
      const { data, error } = await supabase
        .from('collections')
        .select('name')
        .order('name');

      if (error) {
        console.log('Collections table not found, using product categories');
        // Fallback to product categories
        const productCategories = await fetchProductCategories();
        setCollections(productCategories);
      } else if (data && data.length > 0) {
        const collectionNames = data?.map(c => c.name).filter(Boolean) || [];
        console.log('Collections from database:', collectionNames);
        setCollections(collectionNames);
      } else {
        console.log('Collections table empty, using product categories');
        // Fallback to product categories
        const productCategories = await fetchProductCategories();
        setCollections(productCategories);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
      // Fallback to product categories
      const productCategories = await fetchProductCategories();
      setCollections(productCategories);
    }
  };

  const fetchProductCategories = async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null);

      if (error) {
        console.error('Error fetching product categories:', error);
        return [];
      }

      const categories = Array.from(new Set(data?.map(p => p.category).filter(Boolean))) || [];
      console.log('Product categories as fallback:', categories);
      return categories;
    } catch (error) {
      console.error('Error fetching product categories:', error);
      return [];
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .eq('status', 'Active') // Only show active products
        .neq('display_page', 'clearance') // Exclude clearance items
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        // Use sample products as fallback
        const sampleProducts = getAllProducts();
        console.log('Using sample products:', sampleProducts.length);
        setProducts(sampleProducts);
      } else if (data && data.length > 0) {
        const mappedProducts = data?.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          original_price: product.original_price,
          image: product.images?.[0] || '/placeholder.svg',
          images: product.images || [],
          category: product.collection || product.category || 'Uncategorized', // Use collection field primarily
          style: product.description || '',
          color: product.colors?.[0] || '',
          collection: product.collection || '',
          badge: product.featured ? 'New in' : (!product.in_stock ? 'Sold out' : (product.original_price && product.original_price > product.price ? 'Sale' : undefined)) as "New in" | "Sold out" | "Sale" | undefined,
          sort_order: (product as any).sort_order || 999, // Add sort_order field with type assertion
          featured: product.featured || false, // Add featured field
          in_stock: product.in_stock !== false, // Add in_stock field
        })) || [];
        
        setProducts(mappedProducts);
      } else {
        // Use sample products if database is empty
        const sampleProducts = getAllProducts();
        console.log('Database empty, using sample products:', sampleProducts.length);
        setProducts(sampleProducts);
      }
    } catch (error) {
      console.error('Error:', error);
      // Use sample products as fallback
      const sampleProducts = getAllProducts();
      setProducts(sampleProducts);
      toast({
        title: "Using Sample Products",
        description: "Loaded sample products for demonstration",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    console.log('Products:', products);
    console.log('Categories found:', cats);
    return cats.sort();
  }, [products]);

  const filtered = useMemo(() => {
    console.log('=== Filtering Debug ===');
    console.log('Search query:', searchQuery);
    console.log('Filters:', filters);
    console.log('Total products before filtering:', products.length);
    
    console.log('Filtering by collections:', filters.categories);
    console.log('Available products:', products.map(p => ({ 
      id: p.id, 
      name: p.name, 
      category: p.category,
      collection: p.category // This should be the collection field
    })));
    
    let filteredProducts = applyFilters(products, filters);
    console.log('After filterUtils.applyFilters:', filteredProducts.length);
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      console.log('Applying search for query:', query);
      const beforeSearch = filteredProducts.length;
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.style?.toLowerCase().includes(query) ||
        p.color?.toLowerCase().includes(query)
      );
      console.log(`Search filtered ${beforeSearch} to ${filteredProducts.length} products`);
    }
    
    const finalResult = sortProducts(filteredProducts, sortBy);
    console.log('Final result after sorting:', finalResult.length);
    console.log('=== End Filtering Debug ===');
    
    return finalResult;
  }, [products, filters, sortBy, searchQuery]);

  // Display all filtered products at once
  const displayedProducts = useMemo(() => {
    return filtered;
  }, [filtered]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-[92px] pb-mobile-nav">
        <AnnouncementBar content={{ text: "2026 Collection - Coming Soon!", enabled: true }} />
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="font-body text-muted-foreground">Loading 2026 Collection...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-[92px] pb-mobile-nav">
      <AnnouncementBar content={{ text: "2026 Collection - Discover the Latest Trends!", enabled: true }} />
      <Navbar />

      {/* Header */}
      <div className="py-12 md:py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl md:text-5xl text-foreground"
        >
          2026 Collection
        </motion.h1>
        <p className="font-body text-sm text-muted-foreground mt-3 tracking-wide">
          {filtered.length} Products
        </p>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 sm:px-6 mb-8">
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                console.log('Search input changed:', e.target.value);
                setSearchQuery(e.target.value);
              }}
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
      <div className="container mx-auto px-4 sm:px-6 mb-6">
        <div className="md:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 font-body text-sm tracking-wide text-foreground hover:text-primary transition-colors"
          >
            <SlidersHorizontal size={16} />
            Advanced Filters
            {getActiveFiltersCount(filters, products) > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs ml-1">
                {getActiveFiltersCount(filters, products)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="flex gap-8 mt-6">
        <div className="w-full md:w-80 flex-shrink-0">
          <ProductFilters
            products={products}
            collections={collections}
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
            className="md:sticky md:top-24"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 pb-12">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">
              No products found. Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <>
            <div className={getGridClassesForColumns(currentColumns) + " gap-4 md:gap-6"}>
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer"
                >
                  <Link to={`/product/${slugify(product.name)}`}>
                    <div className="relative overflow-hidden bg-secondary">
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto object-contain"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        loading="eager"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      {product.badge && (
                        <motion.span
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          className={`absolute top-3 left-3 font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 ${
                            product.badge === "Sold out"
                              ? "bg-charcoal text-primary-foreground"
                              : product.badge === "Sale"
                              ? "bg-red-600 text-white"
                              : "text-foreground"
                          }`}
                        >
                          {product.badge}
                        </motion.span>
                      )}
                    </div>
                  </Link>

                  <div className="pt-4 space-y-3">
                    {/* Product Details */}
                    <div className="space-y-2">
                      <h3 className="font-heading text-sm font-light text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                        {product.name}
                      </h3>
                      
                      {/* Style */}
                      {product.style && (
                        <div className="flex items-center gap-2">
                          <span className="font-body text-[10px] text-muted-foreground/60 uppercase tracking-wide">
                            Style:
                          </span>
                          <span className="font-body text-[10px] text-foreground/80">
                            {product.style}
                          </span>
                        </div>
                      )}

                      {/* Colour */}
                      {product.color && (
                        <div className="flex items-center gap-2">
                          <span className="font-body text-[10px] text-muted-foreground/60 uppercase tracking-wide">
                            Colour:
                          </span>
                          <span className="font-body text-[10px] text-foreground/80">
                            {product.color}
                          </span>
                        </div>
                      )}

                      {/* Size */}
                      {product.size && (
                        <div className="flex items-center gap-2">
                          <span className="font-body text-[10px] text-muted-foreground/60 uppercase tracking-wide">
                            Size:
                          </span>
                          <span className="font-body text-[10px] text-foreground/80">
                            {product.size}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price Display - Only show if price is valid */}
                    {(product.price != null && product.price !== undefined && product.price > 0) && (
                      <div className="flex items-center gap-3 mt-1">
                        {product.original_price && product.original_price > product.price ? (
                          <>
                            {/* Compare Price (strikethrough) */}
                            <span className="font-body text-xs text-muted-foreground/70 line-through">
                              ${product.original_price.toFixed(2)}
                            </span>
                            {/* Sale Price */}
                            <span className="font-heading text-base font-light text-foreground">
                              ${product.price.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          /* Regular Price (no discount) */
                          <span className="font-heading text-base font-light text-foreground">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* All products are displayed at once */}
            {filtered.length > 0 && !loading && (
              <div className="text-center mt-8 py-4">
                <p className="text-muted-foreground">
                  Showing all {filtered.length} products
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Collection2026;
