import { listAdminProfiles } from "@/lib/server/users";
import { RequireSuperAdmin } from "@/components/admin/RequireSuperAdmin";
import { UtilisateursClient } from "./UtilisateursClient";

export default async function UtilisateursPage() {
  const users = await listAdminProfiles();

  return (
    <RequireSuperAdmin>
      <UtilisateursClient users={users} />
    </RequireSuperAdmin>
  );
}
