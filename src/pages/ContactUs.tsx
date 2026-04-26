import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

const ContactUs = () => {

  return (
    <div className="min-h-screen bg-background pt-[92px] pb-mobile-nav">
      <Navbar />

      {/* Header */}
      <section className="py-16 md:py-20 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-4">Contact Us</h1>
          <p className="font-body text-base text-muted-foreground max-w-2xl mx-auto">
            Want to stay on top of the latest fashion trends? Contact us for all your fashion needs! Whether you need styling advice or have product inquiries, we're here to help.
          </p>
        </motion.div>
      </section>

      {/* Content Grid */}
      <section className="px-6 md:px-16 pb-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-2 space-y-8"
          >
            <h2 className="font-heading text-2xl font-light text-foreground">Get in Touch</h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-foreground">Email</p>
                  <a href="mailto:info@fashionspectrum.com.au" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                    info@fashionspectrum.com.au
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-foreground">Phone</p>
                  <a href="tel:+61396999533" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                    +61 3 9699 9533
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-foreground">Address</p>
                  <p className="font-body text-sm text-muted-foreground">
                    Melbourne, Victoria<br />Australia
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="md:col-span-3"
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
