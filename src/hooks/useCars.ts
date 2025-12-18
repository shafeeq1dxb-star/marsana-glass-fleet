import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Car } from "@/lib/fleetData";

export function useCars() {
  return useQuery({
    queryKey: ["cars"],
    queryFn: async (): Promise<Car[]> => {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("year", { ascending: false })
        .order("model", { ascending: true });

      if (error) throw error;

      return data.map((car) => ({
        id: car.id,
        model: car.model,
        year: car.year,
        units: car.units,
        dailyRate: Number(car.daily_rate),
        weeklyRate: Number(car.weekly_rate),
        monthlyRate: Number(car.monthly_rate),
        category: car.category || "sedan",
        imageUrl: car.image_url || undefined,
      }));
    },
  });
}
