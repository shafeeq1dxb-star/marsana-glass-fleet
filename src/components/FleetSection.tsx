import { useState } from "react";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { useCars } from "@/hooks/useCars";
import { CarCard } from "./CarCard";
import { BookingModal } from "./BookingModal";
import type { Car } from "@/lib/fleetData";

export function FleetSection() {
  const { data: cars, isLoading, error } = useCars();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);

  const years = cars
    ? [...new Set(cars.map((c) => c.year))].sort((a, b) => b - a)
    : [];

  const filteredCars = yearFilter
    ? cars?.filter((c) => c.year === yearFilter)
    : cars;

  if (error) {
    return (
      <section id="fleet" className="py-20 relative">
        <div className="container px-4">
          <div className="glass p-8 rounded-2xl text-center">
            <p className="text-destructive">Failed to load fleet data. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="fleet" className="py-20 relative">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
            OUR COLLECTION
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Premium</span>{" "}
            <span className="text-gradient">Fleet</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our wide selection of well-maintained vehicles. From
            economical options to premium sedans, we have the perfect car for
            every journey.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            Filter by year:
          </span>
          <button
            onClick={() => setYearFilter(null)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              yearFilter === null
                ? "bg-primary text-primary-foreground"
                : "glass hover:border-primary/30"
            }`}
          >
            All Years
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setYearFilter(year)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                yearFilter === year
                  ? "bg-primary text-primary-foreground"
                  : "glass hover:border-primary/30"
              }`}
            >
              {year}
            </button>
          ))}
        </motion.div>

        {/* Fleet Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass p-1 rounded-2xl animate-pulse">
                <div className="aspect-video bg-secondary/50 rounded-xl mb-4" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-secondary/50 rounded w-3/4" />
                  <div className="h-4 bg-secondary/50 rounded w-1/2" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-16 bg-secondary/50 rounded" />
                    <div className="h-16 bg-secondary/50 rounded" />
                    <div className="h-16 bg-secondary/50 rounded" />
                  </div>
                  <div className="h-12 bg-secondary/50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars?.map((car, index) => (
              <CarCard
                key={car.id}
                car={car}
                index={index}
                onSelect={setSelectedCar}
              />
            ))}
          </div>
        )}

        {filteredCars?.length === 0 && (
          <div className="glass p-8 rounded-2xl text-center">
            <p className="text-muted-foreground">No cars found for the selected filter.</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal car={selectedCar} onClose={() => setSelectedCar(null)} />
    </section>
  );
}
