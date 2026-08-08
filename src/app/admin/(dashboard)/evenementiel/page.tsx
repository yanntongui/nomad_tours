import { listEventRequests } from "@/lib/server/events";
import { RequireRole } from "@/components/admin/RequireRole";
import { EvenementielClient } from "./EvenementielClient";

export default async function EvenementielPage() {
  const requests = await listEventRequests();

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <EvenementielClient requests={requests} />
    </RequireRole>
  );
}
