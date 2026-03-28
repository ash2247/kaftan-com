import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from './ContactForm';

interface ContactSectionProps {
  title?: string;
  description?: string;
  showContactInfo?: boolean;
  className?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({
  title = "Get in Touch",
  description = "Have questions about our collections? We'd love to hear from you.",
  showContactInfo = true,
  className = ""
}) => {
  return (
    <section className={`py-16 px-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground mb-4">
            {title}
          </h2>
          <p className="font-body text-base text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {showContactInfo && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h3 className="font-heading text-xl font-light text-foreground mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground mb-1">Email</p>
                      <a 
                        href="mailto:info@fashionspectrum.com.au" 
                        className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        info@fashionspectrum.com.au
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground mb-1">Phone</p>
                      <a 
                        href="tel:+61396999533" 
                        className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        +61 3 9699 9533
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground mb-1">Address</p>
                      <p className="font-body text-sm text-muted-foreground">
                        Melbourne, Victoria<br />
                        Australia
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-6">
                <h4 className="font-heading text-lg font-light text-foreground mb-3">
                  Business Hours
                </h4>
                <div className="space-y-2 font-body text-sm text-muted-foreground">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
