"use server";

import { revalidatePath } from "next/cache";
import {
  createTaskTemplate,
  updateTaskTemplate,
  deleteTaskTemplate,
  getTaskTemplate,
  replaceTaskTemplateItems,
} from "@/lib/server/task-templates";
import {
  createCommunicationTemplate,
  updateCommunicationTemplate,
  deleteCommunicationTemplate,
} from "@/lib/server/communication-templates";
import type { TablesInsert, TablesUpdate } from "@/lib/server/types";

type TaskTemplateItemInput = Omit<TablesInsert<"task_template_items">, "task_template_id">[];

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

export async function createTaskTemplateAction(
  input: TablesInsert<"task_templates">,
  items: TaskTemplateItemInput
) {
  try {
    const template = await createTaskTemplate(input);
    await replaceTaskTemplateItems(template.id, items);
    revalidatePath("/admin/voyages/modeles");
    return { data: template };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function updateTaskTemplateAction(
  id: string,
  patch: TablesUpdate<"task_templates">,
  items: TaskTemplateItemInput
) {
  try {
    const template = await updateTaskTemplate(id, patch);
    await replaceTaskTemplateItems(id, items);
    revalidatePath("/admin/voyages/modeles");
    revalidatePath(`/admin/voyages/modeles/${id}`);
    return { data: template };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function deleteTaskTemplateAction(id: string) {
  try {
    await deleteTaskTemplate(id);
    revalidatePath("/admin/voyages/modeles");
    return {};
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function duplicateTaskTemplateAction(id: string) {
  try {
    const source = await getTaskTemplate(id);
    if (!source) return { error: "Modèle introuvable." };
    const { id: _id, created_at, updated_at, task_template_items, ...rest } = source;
    const copy = await createTaskTemplate({ ...rest, name: `${rest.name} (copie)` });
    await replaceTaskTemplateItems(
      copy.id,
      task_template_items.map(({ id: _itemId, task_template_id: _templateId, ...item }) => item)
    );
    revalidatePath("/admin/voyages/modeles");
    return { data: copy };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function createCommunicationTemplateAction(
  input: TablesInsert<"communication_templates">
) {
  try {
    const template = await createCommunicationTemplate(input);
    revalidatePath("/admin/voyages/modeles");
    revalidatePath("/admin/parametres");
    return { data: template };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function updateCommunicationTemplateAction(
  id: string,
  patch: TablesUpdate<"communication_templates">
) {
  try {
    const template = await updateCommunicationTemplate(id, patch);
    revalidatePath("/admin/voyages/modeles");
    revalidatePath("/admin/parametres");
    return { data: template };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

export async function deleteCommunicationTemplateAction(id: string) {
  try {
    await deleteCommunicationTemplate(id);
    revalidatePath("/admin/voyages/modeles");
    revalidatePath("/admin/parametres");
    return {};
  } catch (error) {
    return { error: errorMessage(error) };
  }
}
