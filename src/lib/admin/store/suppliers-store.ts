"use client";
import { useSyncExternalStore } from "react";
import { SUPPLIERS as INITIAL } from "@/lib/admin/mock/suppliers";
import { Supplier } from "@/lib/admin/types";

let suppliers: Supplier[] = [...INITIAL];
const listeners = new Set<() => void>();
function emit() {
  suppliers = [...suppliers];
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

export function useSuppliers() {
  return useSyncExternalStore(subscribe, () => suppliers, () => suppliers);
}

export function getSupplier(id: string) {
  return suppliers.find((s) => s.id === id);
}

export function createEmptySupplier(): Supplier {
  return {
    id: nextId("sup"),
    name: "",
    type: "AUTRE",
    active: true,
    createdAt: new Date().toISOString(),
  };
}

export function upsertSupplier(supplier: Supplier) {
  const exists = suppliers.some((s) => s.id === supplier.id);
  suppliers = exists ? suppliers.map((s) => (s.id === supplier.id ? supplier : s)) : [supplier, ...suppliers];
  emit();
  return supplier;
}

export function deleteSupplier(id: string) {
  suppliers = suppliers.filter((s) => s.id !== id);
  emit();
}
