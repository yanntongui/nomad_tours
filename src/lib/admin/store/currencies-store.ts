"use client";
import { useSyncExternalStore } from "react";
import { CURRENCIES as INITIAL } from "@/lib/admin/mock/currencies";
import { CurrencyRate } from "@/lib/admin/types";

let currencies: CurrencyRate[] = [...INITIAL];
const listeners = new Set<() => void>();
function emit() {
  currencies = [...currencies];
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

export function useCurrencies() {
  return useSyncExternalStore(subscribe, () => currencies, () => currencies);
}

export function getCurrency(id: string) {
  return currencies.find((c) => c.id === id);
}

export function createEmptyCurrency(): CurrencyRate {
  return {
    id: nextId("cur"),
    code: "",
    label: "",
    rateToXOF: 1,
  };
}

export function upsertCurrency(currency: CurrencyRate) {
  const exists = currencies.some((c) => c.id === currency.id);
  currencies = exists ? currencies.map((c) => (c.id === currency.id ? currency : c)) : [currency, ...currencies];
  emit();
  return currency;
}

export function deleteCurrency(id: string) {
  currencies = currencies.filter((c) => c.id !== id);
  emit();
}
