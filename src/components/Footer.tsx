import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Car } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="relative py-16 border-t border-primary/10">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      
      <div className="container px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
                <Car className="relative w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-gradient">
                  Marsana
                </h3>
                <p className="text-xs text-muted-foreground">Rent A Car</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium car rental services in Saudi Arabia. Quality vehicles,
              competitive prices, and exceptional customer service.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-display font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+966537489695"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +966 537 489 695
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@marsana.sa"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@marsana.sa
                </a>
              </li>
              <li>
                <span className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  Riyadh, Saudi Arabia
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-display font-semibold mb-4">Working Hours</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Saturday - Thursday: 8AM - 10PM
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Friday: 2PM - 10PM
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary/10 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Marsana Rent A Car. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
