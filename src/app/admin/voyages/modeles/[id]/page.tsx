"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TaskTemplateForm } from "@/components/admin/TaskTemplateForm";
import { useTaskTemplates } from "@/lib/admin/store/task-templates-store";

export default function EditTaskTemplatePage({ params }: { params: { id: string } }) {
  const templates = useTaskTemplates();
  const template = templates.find((t) => t.id === params.id);

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

  return <TaskTemplateForm initial={template} mode="edit" key={template.id} />;
}
