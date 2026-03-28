import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import HorizontalFilterBar from "@/components/HorizontalFilterBar";
import type { FilterState } from "@/lib/filterUtils";
import { getFilterOptions, getPriceRange, applyFilters, sortProducts } from "@/lib/filterUtils";
import type { Product } from "@/lib/products";

const sortOptions = [
  { label: "Sort by popularity", value: "popular" },
  { label: "Sort by latest", value: "latest" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
];

const BuyClearance = () => {
  const [sortBy, setSortBy] = useState("popular");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentColumns, setCurrentColumns] = useState<3 | 4>(3);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Clearance products from database
  useEffect(() => {
    const fetchClearanceProducts = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching Clearance products...');
        // @ts-ignore - Suppress TypeScript error for complex Supabase query
        const result = await supabase
          .from('products')
          .select('*')
          .eq('in_stock', true)
          .not('original_price', 'is', null)
          .gt('original_price', 0)
          .eq('display_page', 'clearance')
          .order('created_at', { ascending: false });
        
        const { data, error } = result as any;

        console.log('📊 Clearance products data:', data);
        console.log('❌ Clearance products error:', error);
        console.log(`✅ Found ${data?.length || 0} Clearance products`);

        if (error) {
          console.error('Error fetching clearance products:', error);
          toast({
            title: "Error",
            description: "Failed to load clearance products",
            variant: "destructive"
          });
        } else {
          // Map database products to Product interface
          const mappedProducts = (data || []).map((p: any) => ({
            ...p,
            image: p.images?.[0] || "/placeholder.svg",
            size: p.size || undefined,
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load clearance products",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClearanceProducts();
  }, []);

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
      return "grid grid-cols-2 md:grid-cols-3";
    } else {
      return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...cats.sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let items = [...products];

    // Apply new filter system
    items = applyFilters(items, filters);
    
    // Apply legacy category filter for backward compatibility
    if (selectedCategory !== "All") {
      items = items.filter((p) => p.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      items = items.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.style?.toLowerCase().includes(query) ||
        p.color?.toLowerCase().includes(query)
      );
    }

    // Apply sorting using the new sort system
    return sortProducts(items, sortBy);
  }, [products, filters, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background pt-[92px] pb-mobile-nav">
      <AnnouncementBar content={{ text: "🔥 Hot Clearance Deals - Limited Time Offers!", enabled: true }} />
      <Navbar />

      {/* Header */}
      <div className="py-12 md:py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl md:text-5xl text-foreground"
        >
          Clearance Sale
        </motion.h1>
        <p className="font-body text-sm text-muted-foreground mt-3 tracking-wide">
          {filtered.length} Clearance Items Available
        </p>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 sm:px-6 mb-8">
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clearance items..."
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
      </div>

      {/* Horizontal Filter Bar */}
      <div className="container mx-auto px-4 sm:px-6 mb-8">
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
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 pb-16">
        <div className={getGridClassesForColumns(currentColumns) + " gap-4 md:gap-6"}>
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground">
              {searchQuery || selectedCategory !== "All" || filters.categories.length > 0
                ? "No clearance items found matching your filters."
                : "No clearance items available at the moment."}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BuyClearance;
