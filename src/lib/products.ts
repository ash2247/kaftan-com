import { productService } from './productService';

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  images?: string[];
  badge?: "New in" | "Sold out";
  category: string;
  style?: string;
  color?: string;
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
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Mock data for fallback - Paradise Collection products
export const newArrivals: Product[] = [
  {
    id: "zahara-pink",
    name: "Zahara Pink Tank Top",
    price: 89,
    original_price: 129,
    image: "/paradise/paradise-1.jpg",
    images: ["/paradise/paradise-1.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Tank Top",
    color: "Pink"
  },
  {
    id: "monet-orange-7",
    name: "Monet Orange Hi-Low Dress",
    price: 149,
    original_price: 199,
    image: "/paradise/paradise-2.jpg",
    images: ["/paradise/paradise-2.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Hi-Low Dress",
    color: "Orange"
  },
  {
    id: "monet-orange-6",
    name: "Monet Orange Wrap Pant",
    price: 119,
    original_price: 159,
    image: "/paradise/paradise-3.jpg",
    images: ["/paradise/paradise-3.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Wrap Pant",
    color: "Orange"
  },
  {
    id: "monet-orange-5",
    name: "Monet Orange Long Box Kaftan",
    price: 179,
    original_price: 249,
    image: "/paradise/paradise-4.jpg",
    images: ["/paradise/paradise-4.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Long Box Kaftan",
    color: "Orange"
  },
  {
    id: "monet-orange-4",
    name: "Monet Orange Tunic Dress",
    price: 139,
    original_price: 189,
    image: "/paradise/paradise-5.jpg",
    images: ["/paradise/paradise-5.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Tunic Dress",
    color: "Orange"
  },
  {
    id: "monet-orange-3",
    name: "Monet Orange Tank Top",
    price: 99,
    original_price: 139,
    image: "/paradise/paradise-6.jpg",
    images: ["/paradise/paradise-6.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Tank Top",
    color: "Orange"
  },
  {
    id: "monet-orange-2",
    name: "Monet Orange Shirt",
    price: 79,
    original_price: 109,
    image: "/paradise/paradise-7.jpg",
    images: ["/paradise/paradise-7.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Shirt",
    color: "Orange"
  },
  {
    id: "7166",
    name: "Monet Orange Short Kaftan",
    price: 119,
    original_price: 169,
    image: "/paradise/paradise-8.jpg",
    images: ["/paradise/paradise-8.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Short Kaftan",
    color: "Orange"
  },
  {
    id: "marigold-aqua-brown-2",
    name: "Marigold Aqua Brown Tank Top",
    price: 89,
    original_price: 129,
    image: "/paradise/paradise-9.jpg",
    images: ["/paradise/paradise-9.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Tank Top",
    color: "Aqua Brown"
  },
  {
    id: "marigold-aqua-brown",
    name: "Marigold Aqua Brown Long Shirt Dress",
    price: 159,
    original_price: 219,
    image: "/paradise/paradise-10.jpg",
    images: ["/paradise/paradise-10.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Long Shirt Dress",
    color: "Aqua Brown"
  },
  {
    id: "garden-delight-5",
    name: "Garden Delight Long Kaftan",
    price: 189,
    original_price: 259,
    image: "/paradise/paradise-11.jpg",
    images: ["/paradise/paradise-11.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Long Kaftan",
    color: "Coral"
  },
  {
    id: "garden-delight-4",
    name: "Garden Delight Long Kaftan",
    price: 169,
    original_price: 239,
    image: "/paradise/paradise-12.jpg",
    images: ["/paradise/paradise-12.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Long Kaftan",
    color: "Aqua"
  },
  {
    id: "garden-delight-3",
    name: "Garden Delight Shirt",
    price: 99,
    original_price: 139,
    image: "/paradise/paradise-13.jpg",
    images: ["/paradise/paradise-13.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Shirt",
    color: "Aqua"
  },
  {
    id: "tiger-brown-2",
    name: "Tiger Brown Short Kaftan",
    price: 139,
    original_price: 189,
    image: "/paradise/paradise-14.jpg",
    images: ["/paradise/paradise-14.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Short Kaftan",
    color: "Brown"
  },
  {
    id: "tiger-brown",
    name: "Tiger Brown Short Frill Dress",
    price: 149,
    original_price: 199,
    image: "/paradise/paradise-15.jpg",
    images: ["/paradise/paradise-15.jpg"],
    badge: "New in",
    category: "Paradise Collection",
    style: "Short Frill Dress",
    color: "Brown"
  }
];

export const saleProducts: Product[] = [];
export const bestSellers: Product[] = [];
