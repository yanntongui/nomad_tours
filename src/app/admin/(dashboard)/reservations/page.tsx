import { listBookings } from "@/lib/server/bookings";
import { listAdminProfiles } from "@/lib/server/users";
import { RequireRole } from "@/components/admin/RequireRole";
import { ReservationsClient } from "./ReservationsClient";

export default async function ReservationsPage() {
  const [bookings, profiles] = await Promise.all([listBookings(), listAdminProfiles()]);
  const agents = profiles.filter((p) => p.role === "AGENT" || p.role === "SUPER_ADMIN");

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <ReservationsClient bookings={bookings} agents={agents} />
    </RequireRole>
  );
}
