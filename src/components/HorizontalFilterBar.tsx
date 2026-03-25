import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/products";
import type { FilterState } from "@/lib/filterUtils";
import { getFilterOptions } from "@/lib/filterUtils";

interface HorizontalFilterBarProps {
  products: Product[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  filteredCount: number;
  totalCount: number;
}

const HorizontalFilterBar = ({
  products,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  filteredCount,
  totalCount
}: HorizontalFilterBarProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  const filterOptions = getFilterOptions(products);
  
  const sortOptions = [
    { label: "Most Popular", value: "featured" },
    { label: "Latest", value: "latest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Name: A to Z", value: "name-az" },
    { label: "Name: Z to A", value: "name-za" }
  ];

  const filterCategories = [
    { key: "categories", label: "Category", options: filterOptions.categories },
    { key: "colors", label: "Color", options: filterOptions.colors },
    { key: "sizes", label: "Size", options: filterOptions.sizes },
    { key: "badges", label: "Features", options: filterOptions.badges },
    { key: "style", label: "Style", options: [] }, // Placeholder for future implementation
    { key: "print", label: "Print", options: [] }, // Placeholder for future implementation
    { key: "occasion", label: "Occasion", options: [] } // Placeholder for future implementation
  ];

  const handleFilterChange = (filterKey: keyof FilterState, value: string, checked: boolean) => {
    const currentValues = filters[filterKey] as string[];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    onFiltersChange({ ...filters, [filterKey]: newValues });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 1000],
      colors: [],
      sizes: [],
      badges: [],
      inStockOnly: false
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.colors.length > 0 || 
                          filters.sizes.length > 0 || 
                          filters.badges.length > 0;

  const getActiveFilterCount = (filterKey: keyof FilterState) => {
    return (filters[filterKey] as string[])?.length || 0;
  };

  return (
    <div className="border-b border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          {/* Left side - Filter dropdowns */}
          <div className="flex items-center gap-4 flex-1 overflow-x-auto">
            {filterCategories.map((category) => {
              const activeCount = getActiveFilterCount(category.key as keyof FilterState);
              const hasOptions = category.options.length > 0;
              
              return (
                <div key={category.key} className="relative">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === category.key ? null : category.key)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors whitespace-nowrap ${
                      activeCount > 0
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-primary"
                    } ${!hasOptions ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!hasOptions}
                  >
                    {category.label}
                    {activeCount > 0 && (
                      <span className="bg-current/20 rounded-full px-2 py-0.5 text-xs">
                        {activeCount}
                      </span>
                    )}
                    {hasOptions && <ChevronDown size={14} />}
                  </button>

                  {/* Dropdown */}
                  {openDropdown === category.key && hasOptions && (
                    <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                      <div className="p-2">
                        {category.options.map((option) => {
                          const isChecked = (filters[category.key as keyof FilterState] as string[])?.includes(option);
                          return (
                            <label
                              key={option}
                              className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted cursor-pointer rounded"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleFilterChange(category.key as keyof FilterState, option, e.target.checked)}
                                className="rounded border-border"
                              />
                              <span className="text-foreground">{option}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                <X size={14} className="mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Right side - View options and sort */}
          <div className="flex items-center gap-4">
            {/* Product count */}
            <span className="text-sm text-muted-foreground">
              {filteredCount} of {totalCount} products
            </span>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-border bg-background hover:border-primary transition-colors"
              >
                Sort by
                <span className="text-primary">|</span>
                <span className="text-primary">
                  {sortOptions.find(opt => opt.value === sortBy)?.label || "Most Popular"}
                </span>
                <ChevronDown size={14} />
              </button>

              {openDropdown === "sort" && (
                <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 min-w-[200px]">
                  <div className="p-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onSortChange(option.value);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-muted rounded transition-colors ${
                          sortBy === option.value ? "text-primary font-medium" : "text-foreground"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
};

export default HorizontalFilterBar;
