import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface BookingData {
  carId: string;
  customerName: string;
  customerMobile: string;
  pickupDate: Date;
  dropoffDate: Date;
  totalPrice: number;
}

export interface Booking {
  id: string;
  car_id: string | null;
  customer_name: string;
  customer_mobile: string;
  pickup_date: string;
  dropoff_date: string;
  total_price: number;
  status: string;
  created_at: string;
  cars?: {
    model: string;
    year: number;
  } | null;
}

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          cars (
            model,
            year
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: BookingData) => {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          car_id: booking.carId,
          customer_name: booking.customerName,
          customer_mobile: booking.customerMobile,
          pickup_date: booking.pickupDate.toISOString(),
          dropoff_date: booking.dropoffDate.toISOString(),
          total_price: booking.totalPrice,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: "Booking Submitted!",
        description: "Your reservation request has been received. We'll contact you shortly.",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: "Status Updated",
        description: "Booking status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
