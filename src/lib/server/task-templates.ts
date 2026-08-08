import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "./types";

export type TaskTemplateRow = Tables<"task_templates"> & {
  task_template_items: Tables<"task_template_items">[];
};

export async function listTaskTemplates() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("task_templates")
    .select("*, task_template_items(*)")
    .order("name");
  if (error) throw error;
  return data as TaskTemplateRow[];
}

export async function getTaskTemplate(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("task_templates")
    .select("*, task_template_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as TaskTemplateRow | null;
}

export async function createTaskTemplate(
  template: TablesInsert<"task_templates">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("task_templates")
    .insert(template)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTaskTemplate(
  id: string,
  patch: TablesUpdate<"task_templates">,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("task_templates")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTaskTemplate(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("task_templates").delete().eq("id", id);
  if (error) throw error;
}

/** Replaces every item on a template — mirrors TaskTemplateForm.tsx's "save whole list" editing pattern. */
export async function replaceTaskTemplateItems(
  templateId: string,
  items: Omit<TablesInsert<"task_template_items">, "task_template_id">[],
) {
  const supabase = await createClient();
  const { error: deleteError } = await supabase
    .from("task_template_items")
    .delete()
    .eq("task_template_id", templateId);
  if (deleteError) throw deleteError;
  if (items.length === 0) return [];
  const { data, error } = await supabase
    .from("task_template_items")
    .insert(items.map((item) => ({ ...item, task_template_id: templateId })))
    .select();
  if (error) throw error;
  return data;
}
