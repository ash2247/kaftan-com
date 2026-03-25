import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { safariProducts } from "@/lib/safariProducts";
import { SlidersHorizontal, ChevronDown, Search, X } from "lucide-react";
import { useCollectionSettings } from "@/hooks/useCollectionSettings";

const sortOptions = [
  { label: "Sort by popularity", value: "popular" },
  { label: "Sort by latest", value: "latest" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
];

const SafariCollection = () => {
  const [sortBy, setSortBy] = useState("popular");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getGridClasses } = useCollectionSettings();

  const categories = useMemo(() => {
    const cats = Array.from(new Set(safariProducts.map((p) => p.category)));
    return ["All", ...cats.sort()];
  }, []);

  const filtered = useMemo(() => {
    let items = selectedCategory === "All"
      ? [...safariProducts]
      : safariProducts.filter((p) => p.category === selectedCategory);

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

    switch (sortBy) {
      case "price-asc":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items.sort((a, b) => b.price - a.price);
        break;
      case "latest":
        items.reverse();
        break;
      default:
        break;
    }
    return items;
  }, [sortBy, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background pb-mobile-nav">
      <AnnouncementBar content={{ text: "Launched New Safari Collection!", enabled: true }} />
      <Navbar />

      {/* Header */}
      <div className="py-12 md:py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl md:text-5xl text-foreground"
        >
          Safari Collection
        </motion.h1>
        <p className="font-body text-sm text-muted-foreground mt-3 tracking-wide">
          {filtered.length} Products
        </p>
      </div>

      {/* Toolbar */}
      <div className="container mx-auto px-4 sm:px-6 mb-8">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 font-body text-sm tracking-wide text-foreground hover:text-primary transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
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

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-transparent font-body text-sm tracking-wide text-foreground pr-6 cursor-pointer focus:outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden py-4 flex flex-wrap gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-body text-xs tracking-wider border transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:border-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 sm:px-6 pb-16">
        <div className={getGridClasses() + " gap-4 md:gap-6"}>
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
            <p className="font-body text-muted-foreground">No products found. Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SafariCollection;
