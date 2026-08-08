"use client";
import { useSyncExternalStore } from "react";
import { PAYMENT_SETTINGS as INITIAL_SETTINGS } from "@/lib/admin/mock/payment-settings";
import { PaymentSettings } from "@/lib/admin/types";

let state: PaymentSettings = { ...INITIAL_SETTINGS };

const listeners = new Set<() => void>();
function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function usePaymentSettings() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
}

export function updatePaymentSettings(patch: Partial<PaymentSettings>) {
  state = { ...state, ...patch };
  emit();
}
