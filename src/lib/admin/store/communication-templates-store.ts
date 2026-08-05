"use client";
import { useSyncExternalStore } from "react";
import { COMMUNICATION_TEMPLATES as INITIAL } from "@/lib/admin/mock/communication-templates";
import { CommunicationTemplate } from "@/lib/admin/types";

let templates: CommunicationTemplate[] = [...INITIAL];
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

export function useCommunicationTemplates() {
  return useSyncExternalStore(subscribe, () => templates, () => templates);
}

export function getCommunicationTemplate(id: string) {
  return templates.find((t) => t.id === id);
}

export function createEmptyCommunicationTemplate(): CommunicationTemplate {
  return {
    id: nextId("ct"),
    name: "",
    phase: "AVANT",
    channel: "EMAIL",
    body: "",
  };
}

export function upsertCommunicationTemplate(template: CommunicationTemplate) {
  const exists = templates.some((t) => t.id === template.id);
  templates = exists ? templates.map((t) => (t.id === template.id ? template : t)) : [template, ...templates];
  emit();
  return template;
}

export function deleteCommunicationTemplate(id: string) {
  templates = templates.filter((t) => t.id !== id);
  emit();
}
