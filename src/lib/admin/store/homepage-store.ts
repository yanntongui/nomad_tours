"use client";
import { useSyncExternalStore } from "react";
import { HOMEPAGE_CONTENT as INITIAL_CONTENT } from "@/lib/admin/mock/homepage";
import { HomepageContent } from "@/lib/admin/types";

let state: HomepageContent = { ...INITIAL_CONTENT };

const listeners = new Set<() => void>();
function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useHomepageContent() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
}

export function getHomepageContent() {
  return state;
}

export function updateHomepageContent(content: HomepageContent) {
  state = { ...content };
  emit();
}
