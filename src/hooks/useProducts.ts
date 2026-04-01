import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/products";

interface UseProductsOptions {
  collection?: string;
  featured?: boolean;
  displayPage?: string | string[];
}

const mapDbProductToProduct = (dbProduct: any): Product => {
  const isSoldOut = !dbProduct.in_stock;

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    price: Number(dbProduct.price),
    original_price: dbProduct.original_price ? Number(dbProduct.original_price) : undefined,
    image: dbProduct.images?.[0] || "/placeholder.svg",
    images: dbProduct.images || [],
    badge: isSoldOut ? "Sold out" : dbProduct.featured ? "New in" : undefined,
    category: dbProduct.category || "Uncategorized",
    style: dbProduct.style || undefined,
    color: dbProduct.color || undefined,
    size: dbProduct.size || undefined,
  };
};

export const useProducts = (options?: UseProductsOptions) => {
  return useQuery({
    queryKey: ["products", options],
    queryFn: async () => {
      let query = supabase.from("products").select("*");

      // Only show active products on frontend
      query = query.eq("status", "Active");

      if (options?.collection) {
        query = query.eq("collection", options.collection);
      }
      if (options?.featured) {
        query = query.eq("featured", true);
      }
      if (options?.displayPage) {
        if (Array.isArray(options.displayPage)) {
          // Check if any of the requested display pages are in the product's display_pages array
          query = query.contains("display_pages", options.displayPage);
        } else {
          // Check if the requested display page is in the product's display_pages array
          query = query.contains("display_pages", [options.displayPage]);
        }
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(mapDbProductToProduct);
    },
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      // First try to find by slug
      let { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("status", "Active")
        .maybeSingle();

      // If not found, try to find by name (slugified)
      if (!data && !error) {
        const { data: dataByName, error: errorByName } = await supabase
          .from("products")
          .select("*")
          .eq("status", "Active")
          .ilike("name", slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()))
          .maybeSingle();
        
        if (errorByName) throw errorByName;
        data = dataByName;
      }

      // If still not found, try partial name match
      if (!data && !error) {
        const { data: dataPartial, error: errorPartial } = await supabase
          .from("products")
          .select("*")
          .eq("status", "Active")
          .ilike("name", `%${slug.replace(/-/g, "%")}%`)
          .maybeSingle();
        
        if (errorPartial) throw errorPartial;
        data = dataPartial;
      }

      if (error) throw error;
      if (!data) return null;
      return mapDbProductToProduct(data);
    },
    enabled: !!slug,
  });
};
