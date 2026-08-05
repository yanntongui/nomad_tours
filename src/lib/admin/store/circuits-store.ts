"use client";
import { useSyncExternalStore } from "react";
import { ADMIN_CIRCUITS as INITIAL } from "@/lib/admin/mock/circuits";
import { Circuit } from "@/lib/admin/types";

let circuits: Circuit[] = [...INITIAL];
const listeners = new Set<() => void>();
function emit() {
  circuits = [...circuits];
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

export function useCircuits() {
  return useSyncExternalStore(subscribe, () => circuits, () => circuits);
}

export function getCircuit(id: string) {
  return circuits.find((c) => c.id === id);
}

export function createEmptyCircuit(): Circuit {
  const now = new Date().toISOString();
  return {
    id: nextId("circ"),
    slug: "",
    title: "",
    destinationId: "",
    destinationName: "",
    durationDays: 1,
    priceXOF: 0,
    theme: "Culture",
    isFeatured: false,
    images: [],
    itinerary: [],
    included: [],
    excluded: [],
    priceTiers: [],
    options: [],
    departures: [],
    seoTitle: "",
    seoDescription: "",
    bookingsCount: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function upsertCircuit(circuit: Circuit) {
  const exists = circuits.some((c) => c.id === circuit.id);
  const saved: Circuit = { ...circuit, updatedAt: new Date().toISOString() };
  circuits = exists ? circuits.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...circuits];
  emit();
  return saved;
}

export function duplicateCircuit(id: string) {
  const source = getCircuit(id);
  if (!source) return undefined;
  const now = new Date().toISOString();
  const copy: Circuit = {
    ...source,
    id: nextId("circ"),
    slug: `${source.slug}-copie`,
    title: `${source.title} (copie)`,
    isFeatured: false,
    departures: [],
    bookingsCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  circuits = [copy, ...circuits];
  emit();
  return copy;
}

export function deleteCircuit(id: string) {
  circuits = circuits.filter((c) => c.id !== id);
  emit();
}
