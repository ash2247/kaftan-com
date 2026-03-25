import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/lib/products";
import { slugify } from "@/lib/productUtils";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);
  
  // Check if this is a Paradise collection product
  const isParadiseProduct = product.id.startsWith('pr') || product.name.includes('Paradise');

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, "M");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <Link to={`/product/${slugify(product.name)}`}>
        <div className={`relative overflow-hidden aspect-[3/4] ${isParadiseProduct ? 'bg-secondary' : 'bg-secondary'}`}>
          <motion.img
            src={product.image}
            alt={product.name}
            className={`w-full h-full ${isParadiseProduct ? 'object-cover' : 'object-contain'}`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            loading="eager"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{
              imageRendering: 'auto',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              backfaceVisibility: 'hidden',
              filter: 'none',
              willChange: 'transform'
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {product.badge && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className={`absolute top-3 left-3 font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 ${
                product.badge === "Sold out"
                  ? "bg-charcoal text-primary-foreground"
                  : "text-foreground"
              }`}
            >
              {product.badge}
            </motion.span>
          )}

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleWishlist}
              className={`p-2 transition-all duration-300 shadow-sm ${
                wishlisted
                  ? "bg-primary text-primary-foreground"
                  : "backdrop-blur-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-x-0 lg:translate-x-2 lg:group-hover:translate-x-0 hover:bg-primary hover:text-primary-foreground"
              }`}
              style={!wishlisted ? { backgroundColor: 'rgba(255, 255, 255, 0.9)' } : {}}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={15} fill={wishlisted ? "currentColor" : "none"} />
            </button>
            <div className="backdrop-blur-sm p-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 translate-x-0 lg:translate-x-2 lg:group-hover:translate-x-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <Eye size={15} />
            </div>
          </div>
        </div>
      </Link>

      <div className="pt-4 space-y-2">
        {/* Product Details */}
        <div className="space-y-1">
          <h3 className="font-body text-xs tracking-[0.1em] uppercase text-foreground group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          
          {/* Style */}
          {product.style && (
            <div className="flex items-center gap-2">
              <span className="font-body text-[10px] text-muted-foreground uppercase">
                Style:
              </span>
              <span className="font-body text-[10px] text-foreground">
                {product.style}
              </span>
            </div>
          )}

          {/* Colour */}
          {product.color && (
            <div className="flex items-center gap-2">
              <span className="font-body text-[10px] text-muted-foreground uppercase">
                Colour:
              </span>
              <span className="font-body text-[10px] text-foreground">
                {product.color}
              </span>
            </div>
          )}

          {/* Collection */}
          {product.collection && (
            <div className="flex items-center gap-2">
              <span className="font-body text-[10px] text-muted-foreground uppercase">
                Collection:
              </span>
              <span className="font-body text-[10px] text-foreground">
                {product.collection}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
