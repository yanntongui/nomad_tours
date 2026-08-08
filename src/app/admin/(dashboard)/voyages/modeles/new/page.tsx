import { listTaskTemplates } from "@/lib/server/task-templates";
import { listCommunicationTemplates } from "@/lib/server/communication-templates";
import { TaskTemplateForm } from "@/components/admin/TaskTemplateForm";

export default async function NewTaskTemplatePage() {
  const [taskTemplates, commTemplates] = await Promise.all([
    listTaskTemplates(),
    listCommunicationTemplates(),
  ]);

  const itemTitleSuggestions = Array.from(
    new Set(taskTemplates.flatMap((t) => t.task_template_items.map((i) => i.title)))
  );

  return (
    <TaskTemplateForm
      initial={null}
      mode="create"
      commTemplates={commTemplates.filter((t) => t.scope === "TRIP")}
      itemTitleSuggestions={itemTitleSuggestions}
    />
  );
}
