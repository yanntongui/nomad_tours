"use client";
import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Wallet, Users, Percent, Star } from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingsStore } from "@/lib/admin/store/bookings-store";
import { useTrips } from "@/lib/admin/store/trips-store";
import type { CircuitRow } from "@/lib/server/circuits";

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

export function CircuitStatsTab({ circuit }: { circuit: CircuitRow }) {
  const { bookings } = useBookingsStore();
  const trips = useTrips();

  const circuitBookings = React.useMemo(
    () => bookings.filter((b) => b.type === "CIRCUIT" && b.referenceId === circuit.id),
    [bookings, circuit.id]
  );

  const totalRevenue = circuitBookings.reduce((sum, b) => sum + b.paidXOF, 0);
  const totalPassengers = circuitBookings.reduce((sum, b) => sum + b.passengers, 0);

  const occupancy = React.useMemo(() => {
    const totalSeats = circuit.circuit_departures.reduce((sum, d) => sum + d.seats_total, 0);
    const bookedSeats = circuit.circuit_departures.reduce((sum, d) => sum + d.seats_booked, 0);
    return totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;
  }, [circuit.circuit_departures]);

  const avgRating = React.useMemo(() => {
    const bookingIds = new Set(circuitBookings.map((b) => b.id));
    const feedbacks = trips
      .filter((t) => bookingIds.has(t.bookingId))
      .flatMap((t) => t.feedbacks);
    if (feedbacks.length === 0) return null;
    return feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
  }, [circuitBookings, trips]);

  const bookingsByMonth = React.useMemo(() => {
    const buckets = new Map<string, number>();
    circuitBookings.forEach((b) => {
      const key = format(new Date(b.createdAt), "MMM yyyy", { locale: fr });
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    });
    return Array.from(buckets.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [circuitBookings]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Revenu généré" value={formatXOF(totalRevenue)} icon={Wallet} helper={`${circuitBookings.length} réservation(s)`} />
        <KpiCard label="Voyageurs" value={String(totalPassengers)} icon={Users} helper="total passagers" />
        <KpiCard label="Taux de remplissage" value={`${occupancy}%`} icon={Percent} helper="toutes dates confondues" />
        <KpiCard label="Note moyenne" value={avgRating !== null ? avgRating.toFixed(1) : "—"} icon={Star} helper={avgRating !== null ? "sur 5" : "aucun avis"} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Réservations dans le temps</CardTitle>
        </CardHeader>
        <CardContent className="h-72 pl-0">
          {bookingsByMonth.length === 0 ? (
            <p className="text-sm text-stone-400 dark:text-stone-500 px-6">Aucune réservation pour ce circuit.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsByMonth} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFEAE3" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#78716c" }} axisLine={{ stroke: "#E7E2DA" }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" name="Réservations" fill="#C4633A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
