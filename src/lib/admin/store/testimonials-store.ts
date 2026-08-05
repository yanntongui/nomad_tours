"use client";
import { useSyncExternalStore } from "react";
import { ADMIN_TESTIMONIALS as INITIAL } from "@/lib/admin/mock/testimonials";
import { AdminTestimonial } from "@/lib/admin/types";

let testimonials: AdminTestimonial[] = [...INITIAL];
const listeners = new Set<() => void>();
function emit() {
  testimonials = [...testimonials];
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useTestimonialsStore() {
  return useSyncExternalStore(subscribe, () => testimonials, () => testimonials);
}

export function approveTestimonial(id: string) {
  testimonials = testimonials.map((t) => (t.id === id ? { ...t, status: "APPROVED" } : t));
  emit();
}

export function rejectTestimonial(id: string) {
  testimonials = testimonials.map((t) => (t.id === id ? { ...t, status: "REJECTED" } : t));
  emit();
}

export function deleteTestimonial(id: string) {
  testimonials = testimonials.filter((t) => t.id !== id);
  emit();
}
