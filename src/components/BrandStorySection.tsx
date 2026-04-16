import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Globe, Users, Award, ArrowRight } from "lucide-react";
import { useHomePageContent } from "@/hooks/usePageContent";

// Import actual images
import aboutBrandImage from "@/assets/safari/safari-1.png";
import paradiseImage from "@/assets/paradise/paradise-2.jpg";

const BrandStorySection = () => {
  const content = useHomePageContent();
  const values = [
    {
      icon: Heart,
      title: "Handcrafted with Love",
      description: "Each piece is carefully crafted by skilled artisans who pour their heart into every stitch."
    },
    {
      icon: Globe,
      title: "Sustainable Fashion",
      description: "We prioritize eco-friendly materials and ethical production practices for a better future."
    },
    {
      icon: Users,
      title: "Empowering Communities",
      description: "Supporting local artisans and their families through fair trade practices."
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "Premium materials and meticulous attention to detail ensure lasting beauty."
    }
  ];

  return (
    <section className="py-16 md:py-24 px-6 md:px-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-light text-foreground mb-4">
            {content.about.title}
          </h2>
        </motion.div>

        {/* Story content with image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 lg:col-span-1"
          >
            <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-lg">
              {content.about.paragraph1}
            </p>
            <div>
              <h3 className="font-heading text-2xl font-light text-foreground mb-4">
                Heritage Meets Modernity
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed max-w-lg">
                {content.about.paragraph2}
              </p>
            </div>
            
            <Link
              to="/our-story"
              className="inline-flex items-center gap-2 font-body text-sm tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors duration-300 border-b border-foreground hover:border-primary pb-1"
            >
              {content.about.ctaText}
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:col-span-1"
          >
            <div className="aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src={aboutBrandImage}
                alt="Artisan crafting kaftan"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            
            {/* Floating stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 bg-primary text-primary-foreground p-4 lg:p-6 rounded-lg shadow-lg"
            >
              <div className="text-center">
                <div className="font-heading text-2xl lg:text-3xl font-light mb-1">20+</div>
                <div className="font-body text-xs lg:text-sm">Years of Excellence</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Values grid */}
        
        {/* Call to action */}
              </div>
    </section>
  );
};

export default BrandStorySection;
