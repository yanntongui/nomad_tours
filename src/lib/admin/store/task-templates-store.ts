"use client";
import { useSyncExternalStore } from "react";
import { TASK_TEMPLATES as INITIAL } from "@/lib/admin/mock/task-templates";
import { TaskTemplate } from "@/lib/admin/types";

let templates: TaskTemplate[] = [...INITIAL];
const listeners = new Set<() => void>();
function emit() {
  templates = [...templates];
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
let seq = 1;
function nextId(prefix: string) {
  seq += 1;
  return `${prefix}-${Date.now()}-${seq}`;
}

export function useTaskTemplates() {
  return useSyncExternalStore(subscribe, () => templates, () => templates);
}

export function getTaskTemplate(id: string) {
  return templates.find((t) => t.id === id);
}

export function createEmptyTaskTemplate(): TaskTemplate {
  const now = new Date().toISOString();
  return {
    id: nextId("tt"),
    name: "",
    items: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function upsertTaskTemplate(template: TaskTemplate) {
  const exists = templates.some((t) => t.id === template.id);
  const saved: TaskTemplate = { ...template, updatedAt: new Date().toISOString() };
  templates = exists ? templates.map((t) => (t.id === saved.id ? saved : t)) : [saved, ...templates];
  emit();
  return saved;
}

export function duplicateTaskTemplate(id: string) {
  const source = getTaskTemplate(id);
  if (!source) return undefined;
  const now = new Date().toISOString();
  const copy: TaskTemplate = {
    ...source,
    id: nextId("tt"),
    name: `${source.name} (copie)`,
    items: source.items.map((item, i) => ({ ...item, id: `${nextId("tti")}-${i}` })),
    createdAt: now,
    updatedAt: now,
  };
  templates = [copy, ...templates];
  emit();
  return copy;
}

export function deleteTaskTemplate(id: string) {
  templates = templates.filter((t) => t.id !== id);
  emit();
}
