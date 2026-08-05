"use client";
import { useSyncExternalStore } from "react";
import { ADMIN_DESTINATIONS as INITIAL } from "@/lib/admin/mock/destinations";
import { Destination } from "@/lib/admin/types";

let destinations: Destination[] = [...INITIAL];
const listeners = new Set<() => void>();
function emit() {
  destinations = [...destinations];
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

export function useDestinations() {
  return useSyncExternalStore(subscribe, () => destinations, () => destinations);
}

export function getDestination(id: string) {
  return destinations.find((d) => d.id === id);
}

export function createEmptyDestination(): Destination {
  const now = new Date().toISOString();
  return {
    id: nextId("dest"),
    slug: "",
    name: "",
    country: "",
    region: "",
    description: "",
    highlights: [],
    images: [],
    climate: "",
    bestPeriod: "",
    isInternational: false,
    isFeatured: false,
    pointsOfInterest: [],
    seoTitle: "",
    seoDescription: "",
    circuitsCount: 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function upsertDestination(destination: Destination) {
  const exists = destinations.some((d) => d.id === destination.id);
  const saved: Destination = { ...destination, updatedAt: new Date().toISOString() };
  destinations = exists
    ? destinations.map((d) => (d.id === saved.id ? saved : d))
    : [saved, ...destinations];
  emit();
  return saved;
}

export function duplicateDestination(id: string) {
  const source = getDestination(id);
  if (!source) return undefined;
  const now = new Date().toISOString();
  const copy: Destination = {
    ...source,
    id: nextId("dest"),
    slug: `${source.slug}-copie`,
    name: `${source.name} (copie)`,
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  };
  destinations = [copy, ...destinations];
  emit();
  return copy;
}

export function deleteDestination(id: string) {
  destinations = destinations.filter((d) => d.id !== id);
  emit();
}
