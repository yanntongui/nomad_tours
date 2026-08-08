"use client";
import { useSyncExternalStore } from "react";
import { NEWSLETTER_SUBSCRIBERS as INITIAL } from "@/lib/admin/mock/newsletter";
import { NewsletterSubscriber } from "@/lib/admin/types";

let subscribers: NewsletterSubscriber[] = [...INITIAL];
const listeners = new Set<() => void>();
function emit() {
  subscribers = [...subscribers];
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useNewsletterSubscribers() {
  return useSyncExternalStore(subscribe, () => subscribers, () => subscribers);
}

export function disableNewsletterSubscriber(id: string) {
  subscribers = subscribers.map((s) => (s.id === id ? { ...s, status: "DISABLED" } : s));
  emit();
}

export function enableNewsletterSubscriber(id: string) {
  subscribers = subscribers.map((s) => (s.id === id ? { ...s, status: "ACTIVE" } : s));
  emit();
}
