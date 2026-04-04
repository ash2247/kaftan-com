import { useState, useRef } from "react";
import { Heart, Search, ShoppingBag, Menu, X, User, LogOut, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCollections } from "@/hooks/useCollections";
import { useNavigationPages } from "@/hooks/useNavigationPages";
import { useQuery } from "@tanstack/react-query";
import { headerFooterService } from "@/lib/headerFooterService";
import SearchOverlay from "./SearchOverlay";
import Logo from "./Logo";

const whereToBuyLinks = [
  { label: "Ambia collections", url: "https://www.ambia.com.au/" },
  { label: "Pizzaz boutique", url: "https://pizazzboutique.com.au/" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [whereToBuyOpen, setWhereToBuyOpen] = useState(false);
  const [mobileWhereToBuyOpen, setMobileWhereToBuyOpen] = useState(false);
  const whereToBuyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { openCart, totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, signOut } = useAuth();
  const { collections, loading: collectionsLoading } = useCollections();
  const { data: navigationPages = [] } = useNavigationPages();
  const location = useLocation();
  const navigate = useNavigate();

  // Get navigation from Header & Footer service
  const { data: headerFooterContent } = useQuery({
    queryKey: ["headerFooter-content"],
    queryFn: () => headerFooterService.getHeaderFooterContent(),
  });

  const navItems = headerFooterContent?.header?.navItems || [];

  const handleWhereToBuyEnter = () => {
    if (whereToBuyTimeout.current) clearTimeout(whereToBuyTimeout.current);
    setWhereToBuyOpen(true);
  };
  const handleWhereToBuyLeave = () => {
    whereToBuyTimeout.current = setTimeout(() => setWhereToBuyOpen(false), 200);
  };

  return (
    <>
      <header className="fixed top-[32px] left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.08)]">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center px-6 py-3 h-[60px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <Logo type="header" size="6xl" />
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-2 xl:gap-3 ml-2 xl:ml-3">
            {navItems.map((item) =>
              item.label === "Where to Buy" ? (
                <div
                  key={item.id}
                  className="relative flex items-center"
                  onMouseEnter={handleWhereToBuyEnter}
                  onMouseLeave={handleWhereToBuyLeave}
                >
                  <span
                    className={`font-body text-[10px] xl:text-[11px] tracking-[0.05em] xl:tracking-[0.08em] uppercase transition-colors duration-300 hover:text-primary cursor-pointer whitespace-nowrap inline-block leading-none h-[45px] flex items-center ${
                      location.pathname === item.to
                        ? "text-primary font-medium"
                        : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                  <AnimatePresence>
                    {whereToBuyOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 min-w-[280px] bg-foreground rounded-md shadow-lg py-3 z-50"
                      >
                        {/* Where to Buy Section */}
                        <div className="border-b border-foreground/20 pb-2 mb-2">
                          <div className="px-5 py-1 text-xs font-body text-background/60 uppercase tracking-wider">
                            Where to Buy
                          </div>
                          {whereToBuyLinks.map((item) => (
                            <a
                              key={item.label}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-5 py-2 text-sm font-body text-background hover:text-primary-foreground/80 transition-colors"
                            >
                              {item.label}
                            </a>
                          ))}
                        </div>

                        {/* Collections Section */}
                        <div>
                          <div className="px-5 py-1 text-xs font-body text-background/60 uppercase tracking-wider">
                            Collections
                          </div>
                          {collectionsLoading ? (
                            <div className="px-5 py-2 text-sm font-body text-background/60">
                              Loading collections...
                            </div>
                          ) : collections.length === 0 ? (
                            <div className="px-5 py-2 text-sm font-body text-background/60">
                              No collections available
                            </div>
                          ) : (
                            collections.map((collection) => (
                              <Link
                                key={collection.id}
                                to={`/collection/${collection.slug}`}
                                className="block px-5 py-2 text-sm font-body text-background hover:text-primary-foreground/80 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  {collection.featured && (
                                    <span className="w-2 h-2 bg-primary-foreground rounded-full"></span>
                                  )}
                                  <span>{collection.name}</span>
                                </div>
                              </Link>
                            ))
                          )}
                          <Link
                            to="/collections"
                            className="block px-5 py-2 text-sm font-body text-background/80 hover:text-primary-foreground transition-colors border-t border-foreground/10 pt-2"
                          >
                            View All Collections →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.id}
                  to={item.to}
                  className={`font-body text-[10px] xl:text-[11px] tracking-[0.05em] xl:tracking-[0.08em] uppercase transition-colors duration-300 hover:text-primary whitespace-nowrap ${
                    location.pathname === item.to
                      ? "text-primary font-medium"
                      : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
            
            {/* Dynamic Navigation Pages - only show if not already in navItems */}
            {navigationPages.filter(page => !navItems.some(navItem => navItem.to === page.path)).map((page) => (
              <Link
                key={page.id}
                to={page.path}
                className={`font-body text-[10px] xl:text-[11px] tracking-[0.05em] xl:tracking-[0.08em] uppercase transition-colors duration-300 hover:text-primary whitespace-nowrap ${
                  location.pathname === page.path
                    ? "text-primary font-medium"
                    : "text-foreground"
                }`}
              >
                {page.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/account" className="text-foreground hover:text-primary transition-colors" aria-label="Account">
                  <User size={20} />
                </Link>
                <button
                  onClick={async () => { await signOut(); navigate("/"); }}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-foreground hover:text-primary transition-colors" aria-label="Sign in">
                <User size={20} />
              </Link>
            )}
            <Link
              to="/wishlist"
              className="relative text-foreground hover:text-primary transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <motion.span
                  key={wishlistCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-sale text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>
            <button
              onClick={openCart}
              className="relative text-foreground hover:text-primary transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              <motion.span
                key={totalItems}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body"
              >
                {totalItems}
              </motion.span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Layout */}
        <div className="flex lg:hidden items-center justify-between px-4 sm:px-6 py-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground hover:text-primary transition-colors z-10"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <Logo type="header" size="7xl" />
          </Link>

          <div className="flex items-center gap-3 z-10">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              onClick={openCart}
              className="relative text-foreground hover:text-primary transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-border bg-background"
            >
              <div className="flex flex-col py-4 px-6 gap-4">
                {navItems.map((item) =>
                  item.label === "Where to Buy" ? (
                    <div key={item.id}>
                      <button
                        onClick={() => setMobileWhereToBuyOpen(!mobileWhereToBuyOpen)}
                        className="font-body text-sm tracking-[0.15em] uppercase text-foreground w-full text-left"
                      >
                        {item.label}
                      </button>
                      <AnimatePresence>
                        {mobileWhereToBuyOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pl-4 mt-2 flex flex-col gap-2"
                          >
                            {/* Collections Section */}
                            <div className="border-b border-border pb-2 mb-2">
                              <div className="text-xs font-body text-muted-foreground uppercase tracking-wider mb-2">
                                Collections
                              </div>
                              {collectionsLoading ? (
                                <div className="font-body text-sm tracking-[0.1em] text-muted-foreground">
                                  Loading collections...
                                </div>
                              ) : collections.length === 0 ? (
                                <div className="font-body text-sm tracking-[0.1em] text-muted-foreground">
                                  No collections available
                                </div>
                              ) : (
                                collections.map((collection) => (
                                  <Link
                                    key={collection.id}
                                    to={`/collection/${collection.slug}`}
                                    onClick={() => setMobileOpen(false)}
                                    className="font-body text-sm tracking-[0.1em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                                  >
                                    {collection.featured && (
                                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                                    )}
                                    {collection.name}
                                  </Link>
                                ))
                              )}
                              <Link
                                to="/collections"
                                onClick={() => setMobileOpen(false)}
                                className="font-body text-sm tracking-[0.1em] text-muted-foreground hover:text-primary transition-colors border-t border-border pt-2 mt-2"
                              >
                                View All Collections →
                              </Link>
                            </div>

                            {/* Where to Buy Section */}
                            <div>
                              <div className="text-xs font-body text-muted-foreground uppercase tracking-wider mb-2">
                                Where to Buy
                              </div>
                              {whereToBuyLinks.map((item) => (
                                <a
                                  key={item.label}
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setMobileOpen(false)}
                                  className="font-body text-sm tracking-[0.1em] text-muted-foreground hover:text-primary transition-colors"
                                >
                                  {item.label}
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={item.id}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`font-body text-sm tracking-[0.15em] uppercase ${
                        location.pathname === item.to
                          ? "text-primary font-medium"
                          : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                )}
                
                {/* Dynamic Navigation Pages */}
                {navigationPages.map((page) => (
                  <Link
                    key={page.id}
                    to={page.path}
                    onClick={() => setMobileOpen(false)}
                    className={`font-body text-sm tracking-[0.15em] uppercase ${
                      location.pathname === page.path
                        ? "text-primary font-medium"
                        : "text-foreground"
                    }`}
                  >
                    {page.name}
                  </Link>
                ))}
                
                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-sm tracking-[0.15em] uppercase text-foreground"
                >
                  Wishlist ({wishlistCount})
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
