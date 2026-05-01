import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Clock } from "lucide-react";
import ProductCard from "./ProductCard";
import { productService } from "@/lib/productService";
import type { Product as DBProduct } from "@/lib/productService";
import type { Product } from "@/lib/products";

const NewArrivalsSection = () => {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewArrivals();
  }, []);

  const loadNewArrivals = async () => {
    try {
      const data = await productService.getProducts();
      // Get products that are in stock and shuffle them randomly
      const inStockProducts = data.filter(p => p.in_stock);
      
      // Shuffle array randomly using Fisher-Yates algorithm
      const shuffled = [...inStockProducts].sort(() => Math.random() - 0.5);
      
      // Take first 9 from shuffled array
      const newArrivals = shuffled.slice(0, 9);
      
      setProducts(newArrivals);
    } catch (error) {
      console.error('Error loading new arrivals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert DB products to frontend Product format
  const convertToProduct = (p: DBProduct): Product => ({
    id: p.id,
    name: p.name,
    price: p.price,
    original_price: p.original_price || undefined,
    image: p.images?.[0] || "/placeholder.svg",
    badge: undefined,
    category: p.category || "",
    style: undefined,
    color: p.colors?.[0],
  });

  const newArrivalProducts = products.map(convertToProduct);

  return (
    <section className="py-16 md:py-24 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-body text-sm tracking-[0.2em] uppercase text-primary">Just Arrived</span>
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-light text-foreground mb-4">
            New Arrivals
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Be the first to discover our latest additions to the collection
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-secondary rounded-lg mb-4" />
                <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                <div className="h-4 bg-secondary rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5 mb-12">
              {newArrivalProducts.map((product, index) => (
                <div key={product.id}>
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/new-arrivals"
                className="inline-flex items-center gap-2 font-body text-sm tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors duration-300 border-b border-foreground hover:border-primary pb-1"
              >
                <Clock size={16} />
                View All New Arrivals
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NewArrivalsSection;
