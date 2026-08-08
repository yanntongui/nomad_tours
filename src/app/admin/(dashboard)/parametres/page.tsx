import { getAgencySettings } from "@/lib/server/settings";
import { listCommunicationTemplates } from "@/lib/server/communication-templates";
import { RequireSuperAdmin } from "@/components/admin/RequireSuperAdmin";
import { ParametresClient } from "./ParametresClient";

export default async function ParametresPage() {
  const [agencySettings, commTemplates] = await Promise.all([
    getAgencySettings(),
    listCommunicationTemplates(),
  ]);

  return (
    <RequireSuperAdmin>
      <ParametresClient
        agencySettings={agencySettings}
        commTemplates={commTemplates.filter((t) => t.scope === "SYSTEM")}
      />
    </RequireSuperAdmin>
  );
}
