import { listClients } from "@/lib/server/clients";
import { listBookingStats } from "@/lib/server/bookings";
import { RequireRole } from "@/components/admin/RequireRole";
import { ClientsListClient } from "./ClientsListClient";

export default async function ClientsPage() {
  const [clients, bookingStats] = await Promise.all([listClients(), listBookingStats()]);

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <ClientsListClient clients={clients} bookingStats={bookingStats} />
    </RequireRole>
  );
}
