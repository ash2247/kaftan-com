import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { sortProducts } from "@/lib/filterUtils";
import type { Product } from "@/lib/products";

const sortOptions = [
  { label: "Sort by popularity", value: "popular" },
  { label: "Sort by latest", value: "latest" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
];

const BuyClearance = () => {
  const [sortBy, setSortBy] = useState("popular");
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

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  // Apply sorting
  const filtered = useMemo(() => {
    return sortProducts(products, sortBy);
  }, [products, sortBy]);

  const getGridClassesForColumns = (cols: 3 | 4) => {
    if (cols === 3) {
      return "grid grid-cols-2 md:grid-cols-3";
    } else {
      return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  };

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
              No clearance items available at the moment.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BuyClearance;
