import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TaskTemplateForm } from "@/components/admin/TaskTemplateForm";
import { getTaskTemplate, listTaskTemplates } from "@/lib/server/task-templates";
import { listCommunicationTemplates } from "@/lib/server/communication-templates";

export default async function EditTaskTemplatePage({ params }: { params: { id: string } }) {
  const [template, taskTemplates, commTemplates] = await Promise.all([
    getTaskTemplate(params.id),
    listTaskTemplates(),
    listCommunicationTemplates(),
  ]);

  if (!template) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-10 text-center dark:border-stone-800 dark:bg-stone-900">
        <p className="text-stone-500 dark:text-stone-400">Modèle introuvable.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/admin/voyages/modeles"><ArrowLeft className="h-4 w-4" />Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const itemTitleSuggestions = Array.from(
    new Set(taskTemplates.flatMap((t) => t.task_template_items.map((i) => i.title)))
  );

  return (
    <TaskTemplateForm
      initial={template}
      mode="edit"
      key={template.id}
      commTemplates={commTemplates.filter((t) => t.scope === "TRIP")}
      itemTitleSuggestions={itemTitleSuggestions}
    />
  );
}
