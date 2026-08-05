"use client";
import { useSyncExternalStore } from "react";
import { AGENCY_SETTINGS as INITIAL_SETTINGS } from "@/lib/admin/mock/settings";
import { AgencySettings } from "@/lib/admin/types";

let state: AgencySettings = { ...INITIAL_SETTINGS };

const listeners = new Set<() => void>();
function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useSettings() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
}

export function updateSettings(patch: Partial<AgencySettings>) {
  state = { ...state, ...patch };
  emit();
}
