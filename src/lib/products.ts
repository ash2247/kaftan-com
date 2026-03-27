import { productService } from './productService';

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  images?: string[];
  badge?: "New in" | "Sold out" | "Sale";
  category: string;
  style?: string;
  color?: string;
  size?: string;
  collection?: string;
  sort_order?: number; // For controlling product order within collections
  featured?: boolean; // Featured status from database
  in_stock?: boolean; // Stock status from database
}

// Get products from database
export const getProducts = async (): Promise<Product[]> => {
  try {
    const products = await productService.getProducts();
    return products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      original_price: p.original_price || undefined,
      image: p.images?.[0] || "/placeholder.svg",
      images: p.images || [],
      badge: p.in_stock ? undefined : "Sold out",
      category: p.category || "",
      style: undefined, // Not in database schema
      color: p.colors?.[0], // Get first color from colors array
      collection: p.collection || "",
      sort_order: p.sort_order || 999, // Add sort_order field
      featured: p.featured || false, // Add featured field
      in_stock: p.in_stock !== false, // Add in_stock field
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Mock data for fallback - these are now empty arrays
export const newArrivals: Product[] = [];
export const saleProducts: Product[] = [];
export const bestSellers: Product[] = [];
