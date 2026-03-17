import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Product2026 {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  images?: string[];
  category: string;
  color?: string;
  in_stock: boolean;
  sku?: string;
  created_at: string;
}

const sortOptions = [
  { label: "Sort by latest", value: "latest" },
  { label: "Sort by name", value: "name" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
];

const Collection2026 = () => {
  const [products, setProducts] = useState<Product2026[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("latest");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } else {
        const mappedProducts = data?.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          original_price: product.original_price,
          image: product.images?.[0] || '/placeholder.svg',
          images: product.images || [],
          category: product.category || '',
          color: product.colors?.[0] || '',
          in_stock: product.in_stock || false,
          sku: product.sku || '',
          created_at: product.created_at || ''
        })) || [];
        
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return ["All", ...cats.sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let items = selectedCategory === "All"
      ? [...products]
      : products.filter((p) => p.category === selectedCategory);

    switch (sortBy) {
      case "price-asc":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items.sort((a, b) => b.price - a.price);
        break;
      case "name":
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "latest":
      default:
        items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
    return items;
  }, [sortBy, selectedCategory, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-mobile-nav">
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
    <div className="min-h-screen bg-background pb-mobile-nav">
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

      {/* Toolbar */}
      <div className="container mx-auto px-4 sm:px-6 mb-8">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 font-body text-sm tracking-wide text-foreground hover:text-primary transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none font-body text-sm tracking-wide text-foreground bg-background border border-border rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" size={16} />
          </div>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4"
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-body text-sm tracking-wide transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 pb-12">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">
              {selectedCategory === "All" 
                ? "No products found in the 2026 Collection." 
                : `No products found in ${selectedCategory} category.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Collection2026;
