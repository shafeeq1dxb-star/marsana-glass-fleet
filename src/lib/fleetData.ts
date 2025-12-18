export interface Car {
  id: string;
  model: string;
  year: number;
  units: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  category: string;
  imageUrl?: string;
}

export interface Booking {
  id: string;
  carId: string;
  customerName: string;
  customerMobile: string;
  pickupDate: Date;
  dropoffDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

export function calculatePrice(
  dailyRate: number,
  weeklyRate: number,
  monthlyRate: number,
  startDate: Date,
  endDate: Date
): { total: number; breakdown: string; days: number } {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return { total: dailyRate, breakdown: '1 day', days: 1 };
  }
  
  let total: number;
  let breakdown: string;
  
  if (days < 7) {
    // Daily rate
    total = dailyRate * days;
    breakdown = `${days} day${days > 1 ? 's' : ''} × SAR ${dailyRate}/day`;
  } else if (days < 30) {
    // Weekly rate per day
    const weeklyDailyRate = weeklyRate / 7;
    total = weeklyDailyRate * days;
    breakdown = `${days} days × SAR ${weeklyDailyRate.toFixed(2)}/day (weekly rate)`;
  } else {
    // Monthly rate per day
    const monthlyDailyRate = monthlyRate / 30;
    total = monthlyDailyRate * days;
    breakdown = `${days} days × SAR ${monthlyDailyRate.toFixed(2)}/day (monthly rate)`;
  }
  
  return { total: Math.round(total * 100) / 100, breakdown, days };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
