import { listTaskTemplates } from "@/lib/server/task-templates";
import { listCommunicationTemplates } from "@/lib/server/communication-templates";
import { ModelesClient } from "./ModelesClient";

export default async function ModelesPage() {
  const [taskTemplates, commTemplates] = await Promise.all([
    listTaskTemplates(),
    listCommunicationTemplates(),
  ]);

  return <ModelesClient taskTemplates={taskTemplates} commTemplates={commTemplates} />;
}
