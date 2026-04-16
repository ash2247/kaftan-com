import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, GripVertical, Image as ImageIcon, Type, FileText, Layout, Mail, Globe, Upload, X, Plus, Replace, RotateCcw, Package, Trash2, MoveUp, MoveDown } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCatalogPageContent, type CatalogPageContent, type ProductItem } from "@/hooks/usePageContent";
import { bannerContentService } from "@/lib/bannerContentService";
import { pagesService, type Page } from "@/lib/pagesService";
import { useProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import HeaderFooterEditor from "@/components/admin/HeaderFooterEditor";

// Import default hero images
import aboutBrandImg from "@/assets/safari/safari-1.png";

// ---- Interfaces ----
interface HeroSlide {
  src: string;
  alt: string;
}

interface HeroContent {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  autoSlide: boolean;
  slideInterval: number;
}

interface AnnouncementContent {
  text: string;
  enabled: boolean;
}

interface AboutContent {
  title: string;
  paragraph1: string;
  paragraph2: string;
  ctaText: string;
}

interface FooterContent {
  newsletterTitle: string;
  newsletterSubtitle: string;
  ctaText: string;
  copyright: string;
}

interface SectionMeta {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
}

// Product management interfaces

interface ProductPageContent {
  title: string;
  subtitle: string;
  bannerImage: string;
  showBanner: boolean;
  announcementText: string;
  announcementEnabled: boolean;
  products: ProductItem[];
  footerNewsletterTitle: string;
  footerNewsletterSubtitle: string;
  footerCtaText: string;
  footerCopyright: string;
}

// ---- Defaults ----
const defaultHeroSlides: HeroSlide[] = [];

const defaultHomeContent = {
  hero: {
    titleLine1: "Luxurious",
    titleLine2: "Kaftan Collection",
    subtitle: "Discover our latest collection of handcrafted kaftans, dresses & resort wear designed for the modern woman.",
    ctaText: "Shop Collection",
    ctaLink: "#new-arrivals",
    autoSlide: true,
    slideInterval: 4500,
  } as HeroContent,
  announcement: { text: "Free Shipping Over $300", enabled: true } as AnnouncementContent,
  about: {
    title: "About The Brand",
    paragraph1: "FashionSpectrum is the zenith of luxury resort wear, crafted for the modern woman who embraces elegance in every moment. Our collections blend cultural artistry with contemporary design, creating pieces that transcend seasons and boundaries.",
    paragraph2: "Each garment is meticulously designed with premium fabrics and intricate embellishments, ensuring that every piece tells a story of sophistication, comfort, and timeless beauty. From sun-drenched beaches to glamorous evening events, FashionSpectrum dresses you in confidence.",
    ctaText: "Learn More",
  } as AboutContent,
  footer: {
    newsletterTitle: "Join the FashionSpectrum World",
    newsletterSubtitle: "Subscribe for exclusive access to new collections, special offers & more.",
    ctaText: "Subscribe",
    copyright: "© 2026 FashionSpectrum. All Rights Reserved.",
  } as FooterContent,
};

const defaultSections: SectionMeta[] = [
  { id: "announcement", label: "Announcement Bar", icon: "Globe", enabled: true },
  { id: "hero", label: "Hero Section", icon: "ImageIcon", enabled: true },
  { id: "newArrivals", label: "New Arrivals", icon: "Layout", enabled: true },
  { id: "saleBanner", label: "Summer Sale", icon: "Layout", enabled: true },
  { id: "bestSellers", label: "Best Sellers", icon: "Layout", enabled: true },
  { id: "about", label: "About Brand", icon: "FileText", enabled: true },
  { id: "footer", label: "Footer", icon: "Mail", enabled: true },
];

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconProps = { size: 16 };
  switch (iconName) {
    case "Globe": return <Globe {...iconProps} />;
    case "ImageIcon": return <ImageIcon {...iconProps} />;
    case "Layout": return <Layout {...iconProps} />;
    case "FileText": return <FileText {...iconProps} />;
    case "Mail": return <Mail {...iconProps} />;
    default: return <Layout {...iconProps} />;
  }
};

const catalogPageDefaults: Record<string, CatalogPageContent> = {
  shop: {
    title: "Shop All",
    subtitle: "Explore our complete collection of luxury resort wear",
    bannerImage: "",
    showBanner: false,
    showHeroText: true,
    showCtaButton: true,
    metaDescription: "Browse our full collection",
    ogImage: "",
    announcementText: "Free Shipping Over $300",
    announcementEnabled: true,
    products: [],
    footerNewsletterTitle: "Join the FashionSpectrum World",
    footerNewsletterSubtitle: "Subscribe for exclusive access to new collections, special offers & more.",
    footerCtaText: "Subscribe",
    footerCopyright: "© 2026 FashionSpectrum. All Rights Reserved.",
  },
  collections: {
    title: "Collections",
    subtitle: "Curated collections for every occasion",
    bannerImage: "",
    showBanner: false,
    showHeroText: true,
    showCtaButton: true,
    metaDescription: "Browse curated collections",
    ogImage: "",
    announcementText: "Free Shipping Over $300",
    announcementEnabled: true,
    products: [],
    footerNewsletterTitle: "Join the FashionSpectrum World",
    footerNewsletterSubtitle: "Subscribe for exclusive access to new collections, special offers & more.",
    footerCtaText: "Subscribe",
    footerCopyright: "© 2026 FashionSpectrum. All Rights Reserved.",
  },
  "new-arrivals": {
    title: "New Arrivals",
    subtitle: "The latest additions to our collection",
    bannerImage: "",
    showBanner: false,
    showHeroText: true,
    showCtaButton: true,
    metaDescription: "See our latest pieces",
    ogImage: "",
    announcementText: "Free Shipping Over $300",
    announcementEnabled: true,
    products: [],
    footerNewsletterTitle: "Join the FashionSpectrum World",
    footerNewsletterSubtitle: "Subscribe for exclusive access to new collections, special offers & more.",
    footerCtaText: "Subscribe",
    footerCopyright: "© 2026 FashionSpectrum. All Rights Reserved.",
  },
  sale: {
    title: "Summer Sale",
    subtitle: "Limited time offers on select styles",
    bannerImage: "",
    showBanner: false,
    showHeroText: true,
    showCtaButton: true,
    metaDescription: "Shop sale items",
    ogImage: "",
    announcementText: "Free Shipping Over $300",
    announcementEnabled: true,
    products: [],
    footerNewsletterTitle: "Join the FashionSpectrum World",
    footerNewsletterSubtitle: "Subscribe for exclusive access to new collections, special offers & more.",
    footerCtaText: "Subscribe",
    footerCopyright: "© 2026 FashionSpectrum. All Rights Reserved.",
  },
  "best-sellers": {
    title: "Best Sellers",
    subtitle: "Our most loved pieces",
    bannerImage: "",
    showBanner: false,
    showHeroText: true,
    showCtaButton: true,
    metaDescription: "Shop our most popular",
    ogImage: "",
    announcementText: "Free Shipping Over $300",
    announcementEnabled: true,
    products: [],
    footerNewsletterTitle: "Join the FashionSpectrum World",
    footerNewsletterSubtitle: "Subscribe for exclusive access to new collections, special offers & more.",
    footerCtaText: "Subscribe",
    footerCopyright: "© 2026 FashionSpectrum. All Rights Reserved.",
  },
  about: {
    title: "About Us",
    subtitle: "",
    bannerImage: "",
    showBanner: false,
    showHeroText: true,
    showCtaButton: true,
    metaDescription: "Learn about FashionSpectrum",
    ogImage: "",
    announcementText: "Free Shipping Over $300",
    announcementEnabled: true,
    products: [],
    footerNewsletterTitle: "Join the FashionSpectrum World",
    footerNewsletterSubtitle: "Subscribe for exclusive access to new collections, special offers & more.",
    footerCtaText: "Subscribe",
    footerCopyright: "© 2026 FashionSpectrum. All Rights Reserved.",
  },
  contact: {
    title: "Contact Us",
    subtitle: "",
    bannerImage: "",
    showBanner: false,
    showHeroText: true,
    showCtaButton: true,
    metaDescription: "Get in touch",
    ogImage: "",
    announcementText: "Free Shipping Over $300",
    announcementEnabled: true,
    products: [],
    footerNewsletterTitle: "Join the FashionSpectrum World",
    footerNewsletterSubtitle: "Subscribe for exclusive access to new collections, special offers & more.",
    footerCtaText: "Subscribe",
    footerCopyright: "© 2026 FashionSpectrum. All Rights Reserved.",
  },
};

// ---- Product Manager Component ----
const ProductManager = ({ products, onChange }: { products: ProductItem[]; onChange: (products: ProductItem[]) => void }) => {
  console.log('🎯 ProductManager rendered with products:', products);
  const { data: allProducts = [] } = useProducts();
  const [availableProducts, setAvailableProducts] = useState(allProducts);
  
  useEffect(() => {
    console.log('🎯 ProductManager useEffect - products:', products, 'allProducts:', allProducts);
    // Filter out products that are already added
    const addedProductIds = products.map(p => p.productId);
    const available = allProducts.filter(p => !addedProductIds.includes(p.id));
    setAvailableProducts(available);
  }, [allProducts, products]);

  const addProduct = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const newProductItem: ProductItem = {
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      original_price: product.original_price,
      size: 'medium',
      order: products.length,
      enabled: true
    };
    
    onChange([...products, newProductItem]);
  };

  const removeProduct = (id: string) => {
    onChange(products.filter(p => p.id !== id));
  };

  const toggleProduct = (id: string) => {
    onChange(products.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const moveProduct = (id: string, direction: 'up' | 'down') => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= products.length) return;
    
    const newProducts = [...products];
    [newProducts[index], newProducts[newIndex]] = [newProducts[newIndex], newProducts[index]];
    
    // Update order values
    newProducts.forEach((p, i) => {
      p.order = i;
    });
    
    onChange(newProducts);
  };

  const updateProductSize = (id: string, size: 'small' | 'medium' | 'large') => {
    onChange(products.map(p => 
      p.id === id ? { ...p, size } : p
    ));
  };

  const getSizeClasses = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small': return 'col-span-1';
      case 'medium': return 'col-span-1 md:col-span-2';
      case 'large': return 'col-span-1 md:col-span-3';
      default: return 'col-span-1';
    }
  };

  console.log('🎯 ProductManager about to render, products count:', products.length);

  return (
    <div className="space-y-6">
      {/* Add Product Section */}
      <div className="space-y-4">
        <Label className="font-body text-sm font-medium">Add Products</Label>
        <div className="flex gap-2">
          <Select onValueChange={addProduct}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a product to add..." />
            </SelectTrigger>
            <SelectContent>
              {availableProducts.map(product => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - ${product.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="font-body text-sm font-medium">Manage Products ({products.length})</Label>
          <p className="font-body text-xs text-muted-foreground">Drag to reorder, toggle to enable/disable</p>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg bg-secondary/20">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-body text-sm text-muted-foreground">No products added yet</p>
            <p className="font-body text-xs text-muted-foreground mt-1">Add products using the dropdown above</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={product.id} className="bg-card border border-border rounded-lg p-4 space-y-4">
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary/20 flex-shrink-0">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-body text-sm font-medium text-foreground">{product.name}</h4>
                        <div className="flex items-center gap-2">
                          {product.original_price && product.original_price > product.price ? (
                            <p className="font-body text-xs text-muted-foreground line-through">${product.original_price}</p>
                          ) : null}
                          <p className="font-body text-xs text-red-500">${product.price}</p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={product.enabled} 
                          onCheckedChange={() => toggleProduct(product.id)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveProduct(product.id, 'up')}
                          disabled={index === 0}
                        >
                          <MoveUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveProduct(product.id, 'down')}
                          disabled={index === products.length - 1}
                        >
                          <MoveDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Size Control */}
                    <div className="flex items-center gap-4">
                      <Label className="font-body text-xs text-muted-foreground">Display Size:</Label>
                      <Select 
                        value={product.size} 
                        onValueChange={(value: 'small' | 'medium' | 'large') => updateProductSize(product.id, value)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {/* Size Preview */}
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded ${product.size === 'small' ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`w-3 h-2 rounded ${product.size === 'medium' ? 'bg-primary' : 'bg-muted'}`} />
                        <div className={`w-4 h-2 rounded ${product.size === 'large' ? 'bg-primary' : 'bg-muted'}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="space-y-4">
        <Label className="font-body text-sm font-medium">Preview</Label>
        <div className="border border-dashed border-border rounded-lg p-4 bg-secondary/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.filter(p => p.enabled).map(product => (
              <div key={product.id} className={`${getSizeClasses(product.size)} space-y-2`}>
                <div className="aspect-square rounded-lg overflow-hidden bg-secondary/20">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-body text-xs font-medium text-foreground truncate">{product.name}</p>
                  <div className="flex items-center justify-center gap-1">
                    {product.original_price && product.original_price > product.price ? (
                      <p className="font-body text-xs text-muted-foreground line-through">${product.original_price}</p>
                    ) : null}
                    <p className="font-body text-xs text-red-500">${product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- Main Component ----
const AdminPageEditor = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isHome = pageId === "home" || pageId === "1";
  const pageKey = isHome ? "home" : (pageId || "");

  // State for dynamic pages
  const [dynamicPage, setDynamicPage] = useState<Page | null>(null);
  const [isDynamicPage, setIsDynamicPage] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if this is a dynamic page
  useEffect(() => {
    const checkPageType = async () => {
      try {
        console.log('🔍 Checking page type for pageId:', pageId);
        
        // For known catalog pages, treat them as catalog pages, not dynamic pages
        const catalogPageKeys = ['shop', 'collections', 'new-arrivals', 'sale', 'best-sellers', 'about', 'contact'];
        if (catalogPageKeys.includes(pageId || '')) {
          console.log('🔍 Identified as catalog page:', pageId);
          setIsDynamicPage(false);
          return;
        }
        
        // For test or invalid pages, don't try to fetch from database
        if (pageId === 'test' || !pageId) {
          console.log('🔍 Test or invalid page, treating as catalog page:', pageId);
          setIsDynamicPage(false);
          return;
        }
        
        // For dynamic pages, we'll use the path-based approach
        // First try to get by path (most common for dynamic pages)
        const pathData = await pagesService.getPageByPath(`/${pageId}`);
        if (pathData) {
          setDynamicPage(pathData);
          setIsDynamicPage(true);
          console.log('🔍 Found dynamic page by path:', pathData);
        } else {
          // Try by ID only if it looks like a UUID
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          if (uuidRegex.test(pageId || "")) {
            const pageData = await pagesService.getPageById(pageId || "");
            if (pageData) {
              setDynamicPage(pageData);
              setIsDynamicPage(true);
              console.log('🔍 Found dynamic page by ID:', pageData);
            }
          }
        }
      } catch (error) {
        console.error('Error checking page type:', error);
        // Default to catalog page on error
        setIsDynamicPage(false);
      } finally {
        setLoading(false);
      }
    };

    if (!isHome && pageId) {
      checkPageType();
    } else {
      setLoading(false);
    }
  }, [pageId, isHome]);

  const [hero, setHero] = useState<HeroContent>(defaultHomeContent.hero);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [announcement, setAnnouncement] = useState<AnnouncementContent>(defaultHomeContent.announcement);
  const [aboutImage, setAboutImage] = useState<string>(aboutBrandImg);
  const [about, setAbout] = useState<AboutContent>(defaultHomeContent.about);
  const [footer, setFooter] = useState<FooterContent>(defaultHomeContent.footer);
  const [sections, setSections] = useState<SectionMeta[]>(defaultSections);
  const [hasChanges, setHasChanges] = useState(false);

  // State for dynamic page editing
  const [dynamicPageContent, setDynamicPageContent] = useState({
    name: "",
    path: "",
    content: "",
    meta_title: "",
    meta_description: "",
    status: "draft" as 'draft' | 'published',
  });

  // Use the same hook as the frontend!
  const cmsContent = useCatalogPageContent(pageKey);
  
  const [catalogPage, setCatalogPage] = useState<CatalogPageContent>(
    catalogPageDefaults[pageKey] || { 
      title: "", 
      subtitle: "", 
      bannerImage: "", 
      showBanner: false, 
      showHeroText: true, 
      showCtaButton: true, 
      metaDescription: "", 
      ogImage: "", 
      announcementText: "Free Shipping Over $300", 
      announcementEnabled: true, 
      products: [], 
      footerNewsletterTitle: "Join the FashionSpectrum World", 
      footerNewsletterSubtitle: "Subscribe for exclusive access to new collections, special offers & more.", 
      footerCtaText: "Subscribe", 
      footerCopyright: " 2026 FashionSpectrum. All Rights Reserved." 
    }
  );

  // Load banner content for home page
  useEffect(() => {
    if (isHome) {
      const loadHomeContent = async () => {
        try {
          console.log('Loading home page banner content...');
          const bannerData = await bannerContentService.getBannerContent('home');
          
          if (bannerData) {
            console.log('Found home banner data:', bannerData);
            // Update all the state with the loaded data
            if (bannerData.hero_title_line1 || bannerData.hero_title_line2) {
              setHero({
                titleLine1: bannerData.hero_title_line1 || defaultHomeContent.hero.titleLine1,
                titleLine2: bannerData.hero_title_line2 || defaultHomeContent.hero.titleLine2,
                subtitle: bannerData.hero_subtitle || defaultHomeContent.hero.subtitle,
                ctaText: bannerData.hero_cta_text || defaultHomeContent.hero.ctaText,
                ctaLink: bannerData.hero_cta_link || defaultHomeContent.hero.ctaLink,
                autoSlide: bannerData.hero_auto_slide !== undefined ? bannerData.hero_auto_slide : defaultHomeContent.hero.autoSlide,
                slideInterval: bannerData.hero_slide_interval || defaultHomeContent.hero.slideInterval,
              });
            }
            
            if (bannerData.hero_slides && bannerData.hero_slides.length > 0) {
              setHeroSlides(bannerData.hero_slides);
            }
            
            if (bannerData.announcement_text) {
              setAnnouncement({
                text: bannerData.announcement_text,
                enabled: bannerData.announcement_enabled !== undefined ? bannerData.announcement_enabled : defaultHomeContent.announcement.enabled,
              });
            }
            
            if (bannerData.about_image) {
              setAboutImage(bannerData.about_image);
            }
            
            if (bannerData.about_title) {
              setAbout({
                title: bannerData.about_title || defaultHomeContent.about.title,
                paragraph1: bannerData.about_paragraph1 || defaultHomeContent.about.paragraph1,
                paragraph2: bannerData.about_paragraph2 || defaultHomeContent.about.paragraph2,
                ctaText: bannerData.about_cta_text || defaultHomeContent.about.ctaText,
              });
            }
            
            if (bannerData.footer_newsletter_title) {
              setFooter({
                newsletterTitle: bannerData.footer_newsletter_title || defaultHomeContent.footer.newsletterTitle,
                newsletterSubtitle: bannerData.footer_newsletter_subtitle || defaultHomeContent.footer.newsletterSubtitle,
                ctaText: bannerData.footer_cta_text || defaultHomeContent.footer.ctaText,
                copyright: bannerData.footer_copyright || defaultHomeContent.footer.copyright,
              });
            }
            
            if (bannerData.sections) {
              setSections(bannerData.sections);
            }
          } else {
            console.log('No home banner data found, using defaults');
          }
        } catch (error) {
          console.error('Error loading home banner content:', error);
        }
      };
      
      loadHomeContent();
    }
  }, [isHome]);

  // Update catalogPage when cmsContent changes
  useEffect(() => {
    if (cmsContent) {
      console.log(' Found CMS content for page:', pageKey, cmsContent);
      setCatalogPage(cmsContent);
    } else {
      console.log(' No CMS content found for page:', pageKey, 'Using defaults');
    }
  }, [cmsContent, pageKey]);

  useEffect(() => {
    if (isDynamicPage && dynamicPage) {
      // Load dynamic page data
      setDynamicPageContent({
        name: dynamicPage.name,
        path: dynamicPage.path,
        content: dynamicPage.content,
        meta_title: dynamicPage.meta_title,
        meta_description: dynamicPage.meta_description,
        status: dynamicPage.status,
      });
    }
  }, [pageKey, isHome, isDynamicPage, dynamicPage]);

  const markChanged = () => setHasChanges(true);

  // Helper function to compress base64 image
  const compressBase64Image = (base64: string, maxWidth: number = 1920, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(base64);
          return;
        }

        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = base64;
    });
  };

  // Helper function to safely set localStorage with quota handling
  const safeSetLocalStorage = (key: string, value: any): boolean => {
    try {
      const jsonString = JSON.stringify(value);
      localStorage.setItem(key, jsonString);
      return true;
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded. Please try uploading smaller images.');
        toast({ 
          title: "Storage Error", 
          description: "Image too large. Please try a smaller image or compress the current one.",
          variant: "destructive" 
        });
        return false;
      }
      throw error;
    }
  };

  const handleSave = async () => {
    if (isDynamicPage && dynamicPage) {
      // Save dynamic page
      try {
        const updatedPage = await pagesService.updatePage(dynamicPage.id, {
          name: dynamicPageContent.name,
          path: dynamicPageContent.path,
          content: dynamicPageContent.content,
          meta_title: dynamicPageContent.meta_title,
          meta_description: dynamicPageContent.meta_description,
          status: dynamicPageContent.status,
        });

        if (updatedPage) {
          setDynamicPage(updatedPage);
          setHasChanges(false);
          toast({ title: "Page saved successfully!" });
        } else {
          toast({ 
            title: "Save Error", 
            description: "Failed to save page to database.",
            variant: "destructive" 
          });
        }
      } catch (error) {
        console.error('Error saving dynamic page:', error);
        toast({ 
          title: "Save Error", 
          description: "Failed to save page. Please try again.",
          variant: "destructive" 
        });
      }
    } else if (isHome) {
      // Compress images before saving
      const compressedHeroSlides = await Promise.all(
        heroSlides.map(async (slide) => ({
          ...slide,
          src: await compressBase64Image(slide.src, 1920, 0.8)
        }))
      );
      
      const compressedAboutImage = await compressBase64Image(aboutImage, 1920, 0.8);

      try {
        const success = await bannerContentService.saveBannerContent(pageKey, {
          hero_title_line1: hero.titleLine1,
          hero_title_line2: hero.titleLine2,
          hero_subtitle: hero.subtitle,
          hero_cta_text: hero.ctaText,
          hero_cta_link: hero.ctaLink,
          hero_auto_slide: hero.autoSlide,
          hero_slide_interval: hero.slideInterval,
          hero_slides: compressedHeroSlides,
          announcement_text: announcement.text,
          announcement_enabled: announcement.enabled,
          about_title: about.title,
          about_paragraph1: about.paragraph1,
          about_paragraph2: about.paragraph2,
          about_cta_text: about.ctaText,
          about_image: compressedAboutImage,
          footer_newsletter_title: footer.newsletterTitle,
          footer_newsletter_subtitle: footer.newsletterSubtitle,
          footer_cta_text: footer.ctaText,
          footer_copyright: footer.copyright,
          sections: sections,
        });

        if (!success) {
          toast({ 
            title: "Save Error", 
            description: "Failed to save banner content to database.",
            variant: "destructive" 
          });
          return;
        }

        // Also save to localStorage as backup
        const saveData = {
          hero, 
          heroSlides: compressedHeroSlides, 
          announcement, 
          aboutImage: compressedAboutImage, 
          about, 
          footer, 
          sections,
        };
        safeSetLocalStorage(`page_content_${pageKey}`, saveData);
      } catch (error) {
        console.error('Error saving to Supabase:', error);
        toast({ 
          title: "Save Error", 
          description: "Failed to save banner content. Please try again.",
          variant: "destructive" 
        });
        return;
      }
    } else {
      // Save catalog page to localStorage only
      try {
        const success = safeSetLocalStorage(`page_content_${pageKey}`, catalogPage);
        if (!success) return;
        
        console.log('✅ Saved catalog page to localStorage:', pageKey);
      } catch (error) {
        console.error('Error saving catalog page:', error);
        return;
      }
    }
    setHasChanges(false);
    toast({ title: "Page saved successfully!" });
  };

  const toggleSection = (id: string) => {
    setSections(s => s.map(sec => sec.id === id ? { ...sec, enabled: !sec.enabled } : sec));
    markChanged();
  };

  const handleReset = () => {
    if (isHome) {
      setHero(defaultHomeContent.hero);
      setHeroSlides(defaultHeroSlides);
      setAnnouncement(defaultHomeContent.announcement);
      setAboutImage(aboutBrandImg);
      setAbout(defaultHomeContent.about);
      setFooter(defaultHomeContent.footer);
      setSections(defaultSections);
    } else {
      setCatalogPage(catalogPageDefaults[pageKey] || { title: "", subtitle: "", bannerImage: "", showBanner: false, showHeroText: true, showCtaButton: true, metaDescription: "", ogImage: "", announcementText: "Free Shipping Over $300", announcementEnabled: true, products: [], footerNewsletterTitle: "Join the FashionSpectrum World", footerNewsletterSubtitle: "Subscribe for exclusive access to new collections, special offers & more.", footerCtaText: "Subscribe", footerCopyright: "© 2026 FashionSpectrum. All Rights Reserved." });
    }
    localStorage.removeItem(`page_content_${pageKey}`);
    setHasChanges(false);
    toast({ title: "Page reset to defaults" });
  };

  const pageName = isHome ? "Home" : (isDynamicPage ? dynamicPage?.name : (catalogPageDefaults[pageKey]?.title || pageKey));

  // ---- Image Uploader Component ----
  const ImageUploader = ({ src, alt, onUpload, onRemove, onAltChange, className = "" }: {
    src: string;
    alt: string;
    onUpload: (dataUrl: string) => void;
    onRemove?: () => void;
    onAltChange?: (alt: string) => void;
    className?: string;
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
      if (!file.type.startsWith("image/")) return;
      
      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({ 
          title: "File Too Large", 
          description: "Please select an image smaller than 10MB.",
          variant: "destructive" 
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) onUpload(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }, [onUpload, toast]);

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith("image/")) return;
      
      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({ 
          title: "File Too Large", 
          description: "Please select an image smaller than 10MB.",
          variant: "destructive" 
        });
        return;
      }
      
      handleFile(file);
    }, [handleFile, toast]);

    return (
      <div className={`relative group ${className}`}>
        <div
          className="relative overflow-hidden rounded-lg border border-border bg-secondary/30 cursor-pointer"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <img src={src} alt={alt} className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              <div className="bg-background/90 rounded-full p-2">
                <Replace size={16} className="text-foreground" />
              </div>
              <span className="font-body text-xs text-background font-medium bg-foreground/70 px-2 py-1 rounded">Replace</span>
            </div>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          >
            <X size={12} />
          </button>
        )}
        {onAltChange && (
          <Input
            value={alt}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Alt text..."
            className="mt-2 text-xs h-8"
          />
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
        />
      </div>
    );
  };

  // Add new slide placeholder
  const AddSlideButton = ({ onAdd }: { onAdd: (dataUrl: string) => void }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    
    const handleFile = (file: File) => {
      if (!file.type.startsWith("image/")) return;
      
      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({ 
          title: "File Too Large", 
          description: "Please select an image smaller than 10MB.",
          variant: "destructive" 
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (ev) => { if (ev.target?.result) onAdd(ev.target.result as string); };
      reader.readAsDataURL(file);
    };
    
    return (
      <div>
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full h-40 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-secondary/20 hover:bg-secondary/40 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={24} className="text-muted-foreground" />
          <span className="font-body text-xs text-muted-foreground">Add Slide</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFile(file);
              e.target.value = "";
            }
          }}
        />
      </div>
    );
  };

  // Single image upload card (for collection banner / about)
  const SingleImageUploader = ({ src, label, onUpload }: { src: string; label: string; onUpload: (dataUrl: string) => void }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    
    const handleFile = (file: File) => {
      if (!file.type.startsWith("image/")) return;
      
      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast({ 
          title: "File Too Large", 
          description: "Please select an image smaller than 10MB.",
          variant: "destructive" 
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (ev) => { if (ev.target?.result) onUpload(ev.target.result as string); };
      reader.readAsDataURL(file);
    };
    
    return (
      <div className="space-y-2">
        <Label className="font-body text-sm">{label}</Label>
        <div
          className="relative group overflow-hidden rounded-lg border border-border cursor-pointer"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
        >
          <img src={src} alt={label} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              <div className="bg-background/90 rounded-full p-2.5">
                <Upload size={18} className="text-foreground" />
              </div>
              <span className="font-body text-sm text-background font-medium bg-foreground/70 px-3 py-1.5 rounded">Upload New Image</span>
            </div>
          </div>
        </div>
        <p className="font-body text-xs text-muted-foreground">Click or drag & drop to replace. Max size 10MB.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFile(file);
              e.target.value = "";
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-body text-xl text-muted-foreground">Loading page...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/admin/pages")}>
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">Edit: {pageName}</h1>
                <p className="font-body text-sm text-muted-foreground">Customize the content of your {pageName.toLowerCase()} page</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                    <RotateCcw size={14} /> Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset to defaults?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will restore all content on the {pageName} page to its original defaults. Any customizations will be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline" size="sm" asChild>
                <a href={isHome ? "/" : (isDynamicPage ? dynamicPage?.path : `/${pageKey}`)} target="_blank" rel="noopener noreferrer" className="gap-2">
                  <Eye size={14} /> Preview
                </a>
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!hasChanges} className="gap-2">
                <Save size={14} /> Save Changes
              </Button>
            </div>
          </div>

          {isDynamicPage ? (
            <DynamicPageEditor 
              page={dynamicPage} 
              content={dynamicPageContent} 
              setContent={setDynamicPageContent} 
              markChanged={markChanged} 
            />
          ) : isHome ? (
            <HomePageEditor
              hero={hero} setHero={(v) => { setHero(v); markChanged(); }}
              heroSlides={heroSlides}
              onSlideReplace={(i, src) => { const s = [...heroSlides]; s[i] = { ...s[i], src }; setHeroSlides(s); markChanged(); }}
              onSlideAltChange={(i, alt) => { const s = [...heroSlides]; s[i] = { ...s[i], alt }; setHeroSlides(s); markChanged(); }}
              onSlideRemove={(i) => { setHeroSlides(heroSlides.filter((_, idx) => idx !== i)); markChanged(); }}
              onSlideAdd={(src) => { setHeroSlides([...heroSlides, { src, alt: `Slide ${heroSlides.length + 1}` }]); markChanged(); }}
              announcement={announcement} setAnnouncement={(v) => { setAnnouncement(v); markChanged(); }}
              aboutImage={aboutImage} onAboutImageChange={(src) => { setAboutImage(src); markChanged(); }}
              about={about} setAbout={(v) => { setAbout(v); markChanged(); }}
              footer={footer} setFooter={(v) => { setFooter(v); markChanged(); }}
              sections={sections} toggleSection={toggleSection}
            />
          ) : (
            <CatalogPageEditor page={catalogPage} setPage={(v) => { setCatalogPage(v); markChanged(); }} pageKey={pageKey} />
          )}
        </>
      )}
    </div>
  );
};

// ---- Home Page Editor ----
interface HomeEditorProps {
  hero: HeroContent; setHero: (v: HeroContent) => void;
  heroSlides: HeroSlide[];
  onSlideReplace: (index: number, src: string) => void;
  onSlideAltChange: (index: number, alt: string) => void;
  onSlideRemove: (index: number) => void;
  onSlideAdd: (src: string) => void;
  announcement: AnnouncementContent; setAnnouncement: (v: AnnouncementContent) => void;
  aboutImage: string; onAboutImageChange: (src: string) => void;
  about: AboutContent; setAbout: (v: AboutContent) => void;
  footer: FooterContent; setFooter: (v: FooterContent) => void;
  sections: SectionMeta[]; toggleSection: (id: string) => void;
}

const HomePageEditor = ({
  hero, setHero, heroSlides, onSlideReplace, onSlideAltChange, onSlideRemove, onSlideAdd,
  announcement, setAnnouncement,
  aboutImage, onAboutImageChange,
  about, setAbout, footer, setFooter, sections, toggleSection,
}: HomeEditorProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
    {/* Sidebar */}
    <div className="bg-card border border-border rounded-xl p-4 h-fit">
      <h3 className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-4">Page Sections</h3>
      <div className="space-y-1">
        {sections.map(sec => (
          <div key={sec.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-secondary/50 transition-colors group">
            <div className="flex items-center gap-3">
              <GripVertical size={14} className="text-muted-foreground/40 group-hover:text-muted-foreground cursor-grab" />
              <div className="text-muted-foreground">{getIconComponent(sec.icon)}</div>
              <span className="font-body text-sm text-foreground">{sec.label}</span>
            </div>
            <Switch checked={sec.enabled} onCheckedChange={() => toggleSection(sec.id)} />
          </div>
        ))}
      </div>
    </div>

    {/* Main Editor */}
    <div className="space-y-6">
      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="w-full justify-start bg-card border border-border h-auto p-1 flex-wrap">
          <TabsTrigger value="announcement" className="font-body text-xs">Announcement</TabsTrigger>
          <TabsTrigger value="hero" className="font-body text-xs">Hero</TabsTrigger>
          <TabsTrigger value="collection" className="font-body text-xs">Collection Banner</TabsTrigger>
          <TabsTrigger value="about" className="font-body text-xs">About</TabsTrigger>
          <TabsTrigger value="footer" className="font-body text-xs">Footer</TabsTrigger>
          <TabsTrigger value="header-footer" className="font-body text-xs">Header & Footer</TabsTrigger>
          <TabsTrigger value="seo" className="font-body text-xs">SEO</TabsTrigger>
        </TabsList>

        {/* Announcement */}
        <TabsContent value="announcement">
          <EditorCard title="Announcement Bar" description="The scrolling bar at the top of the page">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-body text-sm">Enabled</Label>
                <Switch checked={announcement.enabled} onCheckedChange={v => setAnnouncement({ ...announcement, enabled: v })} />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Announcement Text</Label>
                <Input value={announcement.text} onChange={e => setAnnouncement({ ...announcement, text: e.target.value })} placeholder="e.g. Free Shipping Over $300" />
              </div>
              <PreviewBox>
                <div className="bg-primary py-2 px-4 text-center">
                  <span className="text-xs font-body tracking-[0.2em] uppercase text-primary-foreground">{announcement.text}</span>
                </div>
              </PreviewBox>
            </div>
          </EditorCard>
        </TabsContent>

        {/* Hero */}
        <TabsContent value="hero">
          <div className="space-y-6">
            {/* Hero Slides Manager */}
            <EditorCard title="Hero Slides" description="Manage the slideshow images. Click to replace, drag & drop supported.">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {heroSlides.map((slide, i) => (
                  <ImageUploader
                    key={i}
                    src={slide.src}
                    alt={slide.alt}
                    onUpload={(src) => onSlideReplace(i, src)}
                    onRemove={heroSlides.length > 1 ? () => onSlideRemove(i) : undefined}
                    onAltChange={(alt) => onSlideAltChange(i, alt)}
                  />
                ))}
                {heroSlides.length < 10 && (
                  <AddSlideButton onAdd={onSlideAdd} />
                )}
              </div>
              <p className="font-body text-xs text-muted-foreground">{heroSlides.length} slide{heroSlides.length !== 1 ? "s" : ""} · Max 10 slides · No size limit per image</p>
            </EditorCard>

          </div>
        </TabsContent>

        {/* About */}
        <TabsContent value="about">
          <EditorCard title="About Brand" description="Brand story section with image and text">
            <SingleImageUploader src={aboutImage} label="About Section Image" onUpload={onAboutImageChange} />
            <Separator />
            <div className="space-y-2">
              <Label className="font-body text-sm">Section Title</Label>
              <Input value={about.title} onChange={e => setAbout({ ...about, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Paragraph 1</Label>
              <Textarea value={about.paragraph1} onChange={e => setAbout({ ...about, paragraph1: e.target.value })} rows={4} />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Paragraph 2</Label>
              <Textarea value={about.paragraph2} onChange={e => setAbout({ ...about, paragraph2: e.target.value })} rows={4} />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">CTA Text</Label>
              <Input value={about.ctaText} onChange={e => setAbout({ ...about, ctaText: e.target.value })} />
            </div>
          </EditorCard>
        </TabsContent>

        {/* Footer */}
        <TabsContent value="footer">
          <EditorCard title="Footer" description="Newsletter and footer content">
            <div className="space-y-2">
              <Label className="font-body text-sm">Newsletter Title</Label>
              <Input value={footer.newsletterTitle} onChange={e => setFooter({ ...footer, newsletterTitle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Newsletter Subtitle</Label>
              <Textarea value={footer.newsletterSubtitle} onChange={e => setFooter({ ...footer, newsletterSubtitle: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body text-sm">Button Text</Label>
                <Input value={footer.ctaText} onChange={e => setFooter({ ...footer, ctaText: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Copyright</Label>
                <Input value={footer.copyright} onChange={e => setFooter({ ...footer, copyright: e.target.value })} />
              </div>
            </div>
          </EditorCard>
        </TabsContent>

        {/* Header & Footer */}
        <TabsContent value="header-footer">
          <HeaderFooterEditor />
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <EditorCard title="SEO Settings" description="Search engine optimization for this page">
            <div className="space-y-2">
              <Label className="font-body text-sm">Page Title</Label>
              <Input defaultValue="FashionSpectrum — Luxury Kaftan & Resort Wear" placeholder="Page title for search engines" />
              <p className="font-body text-xs text-muted-foreground">Recommended: 50-60 characters</p>
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Meta Description</Label>
              <Textarea defaultValue="Discover handcrafted luxury kaftans, dresses & resort wear. Free shipping on orders over $300." rows={3} placeholder="Brief description for search results" />
              <p className="font-body text-xs text-muted-foreground">Recommended: 150-160 characters</p>
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">OG Image URL</Label>
              <Input defaultValue="" placeholder="https://example.com/og-image.jpg" />
            </div>
          </EditorCard>
        </TabsContent>
      </Tabs>
    </div>
  </div>
);

// ---- Catalog Page Editor ----
const CatalogPageEditor = ({ page, setPage, pageKey }: { page: CatalogPageContent; setPage: (v: CatalogPageContent) => void; pageKey: string }) => (
  <div className="space-y-6">
    <Tabs defaultValue="banner" className="w-full">
      <TabsList className="w-full justify-start bg-card border border-border h-auto p-1 flex-wrap">
        <TabsTrigger value="banner" className="font-body text-xs">Banner & Content</TabsTrigger>
        <TabsTrigger value="products" className="font-body text-xs">Products</TabsTrigger>
        <TabsTrigger value="announcement" className="font-body text-xs">Announcement</TabsTrigger>
        <TabsTrigger value="footer" className="font-body text-xs">Footer</TabsTrigger>
        <TabsTrigger value="seo" className="font-body text-xs">SEO</TabsTrigger>
      </TabsList>

      {/* Banner & Content */}
      <TabsContent value="banner">
        <EditorCard title="Page Banner & Content" description="Customize the banner image, title and subtitle">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-body text-sm">Show Banner</Label>
              <Switch checked={page.showBanner} onCheckedChange={v => setPage({ ...page, showBanner: v })} />
            </div>
            {page.showBanner && (
              <SingleImageUploader
                src={page.bannerImage || "/placeholder.svg"}
                label="Banner Image"
                onUpload={(src) => setPage({ ...page, bannerImage: src })}
              />
            )}
          </div>
          <Separator />
          <div className="space-y-2">
            <Label className="font-body text-sm">Page Title</Label>
            <Input value={page.title} onChange={e => setPage({ ...page, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Subtitle</Label>
            <Input value={page.subtitle} onChange={e => setPage({ ...page, subtitle: e.target.value })} placeholder="Short description shown below the title" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label className="font-body text-sm">Show Action Button</Label>
            <Switch checked={page.showCtaButton} onCheckedChange={v => setPage({ ...page, showCtaButton: v })} />
          </div>
          <PreviewBox>
            <div className="relative rounded-lg overflow-hidden">
              {page.showBanner && page.bannerImage ? (
                <>
                  <img src={page.bannerImage} alt="" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center text-center">
                    <div>
                      <p className="font-heading text-2xl font-light text-primary-foreground">{page.title}</p>
                      {page.subtitle && <p className="font-body text-xs text-primary-foreground/70 mt-1">{page.subtitle}</p>}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-10 text-center border border-dashed border-border bg-secondary/20">
                  <p className="font-heading text-2xl text-foreground font-light">{page.title}</p>
                  {page.subtitle && <p className="font-body text-xs text-muted-foreground mt-1">{page.subtitle}</p>}
                </div>
              )}
            </div>
          </PreviewBox>
        </EditorCard>
      </TabsContent>

      {/* Products */}
      <TabsContent value="products">
        <EditorCard title="Product Management" description="Manage products assigned to this page">
          <ProductManager 
            products={page.products} 
            onChange={(products) => setPage({ ...page, products })} 
          />
        </EditorCard>
      </TabsContent>

      {/* Announcement */}
      <TabsContent value="announcement">
        <EditorCard title="Announcement Bar" description="The scrolling bar at the top of this page">
          <div className="flex items-center justify-between">
            <Label className="font-body text-sm">Enabled</Label>
            <Switch checked={page.announcementEnabled} onCheckedChange={v => setPage({ ...page, announcementEnabled: v })} />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Announcement Text</Label>
            <Input value={page.announcementText} onChange={e => setPage({ ...page, announcementText: e.target.value })} placeholder="e.g. Free Shipping Over $300" />
          </div>
          <PreviewBox>
            <div className="bg-primary py-2 px-4 text-center">
              <span className="text-xs font-body tracking-[0.2em] uppercase text-primary-foreground">{page.announcementText}</span>
            </div>
          </PreviewBox>
        </EditorCard>
      </TabsContent>

      {/* Footer */}
      <TabsContent value="footer">
        <EditorCard title="Footer" description="Newsletter and footer content for this page">
          <div className="space-y-2">
            <Label className="font-body text-sm">Newsletter Title</Label>
            <Input value={page.footerNewsletterTitle} onChange={e => setPage({ ...page, footerNewsletterTitle: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Newsletter Subtitle</Label>
            <Textarea value={page.footerNewsletterSubtitle} onChange={e => setPage({ ...page, footerNewsletterSubtitle: e.target.value })} rows={2} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body text-sm">Button Text</Label>
              <Input value={page.footerCtaText} onChange={e => setPage({ ...page, footerCtaText: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Copyright</Label>
              <Input value={page.footerCopyright} onChange={e => setPage({ ...page, footerCopyright: e.target.value })} />
            </div>
          </div>
        </EditorCard>
      </TabsContent>

      {/* SEO */}
      <TabsContent value="seo">
        <EditorCard title="SEO Settings" description="Search engine optimization for this page">
          <div className="space-y-2">
            <Label className="font-body text-sm">Meta Description</Label>
            <Textarea value={page.metaDescription} onChange={e => setPage({ ...page, metaDescription: e.target.value })} rows={3} placeholder="Brief description for search results" />
            <p className="font-body text-xs text-muted-foreground">Recommended: 150-160 characters</p>
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">OG Image URL</Label>
            <Input value={page.ogImage} onChange={e => setPage({ ...page, ogImage: e.target.value })} placeholder="https://example.com/og-image.jpg" />
          </div>
        </EditorCard>
      </TabsContent>
    </Tabs>
  </div>
);

// ---- Reusable ----
const EditorCard = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-xl p-6 space-y-5">
    <div>
      <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
      <p className="font-body text-xs text-muted-foreground">{description}</p>
    </div>
    <Separator />
    {children}
  </div>
);

const PreviewBox = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-2">
    <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Live Preview</p>
    <div className="border border-dashed border-border rounded-lg overflow-hidden">
      {children}
    </div>
  </div>
);

// Image Upload Components
const ImageUploader = ({ 
  src, 
  alt, 
  onUpload, 
  onRemove, 
  onAltChange 
}: { 
  src: string; 
  alt: string; 
  onUpload: (src: string) => void; 
  onRemove?: () => void; 
  onAltChange: (alt: string) => void; 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group">
      <div className="aspect-square rounded-lg overflow-hidden border border-border bg-secondary/20">
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          <Replace className="w-4 h-4" />
        </Button>
        {onRemove && (
          <Button
            size="sm"
            variant="destructive"
            onClick={onRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Input
        value={alt}
        onChange={(e) => onAltChange(e.target.value)}
        placeholder="Alt text"
        className="mt-2 h-8 text-xs"
      />
    </div>
  );
};

const AddSlideButton = ({ onAdd }: { onAdd: (src: string) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onAdd(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="aspect-square rounded-lg border-2 border-dashed border-border bg-secondary/20 hover:bg-secondary/40 transition-colors flex items-center justify-center group"
      >
        <Plus className="w-8 h-8 text-muted-foreground group-hover:text-foreground" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
};

const SingleImageUploader = ({ 
  src, 
  label, 
  onUpload 
}: { 
  src: string; 
  label: string; 
  onUpload: (src: string) => void; 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="font-body text-sm">{label}</Label>
      <div 
        className="relative group cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="rounded-lg overflow-hidden border border-border bg-secondary/20 min-h-[200px] flex items-center justify-center">
          {src ? (
            <img src={src} alt="" className="w-full h-full object-cover min-h-[200px]" />
          ) : (
            <div className="text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="font-body text-sm text-muted-foreground">Click to upload image</p>
            </div>
          )}
        </div>
        {src && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <Button size="sm" variant="secondary">
              <Replace className="w-4 h-4" />
            </Button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

// ---- Dynamic Page Editor ----
interface DynamicEditorProps {
  page: Page | null;
  content: {
    name: string;
    path: string;
    content: string;
    meta_title: string;
    meta_description: string;
    status: 'draft' | 'published';
  };
  setContent: (content: any) => void;
  markChanged: () => void;
}

const DynamicPageEditor = ({ page, content, setContent, markChanged }: DynamicEditorProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-body text-sm">Page Name</Label>
            <Input 
              value={content.name} 
              onChange={(e) => { 
                setContent({ ...content, name: e.target.value }); 
                markChanged(); 
              }} 
              placeholder="Page name"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-body text-sm">Path</Label>
            <Input 
              value={content.path} 
              onChange={(e) => { 
                setContent({ ...content, path: e.target.value }); 
                markChanged(); 
              }} 
              placeholder="/page-path"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-body text-sm">Status</Label>
          <select 
            value={content.status}
            onChange={(e) => { 
              setContent({ ...content, status: e.target.value as 'draft' | 'published' }); 
              markChanged(); 
            }}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="font-body text-sm">Meta Title</Label>
          <Input 
            value={content.meta_title} 
            onChange={(e) => { 
              setContent({ ...content, meta_title: e.target.value }); 
              markChanged(); 
            }} 
            placeholder="SEO title"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-body text-sm">Meta Description</Label>
          <Textarea 
            value={content.meta_description} 
            onChange={(e) => { 
              setContent({ ...content, meta_description: e.target.value }); 
              markChanged(); 
            }} 
            placeholder="SEO description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-body text-sm">Page Content</Label>
          <Textarea 
            value={content.content} 
            onChange={(e) => { 
              setContent({ ...content, content: e.target.value }); 
              markChanged(); 
            }} 
            placeholder="HTML content for the page"
            rows={15}
            className="font-mono text-sm"
          />
        </div>

        {page?.is_product_page && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="font-body text-sm font-medium text-blue-800 dark:text-blue-200">Product Page</span>
            </div>
            <p className="font-body text-xs text-blue-700 dark:text-blue-300">
              This is a product page. Products assigned to this page will be displayed in a grid layout on the frontend.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPageEditor;
