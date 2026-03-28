import { useState, useRef } from "react";
import { Heart, Search, ShoppingBag, Menu, X, User, LogOut, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCollections } from "@/hooks/useCollections";
import { useHeaderFooter } from "@/hooks/useHeaderFooter";
import SearchOverlay from "./SearchOverlay";
import Logo from "./Logo";

const NavbarEditable = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [whereToBuyOpen, setWhereToBuyOpen] = useState(false);
  const [mobileWhereToBuyOpen, setMobileWhereToBuyOpen] = useState(false);
  const whereToBuyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { openCart, totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, signOut } = useAuth();
  const { collections, loading: collectionsLoading } = useCollections();
  const { content: headerFooterContent } = useHeaderFooter();
  const location = useLocation();
  const navigate = useNavigate();

  const handleWhereToBuyEnter = () => {
    if (whereToBuyTimeout.current) clearTimeout(whereToBuyTimeout.current);
    setWhereToBuyOpen(true);
  };
  
  const handleWhereToBuyLeave = () => {
    whereToBuyTimeout.current = setTimeout(() => setWhereToBuyOpen(false), 200);
  };

  // Get navigation items from header footer content, fallback to default
  const navItems = headerFooterContent?.header?.navItems?.filter(item => item.enabled) || [
    { label: "Home", to: "/", order: 1, enabled: true },
    { label: "2026 Collection", to: "/collection-2026", order: 2, enabled: true },
    { label: "Safari Collection", to: "/safari-collection", order: 3, enabled: true },
    { label: "Paradise Collection", to: "/paradise-collection", order: 4, enabled: true },
    { label: "Clearance", to: "/clearance", order: 5, enabled: true },
    { label: "Where to Buy", to: "/shop", order: 6, enabled: true },
    { label: "Contact Us", to: "/contact-us", order: 7, enabled: true },
    { label: "Our Story", to: "/our-story", order: 8, enabled: true },
  ];

  const whereToBuyLinks = headerFooterContent?.header?.whereToBuyLinks?.filter(link => link.enabled) || [
    { label: "Ambia collections", url: "https://www.ambia.com.au/", isExternal: true, order: 1, enabled: true },
    { label: "Pizzaz boutique", url: "https://pizazzboutique.com.au/", isExternal: true, order: 2, enabled: true },
  ];

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
            {navItems.map((link) =>
              link.label === "Where to Buy" ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={handleWhereToBuyEnter}
                  onMouseLeave={handleWhereToBuyLeave}
                >
                  <button
                    className={`font-body text-[10px] xl:text-[11px] tracking-[0.05em] xl:tracking-[0.08em] uppercase transition-colors duration-300 hover:text-primary whitespace-nowrap flex items-center gap-1 ${
                      location.pathname === link.to
                        ? "text-primary font-medium"
                        : "text-foreground"
                    }`}
                  >
                    {link.label}
                    <Layers size={12} />
                  </button>
                  
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
                              key={item.id}
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
                  key={link.id}
                  to={link.to || ''}
                  className={`font-body text-[10px] xl:text-[11px] tracking-[0.05em] xl:tracking-[0.08em] uppercase transition-colors duration-300 hover:text-primary whitespace-nowrap ${
                    location.pathname === link.to
                      ? "text-primary font-medium"
                      : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
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
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-foreground hover:text-primary transition-colors" aria-label="Login">
                <User size={20} />
              </Link>
            )}
            <button
              onClick={() => openCart()}
              className="text-foreground hover:text-primary transition-colors relative"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-body">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/wishlist')}
              className="text-foreground hover:text-primary transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-body">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex lg:hidden items-center justify-between px-4 sm:px-6 py-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground hover:text-primary transition-colors z-10"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="flex items-center justify-center">
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
              onClick={() => openCart()}
              className="text-foreground hover:text-primary transition-colors relative"
              aria-label="Shopping cart"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-body">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="fixed left-0 top-0 bottom-0 w-80 bg-foreground overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <Logo type="header" size="6xl" />
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="text-background hover:text-primary-foreground/80 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((link) => (
                    <Link
                      key={link.id}
                      to={link.to || ''}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-3 px-4 rounded-lg font-body text-sm transition-colors ${
                        location.pathname === link.to
                          ? "bg-primary text-primary-foreground"
                          : "text-background hover:text-primary-foreground/80"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-foreground/20">
                  <div className="space-y-4">
                    {user ? (
                      <>
                        <Link
                          to="/account"
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 px-4 text-background hover:text-primary-foreground/80 transition-colors font-body text-sm"
                        >
                          My Account
                        </Link>
                        <button
                          onClick={async () => {
                            await signOut();
                            navigate("/");
                            setMobileOpen(false);
                          }}
                          className="block w-full text-left py-2 px-4 text-background hover:text-destructive transition-colors font-body text-sm"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 px-4 text-background hover:text-primary-foreground/80 transition-colors font-body text-sm"
                      >
                        Login / Register
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default NavbarEditable;
