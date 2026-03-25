import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product } from "@/lib/products";
import type { FilterState } from "@/lib/filterUtils";

interface ProductFiltersProps {
  products: Product[];
  collections: string[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const ProductFilters = ({ 
  products, 
  collections,
  filters, 
  onFiltersChange, 
  isOpen, 
  onToggle,
  className = ""
}: ProductFiltersProps) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const clearAllFilters = () => {
    onFiltersChange({ ...filters, categories: [] });
  };

  const getActiveFiltersCount = () => {
    return filters.categories.length > 0 ? 1 : 0;
  };

  return (
    <div className={`${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button
          onClick={onToggle}
          variant="outline"
          className="w-full justify-between"
        >
          <span>Filters</span>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {getActiveFiltersCount()}
              </span>
            )}
          </div>
        </Button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeInOut",
              height: { duration: 0.4, ease: "easeInOut" }
            }}
            className="md:block"
          >
            <div className="bg-card border border-border rounded-lg p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-lg font-semibold">Collection Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="md:hidden"
                >
                  <X size={16} />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Collection Filters Only */}
                <div className="border-b border-border pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-semibold">Categories</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="h-8 w-8 p-0"
                    >
                      <motion.div
                        animate={{ rotate: isCategoryOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </Button>
                  </div>
                  <AnimatePresence>
                    {isCategoryOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ 
                          duration: 0.3, 
                          ease: "easeInOut",
                          height: { duration: 0.3, ease: "easeInOut" }
                        }}
                        className="space-y-3 overflow-hidden"
                      >
                        {collections.map((collection, index) => (
                          <motion.div
                            key={collection}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              id={`collection-${collection}`}
                              checked={filters.categories.includes(collection)}
                              onCheckedChange={(checked) => handleCategoryChange(collection, checked as boolean)}
                            />
                            <label
                              htmlFor={`collection-${collection}`}
                              className="text-sm font-medium leading-none cursor-pointer hover:text-primary transition-colors"
                            >
                              {collection}
                            </label>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Clear Filters */}
                <AnimatePresence>
                  {filters.categories.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="pt-4 border-t border-border"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                        className="w-full"
                      >
                        Clear All Filters
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilters;
