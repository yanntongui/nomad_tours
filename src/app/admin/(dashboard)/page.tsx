import { listBookings, listPaymentSchedules, listBookingTimelineAll } from "@/lib/server/bookings";
import { listTripsSummary } from "@/lib/server/trips";
import { listClients } from "@/lib/server/clients";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [bookings, schedules, trips, clients, timeline, agentsResult] = await Promise.all([
    listBookings(),
    listPaymentSchedules(),
    listTripsSummary(),
    listClients(),
    listBookingTimelineAll(6),
    supabase.from("admin_profiles").select("id, name").eq("role", "AGENT").order("name"),
  ]);

  return (
    <AdminDashboardClient
      bookings={bookings}
      schedules={schedules}
      trips={trips}
      clients={clients}
      timeline={timeline}
      agents={agentsResult.data ?? []}
    />
  );
}
