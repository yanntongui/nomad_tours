import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequireRole } from "@/components/admin/RequireRole";
import { getTrip, getTripReport } from "@/lib/server/trips";
import { getBooking } from "@/lib/server/bookings";
import { getCircuit } from "@/lib/server/circuits";
import { TripReportClient } from "./TripReportClient";

export default async function TripReportPage({ params }: { params: { id: string } }) {
  const trip = await getTrip(params.id);

  if (!trip) {
    return (
      <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
        <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
          <p className="text-stone-500 dark:text-stone-400">Voyage introuvable.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/admin/voyages">
              <ArrowLeft className="h-4 w-4" />
              Retour à la liste
            </Link>
          </Button>
        </div>
      </RequireRole>
    );
  }

  const [report, booking] = await Promise.all([getTripReport(trip.id), getBooking(trip.booking_id)]);
  const circuit = booking?.type === "CIRCUIT" && booking.reference_id ? await getCircuit(booking.reference_id) : null;
  const itineraryDays = (circuit?.circuit_itinerary_days ?? [])
    .map((d) => ({ id: d.id, day: d.day_number, title: d.title }))
    .sort((a, b) => a.day - b.day);

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <TripReportClient trip={trip} report={report} booking={booking} itineraryDays={itineraryDays} />
    </RequireRole>
  );
}
