import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBooking } from "@/lib/server/bookings";
import { listAdminProfiles } from "@/lib/server/users";
import { RequireRole } from "@/components/admin/RequireRole";
import { Button } from "@/components/ui/button";
import { BookingDetailClient } from "./BookingDetailClient";

export default async function BookingDetailPage({ params }: { params: { id: string } }) {
  const [booking, profiles] = await Promise.all([getBooking(params.id), listAdminProfiles()]);
  const agents = profiles.filter((p) => p.role === "AGENT" || p.role === "SUPER_ADMIN");

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      {booking ? (
        <BookingDetailClient booking={booking} agents={agents} />
      ) : (
        <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
          <p className="text-stone-500 dark:text-stone-400">Réservation introuvable.</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/admin/reservations"><ArrowLeft className="h-4 w-4" />Retour à la liste</Link>
          </Button>
        </div>
      )}
    </RequireRole>
  );
}
