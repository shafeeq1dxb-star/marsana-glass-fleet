import { motion } from "framer-motion";
import { Calendar, Car as CarIcon, Users } from "lucide-react";
import type { Car } from "@/lib/fleetData";
import { formatCurrency } from "@/lib/fleetData";

interface CarCardProps {
  car: Car;
  index: number;
  onSelect: (car: Car) => void;
}

// Get a placeholder image based on category
function getCarImage(model: string, category: string): string {
  const images: Record<string, string> = {
    economy: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&auto=format&fit=crop&q=80",
    sedan: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80",
    compact: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
    hatchback: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80",
  };
  return images[category] || images.sedan;
}

export function CarCard({ car, index, onSelect }: CarCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="glass-hover glow-border p-1 h-full">
        <div className="relative overflow-hidden rounded-xl">
          {/* Image */}
          <div className="aspect-video overflow-hidden">
            <img
              src={car.imageUrl || getCarImage(car.model, car.category)}
              alt={`${car.model} ${car.year}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          {/* Year badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/90 text-primary-foreground">
              {car.year}
            </span>
          </div>

          {/* Units badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium glass border border-primary/20">
              <Users className="w-3 h-3 inline mr-1" />
              {car.units} available
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-display text-xl font-bold text-foreground mb-1">
            {car.model}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 capitalize flex items-center gap-2">
            <CarIcon className="w-4 h-4" />
            {car.category}
          </p>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="text-center p-2 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground">Daily</p>
              <p className="font-semibold text-primary">{formatCurrency(car.dailyRate)}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground">Weekly</p>
              <p className="font-semibold text-primary">{formatCurrency(car.weeklyRate)}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground">Monthly</p>
              <p className="font-semibold text-accent">{formatCurrency(car.monthlyRate)}</p>
            </div>
          </div>

          {/* Book button */}
          <motion.button
            onClick={() => onSelect(car)}
            className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar className="w-4 h-4" />
            Book This Car
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
