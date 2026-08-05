"use client";
import { useSyncExternalStore } from "react";
import { LOYALTY_OFFERS as INITIAL } from "@/lib/admin/mock/loyalty";
import { LoyaltyOffer, VipTier } from "@/lib/admin/types";

export const VIP_TIERS: VipTier[] = ["STANDARD", "SILVER", "GOLD", "PLATINUM"];

export function tierRank(tier: VipTier) {
  return VIP_TIERS.indexOf(tier);
}

let offers: LoyaltyOffer[] = [...INITIAL];
const listeners = new Set<() => void>();
function emit() {
  offers = [...offers];
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

export function useLoyaltyOffers() {
  return useSyncExternalStore(subscribe, () => offers, () => offers);
}

export function getLoyaltyOffer(id: string) {
  return offers.find((o) => o.id === id);
}

export function createEmptyLoyaltyOffer(): LoyaltyOffer {
  const now = new Date().toISOString();
  return { id: nextId("lo"), title: "", description: "", tierRequired: "STANDARD", active: true, createdAt: now, updatedAt: now };
}

export function upsertLoyaltyOffer(offer: LoyaltyOffer) {
  const exists = offers.some((o) => o.id === offer.id);
  const saved: LoyaltyOffer = { ...offer, updatedAt: new Date().toISOString() };
  offers = exists ? offers.map((o) => (o.id === offer.id ? saved : o)) : [saved, ...offers];
  emit();
  return saved;
}

export function deleteLoyaltyOffer(id: string) {
  offers = offers.filter((o) => o.id !== id);
  emit();
}
