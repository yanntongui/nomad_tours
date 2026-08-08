import { listFlightBookings } from "@/lib/server/flights";
import { listClients } from "@/lib/server/clients";
import { RequireRole } from "@/components/admin/RequireRole";
import { VolsClient } from "./VolsClient";

export default async function VolsPage() {
  const [bookings, clients] = await Promise.all([listFlightBookings(), listClients()]);

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <VolsClient bookings={bookings} clients={clients} />
    </RequireRole>
  );
}
