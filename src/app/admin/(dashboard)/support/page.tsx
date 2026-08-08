import { listSupportTickets } from "@/lib/server/support";
import { listClients } from "@/lib/server/clients";
import { RequireRole } from "@/components/admin/RequireRole";
import { SupportClient } from "./SupportClient";

export default async function SupportPage() {
  const [tickets, clients] = await Promise.all([listSupportTickets(), listClients()]);

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <SupportClient tickets={tickets} clients={clients} />
    </RequireRole>
  );
}
