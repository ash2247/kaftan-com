import { useState, useEffect } from "react";
import { bannerContentService, BannerContent } from "@/lib/bannerContentService";

// Import defaults
import heroKaftan1 from "@/assets/hero-kaftan-1.jpg";
import heroKaftan2 from "@/assets/hero-kaftan-2.jpg";
import heroKaftan3 from "@/assets/hero-kaftan-3.jpg";
import collectionBannerImg from "@/assets/collection-banner.jpg";
import aboutBrandImg from "@/assets/about-brand.jpg";

export interface HeroSlide {
  src: string;
  alt: string;
}

export interface HeroContent {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  autoSlide: boolean;
  slideInterval: number;
}

export interface AnnouncementContent {
  text: string;
  enabled: boolean;
}

export interface CollectionBannerContent {
  subtitle: string;
  title: string;
  ctaText: string;
  ctaLink: string;
}

export interface AboutContent {
  title: string;
  paragraph1: string;
  paragraph2: string;
  ctaText: string;
}

export interface FooterContent {
  newsletterTitle: string;
  newsletterSubtitle: string;
  ctaText: string;
  copyright: string;
}

export interface SectionMeta {
  id: string;
  label: string;
  enabled: boolean;
}

export const defaultHeroSlides: HeroSlide[] = [
  { src: heroKaftan1, alt: "Safari Collection - Premium Kaftans" },
  { src: heroKaftan2, alt: "Elegant Fashion Collection" },
  { src: heroKaftan3, alt: "Luxury Resort Wear" },
];

export const defaultHomeContent = {
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
  collectionBanner: { subtitle: "Latest Collection", title: "Golden Lady", ctaText: "Explore Collection", ctaLink: "#" } as CollectionBannerContent,
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

export const defaultSections: SectionMeta[] = [
  { id: "announcement", label: "Announcement Bar", enabled: true },
  { id: "hero", label: "Hero Section", enabled: true },
  { id: "newArrivals", label: "New Arrivals", enabled: true },
  { id: "collectionBanner", label: "Collection Banner", enabled: true },
  { id: "saleBanner", label: "Summer Sale", enabled: true },
  { id: "bestSellers", label: "Best Sellers", enabled: true },
  { id: "about", label: "About Brand", enabled: true },
  { id: "footer", label: "Footer", enabled: true },
];

export interface HomePageContent {
  hero: HeroContent;
  heroSlides: HeroSlide[];
  announcement: AnnouncementContent;
  collectionBanner: CollectionBannerContent;
  collectionImage: string;
  aboutImage: string;
  about: AboutContent;
  footer: FooterContent;
  sections: SectionMeta[];
}

export function useHomePageContent(): HomePageContent {
  const [content, setContent] = useState<HomePageContent>({
    hero: defaultHomeContent.hero,
    heroSlides: defaultHeroSlides,
    announcement: defaultHomeContent.announcement,
    collectionBanner: defaultHomeContent.collectionBanner,
    collectionImage: collectionBannerImg,
    aboutImage: aboutBrandImg,
    about: defaultHomeContent.about,
    footer: defaultHomeContent.footer,
    sections: defaultSections,
  });

  useEffect(() => {
    const fetchContent = async () => {
      console.log('🚀 Starting to fetch home page content...');
      try {
        const bannerData = await bannerContentService.getBannerContent('home');
        
        if (bannerData) {
          console.log('📦 Found banner data from Supabase:', bannerData);
          setContent(prev => ({
            hero: {
              titleLine1: bannerData.hero_title_line1 || prev.hero.titleLine1,
              titleLine2: bannerData.hero_title_line2 || prev.hero.titleLine2,
              subtitle: bannerData.hero_subtitle || prev.hero.subtitle,
              ctaText: bannerData.hero_cta_text || prev.hero.ctaText,
              ctaLink: bannerData.hero_cta_link || prev.hero.ctaLink,
              autoSlide: bannerData.hero_auto_slide !== undefined ? bannerData.hero_auto_slide : prev.hero.autoSlide,
              slideInterval: bannerData.hero_slide_interval || prev.hero.slideInterval,
            },
            heroSlides: bannerData.hero_slides || prev.heroSlides,
            announcement: {
              text: bannerData.announcement_text || prev.announcement.text,
              enabled: bannerData.announcement_enabled !== undefined ? bannerData.announcement_enabled : prev.announcement.enabled,
            },
            collectionBanner: {
              subtitle: bannerData.collection_banner_subtitle || prev.collectionBanner.subtitle,
              title: bannerData.collection_banner_title || prev.collectionBanner.title,
              ctaText: bannerData.collection_banner_cta_text || prev.collectionBanner.ctaText,
              ctaLink: bannerData.collection_banner_cta_link || prev.collectionBanner.ctaLink,
            },
            collectionImage: bannerData.collection_image || prev.collectionImage,
            aboutImage: bannerData.about_image || prev.aboutImage,
            about: {
              title: bannerData.about_title || prev.about.title,
              paragraph1: bannerData.about_paragraph1 || prev.about.paragraph1,
              paragraph2: bannerData.about_paragraph2 || prev.about.paragraph2,
              ctaText: bannerData.about_cta_text || prev.about.ctaText,
            },
            footer: {
              newsletterTitle: bannerData.footer_newsletter_title || prev.footer.newsletterTitle,
              newsletterSubtitle: bannerData.footer_newsletter_subtitle || prev.footer.newsletterSubtitle,
              ctaText: bannerData.footer_cta_text || prev.footer.ctaText,
              copyright: bannerData.footer_copyright || prev.footer.copyright,
            },
            sections: bannerData.sections || prev.sections,
          }));
        } else {
          console.log('⚠️ No banner data found in Supabase, checking localStorage...');
        }
      } catch (error) {
        console.error("❌ Failed to fetch banner content from Supabase:", error);
        // Fallback to localStorage for backward compatibility
        console.log('🔄 Falling back to localStorage...');
        const saved = localStorage.getItem("page_content_home");
        if (saved) {
          try {
            const data = JSON.parse(saved);
            console.log('📦 Found localStorage data:', data);
            setContent(prev => ({
              hero: data.hero || prev.hero,
              heroSlides: data.heroSlides || prev.heroSlides,
              announcement: data.announcement || prev.announcement,
              collectionBanner: data.collectionBanner || prev.collectionBanner,
              collectionImage: data.collectionImage || prev.collectionImage,
              aboutImage: data.aboutImage || prev.aboutImage,
              about: data.about || prev.about,
              footer: data.footer || prev.footer,
              sections: data.sections || prev.sections,
            }));
          } catch (e) {
            console.error("❌ Failed to parse localStorage content", e);
          }
        } else {
          console.log('📦 No localStorage data found, using defaults');
        }
      }
    };

    fetchContent();
  }, []);

  return content;
}

export function isSectionEnabled(sections: SectionMeta[], id: string): boolean {
  const section = sections.find(s => s.id === id);
  return section ? section.enabled : true;
}

export interface CatalogPageContent {
  title: string;
  subtitle: string;
  bannerImage: string;
  metaDescription: string;
  ogImage: string;
  announcementText: string;
  announcementEnabled: boolean;
  footerNewsletterTitle: string;
  footerNewsletterSubtitle: string;
  footerCtaText: string;
  footerCopyright: string;
}

export function useCatalogPageContent(pageKey: string): CatalogPageContent | null {
  const [content, setContent] = useState<CatalogPageContent | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`page_content_${pageKey}`);
    if (saved) {
      try {
        setContent(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse catalog page content", e);
      }
    }
  }, [pageKey]);

  return content;
}
