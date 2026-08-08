import { listVisaRequests } from "@/lib/server/visas";
import { RequireRole } from "@/components/admin/RequireRole";
import { VisasClient } from "./VisasClient";

export default async function VisasPage() {
  const requests = await listVisaRequests();

  return (
    <RequireRole allowed={["SUPER_ADMIN", "AGENT"]}>
      <VisasClient requests={requests} />
    </RequireRole>
  );
}
