import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Calendar, Car, CheckCircle, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useBookings, useUpdateBookingStatus } from "@/hooks/useBookings";
import { formatCurrency } from "@/lib/fleetData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { data: bookings, isLoading } = useBookings();
  const updateStatus = useUpdateBookingStatus();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin");
      else setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/admin");
      else setUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const stats = {
    total: bookings?.length || 0,
    pending: bookings?.filter((b) => b.status === "pending").length || 0,
    confirmed: bookings?.filter((b) => b.status === "confirmed").length || 0,
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    confirmed: "bg-green-500/20 text-green-400",
    completed: "bg-blue-500/20 text-blue-400",
    cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-gradient">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Bookings", value: stats.total, icon: Calendar, color: "text-primary" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-400" },
          { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "text-green-400" },
        ].map((stat) => (
          <motion.div key={stat.label} className="glass p-6 rounded-xl" whileHover={{ scale: 1.02 }}>
            <div className="flex items-center gap-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-4 border-b border-primary/10">
          <h2 className="font-display font-semibold">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-secondary/30">
                <tr>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Car</th>
                  <th className="text-left p-4">Dates</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings?.map((booking) => (
                  <tr key={booking.id} className="border-t border-primary/10">
                    <td className="p-4">
                      <div>{booking.customer_name}</div>
                      <div className="text-xs text-muted-foreground">{booking.customer_mobile}</div>
                    </td>
                    <td className="p-4">
                      {booking.cars ? `${booking.cars.model} (${booking.cars.year})` : "N/A"}
                    </td>
                    <td className="p-4 text-xs">
                      <div>{new Date(booking.pickup_date).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">to {new Date(booking.dropoff_date).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4 font-semibold">{formatCurrency(booking.total_price)}</td>
                    <td className="p-4">
                      <Badge className={statusColors[booking.status]}>{booking.status}</Badge>
                    </td>
                    <td className="p-4">
                      {booking.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateStatus.mutate({ id: booking.id, status: "confirmed" })}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateStatus.mutate({ id: booking.id, status: "cancelled" })}
                          >
                            <XCircle className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
