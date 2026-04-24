import { useState } from "react";
import { Instagram, Facebook, Twitter, ChevronDown, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FooterContent } from "@/hooks/usePageContent";
import { useNavigationPages } from "@/hooks/useNavigationPages";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { sendNewsletterEmail } from "@/services/emailjsService";
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
  content?: FooterContent;
  showLogo?: boolean;
  logoType?: 'header' | 'footer' | 'admin' | 'favicon';
}

const Footer = ({ content, showLogo = true, logoType = 'footer' }: Props) => {
  const { data: navigationPages = [] } = useNavigationPages();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const newsletterTitle = content?.newsletterTitle || "Join the FashionSpectrum World";
  const newsletterSubtitle = content?.newsletterSubtitle || "Subscribe for exclusive access to new collections, special offers & more.";
  const ctaText = content?.ctaText || "Subscribe";
  const copyright = content?.copyright || "© 2026 FashionSpectrum. All Rights Reserved.";

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

      // 2. Send newsletter email
      try {
        const emailSent = await sendNewsletterEmail(email);
        if (emailSent) {
          console.log('Newsletter email sent successfully');
        } else {
          console.warn('Failed to send newsletter email');
        }
      } catch (emailError) {
        console.error('Error sending newsletter email:', emailError);
        // Don't block the subscription process if email fails
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

  // Create dynamic footer sections with navigation pages
  const footerSections = [
    {
      title: "Menu",
      items: [
        { label: "Home", path: "/" },
        { label: "Safari Collection", path: "/safari-collection" },
        { label: "Paradise Collection", path: "/paradise-collection" },
        { label: "Where to Buy", path: "/clearance" },
        { label: "Contact Us", path: "/contact-us" },
        { label: "Our Story", path: "/our-story" },
        ...navigationPages.map(page => ({ label: page.name, path: page.path }))
      ],
    },
    {
      title: "Know Us",
      items: [
        { label: "About Us", path: "/our-story" },
        { label: "Contact", path: "/contact-us" },
        { label: "Sizing Guide", path: "#" },
        { label: "Boutique Locations", path: "#" }
      ],
    },
    {
      title: "Policies",
      items: [
        { label: "Privacy Policy", path: "#" },
        { label: "Shipping", path: "#" },
        { label: "Returns", path: "#" },
        { label: "Terms & Conditions", path: "#" }
      ],
    },
  ];

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
                className="flex-1 bg-transparent border border-primary-foreground/20 px-4 py-3 font-body text-xs tracking-wider text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-gold disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground px-6 py-3 font-body text-xs tracking-[0.2em] uppercase hover:bg-gold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      {/* Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-16 py-8 md:py-20 px-6 md:px-20 lg:px-28 max-w-5xl mx-auto">
        {footerSections.map((section) => (
          <CollapsibleSection key={section.title} title={section.title}>
            <ul className="space-y-3">
              {section.items.map((item) => (
                <li key={item.label}>
                  {item.path === "#" ? (
                    <a 
                      href="#" 
                      className="font-body text-sm text-primary-foreground/50 hover:text-gold transition-colors duration-300"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link 
                      to={item.path} 
                      className="font-body text-sm text-primary-foreground/50 hover:text-gold transition-colors duration-300"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        ))}
      </div>

      {/* Social Icons */}
      <div className="flex flex-col items-center gap-3 py-12 px-6">
        <h4 className="font-body text-xs tracking-[0.2em] uppercase text-primary-foreground/80">Follow Us</h4>
        <div className="flex gap-5">
          <a 
            href="https://instagram.com/fashionspectrum" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary-foreground/50 hover:text-gold transition-colors duration-300" 
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
          <a 
            href="https://facebook.com/fashionspectrum" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary-foreground/50 hover:text-gold transition-colors duration-300" 
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </a>
          <a 
            href="https://twitter.com/fashionspectrum" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary-foreground/50 hover:text-gold transition-colors duration-300" 
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-primary-foreground/10 py-8 px-6 text-center">
        {showLogo && (
          <div className="flex justify-center mb-4">
            <Logo type={logoType} size="md" alt="" />
          </div>
        )}
        <p className="font-body text-[10px] text-primary-foreground/40 tracking-wider">
          {copyright}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
