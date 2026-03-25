import type { Product } from "./products";

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  badges: string[];
  inStockOnly: boolean;
}

export const getActiveFiltersCount = (filters: FilterState, products: Product[]): number => {
  let count = 0;
  
  if (filters.categories.length > 0) count++;
  if (filters.colors.length > 0) count++;
  if (filters.sizes.length > 0) count++;
  if (filters.badges.length > 0) count++;
  if (filters.inStockOnly) count++;
  
  // Check if price range is different from default
  if (products.length > 0) {
    const minPrice = Math.min(...products.map(p => p.price));
    const maxPrice = Math.max(...products.map(p => p.price));
    if (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) count++;
  }
  
  return count;
};

export const getFilterOptions = (products: Product[]) => {
  return {
    categories: Array.from(new Set(products.map(p => p.category))).filter(Boolean),
    colors: Array.from(new Set(products.map(p => p.color).filter(Boolean))),
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"], // Standard sizes
    badges: Array.from(new Set(products.map(p => p.badge).filter(Boolean))),
  };
};

export const getPriceRange = (products: Product[]) => {
  if (products.length === 0) return { min: 0, max: 1000 };
  return {
    min: Math.min(...products.map(p => p.price)),
    max: Math.max(...products.map(p => p.price)),
  };
};

export const applyFilters = (products: Product[], filters: FilterState): Product[] => {
  let result = [...products];

  // Apply collection filter (categories array actually contains collections)
  if (filters.categories.length > 0) {
    result = result.filter((p) => {
      // Check if product has collection field that matches any selected collection
      return filters.categories.includes(p.category); // p.category now contains collection name
    });
  }

  // Apply price range filter
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
    result = result.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
  }

  // Apply color filter
  if (filters.colors.length > 0) {
    result = result.filter((p) => p.color && filters.colors.includes(p.color));
  }

  // Apply size filter (placeholder for when size data is available)
  if (filters.sizes.length > 0) {
    // This would need size data in product schema
    // For now, we'll skip size filtering
  }

  // Apply badge filter
  if (filters.badges.length > 0) {
    result = result.filter((p) => p.badge && filters.badges.includes(p.badge));
  }

  // Apply stock filter
  if (filters.inStockOnly) {
    result = result.filter((p) => p.badge !== "Sold out");
  }

  return result;
};

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const result = [...products];
  
  switch (sortBy) {
    case "collection-order":
      // Sort by sort_order first, then by collection, then by name
      return result.sort((a, b) => {
        // First compare sort_order
        if (a.sort_order !== b.sort_order) {
          return (a.sort_order || 999) - (b.sort_order || 999);
        }
        // If sort_order is same, sort by collection
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        // If collection is same, sort by name
        return a.name.localeCompare(b.name);
      });
    case "featured":
    case "latest":
      // For featured/latest, sort by sort_order first, then by featured priority
      return result.sort((a, b) => {
        // First compare sort_order
        if (a.sort_order !== b.sort_order) {
          return (a.sort_order || 999) - (b.sort_order || 999);
        }
        // If sort_order is same, sort by featured priority
        const getPriority = (featured: boolean, originalPrice?: number) => {
          if (featured) return 1;
          if (originalPrice && originalPrice > 0) return 2;
          return 3;
        };
        return getPriority(b.featured, b.original_price) - getPriority(a.featured, a.original_price);
      });
    case "price-low":
    case "price-asc":
      return result.sort((a, b) => a.price - b.price);
    case "price-high":
    case "price-desc":
      return result.sort((a, b) => b.price - a.price);
    case "name":
    case "name-az":
      return result.sort((a, b) => a.name.localeCompare(b.name));
    case "name-za":
      return result.sort((a, b) => b.name.localeCompare(a.name));
    default: 
      // Default sort: by sort_order, then by name
      return result.sort((a, b) => {
        if (a.sort_order !== b.sort_order) {
          return (a.sort_order || 999) - (b.sort_order || 999);
        }
        return a.name.localeCompare(b.name);
      });
  }
};
