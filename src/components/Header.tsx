import { motion } from "framer-motion";
import { Car, Phone, MapPin } from "lucide-react";

export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="glass border-b border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
                <Car className="relative w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-gradient">
                  Marsana
                </h1>
                <p className="text-xs text-muted-foreground -mt-1">Rent A Car</p>
              </div>
            </motion.div>

            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#fleet"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Our Fleet
              </a>
              <a
                href="#pricing"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <motion.a
                href="tel:+966537489695"
                className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="w-4 h-4" />
                <span>+966 537 489 695</span>
              </motion.a>
              <motion.a
                href="#fleet"
                className="btn-primary text-sm py-2 px-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Now
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
