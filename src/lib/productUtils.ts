import { newArrivals, saleProducts, bestSellers, type Product } from "./products";
import { paradiseProducts } from "./paradiseProducts";
import { safariProducts } from "./safariProducts";

const allProducts: Product[] = [...newArrivals, ...saleProducts, ...bestSellers, ...safariProducts, ...paradiseProducts];

export const getProductBySlug = (slug: string): Product | undefined => {
  return allProducts.find((p) => slugify(p.name) === slug);
};

export const getProductById = (id: string): Product | undefined => {
  return allProducts.find((p) => p.id === id);
};

export const slugify = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const getRelatedProducts = (product: Product, count = 4): Product[] => {
  return allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, count);
};

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    // Import productService to get products from database
    const { productService } = await import('./productService');
    const dbProducts = await productService.getProducts();
    console.log('getAllProducts - Fetched from database:', dbProducts.length, dbProducts);
    
    // Transform database products to match the Product interface
    const transformedProducts: Product[] = dbProducts.map(dbProduct => {
      try {
        return {
          id: dbProduct.id,
          name: dbProduct.name,
          price: dbProduct.price,
          original_price: dbProduct.original_price || undefined,
          image: dbProduct.images?.[0] || "/placeholder.svg", // Use first image from array or placeholder
          images: dbProduct.images || [],
          badge: dbProduct.in_stock ? undefined : "Sold out",
          category: dbProduct.category || "",
          style: undefined, // Not in database schema
          color: (dbProduct as any).colors?.[0] || undefined, // Get first color from colors array if available
          size: undefined, // Not in database schema
          collection: dbProduct.collection || "",
          sort_order: dbProduct.sort_order || 999,
          featured: dbProduct.featured || false,
          in_stock: dbProduct.in_stock !== false,
        };
      } catch (error) {
        console.error('Error transforming product:', dbProduct, error);
        // Return a safe fallback product
        return {
          id: dbProduct.id,
          name: dbProduct.name || 'Unknown Product',
          price: dbProduct.price || 0,
          image: "/placeholder.svg",
          category: "",
          collection: "",
          sort_order: 999,
          featured: false,
          in_stock: true,
        };
      }
    });
    
    return transformedProducts;
  } catch (error) {
    console.error('Error fetching products from database:', error);
    // Fallback to static products if database fails
    const seen = new Set<string>();
    return allProducts.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }
};
