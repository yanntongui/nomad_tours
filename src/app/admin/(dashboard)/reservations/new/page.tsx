import { listClients } from "@/lib/server/clients";
import { listAdminProfiles } from "@/lib/server/users";
import { listCircuits } from "@/lib/server/circuits";
import { listDestinations } from "@/lib/server/destinations";
import { RequireRole } from "@/components/admin/RequireRole";
import { NewBookingClient } from "./NewBookingClient";

export default async function NewBookingPage() {
  const [clients, profiles, circuits, destinations] = await Promise.all([
    listClients(),
    listAdminProfiles(),
    listCircuits(),
    listDestinations(),
  ]);
  const agents = profiles.filter((p) => p.role === "AGENT" || p.role === "SUPER_ADMIN");

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <NewBookingClient clients={clients} agents={agents} circuits={circuits} destinations={destinations} />
    </RequireRole>
  );
}
