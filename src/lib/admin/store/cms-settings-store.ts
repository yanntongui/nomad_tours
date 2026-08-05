"use client";
import { useSyncExternalStore } from "react";
import { CMS_SEO_SETTINGS as INITIAL_SETTINGS } from "@/lib/admin/mock/cms-settings";
import { CmsSeoSettings } from "@/lib/admin/types";

let state: CmsSeoSettings = { ...INITIAL_SETTINGS };

const listeners = new Set<() => void>();
function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useCmsSeoSettings() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
}

export function updateCmsSeoSettings(patch: Partial<CmsSeoSettings>) {
  state = { ...state, ...patch };
  emit();
}
