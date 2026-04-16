import { useState } from "react";
import { Instagram, Facebook, Twitter, ChevronDown, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useHeaderFooter } from "@/hooks/useHeaderFooter";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import emailjs from "@emailjs/browser";
import Logo from "./Logo";

const CollapsibleSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-primary-foreground/10 md:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 md:hidden"
      >
        <h4 className="font-body text-xs tracking-[0.2em] uppercase text-primary-foreground/80">
          {title}
        </h4>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-primary-foreground/50" />
        </motion.span>
      </button>
      <h4 className="hidden md:block font-body text-xs tracking-[0.2em] uppercase mb-4 text-primary-foreground/80">
        {title}
      </h4>
      <div className="hidden md:block">{children}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden md:hidden pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface Props {
  showLogo?: boolean;
  logoType?: 'header' | 'footer' | 'admin' | 'favicon';
}

const FooterEditable = ({ showLogo = true, logoType = 'footer' }: Props) => {
  const { content: headerFooterContent } = useHeaderFooter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Get footer sections from header footer content, fallback to default
  const footerSections = headerFooterContent?.footer?.sections?.filter(section => section.enabled) || [
    {
      id: "menu",
      title: "Menu",
      order: 1,
      enabled: true,
      items: [
        { id: "f1", label: "Home", path: "/", order: 1, enabled: true },
        { id: "f2", label: "Safari Collection", path: "/safari-collection", order: 2, enabled: true },
        { id: "f3", label: "Paradise Collection", path: "/paradise-collection", order: 3, enabled: true },
        { id: "f4", label: "Where to Buy", path: "/clearance", order: 4, enabled: true },
        { id: "f5", label: "Contact Us", path: "/contact-us", order: 5, enabled: true },
        { id: "f6", label: "Our Story", path: "/our-story", order: 6, enabled: true },
      ],
    },
    {
      id: "know-us",
      title: "Know Us",
      order: 2,
      enabled: true,
      items: [
        { id: "f7", label: "About Us", path: "/our-story", order: 1, enabled: true },
        { id: "f8", label: "Contact", path: "/contact-us", order: 2, enabled: true },
        { id: "f9", label: "Sizing Guide", path: "#", order: 3, enabled: true },
        { id: "f10", label: "Boutique Locations", path: "#", order: 4, enabled: true },
      ],
    },
    {
      id: "policies",
      title: "Policies",
      order: 3,
      enabled: true,
      items: [
        { id: "f11", label: "Privacy Policy", path: "#", order: 1, enabled: true },
        { id: "f12", label: "Shipping", path: "#", order: 2, enabled: true },
        { id: "f13", label: "Returns", path: "#", order: 3, enabled: true },
        { id: "f14", label: "Terms & Conditions", path: "#", order: 4, enabled: true },
      ],
    },
  ];

  const newsletterTitle = headerFooterContent?.footer?.newsletterTitle || "Join the FashionSpectrum World";
  const newsletterSubtitle = headerFooterContent?.footer?.newsletterSubtitle || "Subscribe for exclusive access to new collections, special offers & more.";
  const ctaText = headerFooterContent?.footer?.ctaText || "Subscribe";
  const copyright = headerFooterContent?.footer?.copyright || "© 2026 FashionSpectrum. All Rights Reserved.";
  const socialLinks = headerFooterContent?.footer?.socialLinks || {
    instagram: "#",
    facebook: "#",
    twitter: "#",
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to database
      const { error: dbError } = await supabase
        .from('subscribers' as any)
        .upsert({ email: email.toLowerCase(), subscribed_at: new Date().toISOString(), is_active: true } as any, { onConflict: 'email' });

      if (dbError) {
        console.error('Database error:', dbError);
        // Don't block on DB error - still show success to user
      }

      // 2. Send confirmation email via EmailJS
      try {
        const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

        if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              to_email: email,
              to_name: email.split('@')[0],
              from_name: 'FashionSpectrum',
              subject: 'Welcome to FashionSpectrum!',
              message: 'Thank you for subscribing to our newsletter! You will now receive updates about new collections, special offers, and exclusive deals.',
            },
            EMAILJS_PUBLIC_KEY
          );
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't block on email error
      }

      // 3. Show success
      setIsSubscribed(true);
      toast.success("Successfully subscribed! Check your email for confirmation.");
      setEmail("");

      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);

    } catch (error) {
      console.error('Subscription error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-charcoal text-primary-foreground">
      {/* Newsletter */}
      <div className="border-b border-primary-foreground/10 py-16 px-6 md:px-20">
        <div className="max-w-md mx-auto text-center">
          <h3 className="font-heading text-2xl md:text-3xl mb-3">{newsletterTitle}</h3>
          <p className="font-body text-xs text-primary-foreground/60 tracking-wide mb-6">
            {newsletterSubtitle}
          </p>
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-background/10 border border-primary-foreground/20 rounded-none text-primary-foreground placeholder-primary-foreground/40 focus:outline-none focus:border-primary-foreground/40 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-primary text-primary-foreground font-body text-xs tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  ctaText
                )}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-3 py-3 bg-green-500/20 rounded-lg"
            >
              <CheckCircle className="text-green-400" size={20} />
              <span className="font-body text-sm text-green-400">
                You're subscribed! Check your email.
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Links */}
      <div className="py-12 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Logo Section */}
          {showLogo && (
            <div className="lg:col-span-1">
              <div className="mb-6">
                <Logo type={logoType} size="6xl" />
              </div>
              <p className="font-body text-xs text-primary-foreground/60 leading-relaxed mb-6">
                Discover our latest collection of handcrafted kaftans, dresses & resort wear designed for the modern woman.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.instagram && socialLinks.instagram !== "#" && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  >
                    <Instagram size={18} className="text-primary-foreground" />
                  </a>
                )}
                {socialLinks.facebook && socialLinks.facebook !== "#" && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  >
                    <Facebook size={18} className="text-primary-foreground" />
                  </a>
                )}
                {socialLinks.twitter && socialLinks.twitter !== "#" && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                  >
                    <Twitter size={18} className="text-primary-foreground" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Dynamic Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.id}>
              <CollapsibleSection title={section.title}>
                <ul className="space-y-3">
                  {section.items
                    .filter(item => item.enabled)
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <li key={item.id}>
                        <Link
                          to={item.path}
                          className="font-body text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </CollapsibleSection>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-primary-foreground/10 py-6 px-6 md:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-primary-foreground/60">
            {copyright}
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="font-body text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="font-body text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterEditable;
