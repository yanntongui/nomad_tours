import { listClients } from "@/lib/server/clients";
import { RequireRole } from "@/components/admin/RequireRole";
import { ClientsListClient } from "./ClientsListClient";

export default async function ClientsPage() {
  const clients = await listClients();

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <ClientsListClient clients={clients} />
    </RequireRole>
  );
}
