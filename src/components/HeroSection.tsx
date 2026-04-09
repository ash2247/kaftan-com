import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { HeroContent, HeroSlide } from "@/hooks/usePageContent";

interface Props {
  content?: HeroContent;
  slides?: HeroSlide[];
}

const HeroSection = ({ content, slides }: Props) => {
  // Don't show anything if slides haven't loaded yet or if there are no slides
  if (!slides || slides.length === 0) {
    return (
      <section className="relative h-[60vh] md:h-[75vh] bg-secondary flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-4 mx-auto"></div>
          <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
        </div>
      </section>
    );
  }

  const activeSlides = slides;
  const titleLine1 = content?.titleLine1 || "Luxurious";
  const titleLine2 = content?.titleLine2 || "Kaftan Collection";
  const subtitle = content?.subtitle || "Discover our latest collection of handcrafted kaftans, dresses & resort wear designed for the modern woman.";
  const ctaText = content?.ctaText || "Shop Collection";
  const ctaLink = content?.ctaLink || "#new-arrivals";
  const slideInterval = content?.slideInterval || 4500;

  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    if (content?.autoSlide === false) return;
    const timer = setInterval(next, slideInterval);
    return () => clearInterval(timer);
  }, [next, slideInterval, content?.autoSlide]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[60vh] md:h-[75vh] overflow-hidden touch-pan-y"
      onTouchStart={(e) => {
        const touch = e.touches[0];
        sectionRef.current?.setAttribute("data-touch-x", String(touch.clientX));
      }}
      onTouchEnd={(e) => {
        const startX = Number(sectionRef.current?.getAttribute("data-touch-x") || 0);
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
          diff > 0 ? next() : prev();
        }
      }}
    >
      {activeSlides.map((slide, i) => (
        <motion.img
          key={i}
          src={slide.src}
          alt={slide.alt}
          initial={false}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-contain object-center"
          style={{ y }}
        />
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {activeSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? "bg-white w-6" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
