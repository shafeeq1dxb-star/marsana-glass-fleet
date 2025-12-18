import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Phone, Calculator, MessageSquare } from "lucide-react";
import { useCreateBooking } from "@/hooks/useBookings";
import { calculatePrice, formatCurrency } from "@/lib/fleetData";
import type { Car } from "@/lib/fleetData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { z } from "zod";

interface BookingModalProps {
  car: Car | null;
  onClose: () => void;
}

const bookingSchema = z.object({
  customerName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  customerMobile: z.string().trim().regex(/^[\d+\-\s()]+$/, "Invalid phone number").min(8).max(20),
  pickupDate: z.date(),
  dropoffDate: z.date(),
});

export function BookingModal({ car, onClose }: BookingModalProps) {
  const createBooking = useCreateBooking();
  const [formData, setFormData] = useState({
    customerName: "",
    customerMobile: "",
    pickupDate: "",
    pickupTime: "09:00",
    dropoffDate: "",
    dropoffTime: "09:00",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [priceInfo, setPriceInfo] = useState<{
    total: number;
    breakdown: string;
    days: number;
  } | null>(null);

  useEffect(() => {
    if (formData.pickupDate && formData.dropoffDate && car) {
      const pickup = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
      const dropoff = new Date(`${formData.dropoffDate}T${formData.dropoffTime}`);
      
      if (dropoff > pickup) {
        const info = calculatePrice(
          car.dailyRate,
          car.weeklyRate,
          car.monthlyRate,
          pickup,
          dropoff
        );
        setPriceInfo(info);
      } else {
        setPriceInfo(null);
      }
    } else {
      setPriceInfo(null);
    }
  }, [formData, car]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car || !priceInfo) return;

    const pickup = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const dropoff = new Date(`${formData.dropoffDate}T${formData.dropoffTime}`);

    try {
      bookingSchema.parse({
        customerName: formData.customerName,
        customerMobile: formData.customerMobile,
        pickupDate: pickup,
        dropoffDate: dropoff,
      });
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }
    }

    await createBooking.mutateAsync({
      carId: car.id,
      customerName: formData.customerName.trim(),
      customerMobile: formData.customerMobile.trim(),
      pickupDate: pickup,
      dropoffDate: dropoff,
      totalPrice: priceInfo.total,
    });

    // Send WhatsApp notification
    const whatsappMessage = encodeURIComponent(
      `🚗 New Booking Request!\n\n` +
      `Customer: ${formData.customerName}\n` +
      `Mobile: ${formData.customerMobile}\n` +
      `Car: ${car.model} (${car.year})\n` +
      `Pick-up: ${pickup.toLocaleString()}\n` +
      `Drop-off: ${dropoff.toLocaleString()}\n` +
      `Total: ${formatCurrency(priceInfo.total)}`
    );
    window.open(`https://wa.me/966537489695?text=${whatsappMessage}`, "_blank");

    onClose();
    setFormData({
      customerName: "",
      customerMobile: "",
      pickupDate: "",
      pickupTime: "09:00",
      dropoffDate: "",
      dropoffTime: "09:00",
    });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <AnimatePresence>
      {car && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="glass border border-primary/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 glass border-b border-primary/10 p-6 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-gradient">
                  Book Your Ride
                </h2>
                <p className="text-sm text-muted-foreground">
                  {car.model} ({car.year})
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-primary" />
                    Full Name
                  </Label>
                  <Input
                    id="customerName"
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="bg-secondary/50 border-primary/20 focus:border-primary"
                    required
                  />
                  {errors.customerName && (
                    <p className="text-xs text-destructive mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="customerMobile" className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-primary" />
                    Mobile Number
                  </Label>
                  <Input
                    id="customerMobile"
                    type="tel"
                    value={formData.customerMobile}
                    onChange={(e) =>
                      setFormData({ ...formData, customerMobile: e.target.value })
                    }
                    placeholder="+966 5XX XXX XXXX"
                    className="bg-secondary/50 border-primary/20 focus:border-primary"
                    required
                  />
                  {errors.customerMobile && (
                    <p className="text-xs text-destructive mt-1">{errors.customerMobile}</p>
                  )}
                </div>
              </div>

              {/* Date/Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickupDate" className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Pick-up Date
                  </Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    min={today}
                    value={formData.pickupDate}
                    onChange={(e) =>
                      setFormData({ ...formData, pickupDate: e.target.value })
                    }
                    className="bg-secondary/50 border-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pickupTime" className="mb-2 block">Time</Label>
                  <Input
                    id="pickupTime"
                    type="time"
                    value={formData.pickupTime}
                    onChange={(e) =>
                      setFormData({ ...formData, pickupTime: e.target.value })
                    }
                    className="bg-secondary/50 border-primary/20 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dropoffDate" className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-accent" />
                    Drop-off Date
                  </Label>
                  <Input
                    id="dropoffDate"
                    type="date"
                    min={formData.pickupDate || today}
                    value={formData.dropoffDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dropoffDate: e.target.value })
                    }
                    className="bg-secondary/50 border-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dropoffTime" className="mb-2 block">Time</Label>
                  <Input
                    id="dropoffTime"
                    type="time"
                    value={formData.dropoffTime}
                    onChange={(e) =>
                      setFormData({ ...formData, dropoffTime: e.target.value })
                    }
                    className="bg-secondary/50 border-primary/20 focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Price Calculation */}
              {priceInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Price Breakdown</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {priceInfo.breakdown}
                  </p>
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">
                      Total ({priceInfo.days} day{priceInfo.days !== 1 ? "s" : ""})
                    </span>
                    <span className="text-2xl font-bold text-gradient">
                      {formatCurrency(priceInfo.total)}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!priceInfo || createBooking.isPending}
                className="w-full btn-primary py-4 disabled:opacity-50"
              >
                {createBooking.isPending ? (
                  "Processing..."
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By booking, you agree to our terms. You'll receive a WhatsApp
                confirmation shortly.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
